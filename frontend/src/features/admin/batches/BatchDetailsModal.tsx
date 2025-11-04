import React, { useState, useRef, useEffect } from "react";
import { X, Trash } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { notifications } from "@mantine/notifications";
import Button from "../../ui/Button";
import EditableDropdown from "./EditableDropdown";
import { batchService } from "../../../services/batchService";

// ---------------------- Types ----------------------
interface Phase {
  phaseName: string;
  customPhaseName?: string;
  startDate: string;
  endDate: string;
}

interface BatchFormData {
  batchName: string;
  batchYear: string;
  batchNumber: string;
  startDate: string;
  endDate: string;
  batchType: string;
  customBatchType: string;
  phases: Phase[];
}

interface BatchDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  title?: string;
  initialData?: Partial<BatchFormData> | null;
  isEditing?: boolean;
  batchId?: number | null;
}

// ---------------------- Constants ----------------------
const DEFAULT_TYPES = [
  { value: "full-stack", label: "Full Stack Developer" },
  { value: "business-analyst", label: "Business Analyst" },
  { value: "sdet", label: "SDET" },
  { value: "developer-trainee", label: "Developer Trainee" },
];

const DEFAULT_PHASES = [
  { value: "e-learning", label: "E Learning Phase" },
  { value: "tech-fundamentals", label: "Tech Fundamentals Phase" },
  { value: "business-orientation", label: "Business Orientation Phase" },
  { value: "specialization", label: "Specialization Phase" },
  { value: "on-the-job-training", label: "On The Job Training Phase" },
  { value: "custom", label: "Custom Phase" },
];

// Default batch name for create modal
const DEFAULT_BATCH_NAME = "ILP 2025-26 Batch 1";
const DEFAULT_BATCH_YEAR = "2025-26";
const DEFAULT_BATCH_NUMBER = "1";

// Helper functions for batch name parsing
const parseBatchName = (batchName: string) => {
  // Parse "ILP 2025-26 Batch 1" format
  const match = batchName.match(/^ILP\s+(.+?)\s+Batch\s+(.+)$/);
  if (match) {
    return { year: match[1], number: match[2] };
  }
  // Fallback to defaults if parsing fails
  return { year: DEFAULT_BATCH_YEAR, number: DEFAULT_BATCH_NUMBER };
};

const generateBatchName = (year: string, number: string) => {
  return `ILP ${year} Batch ${number}`;
};
// ---------------------- Field Component ----------------------
const Field = ({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  error,
}: any) => (
  <div>
    <label className="block text-sm font-medium text-[#565E6C] mb-1">
      {label}
    </label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={`w-full px-3 py-2 rounded-[4px] border text-[#565E6C]
        placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#bfdbfe]
        focus:border-[#3b82f6] hover:border-[#3b82f6] transition-all duration-150
        appearance-none [&::-webkit-calendar-picker-indicator]:invert-[40%]
        [&::-webkit-calendar-picker-indicator]:opacity-70
        [&::-webkit-calendar-picker-indicator]:cursor-pointer
        ${error ? "border-red-500" : "border-gray-300"}`}
    />
    {error && <span className="text-red-500 text-xs mt-1">{error}</span>}
  </div>
);

// ---------------------- Custom Batch Name Field ----------------------
const BatchNameField = ({
  year,
  batchNumber,
  onYearChange,
  onBatchNumberChange,
  error,
}: {
  year: string;
  batchNumber: string;
  onYearChange: (value: string) => void;
  onBatchNumberChange: (value: string) => void;
  error?: string;
}) => (
  <div>
    <label className="block text-sm font-medium text-[#565E6C] mb-1">
      Batch Name
    </label>
    <div className="flex items-center gap-2">
      <span className="text-[#565E6C] font-medium">ILP</span>
      <input
        type="text"
        value={year}
        onChange={(e) => onYearChange(e.target.value)}
        placeholder="2025-26"
        className={`px-3 py-2 rounded-[4px] border text-[#565E6C] w-24
          placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#bfdbfe]
          focus:border-[#3b82f6] hover:border-[#3b82f6] transition-all duration-150
          ${error ? "border-red-500" : "border-gray-300"}`}
      />
      <span className="text-[#565E6C] font-medium">Batch</span>
      <input
        type="text"
        value={batchNumber}
        onChange={(e) => onBatchNumberChange(e.target.value)}
        placeholder="1"
        className={`px-3 py-2 rounded-[4px] border text-[#565E6C] w-16
          placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#bfdbfe]
          focus:border-[#3b82f6] hover:border-[#3b82f6] transition-all duration-150
          ${error ? "border-red-500" : "border-gray-300"}`}
      />
    </div>
    {error && <span className="text-red-500 text-xs mt-1">{error}</span>}
  </div>
);

