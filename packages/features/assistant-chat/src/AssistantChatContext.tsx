"use client";

import { createContext, useContext, type PropsWithChildren } from "react";
import { Provider } from "react-redux";
import type { ChatContainer } from "@super-app/features-ai-chat/composition";
import type { AssistantChatStoreBindings } from "./store/store";

interface AssistantChatContextValue {
  container: ChatContainer;
  bindings: AssistantChatStoreBindings;
}

const AssistantChatContext = createContext<AssistantChatContextValue | null>(
  null,
);

export function AssistantChatProvider({
  children,
  container,
  bindings,
}: PropsWithChildren<AssistantChatContextValue>) {
  return (
    <Provider store={bindings.store}>
      <AssistantChatContext.Provider value={{ container, bindings }}>
        {children}
      </AssistantChatContext.Provider>
    </Provider>
  );
}

export function useAssistantChatContext(): AssistantChatContextValue {
  const context = useContext(AssistantChatContext);

  if (!context) {
    throw new Error(
      "AssistantChat components must be rendered inside AssistantChatProvider.",
    );
  }

  return context;
}

export function useAssistantChatContainer(): ChatContainer {
  return useAssistantChatContext().container;
}

export function useAssistantChatActions(): AssistantChatStoreBindings["actions"] {
  return useAssistantChatContext().bindings.actions;
}

export function useAssistantChatThunks(): AssistantChatStoreBindings["thunks"] {
  return useAssistantChatContext().bindings.thunks;
}
