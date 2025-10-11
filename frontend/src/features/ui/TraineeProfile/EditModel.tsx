import React, { useState, useEffect, useRef } from "react";
import { X } from "lucide-react";
import Button from "../../ui/Button";

interface EditModalProps {
  opened: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  title: string;
  type: "personal" | "contact" | "emergency" | "address";
  initialData: any;
}

const InputField = ({
  label,
  value,
  onChange,
  type = "text",
  required,
  error,
  textarea,
  rows = 3,
  placeholder,
}: any) =>
  textarea ? (
    <div>
      <label className="block text-sm font-medium text-[#565E6C] mb-1">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </label>
      <textarea
        rows={rows}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2 rounded-[4px] border text-[#565E6C] placeholder-[#9CA3AF]
          focus:outline-none focus:ring-2 focus:ring-[#bfdbfe] focus:border-[#3b82f6]
          hover:border-[#3b82f6] transition-all duration-150 resize-y border-gray-300"
        required={required}
      />
      {error && <span className="text-red-500 text-xs mt-1">{error}</span>}
    </div>
  ) : (
    <div>
      <label className="block text-sm font-medium text-[#565E6C] mb-1">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full px-3 py-2 rounded-[4px] border text-[#565E6C] 
          focus:outline-none focus:ring-2 focus:ring-[#bfdbfe] focus:border-[#3b82f6]
          hover:border-[#3b82f6] transition-all duration-150 ${error ? "border-red-500" : "border-gray-300"}`}
        required={required}
      />
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
    if (opened) {
      setFormData(initialData);
      setErrors({});
    }
  }, [opened, initialData]);

  useEffect(() => {
    const clickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node))
        onClose();
    };
    if (opened) document.addEventListener("mousedown", clickOutside);
    return () => document.removeEventListener("mousedown", clickOutside);
  }, [opened, onClose]);

  if (!opened) return null;

  // Field configuration
  const fieldConfig: Record<string, any[]> = {
    personal: [
      [
        {
          label: "Full Name",
          field: "fullName",
          textarea: false,
          type: "text",
        },
        { label: "Batch", field: "batch" },
      ],
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
          rows: 3,
        },
      ],
    ],
    contact: [
      [{ label: "Phone Number", field: "phoneNumber", type: "tel" }],
      [{ label: "Email", field: "email", type: "email" }],
    ],
    emergency: [
      [{ label: "Contact Number", field: "contactNumber", type: "tel" }],
      [{ label: "Relationship", field: "relationship" }],
    ],
    address: [
      [
        {
          label: "Residential Address",
          field: "residentialAddress",
          textarea: true,
          rows: 4,
        },
      ],
    ],
  };

  // Validators
  const validators: Record<string, (val: string) => string> = {
    email: (val: string) =>
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) ? "" : "Invalid email address.",
    tel: (val: string) => (/^\d{10}$/.test(val) ? "" : "Invalid phone number."),
    adhaarId: (val: string) =>
      /^\d{12}$/.test(val) ? "" : "Aadhaar must be 12 digits.",
  };

  const validateField = (field: any, value: string) => {
    if (!value.trim()) return "This field is required.";
    if (validators[field.type]) return validators[field.type](value);
    if (field.field === "adhaarId") return validators.adhaarId(value);
    return "";
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
    setErrors((prev: any) => ({ ...prev, [field]: "" }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: any = {};
    fieldConfig[type].flat().forEach((f) => {
      const error = validateField(f, formData[f.field] || "");
      if (error) newErrors[f.field] = error;
    });
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      onSave(formData);
      onClose();
    }
  };

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
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {fieldConfig[type]?.map((row, i) => (
            <div
              key={i}
              className={`grid ${row.length > 1 ? "grid-cols-2 gap-4" : ""} gap-4`}
            >
              {row.map((f: any) => (
                <InputField
                  key={f.field}
                  label={f.label}
                  value={formData[f.field] || ""}
                  onChange={(v: string) => handleChange(f.field, v)}
                  type={f.type || "text"}
                  required={true} // <-- all fields required
                  textarea={f.textarea}
                  rows={f.rows}
                  placeholder={f.label ? `Enter ${f.label.toLowerCase()}` : ""}
                  error={errors[f.field]}
                />
              ))}
            </div>
          ))}

          <div className="flex justify-end space-x-3 pt-6">
            <Button variant="default" size="sm" onClick={onClose}>
              Cancel
            </Button>
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
