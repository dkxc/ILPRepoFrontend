import type {
  AttendanceStatus,
  BulkUpdateStatus,
} from "@features/admin/attendance/types/AttendanceRecord.types";
import type { BadgeColor } from "@ui/badges/Badges";
import type { BadgeTypes } from "@ui/badges/components/BadgeTypes";
import { Dot } from "@ui/DotIcon";
import { CheckCheck, Sunrise, Sunset } from "lucide-react";
import type { Selection } from "react-aria-components";

const STATUS_DEFINITIONS: readonly {
  id: AttendanceStatus;
  label: string;
  badgeColor: BadgeColor<BadgeTypes>;
  dotClassName: string;
}[] = [
  {
    id: "P",
    label: "Present",
    badgeColor: "success",
    dotClassName: "text-fg-success-secondary",
  },
  {
    id: "A",
    label: "Absent",
    badgeColor: "error",
    dotClassName: "text-fg-error-secondary",
  },
  {
    id: "N/A",
    label: "N/A",
    badgeColor: "gray",
    dotClassName: "text-fg-secondary",
  },
];

export const getStatusColor = (status: string): BadgeColor<BadgeTypes> => {
  const definition = STATUS_DEFINITIONS.find((s) => s.id === status);
  return definition ? definition.badgeColor : "gray";
};

export const getStatusExpanded = (status: AttendanceStatus): string => {
  const definition = STATUS_DEFINITIONS.find((s) => s.id === status);
  return definition ? definition.label : "N/A";
};

export const attendanceStatuses: {
  id: AttendanceStatus;
  label: string;
  dotClassName: string;
}[] = STATUS_DEFINITIONS.map(({ id, label, dotClassName }) => ({
  id,
  label,
  dotClassName,
}));

export const sessionOptions: {
  label: "Both" | "FN" | "AN";
  getPayload: (status: AttendanceStatus) => BulkUpdateStatus;
  icon: React.FC;
}[] = [
  {
    label: "Both",
    getPayload: (status) => ({ forenoon: status, afternoon: status }),
    icon: CheckCheck,
  },
  {
    label: "FN",
    getPayload: (status) => ({ forenoon: status }),
    icon: Sunrise,
  },
  {
    label: "AN",
    getPayload: (status) => ({ afternoon: status }),
    icon: Sunset,
  },
];

export const getSelectionSize = (
  selector: Selection,
  totalLength: number,
): number => {
  if (selector === "all") {
    return totalLength;
  }

  return selector.size;
};

export const StatusIcon = ({ dotClassName }: { dotClassName: string }) => {
  return (
    <div className="mr-2 size-4 shrink-0 flex items-center justify-center">
      <Dot className={dotClassName} size="sm" />
    </div>
  );
};
