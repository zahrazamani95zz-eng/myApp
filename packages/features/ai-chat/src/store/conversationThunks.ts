import { createAsyncThunk } from "@reduxjs/toolkit";

import type { ChatContainer } from "../composition/chatContainer";
import { ConversationStateMapper } from "../application/mappers/ConversationStateMapper";

export function createConversationThunks(chatContainer: ChatContainer) {
  const conversationsInFlight = new Set<string>();

  const loadConversations = createAsyncThunk(
    "chat/loadConversations",
    async ({ page, perPage }: { page: number; perPage: number }) => {
      const requestKey = `${page}:${perPage}`;

      try {
        const result = await chatContainer.loadConversations.execute(
          page,
          perPage,
        );

        return {
          page: result.page,
          hasMore: result.hasMore,
          conversations: result.items.map(ConversationStateMapper.toState),
        };
      } finally {
        conversationsInFlight.delete(requestKey);
      }
    },
    {
      condition: (
        { page, perPage }: { page: number; perPage: number },
        { getState },
      ) => {
        const state = getState() as {
          chat: {
            conversationsLoading: boolean;
            currentConversationPage: number;
            hasMoreConversations: boolean;
            conversationsLoaded: boolean;
          };
        };

        const requestKey = `${page}:${perPage}`;

        if (state.chat.conversationsLoaded && page === 1) return false;
        if (state.chat.conversationsLoading) return false;
        if (page > 1 && !state.chat.hasMoreConversations) return false;
        if (page > 1 && page <= state.chat.currentConversationPage)
          return false;
        if (conversationsInFlight.has(requestKey)) return false;

        conversationsInFlight.add(requestKey);
        return true;
      },
    },
  );

  return { loadConversations };
}

export type ConversationThunks = ReturnType<typeof createConversationThunks>;
