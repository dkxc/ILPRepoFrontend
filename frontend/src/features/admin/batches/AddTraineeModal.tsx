import React, { useState, useRef, useEffect, type ChangeEvent } from "react";
import { X } from "lucide-react";
import Button from "../../ui/Button";
import { motion, AnimatePresence } from "framer-motion";

export type UploadType = "Trainee Details" | "BO Details" | "DU Details";

// Form data for internal state (optional)
export interface TraineeFormData {
  fullName?: string;
  email?: string;
  phoneNumber?: string;
  traineeName?: string;
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
  buddy: string;
  buddyDU: string;
  duAllocated: string;
  location: string;
  ojtMentor: string;
}

interface AddTraineeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: TraineeFormDataSubmit, type: UploadType) => void;
  title?: string;
  initialData?: Partial<TraineeFormData> | null;
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
    <label className="block text-sm font-medium text-[#565E6C] mb-1">{label}</label>
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
}) => {
  const [uploadType, setUploadType] = useState<UploadType>("Trainee Details");
  const [form, setForm] = useState<TraineeFormData>(initialData || {});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const modalRef = useRef<HTMLDivElement>(null);

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
      if (!form.buddy?.trim()) e.buddy = "Buddy is required";
      if (!form.buddyDU?.trim()) e.buddyDU = "Buddy's DU is required";
    } else if (uploadType === "DU Details") {
      if (!form.traineeName?.trim()) e.traineeName = "Trainee Name is required";
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
      buddy: form.buddy || "",
      buddyDU: form.buddyDU || "",
      duAllocated: form.duAllocated || "",
      location: form.location || "",
      ojtMentor: form.ojtMentor || "",
    };

    onSubmit(safeData, uploadType);
    handleClose();
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
            transition={{ type: "spring", stiffness: 260, damping: 25, duration: 0.4 }}
          >
            {/* Header with dropdown and close button */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-[#565E6C]">{uploadType ? uploadType : title}</h2>

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

                <button onClick={handleClose} className="text-gray-500 hover:text-gray-700">
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
                <Button variant="default" size="sm" onClick={handleClose}>
                  Cancel
                </Button>
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
