import React from "react";

type SmallBatch = {
  id: string | number;
  title: string;
  subtitle?: string;
  status?: string;
};

export const SmallBatchCard: React.FC<{
  batch: SmallBatch;
  selected?: boolean;
  onClick?: () => void;
}> = ({ batch, selected = false, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`min-w-[220px] text-left rounded-md p-4 transition-shadow border ${
        selected
          ? "border-[var(--color-brand-600)] bg-[var(--color-brand-50)] shadow-sm"
          : "border-gray-200 bg-[var(--color-card)] hover:shadow-sm"
      }`}
    >
      <div className="text-sm font-medium text-[var(--color-text-base)]">{batch.title}</div>
      {batch.subtitle && <div className="text-xs text-gray-500">{batch.subtitle}</div>}
      {batch.status && (
        <div className="mt-3 inline-block text-xs px-3 py-1 rounded-full bg-[var(--color-inactive-badge)]">{batch.status}</div>
      )}
    </button>
  );
};

export const BackgroundBatchCard: React.FC<{
  children?: React.ReactNode;
}> = ({ children }) => {
  return (
    <div className="w-full rounded-md p-6 bg-[var(--color-card)] border border-transparent shadow-sm">
      {children}
    </div>
  );
};

export default SmallBatchCard;

export const SquareInfoCard: React.FC<{
  icon?: React.ReactNode;
  title?: string;
  subtitle?: string | number;
}> = ({ icon, title, subtitle }) => {
  return (
    <div className="border rounded-md p-4 h-full bg-[var(--color-card)]">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-md flex items-center justify-center text-[var(--color-brand-600)] bg-[var(--color-brand-50)]">{icon}</div>
        <div>
          {title && <div className="text-xs text-[var(--color-menuitem-text)] font-medium">{title}</div>}
          {subtitle !== undefined && <div className="text-sm text-gray-500">{subtitle}</div>}
        </div>
      </div>
    </div>
  );
};

export const ProjectItem: React.FC<{
  name: string;
  lead?: string;
  percent?: number;
}> = ({ name, lead, percent = 98 }) => {
  return (
    <li className="flex items-center justify-between">
      <div>
        <div className="text-sm font-medium">{name}</div>
        {lead && <div className="text-xs text-gray-500">Team Lead: {lead}</div>}
      </div>
      <div className="w-10 h-10 rounded-full border flex items-center justify-center text-xs text-[var(--color-brand-600)]">{percent}%</div>
    </li>
  );
};

export const TraineeItem: React.FC<{
  name: string;
  project?: string;
}> = ({ name, project }) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <div className="text-sm font-medium">{name}</div>
        {project && <div className="text-xs text-gray-500">{project}</div>}
      </div>
      <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200" />
    </div>
  );
};
