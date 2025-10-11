import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../../ui/card";
import { cn } from "../../../lib/utils";

interface InfoItem {
  label: string;
  value: string;
  gridCols?: "single" | "double";
}

interface ContactItem {
  type: "phone" | "email" | "text";
  label: string;
  value: string;
}

interface InfoCardProps {
  title: string;
  titleIcon?: React.ReactNode;
  items?: InfoItem[];
  contacts?: ContactItem[];
  className?: string;
  onEdit?: () => void;
}

function InfoCard({
  title,
  titleIcon,
  items,
  contacts,
  className,
  onEdit,
}: InfoCardProps) {
  const getContactIcon = (type: "phone" | "email" | "text") => {
    if (type === "phone") {
      return (
        <svg
          className="w-3 h-3"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
          />
        </svg>
      );
    }
    if (type === "email") {
      return (
        <svg
          className="w-3 h-3"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
      );
    }
    return null;
  };

  return (
    <Card
      className={cn(
        "w-full bg-white border border-gray-200 rounded-sm pb-3",
        className,
      )}
    >
      {/* Header */}
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-0">
        <div className="flex items-center space-x-2">
          {titleIcon && <div className="text-blue-500">{titleIcon}</div>}
          <CardTitle
            className="text-lg font-semibold"
            style={{ color: "#565E6C" }}
          >
            {title}
          </CardTitle>
        </div>
        {onEdit && (
          <button
            onClick={onEdit}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </button>
        )}
      </CardHeader>

      {/* Content */}
      <CardContent className="space-y-3 pt-3 pb-3">
        {items && (
          <div className="grid grid-cols-2 gap-x-6 gap-y-3">
            {items.map((item, index) => (
              <div
                key={index}
                className={cn(
                  "space-y-0.5",
                  item.gridCols === "double" ? "col-span-2" : "col-span-1",
                )}
              >
                {/* Label stays gray */}
                <div className="text-xs font-medium text-gray-500 pb-0.25">
                  {item.label}
                </div>
                {/* Value in custom color and semi-bold */}
                <div
                  className="text-sm font-semibold"
                  style={{ color: "#565E6C" }}
                >
                  {item.value}
                </div>
              </div>
            ))}
          </div>
        )}

        {contacts && (
          <div className="space-y-3">
            {contacts.map((contact, index) => (
              <div key={index} className="space-y-0.5">
                {/* Label stays gray */}
                <div className="text-xs font-medium text-gray-500 pb-0.25">
                  {contact.label}
                </div>
                <div className="flex items-center space-x-2">
                  {contact.type !== "text" && (
                    <div className="text-blue-500">
                      {getContactIcon(contact.type)}
                    </div>
                  )}
                  {/* Value in custom color and semi-bold */}
                  <span
                    className="text-sm font-semibold"
                    style={{ color: "#565E6C" }}
                  >
                    {contact.value}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default InfoCard;
