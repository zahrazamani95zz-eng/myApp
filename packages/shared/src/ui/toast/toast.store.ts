import type { ReactNode } from "react";

export type ToastVariant = "default" | "success" | "error" | "warning" | "info";

export interface ToastItem {
  id: string;

  title?: ReactNode;

  description?: ReactNode;

  variant: ToastVariant;

  duration?: number;

  open: boolean;
}

type Listener = (toasts: ToastItem[]) => void;

class ToastStore {
  private toasts: ToastItem[] = [];

  private listeners = new Set<Listener>();

  subscribe(listener: Listener) {
    this.listeners.add(listener);

    listener(this.toasts);

    return () => {
      this.listeners.delete(listener);
    };
  }

  getState() {
    return this.toasts;
  }

  private notify() {
    this.listeners.forEach((listener) => listener(this.toasts));
  }

  add(toast: ToastItem) {
    this.toasts = [...this.toasts, toast];

    this.notify();
  }

  dismiss(id: string) {
    this.toasts = this.toasts.map((toast) =>
      toast.id === id
        ? {
            ...toast,
            open: false,
          }
        : toast,
    );

    this.notify();
  }

  remove(id: string) {
    this.toasts = this.toasts.filter((toast) => toast.id !== id);

    this.notify();
  }

  clear() {
    this.toasts = [];

    this.notify();
  }

  update(id: string, data: Partial<ToastItem>) {
    this.toasts = this.toasts.map((toast) =>
      toast.id === id
        ? {
            ...toast,
            ...data,
          }
        : toast,
    );

    this.notify();
  }
}

export const toastStore = new ToastStore();
