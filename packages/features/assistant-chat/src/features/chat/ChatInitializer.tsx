"use client";

import { useEffect } from "react";

import { useAssistantChatContainer } from "../../AssistantChatContext";

export function ChatInitializer() {
  const chatContainer = useAssistantChatContainer();

  useEffect(() => {
    void chatContainer.gateway.connect().catch((error: unknown) => {
      // A failed/blocked MQTT connection must not become an unhandled promise
      // rejection (for example when credentials are intentionally absent).
      console.error(
        "Unable to initialize the realtime chat connection:",
        error,
      );
    });

    return () => {
      chatContainer.gateway.disconnect();
    };
  }, [chatContainer]);

  return null;
}
