import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router";
import { useBatchToast } from "../../hooks/useBatchToast";
import BatchToastContainer from "../../components/BatchToastContainer";
import BatchDetailsCard from "../../features/admin/batches/BatchDetailsCard";
import BatchDetailsModal from "../../features/admin/batches/BatchDetailsModal";
import AddTraineeModal from "../../features/admin/batches/AddTraineeModal";
import EditDetailsModal from "../../features/admin/batches/EditDetailsModal";
import PhaseTabsAndTables from "../../features/admin/batches/PhaseTabsAndTables";
import { batchService } from "../../services/batchService";
import { traineeService } from "../../services/traineeService";
import DocumentUpload from "../../features/admin/batches/DocumentAccordion";
import ResultsAccordion from "./ResultsAccordion";

interface Trainee {
  id: number;
  traineeId?: number; // Store actual trainee ID from backend for updates
  userId?: number; // User ID for navigation to profile page
  name: string;
  email: string;
  phoneNumber: string;
  status: "Active" | "Inactive";
}

interface TraineeFormData {
  fullName: string;
  email: string;
  phoneNumber: string;
}

interface Batch {
  id: number;
  batchName: string;
  startDate: string;
  endDate: string;
  batchType: string;
  status: "Ongoing" | "Completed" | "Not Started";
  totalTrainees: number;
  totalTrainingHours: number;
  techStack: string;
}

interface BatchUpdateData {
  batchName: string;
  startDate: string;
  endDate: string;
  batchType: string;
  phases?: any[];
}

interface Specialization {
  id: number;
  traineeName: string;
  techStack: string;
  project: string;
}

interface BusinessOrientation {
  id: number;
  boPhaseId?: number; // Store backend ID for updates
  traineeName: string;
  buddy: string;
  du: string;
}

interface DUData {
  id: number;
  traineeDuId?: number; // Store backend ID for updates
  traineeName: string;
  duAllocated: string;
  location: string;
  ojtMentor: string;
}

interface ResultsData {
  id: number;
  traineeName: string;
  techFundamentalScore: string;
  specializationScore: string;
  boScore: string;
  overallScore: string;
}