// ---------------------- Modal ----------------------
const BatchDetailsModal: React.FC<BatchDetailsModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  title,
  initialData = null,
  isEditing = false,
  batchId = null,
}) => {
  const [form, setForm] = useState<BatchFormData>({
    batchName: DEFAULT_BATCH_NAME,
    batchYear: DEFAULT_BATCH_YEAR,
    batchNumber: DEFAULT_BATCH_NUMBER,
    startDate: "",
    endDate: "",
    batchType: "",
    customBatchType: "",
    phases: [],
  });

  const queryClient = useQueryClient();
  const [types, setTypes] = useState(DEFAULT_TYPES);
  const [phaseTypes, setPhaseTypes] = useState(DEFAULT_PHASES);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const modalRef = useRef<HTMLDivElement>(null);
  const modalTitle = title || (isEditing ? "Edit Batch" : "Create Batch");

  // ---------------------- Fetch batch types from API ----------------------
  const { data: apiBatchTypes, isLoading: isLoadingTypes } = useQuery({
    queryKey: ["batchTypes"],
    queryFn: batchService.getAllBatchTypes,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  // ---------------------- Fetch phase types from API ----------------------
  const { data: apiPhaseTypes, isLoading: isLoadingPhaseTypes } = useQuery({
    queryKey: ["phaseTypes"],
    queryFn: batchService.getAllPhaseTypes,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  // ---------------------- Fetch batch data when editing ----------------------
  const {
    data: apiBatchData,
    isLoading: isLoadingBatchData,
    isFetching: isFetchingBatchData,
  } = useQuery({
    queryKey: ["batch", batchId],
    queryFn: () => batchService.getBatchById(batchId!),
    enabled: !!batchId && isEditing && isOpen,
    staleTime: 0, // Always fetch fresh data when modal opens
    refetchOnMount: "always", // Always refetch when modal opens
  });

  // Log query status for debugging
  useEffect(() => {
    if (isEditing && isOpen) {
      console.log("Batch query status:", {
        batchId,
        isLoading: isLoadingBatchData,
        isFetching: isFetchingBatchData,
        hasData: !!apiBatchData,
      });
    }
  }, [
    isEditing,
    isOpen,
    batchId,
    isLoadingBatchData,
    isFetchingBatchData,
    apiBatchData,
  ]);

  // ---------------------- Update batch types when API data is available ----------------------
  useEffect(() => {
    if (apiBatchTypes) {
      const batchTypeArray = Array.isArray(apiBatchTypes)
        ? apiBatchTypes
        : (apiBatchTypes as any).$values || (apiBatchTypes as any).data || [];

      const formattedTypes = batchTypeArray.map((type: any) => ({
        value: type.name.toLowerCase().replace(/\s+/g, "-"),
        label: type.name,
        id: type.id, // Store the ID for updates
      }));

      setTypes(formattedTypes);
    }
  }, [apiBatchTypes]);

  // ---------------------- Update phase types when API data is available ----------------------
  useEffect(() => {
    if (apiPhaseTypes) {
      const phaseTypeArray = Array.isArray(apiPhaseTypes)
        ? apiPhaseTypes
        : (apiPhaseTypes as any).$values || (apiPhaseTypes as any).data || [];

      const formattedPhaseTypes = phaseTypeArray.map((type: any) => ({
        value: type.name.toLowerCase().replace(/\s+/g, "-"),
        label: type.name,
        id: type.id, // Store the ID for updates
      }));

      // Keep "Custom Phase" option at the end
      const customOption = DEFAULT_PHASES.find((p) => p.value === "custom");
      if (customOption) {
        setPhaseTypes([...formattedPhaseTypes, customOption]);
      } else {
        setPhaseTypes(formattedPhaseTypes);
      }
    }
  }, [apiPhaseTypes]);

  // ---------------------- Load initial data ----------------------
  useEffect(() => {
    if (!isOpen) return;

    // When editing, wait for API data to load
    if (isEditing && batchId) {
      // Don't load anything while data is being fetched
      if (isLoadingBatchData || isFetchingBatchData) {
        console.log("Waiting for batch data to load...");
        return;
      }

      // Use API data if available
      if (apiBatchData) {
        console.log("Loading form with API data:", apiBatchData);
        const batchData = (apiBatchData as any).data || apiBatchData;
        console.log("Extracted batch data:", batchData);

        // Convert batchType label to value format for dropdown
        let batchTypeValue =
          batchData.batchType || batchData.batchTypeName || "";
        if (batchTypeValue) {
          // Try to find matching type in the types array
          const matchingType = types.find((t) => t.label === batchTypeValue);
          if (matchingType) {
            batchTypeValue = matchingType.value;
          } else {
            // If not found, convert the label to value format
            batchTypeValue = batchTypeValue.toLowerCase().replace(/\s+/g, "-");
          }
        }

        // Format dates to YYYY-MM-DD for date inputs
        const formatDateForInput = (isoDate: string) => {
          if (!isoDate) return "";
          return isoDate.split("T")[0];
        };

        // Process phases from API data
        // Handle both array formats (with $values wrapper or direct array)
        let phasesArray = [];
        if (batchData.phases) {
          if (Array.isArray(batchData.phases)) {
            phasesArray = batchData.phases;
          } else if ((batchData.phases as any).$values) {
            phasesArray = (batchData.phases as any).$values;
          } else if (typeof batchData.phases === "object") {
            // Might be an object with $values or other wrapper
            console.log("Phases object structure:", batchData.phases);
            phasesArray = [];
          }
        }

        console.log("Loading phases for edit:", phasesArray);
        console.log("Full batch data:", batchData);
        console.log("Phases field type:", typeof batchData.phases);
        console.log("Phases field value:", batchData.phases);

        const processedPhases = phasesArray.map((phase: any) => {
          // Convert phaseType name to value format for dropdown
          let phaseNameValue = phase.phaseType || "";
          if (phaseNameValue) {
            // Try to find matching phase type in the phaseTypes array
            const matchingPhaseType = phaseTypes.find(
              (pt) => pt.label === phaseNameValue,
            );
            if (matchingPhaseType) {
              phaseNameValue = matchingPhaseType.value;
            } else {
              // If not found, convert to value format
              phaseNameValue = phaseNameValue
                .toLowerCase()
                .replace(/\s+/g, "-");
            }
          }

          console.log(
            `Processing phase: ${phase.phaseType} -> ${phaseNameValue}`,
          );

          return {
            phaseName: phaseNameValue,
            customPhaseName: phase.customPhaseName || "",
            startDate: formatDateForInput(phase.startDate) || "",
            endDate: formatDateForInput(phase.endDate) || "",
          };
        });

        // Parse batch name for year and number
        const parsedBatchName = parseBatchName(batchData.batchName || "");

        setForm({
          batchName: batchData.batchName || "",
          batchYear: parsedBatchName.year,
          batchNumber: parsedBatchName.number,
          startDate: formatDateForInput(batchData.startDate) || "",
          endDate: formatDateForInput(batchData.endDate) || "",
          batchType: batchTypeValue,
          customBatchType: batchData.customBatchType || "",
          phases: processedPhases,
        });
        return;
      }
    }

    // For create mode, use initialData if provided
    if (!isEditing && initialData) {
      console.log("Loading form with initialData:", initialData);
      const batchData = initialData;

      // Convert batchType label to value format for dropdown
      let batchTypeValue = batchData.batchType || "";
      if (batchTypeValue) {
        const matchingType = types.find((t) => t.label === batchTypeValue);
        if (matchingType) {
          batchTypeValue = matchingType.value;
        } else {
          batchTypeValue = batchTypeValue.toLowerCase().replace(/\s+/g, "-");
        }
      }

      // Parse batch name for year and number
      const parsedBatchName = parseBatchName(
        batchData.batchName || DEFAULT_BATCH_NAME,
      );

      setForm({
        batchName: batchData.batchName || DEFAULT_BATCH_NAME,
        batchYear: parsedBatchName.year,
        batchNumber: parsedBatchName.number,
        startDate: batchData.startDate || "",
        endDate: batchData.endDate || "",
        batchType: batchTypeValue,
        customBatchType: batchData.customBatchType || "",
        phases: batchData.phases || [],
      });
      return;
    }

    // Reset form for new batch (no initial data)
    console.log("Resetting form for new batch");
    setForm({
      batchName: DEFAULT_BATCH_NAME,
      batchYear: DEFAULT_BATCH_YEAR,
      batchNumber: DEFAULT_BATCH_NUMBER,
      startDate: "",
      endDate: "",
      batchType: "",
      customBatchType: "",
      phases: [],
    });
  }, [
    initialData,
    apiBatchData,
    isOpen,
    types,
    phaseTypes,
    batchId,
    isEditing,
    isLoadingBatchData,
    isFetchingBatchData,
  ]);

  // ---------------------- Close on outside click ----------------------
  useEffect(() => {
    const clickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node))
        onClose();
    };
    if (isOpen) document.addEventListener("mousedown", clickOutside);
    return () => document.removeEventListener("mousedown", clickOutside);
  }, [isOpen, onClose]);

  // ---------------------- Handlers ----------------------
  const handleChange = (key: keyof BatchFormData, value: string) => {
    setForm((f) => ({ ...f, [key]: value }));
    // Clear related errors when dates are changed
    if (key === "startDate" || key === "endDate") {
      setErrors((e) => {
        const newErrors = { ...e };
        delete newErrors.startDate;
        delete newErrors.endDate;
        return newErrors;
      });
    } else if (errors[key]) {
      setErrors((e) => ({ ...e, [key]: "" }));
    }
  };

  const handleYearChange = (year: string) => {
    setForm((f) => ({
      ...f,
      batchYear: year,
      batchName: generateBatchName(year, f.batchNumber),
    }));
    if (errors.batchName) {
      setErrors((e) => ({ ...e, batchName: "" }));
    }
  };

  const handleBatchNumberChange = (number: string) => {
    setForm((f) => ({
      ...f,
      batchNumber: number,
      batchName: generateBatchName(f.batchYear, number),
    }));
    if (errors.batchName) {
      setErrors((e) => ({ ...e, batchName: "" }));
    }
  };

  const handlePhaseChange = (
    index: number,
    key: keyof Phase,
    value: string,
  ) => {
    setForm((prev) => {
      const updated = [...prev.phases];
      updated[index] = { ...updated[index], [key]: value };
      return { ...prev, phases: updated };
    });

    // Clear related phase errors when dates are changed
    if (key === "startDate" || key === "endDate") {
      setErrors((e) => {
        const newErrors = { ...e };
        delete newErrors[`phaseStart${index}`];
        delete newErrors[`phaseEnd${index}`];
        delete newErrors[`phaseOverlap${index}`];
        return newErrors;
      });
    } else {
      const errorKey =
        key === "phaseName"
          ? `phaseName${index}`
          : key === "customPhaseName"
            ? `customPhaseName${index}`
            : "";
      if (errorKey && errors[errorKey]) {
        setErrors((e) => ({ ...e, [errorKey]: "" }));
      }
    }
  };

  const addPhase = () => {
    setForm((prev) => ({
      ...prev,
      phases: [
        ...prev.phases,
        { phaseName: "", customPhaseName: "", startDate: "", endDate: "" },
      ],
    }));
  };

  const removePhase = (index: number) => {
    setForm((prev) => ({
      ...prev,
      phases: prev.phases.filter((_, i) => i !== index),
    }));
  };

  const validate = () => {
    const e: Record<string, string> = {};

    // Basic field validations
    if (!form.batchName.trim()) e.batchName = "Batch name is required";
    if (!form.startDate) e.startDate = "Start date is required";
    if (!form.endDate) e.endDate = "End date is required";
    if (!form.batchType) e.batchType = "Batch type is required";

    // Batch date validations
    if (form.startDate && form.endDate) {
      const start = new Date(form.startDate);
      const end = new Date(form.endDate);
      if (start >= end) {
        e.endDate = "End date must be after start date";
      }
    }

    // Phase validations
    form.phases.forEach((p, idx) => {
      if (!p.phaseName) e[`phaseName${idx}`] = "Phase type is required";
      if (p.phaseName === "custom" && !p.customPhaseName?.trim())
        e[`customPhaseName${idx}`] = "Custom phase name is required";
      if (!p.startDate) e[`phaseStart${idx}`] = "Phase start date is required";
      if (!p.endDate) e[`phaseEnd${idx}`] = "Phase end date is required";

      // Phase date range validation
      if (p.startDate && p.endDate) {
        const phaseStart = new Date(p.startDate);
        const phaseEnd = new Date(p.endDate);

        if (phaseStart >= phaseEnd) {
          e[`phaseEnd${idx}`] = "Phase end date must be after start date";
        }
      }

      // Validate phase dates are within batch dates
      if (form.startDate && form.endDate && p.startDate && p.endDate) {
        const batchStart = new Date(form.startDate);
        const batchEnd = new Date(form.endDate);
        const phaseStart = new Date(p.startDate);
        const phaseEnd = new Date(p.endDate);

        if (phaseStart < batchStart) {
          e[`phaseStart${idx}`] =
            "Phase start date cannot be before batch start date";
        }

        if (phaseEnd > batchEnd) {
          e[`phaseEnd${idx}`] = "Phase end date cannot be after batch end date";
        }
      }

      // Check for overlapping phases
      if (p.startDate && p.endDate) {
        const currentStart = new Date(p.startDate);
        const currentEnd = new Date(p.endDate);

        form.phases.forEach((otherPhase, otherIdx) => {
          if (idx !== otherIdx && otherPhase.startDate && otherPhase.endDate) {
            const otherStart = new Date(otherPhase.startDate);
            const otherEnd = new Date(otherPhase.endDate);

            // Check if phases overlap
            const isOverlapping =
              (currentStart >= otherStart && currentStart < otherEnd) || // Current starts within other
              (currentEnd > otherStart && currentEnd <= otherEnd) || // Current ends within other
              (currentStart <= otherStart && currentEnd >= otherEnd); // Current contains other

            if (isOverlapping && !e[`phaseOverlap${idx}`]) {
              e[`phaseOverlap${idx}`] =
                `Phase ${idx + 1} overlaps with Phase ${otherIdx + 1}`;
            }
          }
        });
      }
    });

    setErrors(e);
    return !Object.keys(e).length;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const processedPhases = form.phases.map((p) => {
      // Find the phase type to get its ID
      const phaseType = phaseTypes.find((pt) => pt.value === p.phaseName);

      return {
        phaseType:
          p.phaseName === "custom"
            ? p.customPhaseName!
            : phaseType?.label || p.phaseName,
        phaseTypeId:
          phaseType && p.phaseName !== "custom" ? (phaseType as any).id : null,
        startDate: p.startDate,
        endDate: p.endDate,
      };
    });

    const selectedTypeLabel =
      types.find((t) => t.value === form.batchType)?.label || form.batchType;

    const submitData = {
      batchName: form.batchName,
      startDate: form.startDate,
      endDate: form.endDate,
      batchType: selectedTypeLabel,
      phases: processedPhases,
    };

    onSubmit(submitData);
    handleClose();
  };

  const handleClose = () => {
    setErrors({});
    // Always reset form on close to ensure fresh data on reopen
    setForm({
      batchName: DEFAULT_BATCH_NAME,
      batchYear: DEFAULT_BATCH_YEAR,
      batchNumber: DEFAULT_BATCH_NUMBER,
      startDate: "",
      endDate: "",
      batchType: "",
      customBatchType: "",
      phases: [],
    });
    onClose();
  };

  if (!isOpen) return null;

  // Show loading state when fetching batch data for editing
  const isLoadingData =
    isEditing && batchId && (isLoadingBatchData || isFetchingBatchData);

  // ---------------------- Render ----------------------
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div
        ref={modalRef}
        className="bg-white rounded-[4px] p-6 w-full max-w-md mx-4 text-[14px] overflow-y-auto max-h-[90vh]"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-[#565E6C]">{modalTitle}</h2>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {isLoadingData && (
          <div className="flex justify-center items-center py-8">
            <div className="text-gray-600">Loading batch details...</div>
          </div>
        )}

        <form
          className="space-y-4"
          onSubmit={handleSubmit}
          style={{ display: isLoadingData ? "none" : "block" }}
        >
          <BatchNameField
            year={form.batchYear}
            batchNumber={form.batchNumber}
            onYearChange={handleYearChange}
            onBatchNumberChange={handleBatchNumberChange}
            error={errors.batchName}
          />

          <div className="grid grid-cols-2 gap-4">
            <Field
              label="Start Date"
              type="date"
              value={form.startDate}
              onChange={(v: string) => handleChange("startDate", v)}
              error={errors.startDate}
            />
            <Field
              label="End Date"
              type="date"
              value={form.endDate}
              onChange={(v: string) => handleChange("endDate", v)}
              error={errors.endDate}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#565E6C] mb-1">
              Batch Type
            </label>
            <EditableDropdown
              options={types}
              value={form.batchType}
              onChange={(v) => handleChange("batchType", v)}
              onEdit={async (val, newLabel) => {
                // Find the batch type to get its ID
                const batchType = types.find((t) => t.value === val);

                if (batchType && (batchType as any).id) {
                  try {
                    // Call API to update batch type
                    await batchService.updateBatchType(
                      (batchType as any).id,
                      newLabel,
                    );

                    // Refetch batch types from API
                    queryClient.invalidateQueries({ queryKey: ["batchTypes"] });

                    // Update locally for immediate UI feedback
                    const updated = types.map((t) =>
                      t.value === val
                        ? {
                            ...t,
                            label: newLabel,
                            value: newLabel.toLowerCase().replace(/\s+/g, "-"),
                          }
                        : t,
                    );
                    setTypes(updated);
                  } catch (error: any) {
                    // Handle backend bug similar to create
                    const errorMessage = (error?.message || "").toLowerCase();
                    if (
                      errorMessage.includes("updated successfully") ||
                      errorMessage.includes("successfully")
                    ) {
                      queryClient.invalidateQueries({
                        queryKey: ["batchTypes"],
                      });
                      const updated = types.map((t) =>
                        t.value === val
                          ? {
                              ...t,
                              label: newLabel,
                              value: newLabel
                                .toLowerCase()
                                .replace(/\s+/g, "-"),
                            }
                          : t,
                      );
                      setTypes(updated);
                      notifications.show({
                        title: "Success",
                        message: "Batch type updated successfully",
                        color: "green",
                      });
                    } else {
                      // Show user-friendly error message
                      const displayMessage =
                        error?.message?.replace(/^HTTP \d+: /, "") ||
                        "Failed to update batch type";
                      notifications.show({
                        title: "Error",
                        message: displayMessage,
                        color: "red",
                      });
                    }
                  }
                } else {
                  // No ID found, just update locally
                  const updated = types.map((t) =>
                    t.value === val ? { ...t, label: newLabel } : t,
                  );
                  setTypes(updated);
                }
              }}
              onCreateCustom={async (newLabel) => {
                try {
                  // Call API to create new batch type
                  await batchService.createBatchType(newLabel);

                  // Refetch batch types from API
                  queryClient.invalidateQueries({ queryKey: ["batchTypes"] });

                  // Add to local state immediately for UI responsiveness
                  const newOpt = {
                    value: newLabel.toLowerCase().replace(/\s+/g, "-"),
                    label: newLabel,
                  };
                  setTypes([...types, newOpt]);
                } catch (error: any) {
                  // Backend might return 400 with success message (bug)
                  // Check if the message indicates success despite the error status
                  const errorMessage = (error?.message || "").toLowerCase();
                  if (
                    errorMessage.includes("created successfully") ||
                    errorMessage.includes("successfully")
                  ) {
                    // Treat as success
                    queryClient.invalidateQueries({ queryKey: ["batchTypes"] });
                    const newOpt = {
                      value: newLabel.toLowerCase().replace(/\s+/g, "-"),
                      label: newLabel,
                    };
                    setTypes([...types, newOpt]);
                    notifications.show({
                      title: "Success",
                      message: "Batch type created successfully",
                      color: "green",
                    });
                  } else {
                    // Show user-friendly error message
                    const displayMessage =
                      error?.message?.replace(/^HTTP \d+: /, "") ||
                      "Failed to create batch type";
                    notifications.show({
                      title: "Error",
                      message: displayMessage,
                      color: "red",
                    });
                  }
                }
              }}
              placeholder={
                isLoadingTypes ? "Loading types..." : "Select batch type..."
              }
              error={errors.batchType}
            />
          </div>

          {/* -------------------- Phases -------------------- */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-[#565E6C]">Phases</h3>

            {form.phases.map((phase, index) => {
              const isCustomPhase = phase.phaseName === "custom";

              return (
                <div
                  key={index}
                  className="space-y-2 relative p-4 rounded-md border border-gray-200 bg-gray-50"
                >
                  <div>
                    <label className="block text-sm font-medium text-[#565E6C] mb-1">
                      Phase Type
                    </label>
                    <EditableDropdown
                      options={phaseTypes.filter((p) => p.value !== "custom")}
                      value={phase.phaseName}
                      onChange={(v) => handlePhaseChange(index, "phaseName", v)}
                      onEdit={async (val, newLabel) => {
                        // Find the phase type to get its ID
                        const phaseType = phaseTypes.find(
                          (t) => t.value === val,
                        );

                        if (phaseType && (phaseType as any).id) {
                          try {
                            // Call API to update phase type
                            await batchService.updatePhaseType(
                              (phaseType as any).id,
                              newLabel,
                            );

                            // Refetch phase types from API
                            queryClient.invalidateQueries({
                              queryKey: ["phaseTypes"],
                            });

                            // Update locally for immediate UI feedback
                            const updated = phaseTypes.map((t) =>
                              t.value === val
                                ? {
                                    ...t,
                                    label: newLabel,
                                    value: newLabel
                                      .toLowerCase()
                                      .replace(/\s+/g, "-"),
                                  }
                                : t,
                            );
                            setPhaseTypes(updated);
                            notifications.show({
                              title: "Success",
                              message: "Phase type updated successfully",
                              color: "green",
                            });
                          } catch (error: any) {
                            // Handle backend bug similar to batch types
                            const errorMessage = (
                              error?.message || ""
                            ).toLowerCase();
                            if (
                              errorMessage.includes("updated successfully") ||
                              errorMessage.includes("successfully")
                            ) {
                              queryClient.invalidateQueries({
                                queryKey: ["phaseTypes"],
                              });
                              const updated = phaseTypes.map((t) =>
                                t.value === val
                                  ? {
                                      ...t,
                                      label: newLabel,
                                      value: newLabel
                                        .toLowerCase()
                                        .replace(/\s+/g, "-"),
                                    }
                                  : t,
                              );
                              setPhaseTypes(updated);
                              notifications.show({
                                title: "Success",
                                message: "Phase type updated successfully",
                                color: "green",
                              });
                            } else {
                              // Show user-friendly error message
                              const displayMessage =
                                error?.message?.replace(/^HTTP \d+: /, "") ||
                                "Failed to update phase type";
                              notifications.show({
                                title: "Error",
                                message: displayMessage,
                                color: "red",
                              });
                            }
                          }
                        } else {
                          // No ID found, just update locally
                          const updated = phaseTypes.map((t) =>
                            t.value === val ? { ...t, label: newLabel } : t,
                          );
                          setPhaseTypes(updated);
                        }
                      }}
                      onCreateCustom={async (newLabel) => {
                        try {
                          // Call API to create new phase type
                          await batchService.createPhaseType(newLabel);

                          // Refetch phase types from API
                          queryClient.invalidateQueries({
                            queryKey: ["phaseTypes"],
                          });

                          // Add to local state immediately for UI responsiveness
                          const newOpt = {
                            value: newLabel.toLowerCase().replace(/\s+/g, "-"),
                            label: newLabel,
                          };
                          setPhaseTypes([
                            ...phaseTypes.filter((p) => p.value !== "custom"),
                            newOpt,
                            phaseTypes.find((p) => p.value === "custom")!,
                          ]);
                          notifications.show({
                            title: "Success",
                            message: "Phase type created successfully",
                            color: "green",
                          });
                        } catch (error: any) {
                          // Backend might return 400 with success message (bug)
                          // Check if the message indicates success despite the error status
                          const errorMessage = (
                            error?.message || ""
                          ).toLowerCase();
                          if (
                            errorMessage.includes("created successfully") ||
                            errorMessage.includes("successfully")
                          ) {
                            // Treat as success
                            queryClient.invalidateQueries({
                              queryKey: ["phaseTypes"],
                            });
                            const newOpt = {
                              value: newLabel
                                .toLowerCase()
                                .replace(/\s+/g, "-"),
                              label: newLabel,
                            };
                            setPhaseTypes([
                              ...phaseTypes.filter((p) => p.value !== "custom"),
                              newOpt,
                              phaseTypes.find((p) => p.value === "custom")!,
                            ]);
                            notifications.show({
                              title: "Success",
                              message: "Phase type created successfully",
                              color: "green",
                            });
                          } else {
                            // Show user-friendly error message
                            const displayMessage =
                              error?.message?.replace(/^HTTP \d+: /, "") ||
                              "Failed to create phase type";
                            notifications.show({
                              title: "Error",
                              message: displayMessage,
                              color: "red",
                            });
                          }
                        }
                      }}
                      placeholder={
                        isLoadingPhaseTypes
                          ? "Loading phase types..."
                          : "Select phase type..."
                      }
                      error={errors[`phaseName${index}`]}
                    />
                  </div>

                  {isCustomPhase && (
                    <Field
                      label="Custom Phase Name"
                      value={phase.customPhaseName || ""}
                      onChange={(v: string) =>
                        handlePhaseChange(index, "customPhaseName", v)
                      }
                      placeholder="Enter custom phase name"
                      error={errors[`customPhaseName${index}`]}
                    />
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <Field
                      label="Start Date"
                      type="date"
                      value={phase.startDate}
                      onChange={(v: string) =>
                        handlePhaseChange(index, "startDate", v)
                      }
                      error={errors[`phaseStart${index}`]}
                    />
                    <Field
                      label="End Date"
                      type="date"
                      value={phase.endDate}
                      onChange={(v: string) =>
                        handlePhaseChange(index, "endDate", v)
                      }
                      error={errors[`phaseEnd${index}`]}
                    />
                  </div>

                  {/* Display phase overlap error */}
                  {errors[`phaseOverlap${index}`] && (
                    <div className="text-red-500 text-xs mt-1">
                      {errors[`phaseOverlap${index}`]}
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => removePhase(index)}
                    className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                  >
                    <Trash size={18} />
                  </button>
                </div>
              );
            })}

            <button
              type="button"
              onClick={addPhase}
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              + Add Phase
            </button>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-1 border border-gray-300 rounded-md text-gray-700 font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <Button size="sm" type="submit">
              {isEditing ? "Save" : "Create"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BatchDetailsModal;
