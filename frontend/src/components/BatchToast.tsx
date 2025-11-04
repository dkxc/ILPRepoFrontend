import React, { useEffect, useState } from "react";

export interface BatchToastProps {
  id: string;
  title: string;
  message: string;
  type: "success" | "error" | "info" | "warning";
  duration?: number;
  onClose: (id: string) => void;
}

const BatchToast: React.FC<BatchToastProps> = ({
  id,
  title,
  message,
  type,
  duration = 5000,
  onClose,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    // Trigger enter animation
    setTimeout(() => setIsVisible(true), 10);

    // Auto-dismiss after duration
    const timer = setTimeout(() => {
      handleClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  const handleClose = () => {
    setIsLeaving(true);
    setTimeout(() => {
      onClose(id);
    }, 150); // Mantine uses shorter exit animation
  };

  const getTypeStyles = () => {
    switch (type) {
      case "success":
        return {
          bg: "bg-white",
          border:
            "border-l-4 border-l-green-500 border-r border-t border-b border-gray-200",
          icon: "text-green-500",
          title: "text-gray-900",
          message: "text-gray-600",
          iconPath: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
        };
      case "error":
        return {
          bg: "bg-white",
          border:
            "border-l-4 border-l-red-500 border-r border-t border-b border-gray-200",
          icon: "text-red-500",
          title: "text-gray-900",
          message: "text-gray-600",
          iconPath:
            "M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z",
        };
      case "warning":
        return {
          bg: "bg-white",
          border:
            "border-l-4 border-l-yellow-500 border-r border-t border-b border-gray-200",
          icon: "text-yellow-500",
          title: "text-gray-900",
          message: "text-gray-600",
          iconPath:
            "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.34 16.5c-.77.833.192 2.5 1.732 2.5z",
        };
      case "info":
      default:
        return {
          bg: "bg-white",
          border:
            "border-l-4 border-l-blue-500 border-r border-t border-b border-gray-200",
          icon: "text-blue-500",
          title: "text-gray-900",
          message: "text-gray-600",
          iconPath: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
        };
    }
  };

  const styles = getTypeStyles();

  return (
    <div
      className={`
        w-80 ${styles.bg} ${styles.border} rounded-md shadow-lg z-50
        transform transition-all duration-150 ease-out
        ${
          isVisible && !isLeaving
            ? "translate-x-0 opacity-100 scale-100"
            : "translate-x-full opacity-0 scale-95"
        }
      `}
      style={{
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
        maxWidth: "100%",
        minWidth: "320px",
      }}
    >
      <div className="flex items-start p-4">
        <div className="flex-shrink-0 mr-3">
          <div className="w-5 h-5 flex items-center justify-center">
            <svg
              className={`w-5 h-5 ${styles.icon}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d={styles.iconPath}
              />
            </svg>
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className={`text-sm font-medium ${styles.title} leading-5`}>
            {title}
          </div>
          <div className={`mt-1 text-sm ${styles.message} leading-5`}>
            {message}
          </div>
        </div>
        <div className="flex-shrink-0 ml-4">
          <button
            type="button"
            className="inline-flex text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600 transition-colors duration-150"
            onClick={handleClose}
          >
            <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default BatchToast;