export default function BatchDetailsPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const batchId = id ? parseInt(id) : null;
  const { toasts, show: showToast, removeToast } = useBatchToast();

  const [isAddTraineeModalOpen, setIsAddTraineeModalOpen] = useState(false);
  const [isEditBatchModalOpen, setIsEditBatchModalOpen] = useState(false);
  const [activePhase, setActivePhase] = useState("Trainees");

  // Fetch batch details from API
  const {
    data: apiBatch,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["batch", batchId],
    queryFn: () => batchService.getBatchById(batchId!),
    enabled: !!batchId,
    staleTime: 30000,
  });

  // Fetch batch types for ID lookup during update
  const { data: apiBatchTypes } = useQuery({
    queryKey: ["batchTypes"],
    queryFn: batchService.getAllBatchTypes,
    staleTime: 5 * 60 * 1000,
  });

  // Fetch trainees for this batch
  const { data: apiTrainees, refetch: refetchTrainees } = useQuery({
    queryKey: ["trainees", batchId],
    queryFn: () => traineeService.getTraineesByBatch(batchId!),
    enabled: !!batchId,
    staleTime: 0, // Don't cache - always fetch fresh data
  });

  // Fetch BO Phases for this batch
  const { data: apiBoPhases } = useQuery({
    queryKey: ["boPhases", batchId],
    queryFn: () => traineeService.getBoPhasesByBatch(batchId!),
    enabled: !!batchId,
    staleTime: 30000,
  });

  // Fetch Trainee DUs for this batch
  const { data: apiTraineeDus } = useQuery({
    queryKey: ["traineeDus", batchId],
    queryFn: () => traineeService.getTraineeDusByBatch(batchId!),
    enabled: !!batchId,
    staleTime: 30000,
  });

  // Fetch Specialization Phase for this batch
  const { data: apiSpecialization } = useQuery({
    queryKey: ["specialization", batchId],
    queryFn: () => batchService.getSpecializationPhaseByBatch(batchId!),
    enabled: !!batchId,
    staleTime: 30000,
  });

  const [currentBatch, setCurrentBatch] = useState<Batch>({
    id: 1,
    batchName: "ILP Batch 7",
    startDate: "2025-04-08",
    endDate: "2025-09-08",
    batchType: "Developer Trainee",
    status: "Ongoing",
    totalTrainees: 5,
    totalTrainingHours: 48,
    techStack: "Loading...",
  });

  // State to track available phases in the batch
  const [availablePhases, setAvailablePhases] = useState<string[]>([]);

  // Update currentBatch when API data is loaded
  useEffect(() => {
    if (apiBatch) {
      // Handle wrapped response format
      const batchData = (apiBatch as any).data || apiBatch;

      if (!batchData || !batchData.startDate || !batchData.endDate) {
        return;
      }

      // Map backend status to frontend format
      // Backend can return status as string or integer (0=NotStarted, 1=Active, 2=Completed)
      let status: "Not Started" | "Ongoing" | "Completed" = "Not Started";

      // Handle integer status values
      if (batchData.status === 0 || batchData.status === "NotStarted") {
        status = "Not Started";
      } else if (
        batchData.status === 1 ||
        batchData.status === "Active" ||
        batchData.status === "Ongoing"
      ) {
        status = "Ongoing";
      } else if (batchData.status === 2 || batchData.status === "Completed") {
        status = "Completed";
      }

      // Calculate training hours from dates
      const start = new Date(batchData.startDate);
      const end = new Date(batchData.endDate);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      const trainingHours = diffDays * 8;

      setCurrentBatch({
        id: batchData.id,
        batchName: batchData.batchName,
        startDate: batchData.startDate?.split("T")?.[0] || batchData.startDate,
        endDate: batchData.endDate?.split("T")?.[0] || batchData.endDate,
        batchType: batchData.batchTypeName || "Unknown",
        status,
        totalTrainees: 0, // Will be updated when trainees are loaded
        totalTrainingHours: trainingHours,
        techStack: "Loading...", // Will be updated from specialization data
      });

      // Extract available phases from batch data
      if (batchData.phases && Array.isArray(batchData.phases)) {
        const phaseNames = batchData.phases
          .map((phase: any) => phase.phaseType || phase.phaseTypeName)
          .filter((name: string) => name);
        setAvailablePhases(phaseNames);
      } else {
        setAvailablePhases([]);
      }
    }
  }, [apiBatch]);

  const [trainees, setTrainees] = useState<Trainee[]>([]);

  // Update trainees when API data is loaded
  useEffect(() => {
    if (apiTrainees) {
      // Handle wrapped response format
      const traineesArray = (apiTrainees as any).data || apiTrainees;

      if (Array.isArray(traineesArray)) {
        const mappedTrainees: Trainee[] = traineesArray.map((trainee: any) => {
          // The trainee ID (trainee.id) is the primary key used for API updates
          // userId is a different field (foreign key to User table) used for profile navigation
          const traineeId = trainee.traineeId || trainee.id;

          return {
            id: traineeId, // Use trainee.id for display and updates
            traineeId: traineeId, // Store explicitly for API calls
            userId: trainee.userId, // Store userId for profile navigation
            name: trainee.username || trainee.name || "Unknown",
            email: trainee.email || "",
            phoneNumber: trainee.phoneNo || trainee.phoneNumber || "",
            status: trainee.status === "Active" ? "Active" : "Inactive",
          };
        });

        // Sort trainees alphabetically by name by default
        const sortedTrainees = mappedTrainees.sort((a, b) =>
          a.name.localeCompare(b.name, undefined, { sensitivity: "base" }),
        );

        setTrainees(sortedTrainees);
      }
    }
  }, [apiTrainees]);

  // Update batch totalTrainees count when trainees change
  useEffect(() => {
    setCurrentBatch((prev) => ({
      ...prev,
      totalTrainees: trainees.length,
    }));
  }, [trainees.length]);

  const [specializationData, setSpecializationData] = useState<
    Specialization[]
  >([]);

  // Update Specialization data when API data is loaded
  useEffect(() => {
    if (apiSpecialization) {
      // Handle wrapped response format
      const specArray = (apiSpecialization as any).data || apiSpecialization;

      if (Array.isArray(specArray)) {
        const mappedSpecialization: Specialization[] = specArray.map(
          (spec: any) => ({
            id: spec.traineeId || spec.id,
            traineeName: spec.traineeName || "Unknown",
            techStack: spec.techStack || "Not Assigned",
            project: spec.project || "Not Assigned",
          }),
        );

        // Sort by trainee name alphabetically
        const sortedSpecialization = mappedSpecialization.sort((a, b) =>
          a.traineeName.localeCompare(b.traineeName, undefined, {
            sensitivity: "base",
          }),
        );

        setSpecializationData(sortedSpecialization);

        // Extract unique tech stacks from projects and update batch tech stack
        const uniqueTechStacks = Array.from(
          new Set(
            specArray
              .map((spec: any) => spec.techStack)
              .filter(
                (tech: string) =>
                  tech && tech !== "Not Assigned" && tech.trim() !== "",
              ),
          ),
        ).sort();

        setCurrentBatch((prev) => ({
          ...prev,
          techStack:
            uniqueTechStacks.length > 0
              ? uniqueTechStacks.join(", ")
              : "Not Assigned",
        }));
      }
    }
  }, [apiSpecialization]);

  const [businessOrientationData, setBusinessOrientationData] = useState<
    BusinessOrientation[]
  >([]);

  // Update BO Phase data when API data is loaded
  useEffect(() => {
    if (apiBoPhases) {
      // Handle wrapped response format
      const boArray = (apiBoPhases as any).data || apiBoPhases;

      if (Array.isArray(boArray)) {
        const mappedBoPhases: BusinessOrientation[] = boArray.map(
          (bo: any) => ({
            id: bo.boPhaseId, // Use boPhaseId from API
            boPhaseId: bo.boPhaseId, // Store backend ID for updates
            traineeName: bo.traineeName || "Unknown",
            buddy: bo.buddy || "", // API returns "buddy" field
            du: bo.buddyDU || "", // API returns "buddyDU" field
          }),
        );

        // Sort by trainee name alphabetically by default
        const sortedBoPhases = mappedBoPhases.sort((a, b) =>
          a.traineeName.localeCompare(b.traineeName, undefined, {
            sensitivity: "base",
          }),
        );

        setBusinessOrientationData(sortedBoPhases);
      }
    }
  }, [apiBoPhases]);

  const [duData, setDuData] = useState<DUData[]>([]);

  // Update Trainee DU data when API data is loaded
  useEffect(() => {
    if (apiTraineeDus) {
      // Handle wrapped response format
      const duArray = (apiTraineeDus as any).data || apiTraineeDus;

      if (Array.isArray(duArray)) {
        const mappedDus: DUData[] = duArray.map((du: any, index: number) => ({
          id: du.traineeDuId || du.id || index + 1,
          traineeDuId: du.traineeDuId, // Store backend ID for updates
          traineeName: du.traineeName || "Unknown",
          duAllocated: du.duAllocated || du.duName || "",
          location: du.location || "",
          ojtMentor: du.ojtMentor || du.ojtMenter || "",
        }));

        // Sort by trainee name alphabetically by default
        const sortedDus = mappedDus.sort((a, b) =>
          a.traineeName.localeCompare(b.traineeName, undefined, {
            sensitivity: "base",
          }),
        );

        setDuData(sortedDus);
      }
    }
  }, [apiTraineeDus]);

  const [resultsData, setResultsData] = useState<ResultsData[]>([
    {
      id: 4,
      traineeName: "Anjali Nair",
      techFundamentalScore: "95",
      specializationScore: "93",
      boScore: "92",
      overallScore: "93.33",
    },
    {
      id: 3,
      traineeName: "Jake Gruton",
      techFundamentalScore: "78",
      specializationScore: "82",
      boScore: "85",
      overallScore: "81.67",
    },
    {
      id: 1,
      traineeName: "John Dover",
      techFundamentalScore: "85",
      specializationScore: "90",
      boScore: "88",
      overallScore: "87.67",
    },
    {
      id: 2,
      traineeName: "Mary Varghese",
      techFundamentalScore: "92",
      specializationScore: "88",
      boScore: "90",
      overallScore: "90.00",
    },
  ]);

  const [isEditPhaseModalOpen, setIsEditPhaseModalOpen] = useState(false);
  const [currentEditRow, setCurrentEditRow] = useState<any>(null);
  const [currentEditPhase, setCurrentEditPhase] = useState<
    | "Trainees"
    | "Specialization"
    | "Business Orientation"
    | "DU"
    | "Scores"
    | null
  >(null);
  const [modalErrors, setModalErrors] = useState<Record<string, string>>({});

  const handleSavePhaseEdit = (updatedRow: any) => {
    switch (currentEditPhase) {
      case "Trainees": {
        // Transform to UpdateTraineeDto format
        // Use traineeId (actual backend ID) for the route parameter
        const traineeId = updatedRow.traineeId || updatedRow.id;

        // Find the original trainee data to preserve status (since it's not editable in modal)
        const originalTrainee = trainees.find(
          (t) => t.id === traineeId || t.traineeId === traineeId,
        );

        const updateData = {
          // Don't include 'id' in body - backend uses [JsonIgnore] and gets it from route parameter
          email: updatedRow.email,
          phoneNo: updatedRow.phoneNumber,
          // Preserve the original status since we don't edit it in the modal
          status: (originalTrainee?.status || updatedRow.status) as
            | "Active"
            | "Inactive"
            | "OnLeave",
        };
        updateTraineeMutation.mutate({ id: traineeId, data: updateData });
        break;
      }
      case "Specialization":
        // TODO: Add Specialization update API when available
        setSpecializationData((prev) =>
          prev.map((r) => (r.id === updatedRow.id ? updatedRow : r)),
        );
        setIsEditPhaseModalOpen(false);
        showToast({
          title: "Success",
          message: "Updated successfully (local only)",
          color: "green",
        });
        break;
      case "Business Orientation": {
        // Transform to UpdateBoPhaseDto format
        const boPhaseId = updatedRow.boPhaseId || updatedRow.id;
        const updateData = {
          boPhaseId: boPhaseId,
          // Don't send traineeName - it's read-only and triggers duplicate checks
          // Only send buddy and DU updates
          buddyName: updatedRow.buddy,
          duName: updatedRow.du,
        };
        updateBoMutation.mutate({ id: boPhaseId, data: updateData });
        break;
      }
      case "DU": {
        // Transform to UpdateTraineeDuDto format
        const traineeDuId = updatedRow.traineeDuId || updatedRow.id;
        const updateData = {
          traineeDuId: traineeDuId,
          // Don't send traineeName - backend should use traineeDuId to identify the record
          duAllocated: updatedRow.duAllocated,
          location: updatedRow.location,
          ojtMentor: updatedRow.ojtMentor,
        };
        updateDuMutation.mutate({ id: traineeDuId, data: updateData });
        break;
      }
      case "Scores":
        // TODO: Add Scores update API when available
        setResultsData((prev) =>
          prev.map((r) => (r.id === updatedRow.id ? updatedRow : r)),
        );
        setIsEditPhaseModalOpen(false);
        showToast({
          title: "Success",
          message: "Updated successfully (local only)",
          color: "green",
        });
        break;
    }
  };

  const queryClient = useQueryClient();

  // Update batch mutation
  const updateBatchMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) =>
      batchService.updateBatch(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["batch", batchId] });
      queryClient.invalidateQueries({ queryKey: ["batches"] });
      setIsEditBatchModalOpen(false);
      showToast({
        title: "Success",
        message: "Batch updated successfully",
        color: "green",
      });
    },
    onError: (error: Error) => {
      showToast({
        title: "Error",
        message: error.message || "Failed to update batch",
        color: "red",
      });
    },
  });

  // Update trainee mutation
  const updateTraineeMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) =>
      traineeService.updateTrainee(id, data),
    onSuccess: async () => {
      // Invalidate and refetch to ensure UI updates
      await queryClient.invalidateQueries({ queryKey: ["trainees", batchId] });
      await refetchTrainees(); // Explicitly refetch
      setModalErrors({}); // Clear any previous errors
      setIsEditPhaseModalOpen(false);
      showToast({
        title: "Success",
        message: "Trainee updated successfully",
        color: "green",
      });
    },
    onError: (error: any) => {
      // Check if it's an email already exists error
      if (
        error.message &&
        error.message.toLowerCase().includes("email already exists")
      ) {
        setModalErrors({ email: "Email already exists" });
        // Don't show notification, just show inline error
      } else {
        showToast({
          title: "Error",
          message: error.message || "Failed to update trainee",
          color: "red",
        });
      }
    },
  });

  // Update BO Phase mutation
  const updateBoMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) =>
      traineeService.updateBoPhase(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["boPhases", batchId] });
      setIsEditPhaseModalOpen(false);
      showToast({
        title: "Success",
        message: "Business Orientation updated successfully",
        color: "green",
      });
    },
    onError: (error: Error) => {
      showToast({
        title: "Error",
        message: error.message || "Failed to update Business Orientation",
        color: "red",
      });
    },
  });

  // Update Trainee DU mutation
  const updateDuMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) =>
      traineeService.updateTraineeDu(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["traineeDus", batchId] });
      setIsEditPhaseModalOpen(false);
      showToast({
        title: "Success",
        message: "DU assignment updated successfully",
        color: "green",
      });
    },
    onError: (error: Error) => {
      showToast({
        title: "Error",
        message: error.message || "Failed to update DU assignment",
        color: "red",
      });
    },
  });

  const handleEditBatch = () => setIsEditBatchModalOpen(true);
  const handleUpdateBatch = (updatedData: BatchUpdateData) => {
    if (!batchId) return;

    // Find the batch type ID from the batch type name
    const batchTypeArray = Array.isArray(apiBatchTypes)
      ? apiBatchTypes
      : (apiBatchTypes as any)?.$values || (apiBatchTypes as any)?.data || [];

    const selectedBatchType = batchTypeArray.find(
      (bt: any) => bt.name === updatedData.batchType,
    );

    // Process phases with ISO dates and ensure phaseTypeId is included
    const processedPhases = updatedData.phases?.map((phase: any) => ({
      phaseType: phase.phaseType,
      phaseTypeId: phase.phaseTypeId,
      startDate: `${phase.startDate}T12:00:00.000Z`,
      endDate: `${phase.endDate}T12:00:00.000Z`,
    }));

    const payload = {
      batchName: updatedData.batchName,
      batchTypeId: selectedBatchType?.id || null,
      // Convert dates to ISO format at noon UTC
      startDate: `${updatedData.startDate}T12:00:00.000Z`,
      endDate: `${updatedData.endDate}T12:00:00.000Z`,
      phases: processedPhases || undefined, // Don't send empty array to preserve existing phases
    };

    updateBatchMutation.mutate({ id: batchId, data: payload });
  };

  const handleAddTrainee = (traineeData: TraineeFormData) => {
    // Trainee creation is handled by AddTraineeModal mutation
    // The query will be invalidated automatically and trainees will refresh
    showToast({
      title: "Success",
      message: `${traineeData.fullName} has been added successfully.`,
      color: "green",
    });
  };

  const handleRowClick = (row: Trainee) =>
    navigate(`/batchDetails/${row.userId}`);

  const formatDateForDisplay = (isoDate: string) =>
    new Date(isoDate).toLocaleDateString("en-GB");

  // Loading state
  if (isLoading) {
    return (
      <div className="p-4 flex justify-center items-center h-64">
        <div className="text-lg text-gray-600">Loading batch details...</div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="p-4">
        <div className="flex flex-col items-center justify-center h-64 text-center space-y-4">
          <div className="text-lg text-red-600">
            Failed to load batch details
          </div>
          <div className="text-sm text-gray-600">
            {(error as Error).message}
          </div>
        </div>
      </div>
    );
  }

  // No batch ID
  if (!batchId) {
    return (
      <div className="p-4 flex justify-center items-center h-64">
        <div className="text-lg text-gray-600">No batch selected</div>
      </div>
    );
  }

  return (
    <div className="p-4 bg-gray-50 flex-grow">
      {/* Batch Card */}
      <div className="mb-4 flex justify-center relative">
        <BatchDetailsCard
          batchId={currentBatch.id}
          batchName={currentBatch.batchName}
          startDate={formatDateForDisplay(currentBatch.startDate)}
          endDate={formatDateForDisplay(currentBatch.endDate)}
          batchType={currentBatch.batchType}
          status={currentBatch.status}
          totalTrainees={trainees.length}
          totalTrainingHours={currentBatch.totalTrainingHours}
          techStack={currentBatch.techStack}
          onEdit={handleEditBatch}
          onAddTrainee={() => setIsAddTraineeModalOpen(true)}
        />
      </div>

      {/* Phase Tabs and Tables Component */}
      <PhaseTabsAndTables
        activePhase={activePhase}
        setActivePhase={setActivePhase}
        trainees={trainees}
        specializationData={specializationData}
        businessOrientationData={businessOrientationData}
        duData={duData}
        resultsData={resultsData}
        availablePhases={availablePhases}
        handleRowClick={handleRowClick}
        handleEditRow={(row, phase) => {
          setCurrentEditRow(row);
          setCurrentEditPhase(
            phase as
              | "Specialization"
              | "Trainees"
              | "Business Orientation"
              | "DU"
              | "Scores",
          );
          setIsEditPhaseModalOpen(true);
        }}
      />

      {/* Modals */}
      <BatchDetailsModal
        isOpen={isEditBatchModalOpen}
        onClose={() => setIsEditBatchModalOpen(false)}
        onSubmit={handleUpdateBatch}
        isEditing
        batchId={batchId}
        initialData={{
          batchName: currentBatch.batchName,
          startDate: currentBatch.startDate,
          endDate: currentBatch.endDate,
          batchType: currentBatch.batchType,
        }}
      />

      <AddTraineeModal
        isOpen={isAddTraineeModalOpen}
        onClose={() => setIsAddTraineeModalOpen(false)}
        onSubmit={handleAddTrainee}
        batchId={batchId}
        existingTrainees={trainees}
      />

      {isEditPhaseModalOpen && currentEditRow && currentEditPhase && (
        <EditDetailsModal
          isOpen
          onClose={() => {
            setIsEditPhaseModalOpen(false);
            setCurrentEditRow(null);
            setCurrentEditPhase(null);
          }}
          title={`Edit ${currentEditPhase} Data`}
          data={currentEditRow}
          fields={
            currentEditPhase === "Trainees"
              ? [
                  { key: "email", label: "Email" },
                  { key: "phoneNumber", label: "Phone Number" },
                ]
              : currentEditPhase === "Specialization"
                ? [
                    {
                      key: "traineeName",
                      label: "Trainee Name",
                      readOnly: true,
                    },
                    { key: "techStack", label: "Tech Stack" },
                    { key: "project", label: "Project Involved" },
                  ]
                : currentEditPhase === "Business Orientation"
                  ? [
                      {
                        key: "traineeName",
                        label: "Trainee Name",
                        readOnly: true,
                      },
                      { key: "buddy", label: "Buddy" },
                      { key: "du", label: "DU" },
                    ]
                  : currentEditPhase === "DU"
                    ? [
                        {
                          key: "traineeName",
                          label: "Trainee Name",
                          readOnly: true,
                        },
                        { key: "duAllocated", label: "DU Allocated" },
                        { key: "location", label: "Location" },
                        { key: "ojtMentor", label: "OJT Mentor" },
                      ]
                    : [
                        {
                          key: "traineeName",
                          label: "Trainee Name",
                          readOnly: true,
                        },
                        {
                          key: "techFundamentalScore",
                          label: "Tech Fundamental Score",
                        },
                        {
                          key: "specializationScore",
                          label: "Specialization Score",
                        },
                        { key: "boScore", label: "BO Score" },
                        { key: "overallScore", label: "Overall Score" },
                      ]
          }
          onSave={handleSavePhaseEdit}
          externalErrors={modalErrors}
        />
      )}

      {/* Document Upload */}
      <div className="mt-4">
        <DocumentUpload
          batchTitle="Document and Link Requirements"
          initialDocuments={[
            {
              id: 1,
              documentName: "BRD",
              deadline: "",
              templateFile: null,
              submissionType: "image",
              isMultiple: false,
              isBroadcast: false,
              documentTypeId: 0,
            },
            {
              id: 2,
              documentName: "UAT",
              deadline: "",
              templateFile: null,
              submissionType: "image",
              isMultiple: false,
              isBroadcast: false,
              documentTypeId: 0,
            },
            {
              id: 3,
              documentName: "Sprint Tracker",
              deadline: "",
              templateFile: null,
              submissionType: "image",
              isMultiple: false,
              isBroadcast: false,
              documentTypeId: 0,
            },
          ]}
          initialLinks={[
            { id: 1, linkName: "GitHub Repo", urlPrefix: "" },
            { id: 2, linkName: "Deployment Link", urlPrefix: "" },
          ]}
          onDocumentChange={() => {
            /* Handle document changes */
          }}
          onLinksChange={() => {
            /* Handle link changes */
          }}
        />
      </div>

      <div className="mt-4">
        <ResultsAccordion batchId={""} />
      </div>

      {/* Toast Container */}
      <BatchToastContainer toasts={toasts} onRemoveToast={removeToast} />
    </div>
  );
}
