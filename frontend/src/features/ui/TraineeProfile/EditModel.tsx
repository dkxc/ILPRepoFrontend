import React, { useState, useEffect, useRef } from "react";
import { X } from "lucide-react";
import Button from "../../ui/Button";

interface EditModalProps {
  opened: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  title: string;
  type: "personal" | "official" | "contact" | "emergency" | "address";
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
        className="w-full px-3 py-2 rounded border border-gray-300 text-[#565E6C]
          focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
      />
      {error && <span className="text-red-500 text-xs">{error}</span>}
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
        className={`w-full px-3 py-2 rounded border ${
          error ? "border-red-500" : "border-gray-300"
        } text-[#565E6C] focus:ring-2 focus:ring-blue-200 focus:border-blue-500`}
      />
      {error && <span className="text-red-500 text-xs">{error}</span>}
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
      [{ label: "Health Conditions", field: "healthConditions", textarea: true }],
      [{ label: "Personal Interests", field: "personalInterests", textarea: true }],
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
    ],

    emergency: [
      [{ label: "Contact Number", field: "contactNumber", type: "tel" }],
      [{ label: "Relationship", field: "relationship" }],
    ],

    address: [
      [{ label: "Current Address", field: "currentAddress", textarea: true }],
      [{ label: "Contact Number", field: "contactNumber", type: "tel" }],
      [{ label: "Permanent Address", field: "permanentAddress", textarea: true }],
    ],
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
    setErrors((prev: any) => ({ ...prev, [field]: "" }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  if (!opened) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div ref={modalRef} className="bg-white rounded p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-[#565E6C]">{title}</h2>
          <button onClick={onClose}>
            <X size={20} className="text-gray-500 hover:text-gray-700" />
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
                <InputField
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

          <div className="flex justify-end gap-3 pt-4">
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
