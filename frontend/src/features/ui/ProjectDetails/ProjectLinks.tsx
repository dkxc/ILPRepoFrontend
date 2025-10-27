import { useState } from "react";
import Button from "../Button";
import { SquarePen, Copy, Link2 } from "lucide-react";

interface ProjectLinksProps {
  id?: number;
  repositoryUrl: string;
  figmaUrl: string;
  canEdit?: boolean;
}

function ProjectLinks({
  id,
  repositoryUrl,
  figmaUrl,
  canEdit = false,
}: ProjectLinksProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editRepo, setEditRepo] = useState(repositoryUrl);
  const [editFigma, setEditFigma] = useState(figmaUrl);
  const [currentRepo, setCurrentRepo] = useState(repositoryUrl);
  const [currentFigma, setCurrentFigma] = useState(figmaUrl);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [linkEditType, setLinkEditType] = useState<"repository" | "figma">(
    "repository",
  );

  async function handleSaveEdit() {
    setSaving(true);
    setSaveError(null);
    try {
      const response = await fetch(
        "https://localhost:7153/api/ProjectDetails/edit-links",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id,
            gitHubLink: editRepo,
            figmaLink: editFigma,
          }),
        },
      );
      if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
      setCurrentRepo(editRepo);
      setCurrentFigma(editFigma);
      setIsEditing(false);
    } catch (err: any) {
      setSaveError(err?.message || "Failed to save changes");
    } finally {
      setSaving(false);
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  // Links array (no pagination)
  const links = [
    {
      label: "Repository",
      url: currentRepo,
      status: currentRepo ? "Submitted" : "Not Submitted",
    },
    {
      label: "Figma",
      url: currentFigma,
      status: currentFigma ? "Submitted" : "Not Submitted",
    },
    // Add more links here if needed
  ];

  return (
    <div className="bg-white px-4 py-4 rounded-lg border border-[#F8F9FA] flex flex-col h-full shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <span className="font-bold flex items-center gap-2 text-[#565E6C] text-base">
          <Link2 className="h-5 w-5" style={{ color: "#7B7575" }} />
          Project Links
        </span>
        {canEdit && (
          <Button
            variant="link"
            size="icon"
            className="rounded-full p-2 text-brand hover:bg-brand/10 focus:ring-2 focus:ring-brand/30 transition-colors shadow-none border-none"
            title="Edit Links"
            onClick={() => setIsEditing(true)}
          >
            <SquarePen className="h-5 w-5" />
          </Button>
        )}
      </div>
      <div className="flex-1">
        {links.map((link, idx) => (
          <>
            <div key={idx} className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3 flex-1">
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-700 hover:text-brand hover:bg-gray-50 px-2 py-1 rounded transition-colors font-medium truncate max-w-[150px]"
                  title={link.url}
                  style={{ textDecoration: "none" }}
                >
                  {link.label}
                </a>
                <span
                  className={
                    link.status === "Submitted"
                      ? "text-green-600 font-semibold text-xs"
                      : "text-red-500 font-semibold text-xs"
                  }
                >
                  {link.status}
                </span>
              </div>
              <button
                className="p-1 hover:bg-gray-100 rounded transition-colors flex-shrink-0"
                onClick={() => copyToClipboard(link.url)}
                title="Copy link"
              >
                <Copy className="h-4 w-4 text-gray-600" />
              </button>
            </div>
            {idx < links.length - 1 && (
              <hr className="border-t border-gray-200 my-1" />
            )}
          </>
        ))}
      </div>
      {/* Modal for editing */}
      {canEdit && isEditing && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Edit Project Links</h2>
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
              >
                <option value="repository">Repository URL</option>
                <option value="figma">Figma URL</option>
              </select>
              {linkEditType === "repository" ? (
                <input
                  type="text"
                  className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-brand"
                  value={editRepo}
                  onChange={(e) => setEditRepo(e.target.value)}
                  placeholder="https://github.com/..."
                />
              ) : (
                <input
                  type="text"
                  className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-brand"
                  value={editFigma}
                  onChange={(e) => setEditFigma(e.target.value)}
                  placeholder="https://figma.com/..."
                />
              )}
            </div>
            {saveError && (
              <div className="text-red-500 text-sm mb-2">{saveError}</div>
            )}
            <div className="flex justify-end gap-3 mt-6">
              <Button
                variant="default"
                size="sm"
                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 text-gray-700"
                onClick={() => {
                  setIsEditing(false);
                  setEditRepo(currentRepo);
                  setEditFigma(currentFigma);
                  setSaveError(null);
                }}
                disabled={saving}
              >
                Cancel
              </Button>
              <Button
                variant="default"
                size="sm"
                className="px-4 py-2 rounded bg-brand text-white hover:bg-brand/90"
                onClick={handleSaveEdit}
                disabled={saving}
              >
                {saving ? "Saving..." : "Save"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProjectLinks;
