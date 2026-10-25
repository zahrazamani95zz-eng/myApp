"use client";

import { useEffect, useRef } from "react";

import { useExternalStoreRuntime } from "@assistant-ui/react";

import { useAppDispatch, useAppSelector } from "../../../store";

import { useAssistantChatContainer } from "../../../AssistantChatContext";

import {
  useAssistantChatActions,
  useAssistantChatThunks,
} from "../../../AssistantChatContext";

import {
  Message,
  //MessageContent,
  MessageStatus,
  //MessageType,
  MessageReceivedEvent,
  StreamChunkReceivedEvent,
  TranscriptionReceivedEvent,
} from "@super-app/features-ai-chat/domain";

import { ReduxChatAdapter } from "./ReduxChatAdapter";

export function useReduxChatRuntime() {
  const chatContainer = useAssistantChatContainer();
  const {
    addMessage,
    appendStreamingChunk,
    setMessageError,
    setMessageTranscription,
    setResponsePending,
    updateMessageAudio,
    markConversationUnread,
  } = useAssistantChatActions();
  const { receiveMessage } = useAssistantChatThunks();
  const dispatch = useAppDispatch();

  const messages = useAppSelector((state) => state.chat.messages);
  const responseCorrelationId = useAppSelector(
    (state) => state.chat.responseCorrelationId,
  );
  const responseConversationId = useAppSelector(
    (state) => state.chat.responseConversationId,
  );
  const conversationId = useAppSelector((state) => state.chat.conversationId);

  const createdStreamingMessages = useRef(new Set<string>());
  const responseTimeouts = useRef(
    new Map<string, ReturnType<typeof setTimeout>>(),
  );
  const timedOutResponses = useRef(new Set<string>());
  const messagesRef = useRef(messages);
  const conversationIdRef = useRef(conversationId);
  const responseConversationIdRef = useRef(responseConversationId);

  useEffect(() => {
    messagesRef.current = messages;
    conversationIdRef.current = conversationId;
    responseConversationIdRef.current = responseConversationId;
  }, [messages, conversationId, responseConversationId]);

  useEffect(() => {
    const unsubscribeEvent = chatContainer.gateway.onEvent(handleChatEvent);

    const unsubscribeError = chatContainer.gateway.onError?.((error) => {
      const correlationId = (error as Error & { correlationId?: string })
        .correlationId;

      const pendingId =
        correlationId ?? responseCorrelationIdRef.current ?? undefined;

      if (!pendingId) return;

      failResponse(
        pendingId,
        error.message || "ارتباط با سرویس برقرار نشد. لطفاً دوباره تلاش کنید.",
      );
    });

    return () => {
      unsubscribeEvent();
      unsubscribeError?.();
      responseTimeouts.current.forEach((timer) => clearTimeout(timer));
      responseTimeouts.current.clear();
    };
  }, []);

  const responseCorrelationIdRef = useRef<string | null>(null);

  useEffect(() => {
    responseCorrelationIdRef.current = responseCorrelationId;
  }, [responseCorrelationId]);

  useEffect(() => {
    if (!responseCorrelationId) return;

    const correlationId = responseCorrelationId;

    if (responseTimeouts.current.has(correlationId)) return;

    const timer = setTimeout(
      () => {
        responseTimeouts.current.delete(correlationId);
        failResponse(
          correlationId,
          "تا پایان زمان انتظار، پاسخی از دستیار دریافت نشد. لطفاً چند لحظه بعد مجدداً تلاش کنید.",
        );
      },
      2 * 60 * 1000,
    );

    responseTimeouts.current.set(correlationId, timer);

    return () => {
      clearTimeout(timer);
      responseTimeouts.current.delete(correlationId);
    };
  }, [responseCorrelationId]);

  function failResponse(correlationId: string, message: string) {
    timedOutResponses.current.add(correlationId);

    if (
      responseConversationIdRef.current &&
      conversationIdRef.current !== responseConversationIdRef.current
    ) {
      dispatch(setResponsePending({ pending: false }));
      return;
    }

    const current = messagesRef.current.find(
      (item) =>
        item.correlationId === correlationId || item.id === correlationId,
    );

    if (current) {
      dispatch(
        setMessageError({
          messageId: current.id,
          error: message,
        }),
      );
      void chatContainer.saveMessageError
        .execute({
          messageId: current.id,
          error: message,
        })
        .catch(() => undefined);
    } else {
      dispatch(
        addMessage({
          id: correlationId,
          correlationId,
          conversationId: conversationIdRef.current ?? "",
          senderId: "assistant",
          text: "",
          type: "text",
          status: MessageStatus.FAILED,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          streaming: false,
          error: message,
        }),
      );
      void chatContainer.saveMessageError
        .execute({
          messageId: correlationId,
          error: message,
        })
        .catch(() => undefined);
    }

    dispatch(setResponsePending({ pending: false }));
  }

  function handleChatEvent(event: unknown) {
    if (event instanceof StreamChunkReceivedEvent) {
      const id = event.correlationId;

      const belongsToActiveRequest =
        conversationIdRef.current === event.chatId ||
        messagesRef.current.some(
          (message) =>
            message.senderId === "user" && message.correlationId === id,
        );

      if (
        !createdStreamingMessages.current.has(id) &&
        (!responseConversationIdRef.current ||
          responseConversationIdRef.current === event.chatId) &&
        belongsToActiveRequest
      ) {
        createdStreamingMessages.current.add(id);

        dispatch(
          addMessage({
            id,

            correlationId: id,

            conversationId: event.chatId,

            senderId: "assistant",

            text: "",

            type: "text",

            status: MessageStatus.SENDING,

            createdAt: new Date().toISOString(),

            updatedAt: new Date().toISOString(),

            streaming: true,
          }),
        );
      }

      if (timedOutResponses.current.has(id)) {
        return;
      }

      if (!belongsToActiveRequest) {
        return;
      }

      dispatch(
        appendStreamingChunk({
          id,
          chunk: event.content,
          done: event.done,
          chatId: event.chatId,
        }),
      );

      // The backend keeps all chat_response_chunk events as streaming chunks.
      // The stream is finalized by the separate chat_response event.

      return;
    }

    if (event instanceof TranscriptionReceivedEvent) {
      const userMessage = messagesRef.current.find(
        (message) =>
          message.senderId === "user" &&
          message.correlationId === event.correlationId,
      );

      // Ignore transcription events that do not belong to a message in the
      // currently active conversation.
      if (
        !userMessage ||
        userMessage.conversationId !== conversationIdRef.current
      ) {
        return;
      }

      dispatch(
        setMessageTranscription({
          correlationId: event.correlationId,
          text: event.text,
        }),
      );

      if (userMessage) {
        void chatContainer.saveMessageTranscription
          .execute({
            messageId: userMessage.id,
            transcription: event.text,
          })
          .catch((error) => {
            console.error("Transcription persistence error:", error);
          });
      }

      return;
    }

    if (event instanceof MessageReceivedEvent) {
      const responseCorrelationId =
        event.message.correlationId ?? event.message.id;
      createdStreamingMessages.current.delete(responseCorrelationId);

      const timer = responseTimeouts.current.get(responseCorrelationId);
      if (timer) {
        clearTimeout(timer);
        responseTimeouts.current.delete(responseCorrelationId);
      }
      timedOutResponses.current.delete(responseCorrelationId);

      if (
        responseCorrelationId === responseCorrelationIdRef.current ||
        event.message.conversationId === responseConversationIdRef.current
      ) {
        dispatch(setResponsePending({ pending: false }));
      }

      void (async () => {
        let storedMessage: Message;

        try {
          storedMessage = await chatContainer.receiveMessage.execute(
            event.message,
          );
        } catch (error) {
          console.error("Message persistence error:", error);
          return;
        }

        const isActiveConversation =
          storedMessage.conversationId === conversationIdRef.current;

        if (isActiveConversation) {
          dispatch(receiveMessage(storedMessage));
        } else {
          // The user left this conversation while the assistant was working.
          // Keep the response out of the active thread, but surface it in
          // history as a local unread notification and stop observing the
          // completed background topic.
          dispatch(
            markConversationUnread({
              conversationId: storedMessage.conversationId,
              lastMessage: storedMessage.content.text,
            }),
          );
          void chatContainer.gateway
            .unsubscribeFromChat(storedMessage.conversationId)
            .catch((error) => {
              console.error("Background chat unsubscribe error:", error);
            });
        }

        if (
          storedMessage.senderId !== "assistant" ||
          !storedMessage.content.text.trim()
        ) {
          return;
        }

        dispatch(
          updateMessageAudio({
            id: storedMessage.id,
            correlationId: storedMessage.correlationId,
            audio: { audioLoading: true, audioError: false },
          }),
        );

        try {
          const speech = await chatContainer.generateSpeechForMessage.execute(
            storedMessage.id,
          );

          if (!speech) return;

          if (conversationIdRef.current === storedMessage.conversationId) {
            dispatch(
              updateMessageAudio({
                id: storedMessage.id,
                correlationId: storedMessage.correlationId,
                audio: {
                  audioId: speech.audioId,
                  audioUrl: speech.audioUrl,
                  audioFormat: speech.audioFormat,
                  durationMs: speech.durationMs,
                  audioLoading: false,
                  audioError: false,
                },
              }),
            );
          }
        } catch (error) {
          console.error("TTS error:", error);
          dispatch(
            updateMessageAudio({
              id: storedMessage.id,
              correlationId: storedMessage.correlationId,
              audio: { audioLoading: false, audioError: true },
            }),
          );
        }
      })();
    }
  }

  return useExternalStoreRuntime({
    messages,

    isRunning: messages.some(
      (message) => message.senderId === "assistant" && message.streaming,
    ),

    convertMessage: ReduxChatAdapter.toAssistantMessage,

    onNew: async () => {},
  });
}
