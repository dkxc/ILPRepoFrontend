import { useState, useCallback } from "react";
import { type BatchToastProps } from "../components/BatchToast";

export interface ShowBatchToastParams {
  title: string;
  message: string;
  color?: "green" | "red" | "blue" | "yellow";
  duration?: number;
}

export const useBatchToast = () => {
  const [toasts, setToasts] = useState<BatchToastProps[]>([]);

  const show = useCallback(
    ({
      title,
      message,
      color = "blue",
      duration = 5000,
    }: ShowBatchToastParams) => {
      const id =
        Date.now().toString() + Math.random().toString(36).substr(2, 9);

      // Map color to toast type
      const typeMap = {
        green: "success" as const,
        red: "error" as const,
        blue: "info" as const,
        yellow: "warning" as const,
      };

      const newToast: BatchToastProps = {
        id,
        title,
        message,
        type: typeMap[color],
        duration,
        onClose: removeToast,
      };

      setToasts((prev) => [...prev, newToast]);
    },
    [],
  );

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const clear = useCallback(() => {
    setToasts([]);
  }, []);

  return {
    toasts,
    show,
    removeToast,
    clear,
  };
};
