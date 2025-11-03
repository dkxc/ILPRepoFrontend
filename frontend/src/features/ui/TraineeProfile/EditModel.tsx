import React, { useState, useEffect, useRef } from "react";
import { X } from "lucide-react";
import Button from "../Button";

interface EditModalProps {
  opened: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  title: string;
  type: "personal" | "official" | "contact" | "emergency" | "address";
  initialData: any;
}

// Define the props interface for Field component
interface FieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  textarea?: boolean;
  rows?: number;
  error?: string;
}

// Field component matching EditDetailsModal styling
const Field = ({
  label,
  value,
  onChange,
  type = "text",
  textarea = false,
  rows = 3,
  error,
}: FieldProps) => (
  <div>
    <label className="block text-sm font-medium text-[#565E6C] mb-1">
      {label}
    </label>
    {textarea ? (
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        className={`w-full px-3 py-2 rounded-[4px] border text-[#565E6C] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#bfdbfe] focus:border-[#3b82f6] hover:border-[#3b82f6] transition-all duration-150 ${
          error ? "border-red-500" : "border-gray-300"
        }`}
      />
    ) : (
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full px-3 py-2 rounded-[4px] border text-[#565E6C] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#bfdbfe] focus:border-[#3b82f6] hover:border-[#3b82f6] transition-all duration-150 ${
          error ? "border-red-500" : "border-gray-300"
        }`}
      />
    )}
    {error && <span className="text-red-500 text-xs mt-1">{error}</span>}
  </div>
);

const EditModal: React.FC<EditModalProps> = ({
  opened,
  onClose,
  onSave,
  title,
  type,
  initialData,
}) => {
  const [formData, setFormData] = useState<any>(initialData || {});
  const [errors, setErrors] = useState<any>({});
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (opened) setFormData(initialData);
  }, [opened, initialData]);

  const fieldConfig: Record<string, any[]> = {
    personal: [
      [{ label: "Full Name", field: "fullName" }],
      [
        { label: "Blood Group", field: "bloodGroup" },
        { label: "Aadhaar ID", field: "adhaarId" },
      ],
      [
        {
          label: "Health Conditions",
          field: "healthConditions",
          textarea: true,
        },
      ],
      [
        {
          label: "Personal Interests",
          field: "personalInterests",
          textarea: true,
        },
      ],
    ],

    official: [
      [{ label: "Batch", field: "batch" }],
      [
        { label: "Tech Stack", field: "techStack" },
        { label: "Projects Involved", field: "projectsInvolved" },
      ],
      [
        { label: "Buddy", field: "buddy" },
        { label: "OJT Mentor", field: "ojtMentor" },
      ],
      [
        { label: "DU Allocation", field: "duAllocation" },
        { label: "Location", field: "location" },
      ],
    ],

    contact: [
      [{ label: "Phone Number", field: "phoneNumber", type: "tel" }],
      [{ label: "Email", field: "email", type: "email" }],
      [
        {
          label: "Emergency Contact Number",
          field: "emergencyContactNumber",
          type: "tel",
        },
      ],
      [
        {
          label: "Emergency Contact Relationship",
          field: "emergencyContactRelationship",
        },
      ],
    ],

    emergency: [
      [{ label: "Contact Number", field: "contactNumber", type: "tel" }],
      [{ label: "Relationship", field: "relationship" }],
    ],

    address: [
      [{ label: "Current Address", field: "currentAddress", textarea: true }],
      [{ label: "Contact Number", field: "contactNumber", type: "tel" }],
      [
        {
          label: "Permanent Address",
          field: "permanentAddress",
          textarea: true,
        },
      ],
    ],
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
    setErrors((prev: any) => ({ ...prev, [field]: "" }));
  };

  const validateForm = () => {
    const newErrors: any = {};

    // Email validation
    if (formData.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = "Invalid email format";
      }
    }

    // Phone number validation (10 digits)
    if (formData.phoneNumber) {
      const phoneRegex = /^\d{10}$/;
      if (!phoneRegex.test(formData.phoneNumber)) {
        newErrors.phoneNumber = "Phone number must be exactly 10 digits";
      }
    }

    // Emergency contact number validation (10 digits)
    if (formData.emergencyContactNumber) {
      const phoneRegex = /^\d{10}$/;
      if (!phoneRegex.test(formData.emergencyContactNumber)) {
        newErrors.emergencyContactNumber =
          "Contact number must be exactly 10 digits";
      }
    }

    // Contact number validation for emergency and address (10 digits)
    if (formData.contactNumber) {
      const phoneRegex = /^\d{10}$/;
      if (!phoneRegex.test(formData.contactNumber)) {
        newErrors.contactNumber = "Contact number must be exactly 10 digits";
      }
    }

    // Aadhaar ID validation (12 digits)
    if (formData.adhaarId) {
      const aadhaarRegex = /^\d{12}$/;
      if (!aadhaarRegex.test(formData.adhaarId)) {
        newErrors.adhaarId = "Aadhaar ID must be exactly 12 digits";
      }
    }

    return newErrors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    onSave(formData);
    onClose();
  };

  // Outside click closes modal
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node))
        onClose();
    };
    if (opened) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [opened, onClose]);

  if (!opened) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div
        ref={modalRef}
        className="bg-white rounded-[4px] p-6 w-full max-w-md mx-4 text-[14px]"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-[#565E6C]">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {fieldConfig[type]?.map((row, i) => (
            <div
              key={i}
              className={`grid ${
                row.length > 1 ? "grid-cols-2 gap-4" : "grid-cols-1"
              }`}
            >
              {row.map((f: any) => (
                <Field
                  key={f.field}
                  label={f.label}
                  value={formData[f.field] || ""}
                  onChange={(v: string) => handleChange(f.field, v)}
                  type={f.type || "text"}
                  textarea={f.textarea}
                  rows={f.rows}
                  error={errors[f.field]}
                />
              ))}
            </div>
          ))}

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1 border border-gray-300 rounded-md text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <Button type="submit" size="sm">
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditModal;
