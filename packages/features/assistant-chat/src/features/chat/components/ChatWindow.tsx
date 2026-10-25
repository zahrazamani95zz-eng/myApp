"use client";

import { useEffect, useRef } from "react";

import { AssistantProvider } from "../assistant-ui/AssistantProvider";
import { ChatLayout } from "../ChatLayout";

import { useAppDispatch, useAppSelector } from "../../../store";

import { useAssistantChatContainer } from "../../../AssistantChatContext";

import {
  useAssistantChatActions,
  useAssistantChatThunks,
} from "../../../AssistantChatContext";

interface ChatWindowProps {
  chatId?: string;
  history?: boolean;
  header?: boolean;
}

export function ChatWindow({ chatId, history, header }: ChatWindowProps) {
  const chatContainer = useAssistantChatContainer();
  const dispatch = useAppDispatch();
  const { setConversationId, resetChat, markConversationRead } =
    useAssistantChatActions();
  const { loadConversationContent } = useAssistantChatThunks();
  const responsePending = useAppSelector((state) => state.chat.responsePending);
  const responseConversationId = useAppSelector(
    (state) => state.chat.responseConversationId,
  );
  const responsePendingRef = useRef(responsePending);
  const responseConversationIdRef = useRef(responseConversationId);
  const activeChatIdRef = useRef<string | undefined>(chatId);

  useEffect(() => {
    responsePendingRef.current = responsePending;
    responseConversationIdRef.current = responseConversationId;
  }, [responsePending, responseConversationId]);

  useEffect(() => {
    const previousChatId = activeChatIdRef.current;
    activeChatIdRef.current = chatId;
    let cancelled = false;

    if (!chatId) {
      if (
        previousChatId &&
        !(
          responsePendingRef.current &&
          responseConversationIdRef.current === previousChatId
        )
      ) {
        void chatContainer.gateway
          .unsubscribeFromChat(previousChatId)
          .catch((error) => {
            console.error("Failed to unsubscribe from previous chat:", error);
          });
      }

      dispatch(resetChat());

      return () => {
        cancelled = true;
      };
    }

    dispatch(setConversationId(chatId));
    dispatch(markConversationRead(chatId));

    // A newly-created conversation already has its optimistic user message
    // and is waiting for the MQTT answer. Do not replace that UI with a full
    // page loading state or refetch the conversation before the answer arrives.
    const isLocalPendingConversation =
      responsePendingRef.current &&
      responseConversationIdRef.current === chatId;

    void chatContainer.gateway.subscribeToChat(chatId).catch((error) => {
      if (!cancelled) {
        console.error("Failed to subscribe to chat replies:", error);
      }
    });

    if (!isLocalPendingConversation) {
      dispatch(
        loadConversationContent({
          chatId,
          page: 1,
          perPage: 20,
        }),
      );
    }

    return () => {
      cancelled = true;

      // Keep a conversation subscribed while its response is pending so a
      // response can arrive after the user navigates to another conversation.
      const keepForBackgroundResponse =
        responsePendingRef.current &&
        responseConversationIdRef.current === chatId;

      if (!keepForBackgroundResponse) {
        void chatContainer.gateway
          .unsubscribeFromChat(chatId)
          .catch((error) => {
            console.error("Failed to unsubscribe from chat replies:", error);
          });
      }
    };
  }, [
    chatContainer,
    chatId,
    dispatch,
    loadConversationContent,
    markConversationRead,
    resetChat,
    setConversationId,
  ]);

  return (
    <AssistantProvider>
      <ChatLayout history={history} header={header} />
    </AssistantProvider>
  );
}
