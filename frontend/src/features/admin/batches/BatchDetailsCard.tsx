import React, { useState, useRef, useEffect } from "react";
import Button from "../../ui/Button";
import { Card } from "@mantine/core";
import { CardContent } from "@mui/material";
import StatusBadge from "../../ui/StatusBadge";
import { Upload, Pencil, MoreVertical, Calendar } from "lucide-react";
import { createPortal } from "react-dom";
import { notifications } from "@mantine/notifications";
import { useNavigate } from "react-router";

interface BatchDetailsCardProps {
  batchName: string;
  startDate: string;
  endDate: string;
  batchType: string;
  totalTrainees: number;
  totalTrainingHours: number;
  techStack: string;
  onEdit?: () => void;
  onAddTrainee?: () => void;
  onUploadTrainees?: () => void;
}

const BatchDetailsCard: React.FC<BatchDetailsCardProps> = ({
  batchName,
  startDate,
  endDate,
  batchType,
  totalTrainees,
  totalTrainingHours,
  techStack,
  onEdit,
  onAddTrainee,
  onUploadTrainees,
}) => {
  const computeStatus = (): "Not Started" | "Ongoing" | "Completed" => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (now < start) return "Not Started";
    if (now >= start && now <= end) return "Ongoing";
    return "Completed";
  };

  const [status, setStatus] = useState(computeStatus());
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [menuStyle, setMenuStyle] = useState<React.CSSProperties>({});

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const menuHeight = 180;
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;
      const dropUp = spaceBelow < menuHeight && spaceAbove > menuHeight;

      setMenuStyle({
        position: "absolute",
        top: dropUp
          ? rect.top + window.scrollY - menuHeight - 4
          : rect.bottom + window.scrollY + 4,
        left: rect.right - 176 + window.scrollX,
        zIndex: 9999,
        minWidth: 176,
        background: "#fff",
        border: "1px solid #ccc",
        borderRadius: 8,
        boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
      });

      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownOpen]);

  const DetailItem: React.FC<{ label: string; value: string | number }> = ({
    label,
    value,
  }) => (
    <div className="flex flex-col gap-0.5">
      <p className="text-gray-500 text-xs">{label}</p>
      <p className="text-sm font-semibold text-gray-800">{value}</p>
    </div>
  );

  const navigate = useNavigate();

  return (
    <Card className="p-0 border border-[#F8F9FA] rounded-[6px] bg-white w-full">
      <div className="pt-5 px-3">
        <div className="flex items-start justify-between ml-4 mb-4">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
            {batchName}
            <StatusBadge status={status} />
          </h1>

          {/* Buttons section */}

          <div className="flex items-center gap-2 relative">
            <button
              className="p-2  rounded-lg hover:bg-gray-200 focus:outline-none"
              onClick={() => navigate("/curriculumAdmin")}
              type="button"
            >
              <Calendar className="w-5 h-5 text-blue-600" />
              <span
                className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 whitespace-nowrap 
          bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 
          transition-opacity duration-200 pointer-events-none"
              >
                View Curriculum
              </span>
            </button>
            <Button
              variant="default"
              className="!bg-white hover:!bg-gray-100 !text-blue-600 border border-blue-600 font-normal px-2 py-1 rounded-lg shadow-sm h-7 w-auto"
              onClick={onAddTrainee}
            >
              + Add
            </Button>

            <Button
              variant="default"
              className="!bg-gray-200 hover:!bg-gray-300 text-gray-700 font-medium px-2 py-1 rounded-lg shadow-sm h-7 w-auto flex items-center justify-center"
              onClick={onEdit}
            >
              <Pencil size={16} className="text-blue-600 hover:!bg-gray-100" />
            </Button>

            {/* 3-dot dropdown button */}

            <button
              ref={buttonRef}
              className="p-2 rounded-full hover:bg-gray-200 focus:outline-none"
              onClick={() => setDropdownOpen((v) => !v)}
              type="button"
            >
              <MoreVertical className="w-6 h-6 text-gray-700" />
            </button>

            {dropdownOpen &&
              createPortal(
                <div
                  ref={dropdownRef}
                  style={menuStyle}
                  className="flex flex-col"
                >
                  {[
                    {
                      label: "Upload Trainee Data",
                      action: () => navigate("/upload-trainee-data"),
                    },
                    {
                      label: "Upload Curriculum",
                      action: () => navigate("/upload-curriculum"),
                    },
                    {
                      label: "Upload Project",
                      action: () => navigate("/upload-project-data"),
                    },
                    {
                      label: "Upload Results",
                      action: () => navigate("/upload-results"),
                    },
                  ].map((item, idx) => (
                    <button
                      key={idx}
                      className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 text-gray-800 text-sm"
                      onClick={() => {
                        item.action();
                        setDropdownOpen(false);
                      }}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>,
                document.body,
              )}
          </div>
        </div>

        <CardContent className="p-0 pt-0">
          <div className="flex flex-wrap items-start gap-12 text-sm px-0 pb-0">
            <DetailItem label="Start Date" value={startDate} />
            <DetailItem label="End Date" value={endDate} />
            <DetailItem label="Batch Type" value={batchType} />
            <DetailItem label="Total Trainees" value={totalTrainees} />
            <DetailItem
              label="Total Training Hours"
              value={`${totalTrainingHours} hrs`}
            />
            <DetailItem label="Tech Stack" value={techStack} />
          </div>
        </CardContent>
      </div>
    </Card>
  );
};

export default BatchDetailsCard;
