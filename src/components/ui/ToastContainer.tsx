import React from "react";
import { Toast, useToast } from "@/hooks/use-toast";

export function ToastContainer({ toasts }: { toasts?: Toast[] }) {
  const { toasts: hookToasts } = useToast();
  const displayToasts = toasts || hookToasts || [];
  
  return (
    <div className="fixed bottom-4 right-4 flex flex-col gap-2 z-50 pointer-events-none">
      {displayToasts.map((t) => (
        <div
          key={t.id}
          className={`rounded-lg px-4 py-2 shadow-lg pointer-events-auto ${
            t.type === "error"
              ? "bg-red-600"
              : t.type === "success"
              ? "bg-green-600"
              : t.type === "warning"
              ? "bg-yellow-600"
              : "bg-gray-800"
          } text-white`}
        >
          <div className="font-semibold">{t.title}</div>
          {t.message && <div className="text-sm">{t.message}</div>}
        </div>
      ))}
    </div>
  );
}
