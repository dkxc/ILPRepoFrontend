import { Plus } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import Button from "../../features/ui/Button";
import DataTable, { type ColumnDef } from "../../features/ui/Table";
import BatchDetailsModal from "../../features/admin/batches/BatchDetailsModal";
import StatusBadge from "../../features/ui/StatusBadge";
import { batchService } from "../../services/batchService";
import { traineeService } from "../../services/allServices";
import { useBatchToast } from "../../hooks/useBatchToast";
import BatchToastContainer from "../../components/BatchToastContainer";

// ---------------------- Types ----------------------
interface Batch {
  id: number;
  name: string;
  type: string;
  totalTrainees: number;
  totalTrainingHours: number;
  status: "Not Started" | "Ongoing" | "Completed";
  startDate?: string;
  endDate?: string;
}

export default function Batches() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [batches, setBatches] = useState<Batch[]>([]);
  const { toasts, show: showToast, removeToast } = useBatchToast();

  // Fetch batch types for ID lookup
  const { data: apiBatchTypes } = useQuery({
    queryKey: ["batchTypes"],
    queryFn: batchService.getAllBatchTypes,
    staleTime: 5 * 60 * 1000,
  });

  // Note: AdminDashboard/training-hours-report endpoint is not available
  // Using enhanced client-side calculation with 6-day training week (Mon-Sat)

  // Enhanced training hours calculation (similar to TotalTrainingHours.tsx logic)
  const calculateTrainingHours = (
    startDate?: string,
    endDate?: string,
  ): number => {
    if (!startDate || !endDate) return 0;

    const start = new Date(startDate);
    const end = new Date(endDate);

    // Validate dates
    if (isNaN(start.getTime()) || isNaN(end.getTime())) return 0;
    if (start >= end) return 0;

    // Calculate total days (inclusive)
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

    // Count 6 days of the week (Monday to Saturday) - excluding only Sunday
    let trainingDays = 0;
    const currentDate = new Date(start);

    while (currentDate <= end) {
      const dayOfWeek = currentDate.getDay();
      // 1 = Monday, 2 = Tuesday, ..., 6 = Saturday (excluding 0 = Sunday)
      if (dayOfWeek >= 1 && dayOfWeek <= 6) {
        trainingDays++;
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }

    // Apply 8 hours per training day (6 days a week)
    const trainingHours = trainingDays * 8;

    console.log(
      `Training hours calculation for ${startDate} to ${endDate}: ${totalDays} total days, ${trainingDays} training days (Mon-Sat), ${trainingHours} hours`,
    );

    return trainingHours;
  };

  // Enhanced training hours calculation (similar to TotalTrainingHours.tsx logic)
  const getTrainingHoursForBatch = (
    _batchId: number,
    batchName: string,
    startDate?: string,
    endDate?: string,
  ): number => {
    // Use enhanced client-side calculation since AdminDashboard API is not available
    const calculatedHours = calculateTrainingHours(startDate, endDate);
    console.log(
      `Calculated training hours for batch ${batchName}: ${calculatedHours} hours`,
    );
    return calculatedHours;
  };

  // Fetch all batches
  const {
    data: apiBatches,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["batches"],
    queryFn: batchService.getAllBatches,
    staleTime: 30000, // Cache for 30 seconds
    retry: 2, // Retry failed requests twice
    retryDelay: 1000, // Wait 1 second between retries
  });

  // Transform API data to local format
  useEffect(() => {
    if (apiBatches) {
      // Handle both direct array and wrapped response formats
      const batchArray = Array.isArray(apiBatches)
        ? apiBatches
        : (apiBatches as any).$values || (apiBatches as any).data || [];

      const transformed = batchArray.map((b: any) => {
        // Map backend status to frontend format
        // Backend can return status as string or integer (0=NotStarted, 1=Active, 2=Completed)
        let status: "Not Started" | "Ongoing" | "Completed" = "Not Started";

        // Debug: Log the actual status value from backend
        console.log(
          `Batch ${b.batchName} status from API:`,
          b.status,
          typeof b.status,
        );

        // Handle integer status values
        if (b.status === 0 || b.status === "NotStarted") {
          status = "Not Started";
        } else if (
          b.status === 1 ||
          b.status === "Active" ||
          b.status === "Ongoing"
        ) {
          status = "Ongoing";
        } else if (b.status === 2 || b.status === "Completed") {
          status = "Completed";
        }

        return {
          id: b.id,
          name: b.batchName,
          type:
            b.batchTypeName ||
            b.batchType?.name ||
            (typeof b.batchType === "string" ? b.batchType : "Unknown"),
          totalTrainees: 0, // Will be updated by fetching trainee counts
          totalTrainingHours: getTrainingHoursForBatch(
            b.id,
            b.batchName,
            b.startDate,
            b.endDate,
          ),
          status,
          startDate: b.startDate,
          endDate: b.endDate,
        };
      });

      // Sort batches by start date in descending order (most recent first)
      const sortedBatches = transformed.sort((a: any, b: any) => {
        // Handle cases where dates might be null or undefined
        if (!a.startDate && !b.startDate) return 0;
        if (!a.startDate) return 1; // Put batches without dates at the end
        if (!b.startDate) return -1;

        // Convert dates to Date objects for comparison
        const dateA = new Date(a.startDate);
        const dateB = new Date(b.startDate);

        // Sort in descending order (most recent first)
        return dateB.getTime() - dateA.getTime();
      });

      // Log batch transformation for debugging
      console.log(
        `Transformed and sorted ${sortedBatches.length} batches by start date (descending)`,
      );

      setBatches(sortedBatches);

      // Fetch trainee counts for all batches
      const fetchTraineeCounts = async () => {
        try {
          const traineeCountPromises = transformed.map(
            async (batch: { id: number }) => {
              try {
                const traineesResponse =
                  await traineeService.getTraineesByBatch(batch.id);
                const traineesArray = Array.isArray(traineesResponse)
                  ? traineesResponse
                  : (traineesResponse as any).$values ||
                    (traineesResponse as any).data ||
                    [];

                return {
                  batchId: batch.id,
                  traineeCount: traineesArray.length,
                };
              } catch (error) {
                console.error(
                  `Failed to fetch trainees for batch ${batch.id}:`,
                  error,
                );
                return {
                  batchId: batch.id,
                  traineeCount: 0,
                };
              }
            },
          );

          const traineeCountResults = await Promise.all(traineeCountPromises);

          // Update all batches with their trainee counts
          setBatches((prevBatches) =>
            prevBatches.map((batch) => {
              const result = traineeCountResults.find(
                (r) => r.batchId === batch.id,
              );
              return result
                ? { ...batch, totalTrainees: result.traineeCount }
                : batch;
            }),
          );
        } catch (error) {
          console.error("Failed to fetch trainee counts:", error);
        }
      };

      fetchTraineeCounts();
    }
  }, [apiBatches]);

  // Create batch mutation
  const createBatchMutation = useMutation({
    mutationFn: batchService.createBatch,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["batches"] });
      setIsModalOpen(false);
      showToast({
        title: "Success",
        message: "Batch created successfully",
        color: "green",
      });
    },
    onError: (error: Error) => {
      showToast({
        title: "Error",
        message: error.message || "Failed to create batch",
        color: "red",
      });
    },
  });

  // Handle batch creation
  const handleAddBatch = (data: {
    batchName: string;
    batchType: string;
    startDate: string;
    endDate: string;
    phases?: any[];
  }) => {
    // Backend automatically calculates status based on dates, so we don't send it

    // Convert dates to ISO 8601 format at noon UTC to avoid timezone issues
    // This ensures the date is interpreted consistently regardless of user's timezone
    const startDateISO = `${data.startDate}T12:00:00.000Z`;
    const endDateISO = `${data.endDate}T12:00:00.000Z`;

    // Find the batch type ID from the batch type name
    const batchTypeArray = Array.isArray(apiBatchTypes)
      ? apiBatchTypes
      : (apiBatchTypes as any)?.$values || (apiBatchTypes as any)?.data || [];

    const selectedBatchType = batchTypeArray.find(
      (bt: any) => bt.name === data.batchType,
    );

    // Process phases with ISO dates at noon UTC to avoid timezone issues
    const processedPhases = data.phases?.map((phase: any) => ({
      phaseType: phase.phaseType,
      phaseTypeId: phase.phaseTypeId,
      startDate: `${phase.startDate}T12:00:00.000Z`,
      endDate: `${phase.endDate}T12:00:00.000Z`,
    }));

    const payload = {
      batchName: data.batchName,
      batchTypeId: selectedBatchType?.id || null,
      // Status is not sent - backend calculates it automatically from dates
      startDate: startDateISO,
      endDate: endDateISO,
      phases: processedPhases || [],
    };

    createBatchMutation.mutate(payload);
  };

  const columns: ColumnDef<Batch>[] = [
    { key: "name", header: "Batch Name", sortable: true, width: "35%" },
    { key: "type", header: "Batch Type", sortable: true, width: "25%" },
    {
      key: "totalTrainees",
      header: "Total Trainees",
      align: "center",
      sortable: true,
      width: "20%",
    },
    {
      key: "status",
      header: "Status",
      align: "center",
      sortable: true,
      width: "20%",
      render: (value) => <StatusBadge status={value as Batch["status"]} />,
    },
  ];

  // Unique options for filters
  const batchTypes = Array.from(new Set(batches.map((b) => b.type)));
  const statuses = Array.from(new Set(batches.map((b) => b.status)));

  // Loading state
  if (isLoading) {
    return (
      <div className="p-4 flex justify-center items-center h-64">
        <div className="text-lg text-gray-600">Loading batches...</div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="p-4">
        <div className="flex flex-col items-center justify-center h-64 text-center space-y-4">
          <div className="text-lg text-red-600 mb-2">
            Failed to load batches
          </div>
          <div className="text-sm text-gray-600">{error.message}</div>
          <div className="text-xs text-gray-500">
            <p>Troubleshooting tips:</p>
            <ul className="list-disc list-inside mt-2 text-left">
              <li>
                Make sure your backend server is running on
                http://ilprepo.runasp.net
              </li>
              <li>Check that CORS is enabled in your backend</li>
              <li>Verify the API endpoint is accessible</li>
            </ul>
          </div>
          <Button
            onClick={() =>
              queryClient.invalidateQueries({ queryKey: ["batches"] })
            }
            size="sm"
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center">
        <span className="text-[30px] font-semibold text-[#565E6C]">
          Batches
        </span>
        <Button
          onClick={() => setIsModalOpen(true)}
          size="sm"
          className="rounded-[18px]"
          disabled={createBatchMutation.isPending}
        >
          <Plus size={16} /> Create new batch
        </Button>
      </div>

      <div className="pt-8">
        <DataTable
          columns={columns}
          data={batches}
          showHeaderSection={true}
          headerTitle="All Batches"
          headerTitleStyle={{ fontSize: "16px", fontWeight: 500 }}
          enableMultipleFilters={true}
          columnFilters={{
            type: batchTypes,
            status: statuses,
          }}
          enableSearch={true}
          enablePagination={true}
          pageSize={10}
          pageSizeOptions={[5, 10, 25, 50]}
          striped={false}
          highlightOnHover={true}
          withBorder={true}
          rowStyle={{
            fontSize: "16px",
            height: "56px",
            lineHeight: "1",
            cursor: "pointer",
          }}
          headerStyle={{
            fontWeight: 500,
            fontSize: "16px",
            height: "40px",
            background: "#F8F9FA",
          }}
          onRowClick={(row) => navigate(`/batches/${row.id}`)}
        />
      </div>

      <BatchDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddBatch}
        title="Create Batch"
      />

      <BatchToastContainer toasts={toasts} onRemoveToast={removeToast} />
    </div>
  );
}
