import React, { useState, useEffect, useRef } from "react";
import { X } from "lucide-react";
import Button from "../../ui/Button";

interface EditDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  fields: { key: string; label: string; type?: string; placeholder?: string }[];
  data: Record<string, string>;
  onSave: (updatedData: Record<string, string>) => void;
}

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

const EditDetailsModal: React.FC<EditDetailsModalProps> = ({
  isOpen,
  onClose,
  title,
  fields,
  data,
  onSave,
}) => {
  const [form, setForm] = useState<Record<string, string>>(data);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setForm(data);
  }, [data]);

  // Outside click closes modal
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node))
        onClose();
    };
    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const validate = () => {
    const e: Record<string, string> = {};
    fields.forEach(({ key, label }) => {
      if (!form[key]?.trim()) e[key] = `${label} is required`;
    });
    setErrors(e);
    return !Object.keys(e).length;
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onSave(form);
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
          <h2 className="text-xl font-semibold text-[#565E6C]">
            {title || "Edit Details"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          {fields.map(({ key, label, type, placeholder }) => (
            <Field
              key={key}
              label={label}
              type={type || "text"}
              value={form[key] || ""}
              onChange={(v: string) => handleChange(key, v)}
              placeholder={placeholder}
              error={errors[key]}
            />
          ))}

          <div className="flex justify-end space-x-3 pt-4">
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

export default EditDetailsModal;
