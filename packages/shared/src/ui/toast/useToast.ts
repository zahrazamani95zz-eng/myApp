"use client";

import { useEffect, useState } from "react";

import { toastStore } from "./toast.store";

export function useToast() {
  const [toasts, setToasts] = useState(toastStore.getState());

  useEffect(() => {
    return toastStore.subscribe(setToasts);
  }, []);

  return {
    toasts,
  };
}
