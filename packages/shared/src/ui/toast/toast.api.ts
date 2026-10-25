import { toastStore } from "./toast.store";

import type { ToastItem, ToastVariant } from "./toast.store";

interface ToastOptions {
  title?: ToastItem["title"];

  description?: ToastItem["description"];

  duration?: number;
}

function createToast(variant: ToastVariant, options: ToastOptions) {
  const toast: ToastItem = {
    id: crypto.randomUUID(),

    open: true,

    variant,

    ...options,
  };

  toastStore.add(toast);

  const duration = options.duration ?? 4000;

  setTimeout(() => {
    toastStore.dismiss(toast.id);

    setTimeout(() => {
      toastStore.remove(toast.id);
    }, 200);
  }, duration);

  return toast.id;
}

export const toast = {
  show(options: ToastOptions) {
    return createToast("default", options);
  },

  success(options: ToastOptions) {
    return createToast("success", options);
  },

  error(options: ToastOptions) {
    return createToast("error", options);
  },

  warning(options: ToastOptions) {
    return createToast("warning", options);
  },

  info(options: ToastOptions) {
    return createToast("info", options);
  },

  dismiss(id: string) {
    toastStore.dismiss(id);
  },

  dismissAll() {
    toastStore.clear();
  },

  update(id: string, data: ToastOptions) {
    toastStore.update(id, data);
  },
};
