import React, { useState } from "react";
import Button from "../../ui/Button";
import { X, Plus } from "lucide-react";
import { updateTechStack, updateProjectLinks } from "./api";

interface EditProjectDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTechStack: string[];
  initialRepositoryUrl: string;
  initialFigmaUrl: string;
  saveError: string | null;
  projectId?: string;
}

const EditProjectDetailsModal: React.FC<EditProjectDetailsModalProps> = ({
  isOpen,
  onClose,
  initialTechStack,
  initialRepositoryUrl,
  initialFigmaUrl,
  saveError,
  projectId = "default",
}) => {
  const [editingTechStack, setEditingTechStack] =
    useState<string[]>(initialTechStack);
  const [techStackInput, setTechStackInput] = useState("");
  const [editingRepoUrl, setEditingRepoUrl] = useState(initialRepositoryUrl);
  const [editingFigmaUrl, setEditingFigmaUrl] = useState(initialFigmaUrl);
  const [linkEditType, setLinkEditType] = useState<"repository" | "figma">(
    "repository",
  );
  const [techStackSaving, setTechStackSaving] = useState(false);
  const [linksSaving, setLinksSaving] = useState(false);
  const [techStackError, setTechStackError] = useState<string | null>(null);
  const [linksError, setLinksError] = useState<string | null>(null);

  const handleLinksSave = async () => {
    setLinksSaving(true);
    setLinksError(null);
    try {
      const success = await updateProjectLinks(projectId, {
        repositoryUrl: editingRepoUrl,
        figmaUrl: editingFigmaUrl,
      });
      if (!success) {
        setLinksError("Failed to update project links");
      }
    } catch (error) {
      setLinksError("Error updating project links");
    }
    setLinksSaving(false);
  };

  const handleAddTechStack = async () => {
    const val = techStackInput.trim();
    if (val && !editingTechStack.includes(val)) {
      const newTechStack = [...editingTechStack, val];
      setEditingTechStack(newTechStack);
      setTechStackInput("");

      // Auto-save when adding new tech stack item
      setTechStackSaving(true);
      setTechStackError(null);
      try {
        const success = await updateTechStack(projectId, newTechStack);
        if (!success) {
          setTechStackError("Failed to update tech stack");
        }
      } catch (error) {
        setTechStackError("Error updating tech stack");
      }
      setTechStackSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Edit Project Details</h2>
        {/* Tech Stack Section */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">Tech Stack</label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-brand"
              value={techStackInput}
              onChange={(e) => setTechStackInput(e.target.value)}
              placeholder="Add technology"
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleAddTechStack();
                }
              }}
              disabled={techStackSaving}
            />
            <Button
              variant="default"
              size="icon"
              className="bg-brand text-white rounded-full p-2 flex items-center justify-center"
              type="button"
              onClick={handleAddTechStack}
              disabled={techStackSaving}
            >
              <Plus className="h-5 w-5" />
            </Button>
          </div>
          {techStackError && (
            <div className="text-red-500 text-sm mb-2">{techStackError}</div>
          )}
          {techStackSaving && (
            <div className="text-blue-500 text-sm mb-2">
              Updating tech stack...
            </div>
          )}
          <div className="flex flex-wrap gap-2">
            {editingTechStack.map((tech, idx) => (
              <span
                key={idx}
                className="bg-brand text-white px-3 py-1 rounded-full text-sm font-normal flex items-center gap-2 border border-brand/30"
              >
                {tech}
                <button
                  onClick={() =>
                    setEditingTechStack(
                      editingTechStack.filter((_, i) => i !== idx),
                    )
                  }
                  className="hover:bg-white/20 rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        </div>
        {/* Link Edit Section */}
        <div className="mb-4">
          <label className="block font-semibold mb-1">
            Select Link to Edit
          </label>
          <select
            className="border border-gray-300 rounded px-3 py-2 w-full mb-2 focus:outline-none focus:ring-2 focus:ring-brand"
            value={linkEditType}
            onChange={(e) =>
              setLinkEditType(e.target.value as "repository" | "figma")
            }
            disabled={linksSaving}
          >
            <option value="repository">Repository URL</option>
            <option value="figma">Figma URL</option>
          </select>
          <div className="flex gap-2 mb-2">
            {linkEditType === "repository" ? (
              <input
                type="text"
                className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-brand"
                value={editingRepoUrl}
                onChange={(e) => setEditingRepoUrl(e.target.value)}
                placeholder="https://github.com/..."
                disabled={linksSaving}
              />
            ) : (
              <input
                type="text"
                className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-brand"
                value={editingFigmaUrl}
                onChange={(e) => setEditingFigmaUrl(e.target.value)}
                placeholder="https://figma.com/..."
                disabled={linksSaving}
              />
            )}
            <Button
              variant="default"
              size="sm"
              className="px-4 py-2 bg-brand text-white hover:bg-brand/90"
              onClick={handleLinksSave}
              disabled={linksSaving}
            >
              {linksSaving ? "Applying..." : "Apply"}
            </Button>
          </div>
          {linksError && (
            <div className="text-red-500 text-sm mb-2">{linksError}</div>
          )}
        </div>
        {saveError && (
          <div className="text-red-500 text-sm mb-2">{saveError}</div>
        )}
        <div className="flex justify-end gap-3 mt-6">
          <Button
            variant="default"
            size="sm"
            className="px-4 py-2"
            onClick={onClose}
            disabled={techStackSaving || linksSaving}
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EditProjectDetailsModal;
