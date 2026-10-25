"use client";

import { useMemo } from "react";

import { ThreadPrimitive } from "@assistant-ui/react";

import { useAppSelector } from "../../../store";

import { ConversationNotFound, EmptyState } from "../components/empty";

import { MessageGroup } from "../components/messages/MessageGroup";
import { MessageAvatar } from "../components/messages/MessageAvatar";
import { StreamingMessage } from "../components/messages/streaming";
import { ScrollToBottomButton } from "../components/thread/ScrollToBottomButton";

import { useChatState } from "../hooks/useChatState";
import { useChatScroll } from "../hooks/useChatScroll";

export function AssistantThread() {
  const { isEmpty, error, loading, conversationNotFound } = useChatState();

  const messages = useAppSelector((state) => state.chat.messages);

  const conversationId = useAppSelector((state) => {
    return state.chat.conversationId;
  });
  const responsePending = useAppSelector(
    (state) =>
      state.chat.responsePending &&
      state.chat.responseConversationId === state.chat.conversationId,
  );
  const responseCorrelationId = useAppSelector(
    (state) => state.chat.responseCorrelationId,
  );

  const messageStates = useMemo(() => {
    return new Map(messages.map((message) => [message.id, message]));
  }, [messages]);

  const { viewportRef, onScroll, showScrollButton, scrollToBottom } =
    useChatScroll(messages.length);

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="text-sm text-text-secondary">
          در حال بارگذاری مکالمه...
        </div>
      </div>
    );
  }

  if (error && messages.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center px-6">
        <div
          role="alert"
          className="w-full max-w-md rounded-2xl border border-border-strong bg-background p-6 text-center shadow-sm"
        >
          <h2 className="text-base font-semibold text-text">
            بارگذاری مکالمه انجام نشد
          </h2>

          <p className="mt-2 text-sm leading-7 text-text-secondary">
            امکان دریافت اطلاعات این مکالمه وجود ندارد. لطفاً دوباره تلاش کنید.
          </p>
        </div>
      </div>
    );
  }

  if (conversationNotFound || (conversationId && isEmpty)) {
    return <ConversationNotFound />;
  }

  if (!conversationId && isEmpty) {
    return <EmptyState />;
  }

  return (
    <>
      {/* {error && (
        <div
          role="alert"
          className="mx-3 mt-3 rounded-xl border border-border bg-muted/30 px-3 py-2 text-center text-xs text-text-secondary"
        >
          {error}
        </div>
      )} */}
      <ThreadPrimitive.Root className="relative flex h-full min-h-0 w-full flex-1 flex-col overflow-hidden">
        <ThreadPrimitive.Viewport
          ref={viewportRef}
          onScroll={onScroll}
          className="flex h-full min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain"
          style={{ scrollbarGutter: "stable" }}
        >
          <div
            className="
            mx-auto
            flex
            min-h-full
            w-full
            max-w-3xl
            flex-col
            gap-6
            px-3
            py-6
            sm:px-6
            sm:py-8
          "
          >
            <div className="flex flex-col gap-6">
              <ThreadPrimitive.Messages>
                {({ message }) => {
                  const state = messageStates.get(message.id);

                  if (!state) {
                    return null;
                  }

                  return <MessageGroup message={state} />;
                }}
              </ThreadPrimitive.Messages>

              {responsePending &&
                !messages.some(
                  (message) =>
                    message.senderId === "assistant" &&
                    (message.streaming ||
                      message.correlationId === responseCorrelationId),
                ) && (
                  <div className="flex w-full items-end justify-start gap-2">
                    <MessageAvatar fromUser={false} />
                    <div className="max-w-[88%] rounded-[22px] rounded-br-[7px] border border-border/80 bg-card px-4.5 py-3 text-text shadow-[0_6px_22px_rgba(20,42,35,0.055)] dark:shadow-[0_8px_24px_rgba(0,0,0,0.16)]">
                      <StreamingMessage text="" streaming />
                    </div>
                  </div>
                )}
            </div>

            <div className="h-20 shrink-0" />
          </div>
        </ThreadPrimitive.Viewport>

        <ScrollToBottomButton
          visible={showScrollButton}
          onClick={scrollToBottom}
        />
      </ThreadPrimitive.Root>
    </>
  );
}
