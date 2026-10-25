"use client";

import { useCallback, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";

import {
  useAssistantChatContainer,
  useAssistantChatActions,
  useAssistantChatThunks,
} from "../../../AssistantChatContext";
import { MessageStatus } from "@super-app/features-chat-core/domain";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";

export function useChat() {
  const chatContainer = useAssistantChatContainer();
  const {
    addMessage,
    replaceMessage,
    setMessageError,
    setResponsePending,
    startConversation,
    updateMessageStatus,
  } = useAssistantChatActions();
  const { sendMessage, sendVoiceMessage } = useAssistantChatThunks();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();

  const conversationId = useAppSelector((state) => state.chat.conversationId);
  const conversationIdRef = useRef(conversationId);
  const activeSendRef = useRef<string | null>(null);

  useEffect(() => {
    conversationIdRef.current = conversationId;
  }, [conversationId]);

  const subscribeInBackground = useCallback(
    (chatId: string) => {
      void chatContainer.gateway.subscribeToChat(chatId).catch((error) => {
        console.error("Failed to subscribe to chat replies:", error);
      });
    },
    [chatContainer],
  );

  const send = useCallback(
    async (senderId: string, text: string) => {
      const currentConversationId = conversationIdRef.current;
      const isNewConversation = !currentConversationId;
      const localConversationId = currentConversationId ?? crypto.randomUUID();
      const sendOperationId = crypto.randomUUID();

      if (isNewConversation) {
        const now = new Date().toISOString();
        conversationIdRef.current = localConversationId;
        dispatch(
          startConversation({
            id: localConversationId,
            title: text,
            updatedAt: now,
            createdAt: now,
            unreadCount: 0,
            lastMessage: text,
            isPinned: false,
          }),
        );
      }

      activeSendRef.current = sendOperationId;

      const temporaryMessageId = crypto.randomUUID();
      const now = new Date().toISOString();

      dispatch(
        addMessage({
          id: temporaryMessageId,
          conversationId: localConversationId,
          senderId,
          text,
          type: "text",
          status: MessageStatus.SENDING,
          createdAt: now,
          updatedAt: now,
        }),
      );

      const result = await dispatch(
        sendMessage({
          conversationId: localConversationId,
          isNewConversation,
          senderId,
          text,
        }),
      );

      if (!sendMessage.fulfilled.match(result)) {
        if (conversationIdRef.current !== localConversationId) {
          return;
        }

        const errorMessage =
          result.error.message ??
          "ارسال پیام انجام نشد. لطفاً دوباره تلاش کنید.";

        dispatch(
          updateMessageStatus({
            id: temporaryMessageId,
            status: MessageStatus.FAILED,
          }),
        );
        dispatch(
          setMessageError({
            messageId: temporaryMessageId,
            error: errorMessage,
          }),
        );
        void chatContainer.saveMessageError
          .execute({
            messageId: temporaryMessageId,
            error: errorMessage,
          })
          .catch(() => undefined);
        dispatch(setResponsePending({ pending: false }));
        throw new Error(errorMessage);
      }

      const payload = result.payload;
      const realChatId = payload.chatId;
      const isStillCurrentConversation =
        conversationIdRef.current === payload.requestConversationId;

      // Subscribe as soon as the backend gives us the real conversation ID.
      // Do not await this before navigation: waiting here can delay the route
      // transition and, more importantly, delay creation of the active MQTT
      // listener while the backend is already producing the response.
      subscribeInBackground(realChatId);

      if (!isStillCurrentConversation) {
        // The user navigated away while the request was running. The response
        // must continue in the background, but it must not mutate the active
        // conversation. The MQTT runtime will turn its completion into an
        // unread marker in history.
        return payload;
      }

      dispatch(
        replaceMessage({
          tempId: temporaryMessageId,
          message: {
            ...payload.message,
            conversationId: realChatId,
            correlationId: payload.correlationId,
          },
        }),
      );

      dispatch(
        setResponsePending({
          pending: true,
          correlationId: payload.correlationId,
          conversationId: realChatId,
        }),
      );

      conversationIdRef.current = realChatId;

      if (
        isNewConversation &&
        realChatId &&
        activeSendRef.current === sendOperationId &&
        pathname === "/chat"
      ) {
        // Navigate immediately. ChatWindow will keep the optimistic user
        // message and show the assistant typing indicator while the MQTT
        // response is pending.
        router.replace(`/chat/${realChatId}`);
      }

      return payload;
    },
    [
      addMessage,
      chatContainer,
      dispatch,
      pathname,
      replaceMessage,
      router,
      sendMessage,
      setMessageError,
      setResponsePending,
      startConversation,
      subscribeInBackground,
      updateMessageStatus,
    ],
  );

  const sendAudio = useCallback(
    async (senderId: string, file: File) => {
      const currentConversationId = conversationIdRef.current;
      const isNewConversation = !currentConversationId;
      const localConversationId = currentConversationId ?? crypto.randomUUID();

      if (isNewConversation) {
        const now = new Date().toISOString();
        conversationIdRef.current = localConversationId;
        dispatch(
          startConversation({
            id: localConversationId,
            title: "پیام صوتی",
            updatedAt: now,
            createdAt: now,
            unreadCount: 0,
            lastMessage: "پیام صوتی",
            isPinned: false,
          }),
        );
      }

      const temporaryMessageId = crypto.randomUUID();
      const localAudioUrl = URL.createObjectURL(file);
      const now = new Date().toISOString();

      dispatch(
        addMessage({
          id: temporaryMessageId,
          conversationId: localConversationId,
          senderId,
          text: "پیام صوتی کاربر",
          type: "audio",
          status: MessageStatus.SENDING,
          createdAt: now,
          updatedAt: now,
          audioId: temporaryMessageId,
          audioUrl: localAudioUrl,
          audioFormat: file.type || "audio/webm",
          streaming: true,
        }),
      );

      let visibleMessageId: string = temporaryMessageId;

      try {
        const result = await dispatch(
          sendVoiceMessage({
            conversationId: localConversationId,
            senderId,
            file,
            isNewConversation,
            messageId: temporaryMessageId,
          }),
        );

        if (!sendVoiceMessage.fulfilled.match(result)) {
          if (conversationIdRef.current !== localConversationId) {
            URL.revokeObjectURL(localAudioUrl);
            return;
          }

          const errorMessage =
            result.error.message ??
            "ارسال پیام صوتی انجام نشد. لطفاً دوباره تلاش کنید.";

          dispatch(
            updateMessageStatus({
              id: temporaryMessageId,
              status: MessageStatus.FAILED,
            }),
          );
          dispatch(
            setMessageError({
              messageId: temporaryMessageId,
              error: errorMessage,
            }),
          );
          void chatContainer.saveMessageError
            .execute({
              messageId: temporaryMessageId,
              error: errorMessage,
            })
            .catch(() => undefined);
          throw new Error(errorMessage);
        }

        const payload = result.payload;
        const isStillCurrentConversation =
          conversationIdRef.current === payload.requestConversationId;

        subscribeInBackground(payload.chatId);

        if (!isStillCurrentConversation) {
          URL.revokeObjectURL(localAudioUrl);
          return payload;
        }

        dispatch(
          replaceMessage({
            tempId: temporaryMessageId,
            message: {
              ...payload.message,
              conversationId: payload.chatId,
              correlationId: payload.correlationId,
            },
          }),
        );
        visibleMessageId = payload.message.id;
        URL.revokeObjectURL(localAudioUrl);

        dispatch(
          setResponsePending({
            pending: true,
            correlationId: payload.correlationId,
            conversationId: payload.chatId,
          }),
        );

        conversationIdRef.current = payload.chatId;

        if (isNewConversation && pathname === "/chat") {
          router.replace(`/chat/${payload.chatId}`);
        }

        return payload;
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "ارسال پیام صوتی انجام نشد. لطفاً دوباره تلاش کنید.";

        dispatch(
          setMessageError({
            messageId: visibleMessageId,
            error: errorMessage,
          }),
        );
        void chatContainer.saveMessageError
          .execute({
            messageId: visibleMessageId,
            error: errorMessage,
          })
          .catch(() => undefined);
        dispatch(setResponsePending({ pending: false }));
      }
    },
    [
      addMessage,
      chatContainer,
      dispatch,
      pathname,
      replaceMessage,
      router,
      sendVoiceMessage,
      setMessageError,
      setResponsePending,
      startConversation,
      subscribeInBackground,
      updateMessageStatus,
    ],
  );

  return { sendMessage: send, sendAudio };
}
