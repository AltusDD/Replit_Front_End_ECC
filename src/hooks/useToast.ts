import { useMemo } from "react";

type ToastKind = "success" | "error" | "info" | "warn";
export type Toast = {
  id: string;
  kind: ToastKind;
  title?: string;
  message: string;
  timeout?: number; // ms
};

type Listener = (toasts: Toast[]) => void;

const listeners = new Set<Listener>();
let toasts: Toast[] = [];

function emit() {
  for (const l of listeners) l(toasts);
}

export const toastStore = {
  subscribe(fn: Listener) {
    listeners.add(fn);
    fn(toasts);
    return () => listeners.delete(fn);
  },
  push(t: Omit<Toast, "id">) {
    const id =
      (globalThis as any)?.crypto?.randomUUID?.() ??
      Math.random().toString(36).slice(2);
    const toast: Toast = { id, timeout: 3500, ...t };
    toasts = [toast, ...toasts].slice(0, 6);
    emit();
    if (toast.timeout && toast.timeout > 0) {
      setTimeout(() => toastStore.remove(id), toast.timeout);
    }
    return id;
  },
  remove(id: string) {
    toasts = toasts.filter((t) => t.id !== id);
    emit();
  },
  clear() {
    toasts = [];
    emit();
  },
};

export function useToast() {
  return useMemo(
    () => ({
      push: (
        message: string,
        opts?: Partial<Omit<Toast, "id" | "message">>
      ) =>
        toastStore.push({
          message,
          kind: opts?.kind ?? "info",
          title: opts?.title,
          timeout: opts?.timeout,
        }),
      success: (msg: string, title = "Success") =>
        toastStore.push({ message: msg, title, kind: "success" }),
      error: (msg: string, title = "Error") =>
        toastStore.push({ message: msg, title, kind: "error", timeout: 6000 }),
      info: (msg: string, title = "Info") =>
        toastStore.push({ message: msg, title, kind: "info" }),
      warn: (msg: string, title = "Warning") =>
        toastStore.push({ message: msg, title, kind: "warn" }),
      dismiss: (id: string) => toastStore.remove(id),
      clear: () => toastStore.clear(),
    }),
    []
  );
}