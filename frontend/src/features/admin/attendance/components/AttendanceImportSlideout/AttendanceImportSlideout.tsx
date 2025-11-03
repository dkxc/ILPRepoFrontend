import { Button } from "@ui/button/Button";
import { SlideoutMenu } from "@ui/slideoutmenu/SlideoutMenu";
import { FileTrigger } from "@ui/fileuploadtrigger/FileUploadTrigger";
import { useEffect, useState } from "react";
import { UploadCloud, X, File } from "lucide-react";
import { toast } from "sonner";
import { getFormattedStringFromFileTypes } from "./utils/AttendanceImportSlideout.utils";

interface AttendanceImportSlideoutProps {
  isOpen: boolean;
  isImporting: boolean;
  onClose: () => void;
  onImport: (file: File) => void;
  onViewTemplate: () => void;
}

const ALLOWED_FILE_TYPES = {
  csv: "text/csv",
  xls: "application/vnd.ms-excel",
  xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
};
const ACCEPTED_MIMES = Object.values(ALLOWED_FILE_TYPES);
const formattedStringFromFileTypes =
  getFormattedStringFromFileTypes(ALLOWED_FILE_TYPES);

function AttendanceImportSlideout({
  isOpen,
  isImporting,
  onClose,
  onImport,
  onViewTemplate,
}: AttendanceImportSlideoutProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleSelectFile = (files: FileList | null) => {
    if (files && files.length > 0) {
      const file = files[0];
      if (!ACCEPTED_MIMES.includes(file.type)) {
        toast.error(
          "Invalid file type. Please select a CSV, XLSX, or XLS file.",
        );
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleClearFile = () => {
    setSelectedFile(null);
  };

  const handleImportClick = () => {
    if (selectedFile) {
      onImport(selectedFile);
    }
  };

  // Reset file state when the modal is closed
  useEffect(() => {
    if (!isOpen) {
      setSelectedFile(null);
    }
  }, [isOpen]);

  return (
    <SlideoutMenu isOpen={isOpen} onOpenChange={onClose} className="z-10">
      <SlideoutMenu.Header onClose={onClose}>
        <h2 className="text-lg font-semibold text-primary">
          Import Attendance
        </h2>
      </SlideoutMenu.Header>
      <SlideoutMenu.Content>
        <div className="flex flex-col gap-4 text-sm text-tertiary">
          <p>
            Select a {formattedStringFromFileTypes} file to bulk import
            attendance records.
          </p>
          <p>
            <sup className="text-red-400">&#9733;</sup> The file should contain
            columns for Trainee Name, Date, Forenoon Status, and Afternoon
            Status.
          </p>

          <Button color="link-gray" onClick={onViewTemplate}>
            Download Template
          </Button>

          <FileTrigger
            acceptedFileTypes={ACCEPTED_MIMES}
            onSelect={handleSelectFile}
          >
            <Button color="secondary" iconLeading={UploadCloud}>
              Select file
            </Button>
          </FileTrigger>

          {selectedFile && (
            <div className="flex items-center justify-between rounded-lg border border-secondary p-3">
              <div className="flex items-center gap-3">
                <File className="h-5 w-5 text-tertiary" />
                <span className="text-sm font-medium text-primary break-all">
                  {selectedFile.name}
                </span>
              </div>
              <Button
                color="tertiary"
                size="sm"
                iconLeading={X}
                onClick={handleClearFile}
                aria-label="Remove selected file"
              />
            </div>
          )}
        </div>
      </SlideoutMenu.Content>
      <SlideoutMenu.Footer>
        <div className="flex w-full justify-end gap-3">
          <Button color="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button
            color="primary"
            onClick={handleImportClick}
            isDisabled={!selectedFile}
            isLoading={isImporting}
          >
            Import
          </Button>
        </div>
      </SlideoutMenu.Footer>
    </SlideoutMenu>
  );
}

export default AttendanceImportSlideout;
