"use client";

import { useAppDispatch, useAppSelector } from "../../../store";

import { useAssistantChatThunks } from "../../../AssistantChatContext";

import { groupConversations } from "../utils/groupConversations";

import { useCallback, useEffect } from "react";

const CONVERSATIONS_PER_PAGE = 20;

export function useConversationHistory(search: string) {
  const dispatch = useAppDispatch();
  const { loadConversations } = useAssistantChatThunks();

  const {
    conversations,
    currentConversationPage,
    hasMoreConversations,
    conversationsLoading,
    conversationsLoaded,
  } = useAppSelector((state) => state.chat);

  useEffect(() => {
    if (conversationsLoaded) return;

    if (conversationsLoading) return;

    dispatch(
      loadConversations({
        page: 1,
        perPage: CONVERSATIONS_PER_PAGE,
      }),
    );
  }, [dispatch, conversationsLoaded, conversationsLoading]);

  const loadNextPage = useCallback(() => {
    if (conversationsLoading) return;

    if (!hasMoreConversations) return;

    dispatch(
      loadConversations({
        page: currentConversationPage + 1,
        perPage: CONVERSATIONS_PER_PAGE,
      }),
    );
  }, [
    dispatch,
    conversationsLoading,
    conversationsLoaded,
    hasMoreConversations,
    currentConversationPage,
  ]);
  return {
    sections: groupConversations(conversations, search),

    loadNextPage,

    hasMore: hasMoreConversations,

    loading: conversationsLoading,
  };
}
