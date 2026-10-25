import { configureStore } from "@reduxjs/toolkit";
import type { ChatContainer } from "../composition/chatContainer";
import { createChatSlice } from "./chatSlice";
import { createChatThunks, type ChatThunks } from "./chatThunks";
import {
  createConversationThunks,
  type ConversationThunks,
} from "./conversationThunks";
import { createDeleteConversationThunk } from "./deleteConversationThunk";

export function createChatStore(chatContainer: ChatContainer) {
  const chatThunks = createChatThunks(chatContainer);
  const conversationThunks = createConversationThunks(chatContainer);
  const deleteConversation = createDeleteConversationThunk(chatContainer);

  const thunks = {
    ...chatThunks,
    ...conversationThunks,
    deleteConversation,
  };

  const slice = createChatSlice(thunks);

  const store = configureStore({
    reducer: {
      chat: slice.reducer,
    },
    devTools: process.env.NODE_ENV !== "production",
  });

  return {
    store,
    actions: slice.actions,
    thunks,
  };
}

export type ChatStoreBindings = ReturnType<typeof createChatStore>;
export type ChatStore = ChatStoreBindings["store"];
export type RootState = ReturnType<ChatStore["getState"]>;
export type AppDispatch = ChatStore["dispatch"];

export type { ChatThunks, ConversationThunks };

export * from "./selectors";
export * from "./state";
export * from "./types";
export * from "./conversation.types";
export * from "./deleteConversationThunk";
