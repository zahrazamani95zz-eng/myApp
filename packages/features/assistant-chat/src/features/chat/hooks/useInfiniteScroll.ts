"use client";

import { useEffect, useRef } from "react";

interface Props {
  enabled: boolean;
  loading: boolean;
  onLoadMore: () => void;
  rootRef: React.RefObject<HTMLDivElement | null>;
}

export function useInfiniteScroll({
  enabled,
  loading,
  onLoadMore,
  rootRef,
}: Props) {
  const targetRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const target = targetRef.current;
    const root = rootRef.current;

    if (!target || !root) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;

        if (loading) {
          return;
        }

        onLoadMore();
      },
      {
        root,
        rootMargin: "200px",
        threshold: 0,
      },
    );
    observer.observe(target);

    return () => {
      observer.disconnect();
    };
  }, [enabled, loading, onLoadMore, rootRef]);

  return targetRef;
}
