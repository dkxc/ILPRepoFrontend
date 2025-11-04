// components/Toast.tsx

import { X } from "lucide-react";
import { useEffect } from "react";

type ToastProps = {
  message: string;
  type: "success" | "error" | "info";
  onClose: () => void;
};

const Toast = ({ message, type, onClose }: ToastProps) => {
  const bgColors = {
    success: "bg-green-100 border-green-400 text-green-700",
    error: "bg-red-100 border-red-400 text-red-700",
    info: "bg-blue-100 border-blue-400 text-blue-700",
  };

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      @keyframes slide-up {
        from {
          transform: translateY(100px);
          opacity: 0;
        }
        to {
          transform: translateY(0);
          opacity: 1;
        }
      }
      .animate-slide-up {
        animation: slide-up 0.3s ease-out;
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-slide-up">
      <div
        className={`${bgColors[type]} border-l-4 p-4 rounded-lg shadow-lg flex items-center gap-3 min-w-[300px]`}
      >
        <span className="flex-1 font-medium">{message}</span>
        <button
          onClick={onClose}
          className="text-current opacity-70 hover:opacity-100 transition-opacity"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
};

export default Toast;
