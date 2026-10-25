"use client";

import { useAppSelector } from "../../../store";

export function useChatState() {
  const chat = useAppSelector((state) => state.chat);

  const hasMessages = chat.messages.length > 0;
  const currentResponsePending =
    chat.responsePending && chat.responseConversationId === chat.conversationId;

  const isEmpty = !hasMessages && !chat.loading && !chat.error;

  return {
    conversationId: chat.conversationId,

    loading: chat.loading,

    responsePending: currentResponsePending,

    error: chat.error,

    conversationNotFound: chat.conversationNotFound,

    hasMessages,

    isEmpty,

    streaming: chat.messages.some((message) => message.streaming),

    canSend: !!chat.conversationId && !chat.loading && !currentResponsePending,
  };
}
