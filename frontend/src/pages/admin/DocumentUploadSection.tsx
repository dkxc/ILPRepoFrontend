import { useState } from 'react';
import DocumentSelector from '../../features/ui/DocUpload/DocumentSelector';
import FileUpload from '../../features/ui/DocUpload/FileUpload';

export interface Document {
  id: number;
  name: string;
  format: string[];
}

const DocUpload = () => {
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleDocumentSelect = (doc: Document) => {
    setSelectedDoc(doc);
    setSelectedFile(null);
  };

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    // Here you can add logic to handle the file upload
    console.log('File selected:', file);
  };

  const handleCancel = () => {
    setSelectedDoc(null);
    setSelectedFile(null);
  };

  return (
    <div className="flex flex-col space-y-6 p-6">
      <div className="flex gap-6">
        <DocumentSelector
          selectedDoc={selectedDoc}
          onSelect={handleDocumentSelect}
        />
        {selectedDoc && (
          <FileUpload
            onFileSelect={handleFileSelect}
            onCancel={handleCancel}
            acceptedFormats={selectedDoc.format}
          />
        )}
      </div>
    </div>
  );
};

export default DocUpload;