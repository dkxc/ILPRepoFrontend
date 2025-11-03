import React, { useState, useRef, useEffect, type ChangeEvent } from "react";
import { X } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { notifications } from "@mantine/notifications";
import Button from "../../ui/Button";
import { motion, AnimatePresence } from "framer-motion";
import { traineeService } from "../../../services/traineeService";

export type UploadType = "Trainee Details" | "BO Details" | "DU Details";

// Form data for internal state (optional)
export interface TraineeFormData {
  fullName?: string;
  email?: string;
  phoneNumber?: string;
  traineeName?: string;
  traineeEmail?: string; // Email for BO/DU Details
  buddy?: string;
  buddyDU?: string;
  duAllocated?: string;
  location?: string;
  ojtMentor?: string;
}

// Form data guaranteed to have strings for submission
export interface TraineeFormDataSubmit {
  fullName: string;
  email: string;
  phoneNumber: string;
  traineeName: string;
  traineeEmail: string;
  buddy: string;
  buddyDU: string;
  duAllocated: string;
  location: string;
  ojtMentor: string;
}

interface AddTraineeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: TraineeFormDataSubmit, type: UploadType) => void;
  title?: string;
  initialData?: Partial<TraineeFormData> | null;
  batchId?: number | null;
}

const Field = ({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  error,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
  error?: string;
}) => (
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
        ${error ? "border-red-500" : "border-gray-300"}`}
    />
    {error && <span className="text-red-500 text-xs mt-1">{error}</span>}
  </div>
);

const AddTraineeModal: React.FC<AddTraineeModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  title = "Add Details",
  initialData = null,
  batchId,
}) => {
  const [uploadType, setUploadType] = useState<UploadType>("Trainee Details");
  const [form, setForm] = useState<TraineeFormData>(initialData || {});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const modalRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  // Mutation for creating trainee
  const createTraineeMutation = useMutation({
    mutationFn: traineeService.createTrainee,
    onSuccess: () => {
      notifications.show({
        title: "Success",
        message: "Trainee created successfully",
        color: "green",
      });
      queryClient.invalidateQueries({ queryKey: ["trainees"] });
      handleClose();
    },
    onError: (error: any) => {
      console.error("Create trainee error:", error);

      // Parse error message for better user feedback
      let errorMessage = "Failed to create trainee";

      if (error.message) {
        // Check for duplicate email constraint
        if (
          error.message.includes("duplicate key") &&
          error.message.includes("email")
        ) {
          errorMessage =
            "This email is already registered. Please use a different email.";
        } else if (
          error.message.includes("duplicate key") &&
          error.message.includes("username")
        ) {
          errorMessage =
            "This username is already taken. Please use a different username.";
        } else {
          errorMessage = error.message;
        }
      }

      notifications.show({
        title: "Error Creating Trainee",
        message: errorMessage,
        color: "red",
        autoClose: 5000,
      });
    },
  });

  // Mutation for creating BO phase
  const createBoPhaseMutation = useMutation({
    mutationFn: traineeService.createBoPhase,
    onSuccess: () => {
      notifications.show({
        title: "Success",
        message: "BO details created successfully",
        color: "green",
      });
      queryClient.invalidateQueries({ queryKey: ["boPhases"] });
      handleClose();
    },
    onError: (error: any) => {
      console.error("Create BO phase error:", error);
      notifications.show({
        title: "Error Creating BO Details",
        message: error.message || "Failed to create BO details",
        color: "red",
        autoClose: 5000,
      });
    },
  });

  // Mutation for creating trainee DU
  const createTraineeDuMutation = useMutation({
    mutationFn: traineeService.createTraineeDu,
    onSuccess: () => {
      notifications.show({
        title: "Success",
        message: "DU details created successfully",
        color: "green",
      });
      queryClient.invalidateQueries({ queryKey: ["traineeDus"] });
      handleClose();
    },
    onError: (error: any) => {
      console.error("Create trainee DU error:", error);
      notifications.show({
        title: "Error Creating DU Details",
        message: error.message || "Failed to create DU details",
        color: "red",
        autoClose: 5000,
      });
    },
  });

  // Close on outside click
  useEffect(() => {
    const clickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        handleClose();
      }
    };
    if (isOpen) document.addEventListener("mousedown", clickOutside);
    return () => document.removeEventListener("mousedown", clickOutside);
  }, [isOpen]);

  const handleChange = (key: keyof TraineeFormData, value: string) => {
    setForm((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: "" }));
  };

  const validate = () => {
    const e: Record<string, string> = {};

    if (!uploadType) e.uploadType = "Select type is required";

    if (uploadType === "Trainee Details") {
      if (!form.fullName?.trim()) e.fullName = "Full name is required";
      if (!form.email?.trim()) e.email = "Email is required";
      if (!form.phoneNumber?.trim()) e.phoneNumber = "Phone number is required";
    } else if (uploadType === "BO Details") {
      if (!form.traineeName?.trim()) e.traineeName = "Trainee Name is required";
      if (!form.traineeEmail?.trim())
        e.traineeEmail = "Trainee Email is required";
      if (!form.buddy?.trim()) e.buddy = "Buddy is required";
      if (!form.buddyDU?.trim()) e.buddyDU = "Buddy's DU is required";
    } else if (uploadType === "DU Details") {
      if (!form.traineeName?.trim()) e.traineeName = "Trainee Name is required";
      if (!form.traineeEmail?.trim())
        e.traineeEmail = "Trainee Email is required";
      if (!form.duAllocated?.trim()) e.duAllocated = "DU allocated is required";
      if (!form.location?.trim()) e.location = "Location is required";
      if (!form.ojtMentor?.trim()) e.ojtMentor = "OJT mentor is required";
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    // Convert optional fields to required strings
    const safeData: TraineeFormDataSubmit = {
      fullName: form.fullName || "",
      email: form.email || "",
      phoneNumber: form.phoneNumber || "",
      traineeName: form.traineeName || "",
      traineeEmail: form.traineeEmail || "",
      buddy: form.buddy || "",
      buddyDU: form.buddyDU || "",
      duAllocated: form.duAllocated || "",
      location: form.location || "",
      ojtMentor: form.ojtMentor || "",
    };

    // Call appropriate API based on upload type
    if (uploadType === "Trainee Details") {
      if (!batchId) {
        notifications.show({
          title: "Error",
          message: "Batch ID is required to create a trainee",
          color: "red",
        });
        return;
      }

      createTraineeMutation.mutate({
        username: safeData.fullName,
        email: safeData.email,
        password: "DefaultPassword123!", // TODO: Handle password properly
        batchId: batchId,
        phoneNo: safeData.phoneNumber,
        status: "Active",
      });
    } else if (uploadType === "BO Details") {
      createBoPhaseMutation.mutate({
        traineeName: safeData.traineeName,
        email: safeData.traineeEmail,
        buddyName: safeData.buddy,
        duName: safeData.buddyDU,
      });
    } else if (uploadType === "DU Details") {
      createTraineeDuMutation.mutate({
        traineeName: safeData.traineeName,
        email: safeData.traineeEmail,
        duName: safeData.duAllocated, // Backend expects 'duName'
        location: safeData.location,
        ojtMenter: safeData.ojtMentor, // Backend has typo: 'ojtMenter'
      });
    }

    // Call the optional onSubmit callback if provided
    if (onSubmit) {
      onSubmit(safeData, uploadType);
    }
  };

  const handleClose = () => {
    setForm({});
    setErrors({});
    setUploadType("Trainee Details");
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <motion.div
            ref={modalRef}
            className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 relative"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 25,
              duration: 0.4,
            }}
          >
            {/* Header with dropdown and close button */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-[#565E6C]">
                {uploadType ? uploadType : title}
              </h2>

              <div className="flex items-center gap-2">
                <select
                  value={uploadType}
                  onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                    setUploadType(e.target.value as UploadType);
                    setErrors({});
                    setForm({});
                  }}
                  className="border rounded px-2 py-1 text-sm border-gray-300"
                >
                  <option value="Trainee Details">Trainee Details</option>
                  <option value="BO Details">BO Details</option>
                  <option value="DU Details">DU Details</option>
                </select>

                <button
                  onClick={handleClose}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Dynamic Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {uploadType === "Trainee Details" && (
                <>
                  <Field
                    label="Full Name"
                    value={form.fullName || ""}
                    onChange={(v) => handleChange("fullName", v)}
                    placeholder="Arjun Sharma"
                    error={errors.fullName}
                  />
                  <Field
                    label="Email"
                    type="email"
                    value={form.email || ""}
                    onChange={(v) => handleChange("email", v)}
                    placeholder="arjun.sharma@experionglobal.com"
                    error={errors.email}
                  />
                  <Field
                    label="Phone Number"
                    type="tel"
                    value={form.phoneNumber || ""}
                    onChange={(v) => handleChange("phoneNumber", v)}
                    placeholder="9876543210"
                    error={errors.phoneNumber}
                  />
                </>
              )}

              {uploadType === "BO Details" && (
                <>
                  <Field
                    label="Trainee Name"
                    value={form.traineeName || ""}
                    onChange={(v) => handleChange("traineeName", v)}
                    placeholder="John Doe"
                    error={errors.traineeName}
                  />
                  <Field
                    label="Trainee Email"
                    value={form.traineeEmail || ""}
                    onChange={(v) => handleChange("traineeEmail", v)}
                    type="email"
                    placeholder="john@example.com"
                    error={errors.traineeEmail}
                  />
                  <Field
                    label="Buddy"
                    value={form.buddy || ""}
                    onChange={(v) => handleChange("buddy", v)}
                    placeholder="Jane Smith"
                    error={errors.buddy}
                  />
                  <Field
                    label="Buddy's DU"
                    value={form.buddyDU || ""}
                    onChange={(v) => handleChange("buddyDU", v)}
                    placeholder="DU-1"
                    error={errors.buddyDU}
                  />
                </>
              )}

              {uploadType === "DU Details" && (
                <>
                  <Field
                    label="Trainee Name"
                    value={form.traineeName || ""}
                    onChange={(v) => handleChange("traineeName", v)}
                    placeholder="John Doe"
                    error={errors.traineeName}
                  />
                  <Field
                    label="Trainee Email"
                    value={form.traineeEmail || ""}
                    onChange={(v) => handleChange("traineeEmail", v)}
                    type="email"
                    placeholder="john@example.com"
                    error={errors.traineeEmail}
                  />
                  <Field
                    label="DU Allocated"
                    value={form.duAllocated || ""}
                    onChange={(v) => handleChange("duAllocated", v)}
                    placeholder="DU-2"
                    error={errors.duAllocated}
                  />
                  <Field
                    label="Location"
                    value={form.location || ""}
                    onChange={(v) => handleChange("location", v)}
                    placeholder="Bangalore"
                    error={errors.location}
                  />
                  <Field
                    label="OJT Mentor"
                    value={form.ojtMentor || ""}
                    onChange={(v) => handleChange("ojtMentor", v)}
                    placeholder="Mentor A"
                    error={errors.ojtMentor}
                  />
                </>
              )}

              {/* Footer */}
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={handleClose}
                  disabled={
                    createTraineeMutation.isPending ||
                    createBoPhaseMutation.isPending ||
                    createTraineeDuMutation.isPending
                  }
                  className="px-4 py-1 border border-gray-300 rounded-md text-gray-700 font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <Button type="submit" size="sm">
                  Add
                </Button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AddTraineeModal;
