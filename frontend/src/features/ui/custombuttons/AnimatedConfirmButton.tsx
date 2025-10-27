import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";
import Button, { type ButtonProps } from "../Button";
import { cn } from "../../../lib/utils";

interface AnimatedConfirmButtonProps {
  onConfirm: () => void;
  children: React.ReactNode;
  variant?: ButtonProps["variant"];
  size?: ButtonProps["size"];
  confirmText?: string;
  successText?: string;
}

export const AnimatedConfirmButton = ({
  onConfirm,
  children,
  variant = "default",
  size = "default",
  confirmText = "Confirm",
  successText = "Success!",
}: AnimatedConfirmButtonProps) => {
  const [buttonState, setButtonState] = useState<
    "idle" | "confirming" | "success"
  >("idle");

  // handlers
  const handleInitialClick = () => setButtonState("confirming");
  const handleConfirmClick = () => {
    onConfirm();
    setButtonState("success");
  };
  const handleCancelClick = () => setButtonState("idle");

  // automatically revert from the success state back to idle after a delay
  useEffect(() => {
    if (buttonState === "success") {
      const timer = setTimeout(() => {
        setButtonState("idle");
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [buttonState]);

  return (
    <div className="relative h-10 flex items-center justify-center">
      <AnimatePresence mode="wait">
        {buttonState === "idle" && (
          <motion.div
            key="idle"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="w-full"
          >
            <Button
              onClick={handleInitialClick}
              variant={variant}
              size={size}
              className="w-full"
            >
              {children}
            </Button>
          </motion.div>
        )}

        {buttonState === "confirming" && (
          <motion.div
            key="confirming"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="flex gap-4 w-full"
          >
            <Button
              onClick={handleConfirmClick}
              variant={variant}
              size={size}
              className="flex-1"
            >
              {confirmText}
            </Button>
            <Button
              onClick={handleCancelClick}
              variant="secondary"
              size={size}
              className="flex-1"
            >
              Cancel
            </Button>
          </motion.div>
        )}

        {buttonState === "success" && (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className={cn(
              "w-full h-10 px-4 py-2 flex items-center justify-center gap-2",
              "whitespace-nowrap rounded-md text-sm font-medium text-white",
              "bg-bg-success",
            )}
          >
            <Check />
            {successText}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
