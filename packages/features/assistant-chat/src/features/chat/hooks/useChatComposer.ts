"use client";

import { useState } from "react";

import { useChat } from "./useChat";
import { useAppSelector } from "../../../store";

export function useChatComposer() {
  const { sendMessage, sendAudio } = useChat();
  const responsePending = useAppSelector(
    (state) =>
      state.chat.responsePending &&
      state.chat.responseConversationId === state.chat.conversationId,
  );
  const [value, setValue] = useState("");

  async function send() {
    const text = value.trim();
    if (!text) return;

    try {
      await sendMessage("user", text);
      setValue("");
    } catch {
      // Redux keeps the failed message and error state.
    }
  }

  async function sendVoice(file: File) {
    if (responsePending) return;
    await sendAudio("user", file);
  }

  return {
    value,
    setValue,
    send,
    sendVoice,
    responsePending,
  };
}
