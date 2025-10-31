import type { BadgeColor } from "@ui/badges/Badges";
import type { BadgeTypes } from "@ui/badges/components/BadgeTypes";

export const getTotalBadgeColor = (
  presentCount: number,
  totalCount: number,
): BadgeColor<BadgeTypes> => {
  if (totalCount === 0) return "gray";
  if (presentCount === totalCount) return "success";
  if (presentCount === 0) return "error";
  return "gray";
};
