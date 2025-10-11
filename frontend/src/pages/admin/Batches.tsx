import { Plus } from "lucide-react";
import { useState, useEffect } from "react";
import BatchCard from "../../features/admin/batches/BatchCard";
import Button from "../../features/ui/Button";
import BatchManager from "../../features/admin/batches/BatchManager";
import BatchDetailsModal from "../../features/admin/batches/BatchDetailsModal";
import type { Batch } from "../../features/admin/batches/BatchTable";

function Batches() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [batches, setBatches] = useState<Batch[]>([]);

  // ✅ Load batches from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("batches");
    if (stored) {
      setBatches(JSON.parse(stored));
    }
  }, []);

  // ✅ Persist batches to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("batches", JSON.stringify(batches));
  }, [batches]);

  // ✅ Determine status based on start/end date
  const determineStatus = (
    startDate: string,
    endDate: string
  ): Batch["status"] => {
    const today = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (today < start) return "Not Started";
    if (today > end) return "Completed";
    return "Ongoing";
  };

  // ✅ Handle adding new batch
  const handleAddBatch = (data: {
    batchName: string;
    batchType: string;
    startDate: string;
    endDate: string;
  }) => {
    const newBatch: Batch = {
      id: Date.now(),
      name: data.batchName,
      type: data.batchType,
      totalTrainees: 0,
      status: determineStatus(data.startDate, data.endDate),
      startDate: data.startDate,
      endDate: data.endDate,
    };

    setBatches((prev) => [...prev, newBatch]);
    setIsModalOpen(false);
  };

  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <span className="text-[30px] font-semibold text-[#565E6C]">
          Batches
        </span>
        <Button
          onClick={() => setIsModalOpen(true)}
          size="sm"
          className="rounded-[18px]"
        >
          <Plus size={16} /> Create new batch
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 pt-3">
        <BatchCard type="all" value={batches.length} />
        <BatchCard
          type="ongoing"
          value={batches.filter((b) => b.status === "Ongoing").length}
        />
        <BatchCard
          type="completed"
          value={batches.filter((b) => b.status === "Completed").length}
        />
        <BatchCard type="hours" value="48" subtitle="hrs" />
      </div>

      {/* Table + Modal */}
      <div className="pt-8">
        <BatchManager batches={batches} setBatches={setBatches} />
      </div>

      <BatchDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddBatch}
        title="Create Batch"
      />
    </div>
  );
}

export default Batches;
