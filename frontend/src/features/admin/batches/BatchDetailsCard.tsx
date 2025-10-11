import React from "react";
import Button from "../../ui/Button";
import { Badge, Card } from "@mantine/core";
import { CardContent } from "@mui/material";

interface BatchDetailsCardProps {
  batchName: string;
  status: "Ongoing" | "Completed" | "Upcoming";
  startDate: string;
  endDate: string;
  batchType: string;
  totalTrainees: number;
  totalTrainingHours: number;
}

const BatchDetailsCard: React.FC<BatchDetailsCardProps> = ({
  batchName,
  status,
  startDate,
  endDate,
  batchType,
  totalTrainees,
  totalTrainingHours,
}) => {
  const getStatusColor = () => {
    return status === "Ongoing" ? "green" : "gray";
  };

  const DetailItem: React.FC<{ label: string; value: string | number }> = ({
    label,
    value,
  }) => (
    <div className="flex flex-col gap-0.5">
      <p className="text-gray-500 text-xs">{label}</p>
      <p className="text-sm font-semibold text-gray-800">{value}</p>
    </div>
  );

  return (
    <Card className="p-0 border-none bg-white w-full">
      <div className="p-4">
        {/* REVISED: Title, Status Badge, AND Edit Button in the same flex container */}
        <div className="flex items-start justify-between ml-4 mb-4">
          {/* Left Side: Title and Status */}
          <h1 className="text-xl font-bold text-gray-800 flex items-center gap-3 ">
            {batchName}
            <Badge
              color={getStatusColor()}
              size="lg"
              radius="xl"
              className="font-light text-base"
            >
              {status}
            </Badge>
          </h1>

          {/* Right Side: EDIT Button (Now inside the card) */}
          <Button
            variant="default" // Use the default variant to ensure base styling
            // Custom classes to replicate the light gray, rounded style from the image
            //className="!bg-gray-200 hover:!bg-gray-300 text-gray-700 font-medium px-4 py-2 rounded-lg shadow-sm h-10 w-auto"
          >
            Edit
          </Button>
        </div>

        {/* Details Grid - Using CardContent's base padding and styling */}
        <CardContent className="p-0 pt-0">
          <div className="grid grid-cols-5 gap-7 text-sm">
            <DetailItem label="Start Date" value={startDate} />
            <DetailItem label="End Date" value={endDate} />
            <DetailItem label="Batch Type" value={batchType} />
            <DetailItem label="Total Trainees" value={totalTrainees} />
            <DetailItem
              label="Total Training Hours"
              value={`${totalTrainingHours} hrs`}
            />
          </div>
        </CardContent>
      </div>
    </Card>
  );
};

export default BatchDetailsCard;
