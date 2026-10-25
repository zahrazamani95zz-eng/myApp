import { createAsyncThunk } from "@reduxjs/toolkit";

import type { ChatContainer } from "../composition/chatContainer";
import { MessageMapper } from "@super-app/features-chat-core/infrastructure";
import { Message } from "@super-app/features-chat-core/domain";
import { ConversationStateMapper } from "../application/mappers/ConversationStateMapper";

export function createChatThunks(chatContainer: ChatContainer) {
  const loadMessages = createAsyncThunk(
    "chat/loadMessages",
    async (conversationId: string) => {
      const messages = await chatContainer.loadMessages.execute(conversationId);
      return messages.map(MessageMapper.toState);
    },
  );

  const sendMessage = createAsyncThunk(
    "chat/sendMessage",
    async (input: {
      conversationId: string;
      isNewConversation?: boolean;
      senderId: string;
      text: string;
    }) => {
      const result = await chatContainer.sendChatMessage.execute(input);

      return {
        message: MessageMapper.toState(result.message),
        chatId: result.chatId,
        conversation: ConversationStateMapper.toState(result.conversation),
        temporaryConversationId: result.temporaryConversationId,
        isNewConversation: result.isNewConversation,
        correlationId: result.message.correlationId ?? result.message.id,
        requestConversationId: input.conversationId,
      };
    },
  );

  const loadConversationContent = createAsyncThunk(
    "chat/loadConversationContent",
    async ({
      chatId,
      page,
      perPage,
    }: {
      chatId: string;
      page: number;
      perPage: number;
    }) => {
      const result = await chatContainer.loadConversationContent.execute(
        chatId,
        page,
        perPage,
      );

      return {
        chatId,
        page: result.page,
        hasMore: result.hasMore,
        messages: result.items.map(MessageMapper.toState),
        warning: result.warning,
      };
    },
  );

  const receiveMessage = createAsyncThunk(
    "chat/receiveMessage",
    async (message: Message) => MessageMapper.toState(message),
  );

  const sendVoiceMessage = createAsyncThunk(
    "chat/sendVoiceMessage",
    async (input: {
      conversationId: string;
      senderId: string;
      file: File;
      isNewConversation?: boolean;
      messageId?: string;
    }) => {
      const result = await chatContainer.sendVoiceMessage.execute(input);

      return {
        message: MessageMapper.toState(result.message),
        chatId: result.chatId ?? input.conversationId,
        requestConversationId: input.conversationId,
        correlationId: result.correlationId,
        jobId: result.jobId,
        conversation: result.conversation
          ? ConversationStateMapper.toState(result.conversation)
          : undefined,
      };
    },
  );

  const sendMessageFeedback = createAsyncThunk(
    "chat/sendMessageFeedback",
    async (input: { messageId: string; isLike: boolean }) => {
      await chatContainer.sendMessageFeedback.execute(input);

      return {
        messageId: input.messageId,
        feedback: (input.isLike ? "like" : "dislike") as "like" | "dislike",
      };
    },
  );

  return {
    loadMessages,
    sendMessage,
    loadConversationContent,
    receiveMessage,
    sendVoiceMessage,
    sendMessageFeedback,
  };
}

export type ChatThunks = ReturnType<typeof createChatThunks>;
