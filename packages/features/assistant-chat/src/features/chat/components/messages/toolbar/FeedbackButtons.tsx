"use client";

import { useCallback, useState } from "react";
import { ThumbsDown, ThumbsUp, X } from "lucide-react";
import { useAppDispatch } from "../../../../../store";
import {
  useAssistantChatActions,
  useAssistantChatThunks,
} from "../../../../../AssistantChatContext";
import { ToolbarButton } from "./ToolbarButton";
import { cn } from "@super-app/shared/lib";

const reasons = [
  "پاسخ اشتباه بود",
  "پاسخ ناقص بود",
  "پاسخ نامرتبط بود",
  "اطلاعات کافی نبود",
  "لحن یا نگارش مناسب نبود",
];

interface Props {
  messageId: string;
  feedback?: "like" | "dislike";
}

export function FeedbackButtons({ messageId, feedback }: Props) {
  const dispatch = useAppDispatch();
  const { setMessageFeedback } = useAssistantChatActions();
  const { sendMessageFeedback } = useAssistantChatThunks();

  const [pending, setPending] = useState(false);
  const [dislikeOpen, setDislikeOpen] = useState(false);
  const [selectedReasons, setSelectedReasons] = useState<string[]>([]);
  const [comment, setComment] = useState("");
  const [validationError, setValidationError] = useState("");

  const submit = useCallback(
    async (isLike: boolean) => {
      const next: "like" | "dislike" = isLike ? "like" : "dislike";

      if (feedback === next || pending) return false;

      const previous = feedback;
      dispatch(setMessageFeedback({ messageId, feedback: next }));
      setPending(true);

      try {
        await dispatch(sendMessageFeedback({ messageId, isLike })).unwrap();
        return true;
      } catch (error) {
        console.error("Message feedback error:", error);
        dispatch(setMessageFeedback({ messageId, feedback: previous }));
        return false;
      } finally {
        setPending(false);
      }
    },
    [
      dispatch,
      feedback,
      messageId,
      pending,
      sendMessageFeedback,
      setMessageFeedback,
    ],
  );

  const submitDislike = async () => {
    if (selectedReasons.length === 0 && !comment.trim()) {
      setValidationError("لطفاً حداقل یک دلیل یا توضیح کوتاه وارد کنید.");
      return;
    }

    setValidationError("");
    const success = await submit(false);

    if (!success) return;

    setDislikeOpen(false);
    setSelectedReasons([]);
    setComment("");
  };

  const openDislike = () => {
    setValidationError("");
    setDislikeOpen(true);
  };

  return (
    <>
      <div
        dir="rtl"
        className="flex shrink-0 flex-row items-center gap-1 whitespace-nowrap"
        role="group"
        aria-label="بازخورد پاسخ"
      >
        <ToolbarButton
          icon={
            <ThumbsUp
              size={16}
              className={cn(feedback === "like" && "fill-current text-primary")}
            />
          }
          onClick={() => void submit(true)}
          aria-label="پسندیدم"
          title="پسندیدم"
          selected={feedback === "like"}
          disabled={pending}
        />

        <ToolbarButton
          icon={
            <ThumbsDown
              size={16}
              className={cn(
                feedback === "dislike" && "fill-current text-danger",
              )}
            />
          }
          onClick={openDislike}
          aria-label="نپسندیدم"
          title="نپسندیدم"
          selected={feedback === "dislike"}
          disabled={pending}
        />
      </div>

      {dislikeOpen && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-black/30 p-4"
          onClick={() => {
            if (!pending) setDislikeOpen(false);
          }}
        >
          <div
            dir="rtl"
            className="w-full max-w-xl overflow-hidden rounded-2xl border border-border bg-background p-5 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-5 flex items-start justify-between gap-4">
              <div className="min-w-0">
                <h3 className="font-semibold text-text">
                  چرا این پاسخ مفید نبود؟
                </h3>
                <p className="mt-1 text-xs text-text-secondary">
                  یک یا چند دلیل را انتخاب کنید.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setDislikeOpen(false)}
                disabled={pending}
                className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-text-secondary transition hover:bg-card hover:text-text disabled:pointer-events-none disabled:opacity-50"
                aria-label="بستن"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex w-full flex-wrap gap-2">
              {reasons.map((reason) => {
                const selected = selectedReasons.includes(reason);

                return (
                  <button
                    key={reason}
                    type="button"
                    onClick={() => {
                      setValidationError("");
                      setSelectedReasons((current) =>
                        selected
                          ? current.filter((item) => item !== reason)
                          : [...current, reason],
                      );
                    }}
                    className={cn(
                      "shrink-0 rounded-full border px-3 py-2 text-xs transition",
                      selected
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border bg-background text-text-secondary hover:bg-card",
                    )}
                  >
                    {reason}
                  </button>
                );
              })}
            </div>

            <textarea
              value={comment}
              onChange={(event) => {
                setValidationError("");
                setComment(event.target.value);
              }}
              placeholder="اگر توضیح دیگری دارید بنویسید..."
              className="mt-4 min-h-24 w-full resize-none rounded-xl border border-border bg-card px-3 py-3 text-sm text-text outline-none transition placeholder:text-text-secondary focus:border-primary"
            />

            {validationError && (
              <p className="mt-2 text-xs text-danger" role="alert">
                {validationError}
              </p>
            )}

            <div className="mt-5 flex flex-row items-center justify-start gap-2">
              <button
                type="button"
                onClick={() => setDislikeOpen(false)}
                disabled={pending}
                className="rounded-xl px-4 py-2 text-sm text-text-secondary transition hover:bg-card disabled:opacity-50"
              >
                انصراف
              </button>

              <button
                type="button"
                disabled={pending}
                onClick={() => void submitDislike()}
                className="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {pending ? "در حال ارسال..." : "ارسال بازخورد"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
