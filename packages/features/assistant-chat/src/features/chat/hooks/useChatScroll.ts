"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export function useChatScroll(messageCount?: number) {
  const viewportRef = useRef<HTMLDivElement>(null);

  const [showScrollButton, setShowScrollButton] = useState(false);

  const isNearBottomRef = useRef(true);

  const scrollToBottom = useCallback(
    (
      options: ScrollToOptions = {
        behavior: "smooth",
      },
    ) => {
      if (!viewportRef.current) return;

      viewportRef.current.scrollTo({
        top: viewportRef.current.scrollHeight,
        ...options,
      });
    },
    [],
  );

  const onScroll = useCallback(() => {
    const viewport = viewportRef.current;

    if (!viewport) return;

    const distance =
      viewport.scrollHeight - viewport.scrollTop - viewport.clientHeight;

    const isNearBottom = distance < 120;

    isNearBottomRef.current = isNearBottom;

    setShowScrollButton(!isNearBottom);
  }, []);

  useEffect(() => {
    if (messageCount === undefined) return;

    if (isNearBottomRef.current) {
      requestAnimationFrame(() => {
        scrollToBottom({
          behavior: "smooth",
        });
      });
    }
  }, [messageCount, scrollToBottom]);

  return {
    viewportRef,

    showScrollButton,

    scrollToBottom,

    onScroll,
  };
}
