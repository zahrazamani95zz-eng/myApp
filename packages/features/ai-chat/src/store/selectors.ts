import type { ChatState } from "./state";

export const selectConversationId = (state: { chat: ChatState }) =>
  state.chat.conversationId;

export const selectMessages = (state: { chat: ChatState }) =>
  state.chat.messages;

export const selectLoading = (state: { chat: ChatState }) => state.chat.loading;

export const selectError = (state: { chat: ChatState }) => state.chat.error;
