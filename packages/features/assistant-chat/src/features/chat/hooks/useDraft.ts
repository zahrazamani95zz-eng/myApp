"use client";

import { useCallback } from "react";

import { useAssistantChatContainer } from "../../../AssistantChatContext";

export function useDraft() {
  const chatContainer = useAssistantChatContainer();
  const save = useCallback(async (conversationId: string, text: string) => {
    await chatContainer.saveDraft.execute(conversationId, text);
  }, []);

  const load = useCallback(async (conversationId: string) => {
    return chatContainer.loadDraft.execute(conversationId);
  }, []);

  const remove = useCallback(async (conversationId: string) => {
    await chatContainer.deleteDraft.execute(conversationId);
  }, []);

  return {
    save,
    load,
    remove,
  };
}
