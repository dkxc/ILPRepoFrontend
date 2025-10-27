import React from "react";
import { cn } from "@lib/utils";

interface WelcomeHeaderSuccessProps
  extends React.HTMLAttributes<HTMLDivElement> {
  firstName?: string;
  ref?: React.Ref<HTMLDivElement>;
}

export function WelcomeHeaderSuccess({
  firstName,
  className,
  ref,
  ...props
}: WelcomeHeaderSuccessProps) {
  return (
    <div className={cn("px-6 pt-4", className)} ref={ref} {...props}>
      <h1 className="text-2xl font-semibold">Welcome, {firstName || "User"}</h1>
    </div>
  );
}
