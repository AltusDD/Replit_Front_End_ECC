import { useState, useCallback } from "react";

export interface Toast {
  id: number;
  title: string;
  message?: string;
  type?: "info" | "success" | "error" | "warning";
}

let counter = 0;

/**
 * Genesis-grade toast system hook.
 * Keeps local state of toasts and exposes `addToast` + `removeToast`.
 * Wrap UI with your own <ToastContainer /> to render these.
 */
export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((toast: Omit<Toast, "id">) => {
    const id = ++counter;
    setToasts((prev) => [...prev, { id, ...toast }]);
    setTimeout(() => removeToast(id), 5000); // auto-remove after 5s
    return id;
  }, []);

  const removeToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return { toasts, addToast, removeToast };
}
