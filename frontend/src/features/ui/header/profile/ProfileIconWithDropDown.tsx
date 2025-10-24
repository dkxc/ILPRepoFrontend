import { useRef, useState } from "react";
import { cn } from "../../../../lib/utils";
import { UserRound } from "lucide-react";
import HeaderItem from "../HeaderItem";
import { useOnClickOutside } from "../../../../hooks/useOnClickOutside";

import { motion, AnimatePresence } from "framer-motion";
import React from "react";

interface ProfileIconWithDropDownProps
  extends React.HTMLAttributes<HTMLDivElement> {
  avatarUrl?: string;
}

export function ProfileIconWithDropDown({
  avatarUrl,
  children,
  className,
  ...props
}: ProfileIconWithDropDownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const toggleDropDown = () => {
    setIsOpen((isOpen) => !isOpen);
  };
  const closeDropDown = () => {
    setIsOpen(false);
  };

  const wrapperRef = useRef<HTMLDivElement>(null);
  useOnClickOutside(wrapperRef, closeDropDown);

  return (
    <div ref={wrapperRef} className={cn("relative", className)} {...props}>
      <HeaderItem
        asChild
        className="rounded-full overflow-hidden"
        onClick={toggleDropDown}
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt="User Avatar"
            className="w-full h-full object-cover"
          />
        ) : (
          <UserRound className="p-2" />
        )}
      </HeaderItem>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="profile-dropdown"
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            style={{ transformOrigin: "top right" }}
            className="absolute right-0 mt-4 w-48 bg-menucolor rounded-md shadow-lg z-10 border border-inactive-badge"
          >
            {React.Children.map(children, (child) => {
              if (React.isValidElement(child)) {
                return React.cloneElement(child, {
                  onClick: closeDropDown,
                } as React.HTMLAttributes<HTMLElement>);
              }
              return child;
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
