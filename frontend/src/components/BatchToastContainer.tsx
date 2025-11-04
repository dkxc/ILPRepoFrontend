import React from "react";
import BatchToast, { type BatchToastProps } from "./BatchToast";

interface BatchToastContainerProps {
  toasts: BatchToastProps[];
  onRemoveToast: (id: string) => void;
}

const BatchToastContainer: React.FC<BatchToastContainerProps> = ({
  toasts,
  onRemoveToast,
}) => {
  return (
    <div
      className="fixed top-4 right-4 z-[9999] pointer-events-none"
      style={{
        maxWidth: "calc(100vw - 2rem)",
        width: "320px",
      }}
    >
      <div className="flex flex-col gap-2">
        {toasts.map((toast, index) => (
          <div
            key={toast.id}
            className="pointer-events-auto"
            style={{
              zIndex: 9999 - index,
            }}
          >
            <BatchToast {...toast} onClose={onRemoveToast} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default BatchToastContainer;
