import React from "react";

type Props = {
  title?: string;
  children?: React.ReactNode;
};

const DashboardProjectCard: React.FC<Props> = ({ title, children }) => {
  return (
    <div className="bg-[var(--color-card)] rounded-md p-4">
      {title && (
        <h3 className="mb-4 text-xl font-bold text-gray-900">{title}</h3>
      )}
      {children}
    </div>
  );
};

export default DashboardProjectCard;
