import React from "react";
import BatchTable, { type Batch } from "./BatchTable";

interface BatchManagerProps {
  batches: Batch[];
  setBatches: React.Dispatch<React.SetStateAction<Batch[]>>;
}

export default function BatchManager({
  batches,
  setBatches,
}: BatchManagerProps) {
  const handleDelete = (id: number) => {
    setBatches((prev) => prev.filter((batch) => batch.id !== id));
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm p-4">
      <BatchTable data={batches} onDelete={handleDelete} />
    </div>
  );
}
