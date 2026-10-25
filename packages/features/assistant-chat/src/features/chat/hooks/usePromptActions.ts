"use client";

//import { useAui } from "@assistant-ui/react";
import { useChat } from "./useChat";

export function usePromptActions() {
  //const aui = useAui();

  const { sendMessage } = useChat();
  async function sendPrompt(text: string) {
    await sendMessage("user", text);
    //  aui.thread().append({
    //   role: "user",
    //   content: [
    //     {
    //       type: "text",
    //       text,
    //     },
    //   ],
    // });
  }

  return {
    sendPrompt,
  };
}
