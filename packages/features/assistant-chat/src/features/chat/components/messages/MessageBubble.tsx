"use client";

import { memo } from "react";

import { cn } from "@super-app/shared/lib";

import { MessageContent } from "./MessageContent";
import { MessageStatus } from "./MessageStatus";
import { MessageTimestamp } from "./MessageTimestamp";
import { MessageToolbar } from "../messages/toolbar";
import { StreamingMessage } from "./streaming";
import type { ChatMessageState } from "@super-app/features-ai-chat/store";
import { VoiceMessagePlayer } from "./VoiceMessagePlayer";

interface Props {
  message: ChatMessageState;
}

function MessageBubbleComponent({ message }: Props) {
  const fromUser = message.senderId === "user";

  const isAssistantStreaming =
    !fromUser && (message.streaming || !message.text);

  const isUserAudio =
    fromUser &&
    (message.type === "audio" ||
      Boolean(message.audioUrl) ||
      Boolean(message.audioId));

  const hasAssistantAudio =
    !fromUser &&
    (Boolean(message.audioUrl) ||
      Boolean(message.audioId) ||
      Boolean(message.audioLoading) ||
      Boolean(message.audioError));

  // For user voice bubbles, avoid repeating the placeholder text when player is shown.
  const showTextContent =
    !isAssistantStreaming &&
    Boolean(message.text) &&
    !(isUserAudio && message.text === "پیام صوتی کاربر");

  return (
    <div
      className={cn(
        "group relative max-w-[88%] min-w-0 rounded-[22px] px-4.5 py-3 shadow-sm sm:px-5",

        fromUser
          ? "rounded-bl-[7px] bg-primary text-primary-foreground shadow-[0_8px_24px_color-mix(in_srgb,var(--primary)_18%,transparent)]"
          : "rounded-br-[7px] border border-border/80 bg-card text-text shadow-[0_6px_22px_rgba(20,42,35,0.055)] dark:shadow-[0_8px_24px_rgba(0,0,0,0.16)]",
      )}
    >
      {!fromUser && message.text && (
        <MessageToolbar
          text={message.text}
          assistant
          messageId={message.id}
          feedback={message.feedback}
        />
      )}

      {isAssistantStreaming ? (
        <StreamingMessage text={message.text} streaming={message.streaming} />
      ) : (
        <>
          {showTextContent && <MessageContent text={message.text} />}

          {/* User voice: player + transcript stay together in the user bubble */}
          {isUserAudio && (
            <VoiceMessagePlayer message={message} variant="user" />
          )}

          {fromUser && message.transcription && (
            <div className="mt-2 rounded-[11px] border border-white/15 bg-white/10 px-2.5 py-2 text-sm text-current">
              <div className="mb-0.5 text-[10px] font-black opacity-70">
                متن تبدیل‌شده
              </div>
              <div className="whitespace-pre-wrap text-xs leading-7">
                {message.transcription}
              </div>
            </div>
          )}

          {fromUser &&
            isUserAudio &&
            message.streaming &&
            !message.transcription && (
              <div className="mt-2 text-xs opacity-70" aria-live="polite">
                در حال تبدیل صدا به متن...
              </div>
            )}
        </>
      )}

      {/* Assistant TTS player (unchanged transport; richer UI only) */}
      {hasAssistantAudio && (
        <VoiceMessagePlayer message={message} variant="assistant" />
      )}

      {message.error && (
        <div
          role="alert"
          className="mt-2 rounded-xl border border-destructive/20 bg-destructive/5 px-3 py-2 text-sm leading-6 text-destructive"
        >
          {message.error}
        </div>
      )}

      <div
        className={`mt-2 flex items-center gap-2 ${
          fromUser ? "justify-end" : "justify-start"
        }`}
      >
        <MessageTimestamp value={message.createdAt} />

        {fromUser && <MessageStatus status={message.status} />}
      </div>
    </div>
  );
}

export const MessageBubble = memo(MessageBubbleComponent, (prev, next) => {
  return (
    prev.message.id === next.message.id &&
    prev.message.text === next.message.text &&
    prev.message.transcription === next.message.transcription &&
    prev.message.streaming === next.message.streaming &&
    prev.message.status === next.message.status &&
    prev.message.type === next.message.type &&
    prev.message.audioId === next.message.audioId &&
    prev.message.audioUrl === next.message.audioUrl &&
    prev.message.audioLoading === next.message.audioLoading &&
    prev.message.audioError === next.message.audioError &&
    prev.message.durationMs === next.message.durationMs &&
    prev.message.feedback === next.message.feedback &&
    prev.message.error === next.message.error
  );
});
