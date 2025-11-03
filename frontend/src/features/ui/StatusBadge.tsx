import React from "react";

interface StatusBadgeProps {
  status: "Active" | "Inactive" | "Ongoing" | "Completed" | "Not Started";
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const getStyles = () => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-700";
      case "Inactive":
        return "bg-gray-200 text-gray-600";
      case "Ongoing":
        return "bg-orange-100 text-orange-700"; // changed to orange
      case "Completed":
        return "bg-green-100 text-green-700"; // changed to green
      case "Not Started":
        return "bg-gray-200 text-gray-600";
      default:
        return "bg-gray-100 text-gray-500";
    }
  };

  return (
    <span
      className={`px-4 py-1 rounded-full text-sm font-medium inline-block text-center min-w-[90px] ${getStyles()}`}
    >
      {status}
    </span>
  );
};

export default StatusBadge;
