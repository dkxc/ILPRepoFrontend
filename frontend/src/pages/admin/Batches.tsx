import { Plus } from "lucide-react";
import { useState, useEffect } from "react";
import BatchCard from "../../features/admin/batches/BatchCard";
import Button from "../../features/ui/Button";
import BatchManager from "../../features/admin/batches/BatchManager";
import BatchDetailsModal from "../../features/admin/batches/BatchDetailsModal";
import type { Batch } from "../../features/admin/batches/BatchTable";
import { batchService } from "../../services/batchService";

function Batches() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ✅ Load batches from API on mount
  useEffect(() => {
    loadBatches();
  }, []);

  const loadBatches = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Loading batches...');
      const batchesData = await batchService.getAllBatches();
      console.log('Batches loaded successfully:', batchesData);
      setBatches(batchesData);
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to load batches. Please try again.';
      
      // Check if it's a CORS error
      if (err.message?.includes('NetworkError') || err.message?.includes('fetch')) {
        setError('CORS Error: Please configure your backend to allow requests from this frontend. Add CORS policy to your .NET API.');
      } else {
        setError(`Failed to load batches: ${errorMessage}`);
      }
      
      console.error('Error loading batches:', err);
    } finally {
      setLoading(false);
    }
  };



  // ✅ Handle adding new batch
  const handleAddBatch = async (data: {
    batchName: string;
    batchType: string;
    startDate: string;
    endDate: string;
  }) => {
    try {
      setError(null);
      const newBatch = await batchService.createBatch(data);
      setBatches((prev) => [...prev, newBatch]);
      setIsModalOpen(false);
    } catch (err) {
      setError('Failed to create batch. Please try again.');
      console.error('Error creating batch:', err);
    }
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

      {/* Error Message */}
      {error && (
        <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
          <button
            onClick={loadBatches}
            className="ml-2 underline hover:no-underline"
          >
            Retry
          </button>
        </div>
      )}

      {/* Summary Cards */}
      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 pt-3">
          <div className="h-24 bg-gray-200 animate-pulse rounded"></div>
          <div className="h-24 bg-gray-200 animate-pulse rounded"></div>
          <div className="h-24 bg-gray-200 animate-pulse rounded"></div>
          <div className="h-24 bg-gray-200 animate-pulse rounded"></div>
        </div>
      ) : (
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
      )}

      {/* Table + Modal */}
      <div className="pt-8">
        {loading ? (
          <div className="bg-white rounded-lg p-8">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        ) : (
          <BatchManager batches={batches} setBatches={setBatches} />
        )}
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
