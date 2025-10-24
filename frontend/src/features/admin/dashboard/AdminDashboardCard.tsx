import React from "react";

type Props = {
  title: string;
  value?: React.ReactNode;
  selected?: boolean;
  onClick?: () => void;
  icon?: React.ReactNode;
};

const AdminDashboardCard: React.FC<Props> = ({
  title,
  value,
  selected = false,
  onClick,
  icon,
}) => {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left rounded-md p-5 flex items-center gap-4 transition-shadow border ${
        selected
          ? "border-[var(--color-brand-600)] bg-[var(--color-brand-50)] shadow-sm"
          : "border-transparent bg-[var(--color-card)] hover:shadow-sm"
      }`}
    >
      {icon && (
        <div className="shrink-0 w-12 h-12 rounded-md flex items-center justify-center]">
          {icon}
        </div>
      )}
      

      <div className="flex-1">
        <div className="text-large text-[var(--color-menuitem-text)] font-medium">
          {title}
        </div>
        {/* {subtitle && <div className="text-xs text-gray-500">{subtitle}</div>} */}
      </div>

      {value && (
        <div className="text-xl font-semibold text-[var(--color-text-base)]">
          {value}
        </div>
      )}
    </button>
  );
};

export default AdminDashboardCard;
