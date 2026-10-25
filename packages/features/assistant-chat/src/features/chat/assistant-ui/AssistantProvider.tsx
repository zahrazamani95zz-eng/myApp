"use client";

import type { PropsWithChildren } from "react";

import { AssistantRuntimeProvider } from "@assistant-ui/react";

import { useReduxChatRuntime } from "./ReduxChatRuntime";

export function AssistantProvider({ children }: PropsWithChildren) {
  const runtime = useReduxChatRuntime();

  return (
    <AssistantRuntimeProvider runtime={runtime}>
      {children}
    </AssistantRuntimeProvider>
  );
}
