import { useState } from 'react';
import { Upload, FileText } from 'lucide-react';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  onCancel: () => void;
  acceptedFormats?: string[];
}

const FileUpload = ({ onFileSelect, onCancel, acceptedFormats = ['.xlsx', '.pdf'] }: FileUploadProps) => {
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelection(files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelection(files[0]);
    }
  };

  const handleFileSelection = (file: File) => {
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    if (acceptedFormats.includes(fileExtension)) {
      setSelectedFile(file);
    } else {
      alert(`Please select a valid file format (${acceptedFormats.join(', ')})`);
    }
  };

  const handleUpload = () => {
    if (selectedFile) {
      onFileSelect(selectedFile);
      setSelectedFile(null);
    }
  };

  return (
    <div className="flex-1 bg-white rounded-lg border border-gray-200 p-6">
      <div
        className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
          isDragging 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 bg-white'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center space-y-4">
          <div className="p-3 bg-blue-50 rounded-full">
            <Upload className="w-6 h-6 text-blue-500" />
          </div>
          
          <div>
            <label htmlFor="file-upload" className="cursor-pointer">
              <span className="text-blue-600 hover:text-blue-700 font-medium">
                Click or drag file to this area to upload
              </span>
              <input
                id="file-upload"
                type="file"
                className="hidden"
                accept={acceptedFormats.join(',')}
                onChange={handleFileInput}
              />
            </label>
          </div>

          {selectedFile && (
            <div className="flex items-center space-x-2 bg-gray-50 px-4 py-2 rounded">
              <FileText className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-700">{selectedFile.name}</span>
            </div>
          )}
        </div>
      </div>

      <p className="text-xs text-gray-500 mt-4">
        Format accepted is {acceptedFormats.join(', ')}
      </p>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <p className="text-sm text-gray-600 mb-2">
          If you do not have a file you can use this sample:
        </p>
        <button className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 text-sm">
          <FileText className="w-4 h-4" />
          <span>Download Template</span>
        </button>
      </div>

      <div className="flex justify-end space-x-3 mt-6">
        <button
          onClick={onCancel}
          className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleUpload}
          disabled={!selectedFile}
          className={`px-4 py-2 rounded transition-colors ${
            selectedFile
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          Upload
        </button>
      </div>
    </div>
  );
};

export default FileUpload;