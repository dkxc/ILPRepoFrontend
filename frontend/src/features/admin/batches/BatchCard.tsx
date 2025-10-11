import { forwardRef } from "react";
import * as Card from "../../ui/card";
import { Users, RefreshCw, CheckCircle, Clock } from "lucide-react";

export interface BatchCardProps extends React.HTMLAttributes<HTMLDivElement> {
  type: "all" | "ongoing" | "completed" | "hours";
  value: number | string;
  subtitle?: string; // e.g., "hours/week"
}

const BatchCard = forwardRef<HTMLDivElement, BatchCardProps>(
  ({ className, type, value, subtitle, ...props }, ref) => {
    const cardData = {
      all: {
        icon: (
          <Users
            className="w-10 h-10"
            strokeWidth={2.5}
            style={{ color: "rgb(222, 225, 230)" }}
          />
        ),
        title: "All Batches",
      },
      ongoing: {
        icon: (
          <RefreshCw
            className="w-9 h-9"
            strokeWidth={2.5}
            style={{ color: "rgb(222, 225, 230)" }}
          />
        ),
        title: "Ongoing Batches",
      },
      completed: {
        icon: (
          <CheckCircle
            className="w-9 h-9"
            strokeWidth={2.5}
            style={{ color: "rgb(222, 225, 230)" }}
          />
        ),
        title: "Completed Batches",
      },
      hours: {
        icon: (
          <Clock
            className="w-9 h-9"
            strokeWidth={2.5}
            style={{ color: "rgb(222, 225, 230)" }}
          />
        ),
        title: "Total Training Hours",
      },
    };

    const { icon, title } = cardData[type];

    return (
      <Card.Card
        ref={ref}
        className={`flex items-center gap-4 p-4 rounded-md border ${className}`}
        style={{
          borderColor: "rgb(229 231 235)", // gray-200
          backgroundColor: "var(--color-sidebar-and-header-background)",
        }}
        {...props}
      >
        {/* Left icon */}
        <div className="flex items-center justify-center">{icon}</div>

        {/* Right side: title + value + subtitle */}
        <div className="flex flex-col">
          <p className="text-base font-medium text-gray-600">{title}</p>

          <div className="flex items-baseline gap-1">
            <p className="text-2xl font-semibold text-gray-700">{value}</p>
            {subtitle && <p className="text-xs text-gray-400">{subtitle}</p>}
          </div>
        </div>
      </Card.Card>
    );
  },
);

BatchCard.displayName = "BatchCard";
export default BatchCard;
