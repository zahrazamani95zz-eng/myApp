"use client";

import { CopyButton } from "./CopyButton";
import { FeedbackButtons } from "./FeedbackButtons";

interface Props {
  text: string;
  assistant?: boolean;
  messageId?: string;
  feedback?: "like" | "dislike";
}

export function MessageToolbar({
  text,
  assistant,
  messageId,
  feedback,
}: Props) {
  return (
    <div
      className="
        absolute
        bottom-2
        left-2

        flex
        gap-1

        rounded-lg
        border
        border-border

        bg-background/95
        backdrop-blur

        p-1

        opacity-0
        transition-all
        duration-200

        translate-y-2

        group-hover:translate-y-0
        group-hover:opacity-100
      "
    >
      <CopyButton text={text} />

      {assistant && messageId && (
        <>
          <FeedbackButtons messageId={messageId} feedback={feedback} />
        </>
      )}
    </div>
  );
}
