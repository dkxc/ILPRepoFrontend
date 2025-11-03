import React, { useEffect, useRef, useState } from "react";
import { Edit3 } from "lucide-react";

interface EditableDropdownProps {
  options: { value: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
  onEdit: (v: string, newLabel: string) => void;
  onCreateCustom: (newLabel: string) => void;
  placeholder?: string;
  error?: string;
}

const EditableDropdown: React.FC<EditableDropdownProps> = ({
  options,
  value,
  onChange,
  onEdit,
  onCreateCustom,
  placeholder = "Select option...",
  error,
}) => {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [creatingCustom, setCreatingCustom] = useState(false);
  const [customValue, setCustomValue] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedLabel =
    options.find((o) => o.value === value)?.label || placeholder;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
        setEditing(null);
        setCreatingCustom(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (v: string) => {
    onChange(v);
    setOpen(false);
  };

  const handleCustomCreate = () => {
    if (customValue.trim()) {
      onCreateCustom(customValue.trim());
      onChange(customValue.trim().toLowerCase().replace(/\s+/g, "-"));
      setCreatingCustom(false);
      setCustomValue("");
      setOpen(false);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Dropdown input display */}
      <div
        onClick={() => setOpen((o) => !o)}
        className={`w-full px-3 py-2 rounded-[4px] border text-[#565E6C] bg-white cursor-pointer flex justify-between items-center
        ${error ? "border-red-500" : "border-gray-300 hover:border-[#3b82f6]"}
        transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[#bfdbfe]`}
      >
        <span>{selectedLabel}</span>
        <span className="text-gray-400 text-sm">▼</span>
      </div>

      {/* Dropdown menu */}
      {open && (
        <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-md max-h-48 overflow-auto">
          {options.map((opt) => (
            <div
              key={opt.value}
              className={`flex items-center justify-between px-3 py-2 text-sm hover:bg-blue-50 ${
                opt.value === value ? "bg-blue-100" : ""
              }`}
            >
              {editing === opt.value ? (
                <input
                  type="text"
                  className="flex-1 border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  onBlur={() => {
                    if (editValue.trim()) onEdit(opt.value, editValue.trim());
                    setEditing(null);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      if (editValue.trim()) onEdit(opt.value, editValue.trim());
                      setEditing(null);
                    } else if (e.key === "Escape") setEditing(null);
                  }}
                  autoFocus
                />
              ) : (
                <>
                  <span
                    className="flex-1 cursor-pointer"
                    onClick={() => handleSelect(opt.value)}
                  >
                    {opt.label}
                  </span>
                  <Edit3
                    size={14}
                    className="ml-2 text-gray-500 hover:text-blue-600 cursor-pointer"
                    onClick={() => {
                      setEditing(opt.value);
                      setEditValue(opt.label);
                    }}
                  />
                </>
              )}
            </div>
          ))}

          {/* Divider */}
          <div className="border-t border-gray-200 my-1" />

          {/* Custom Option Section */}
          {!creatingCustom ? (
            <div
              onClick={() => setCreatingCustom(true)}
              className="px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 cursor-pointer"
            >
              + Create Custom Option
            </div>
          ) : (
            <div className="flex items-center gap-2 px-3 py-2 bg-blue-50">
              <input
                type="text"
                className="flex-1 border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none"
                value={customValue}
                placeholder="Enter new option..."
                onChange={(e) => setCustomValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleCustomCreate();
                  else if (e.key === "Escape") {
                    setCreatingCustom(false);
                    setCustomValue("");
                  }
                }}
                autoFocus
              />
              <button
                type="button"
                className="text-blue-600 text-sm font-medium"
                onClick={handleCustomCreate}
              >
                Add
              </button>
            </div>
          )}
        </div>
      )}

      {error && <span className="text-red-500 text-xs mt-1">{error}</span>}
    </div>
  );
};

export default EditableDropdown;
