import { createAsyncThunk } from "@reduxjs/toolkit";

import type { ChatContainer } from "../composition/chatContainer";

export function createDeleteConversationThunk(chatContainer: ChatContainer) {
  return createAsyncThunk("chat/deleteConversation", async (chatId: string) => {
    await chatContainer.deleteConversation.execute(chatId);
    return chatId;
  });
}

export type DeleteConversationThunk = ReturnType<
  typeof createDeleteConversationThunk
>;
