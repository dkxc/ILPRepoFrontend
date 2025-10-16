import React, { useState, useRef, useEffect } from "react";
import { X } from "lucide-react";
import Button from "../../ui/Button";
// import Select from "react-select";

interface BatchFormData {
  batchName: string;
  startDate: string;
  endDate: string;
  batchType: string;
  customBatchType: string;
}

interface BatchDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<BatchFormData, "customBatchType">) => void;
  title?: string;
  initialData?: Partial<BatchFormData> | null;
}

const DEFAULT_TYPES = [
  { value: "custom", label: "Custom (Enter your own)" },
  { value: "full-stack", label: "Full Stack Developer" },
  { value: "business-analyst", label: "Business Analyst" },
  { value: "sdet", label: "SDET" },
];

// ✅ Reusable field
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

const BatchDetailsModal: React.FC<BatchDetailsModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  title = "Create Batch",
  initialData = null,
}) => {
  const [form, setForm] = useState<BatchFormData>({
    batchName: initialData?.batchName || "",
    startDate: initialData?.startDate || "",
    endDate: initialData?.endDate || "",
    batchType: initialData?.batchType || "",
    customBatchType: initialData?.customBatchType || "",
  });
  const [types, setTypes] = useState(DEFAULT_TYPES);
  const [showCustom, setShowCustom] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const modalRef = useRef<HTMLDivElement>(null);

  // ✅ Load types from localStorage
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("allBatchTypes") || "null");
    const sorted = saved
      ? [
          saved.find((t: any) => t.value === "custom"),
          ...saved.filter((t: any) => t.value !== "custom"),
        ]
      : DEFAULT_TYPES;
    setTypes(sorted);
    if (!saved)
      localStorage.setItem("allBatchTypes", JSON.stringify(DEFAULT_TYPES));
  }, []);

  // ✅ Outside click close
  useEffect(() => {
    const clickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node))
        onClose();
    };
    if (isOpen) document.addEventListener("mousedown", clickOutside);
    return () => document.removeEventListener("mousedown", clickOutside);
  }, [isOpen, onClose]);

  const handleChange = (key: keyof BatchFormData, value: string) => {
    setForm((f) => ({ ...f, [key]: value }));
    if (key === "batchType") setShowCustom(value === "custom");
    if (errors[key]) setErrors((e) => ({ ...e, [key]: "" }));
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.batchName.trim()) e.batchName = "Batch name is required";
    if (!form.startDate) e.startDate = "Start date is required";
    if (!form.endDate) e.endDate = "End date is required";
    if (!showCustom && !form.batchType) e.batchType = "Batch type is required";
    if (showCustom && !form.customBatchType.trim())
      e.customBatchType = "Custom batch type is required";
    setErrors(e);
    return !Object.keys(e).length;
  };

  const saveCustomType = (label: string) => {
    const custom = { value: label.toLowerCase().replace(/\s+/g, "-"), label };
    const updated = [
      types[0],
      ...types.filter((t) => t.value !== "custom" && t.value !== custom.value),
      custom,
    ];
    setTypes(updated);
    localStorage.setItem("allBatchTypes", JSON.stringify(updated));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    const selectedType = showCustom ? form.customBatchType : form.batchType;
    if (showCustom) saveCustomType(selectedType);
    onSubmit({ ...form, batchType: selectedType });
    handleClose();
  };

  const handleClose = () => {
    setForm({
      batchName: "",
      startDate: "",
      endDate: "",
      batchType: "",
      customBatchType: "",
    });
    setShowCustom(false);
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div
        ref={modalRef}
        className="bg-white rounded-[4px] p-6 w-full max-w-md mx-4 text-[14px]"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-[#565E6C]">{title}</h2>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Field
            label="Batch Name"
            value={form.batchName}
            onChange={(v: string) => handleChange("batchName", v)}
            placeholder="ILP 2024-25 Batch 7"
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

          {!showCustom ? (
            <div>
              <label className="block text-sm font-medium text-[#565E6C] mb-1">
                Batch Type
              </label>
              {/* <Select
                options={types}
                value={types.find((t) => t.value === form.batchType)}
                onChange={(opt) => handleChange("batchType", opt?.value || "")}
                components={{ Option: CustomOption }}
                styles={{
                  control: (b, s) => ({
                    ...b,
                    minHeight: "40px",
                    borderRadius: "4px",
                    borderColor: s.isFocused ? "#3b82f6" : "#d1d5db",
                    boxShadow: s.isFocused ? "0 0 0 2px #bfdbfe" : "none",
                    "&:hover": { borderColor: "#3b82f6" },
                  }),
                  option: (b) => ({ ...b, padding: 0 }),
                  menu: (b) => ({
                    ...b,
                    borderRadius: "4px",
                    marginTop: 2,
                    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                  }),
                }}
              /> */}
            </div>
          ) : (
            <div className="space-y-2">
              <Field
                label="Custom Batch Type"
                value={form.customBatchType}
                onChange={(v: string) => handleChange("customBatchType", v)}
                placeholder="Enter custom batch type"
                error={errors.customBatchType}
              />
              <button
                type="button"
                onClick={() => setShowCustom(false)}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                ← Back to predefined options
              </button>
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-4">
            <Button variant="default" size="sm" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" size="sm">
              Create
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BatchDetailsModal;
