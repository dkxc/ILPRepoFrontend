import React from "react";

type Props = {
  title?: string;
  children?: React.ReactNode;
};

const DashboardProjectCard: React.FC<Props> = ({ title, children }) => {
  return (
    <div className="bg-[var(--color-card)] rounded-md p-6">
      {title && <h3 className="text-lg font-semibold mb-4">{title}</h3>}
      {children}
    </div>
  );
};

export default DashboardProjectCard;
