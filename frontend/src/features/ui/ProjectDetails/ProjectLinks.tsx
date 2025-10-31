import { useState, useEffect } from "react";
import Button from "../Button";
import { SquarePen, Copy, Link2 } from "lucide-react";
import { getAllProjectLinks, updateProjectLink } from "./api";
import type { ProjectLink } from "./api";

interface ProjectLinksProps {
  canEdit?: boolean;
  projectId: string;
}

function ProjectLinks({ canEdit = false, projectId }: ProjectLinksProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [projectLinks, setProjectLinks] = useState<ProjectLink[]>([]);
  const [selectedLink, setSelectedLink] = useState<ProjectLink | null>(null);
  const [editLinkUrl, setEditLinkUrl] = useState("");
  const itemsPerPage = 2;

  useEffect(() => {
    const fetchProjectLinks = async () => {
      setLoading(true);
      try {
        const apiData = await getAllProjectLinks(projectId);

        if (apiData && apiData.links) {
          setProjectLinks(apiData.links);
        } else {
          // Fallback to empty array if no links
          setProjectLinks([]);
        }
      } catch (error) {
        console.error("Error fetching project links:", error);
        setProjectLinks([]);
      }
      setLoading(false);
    };

    fetchProjectLinks();
  }, [projectId]);

  async function handleSaveEdit() {
    if (!selectedLink) {
      console.error("No selected link for editing");
      return;
    }

    setSaving(true);
    setSaveError(null);
    try {
      console.log("Frontend: Starting project link update");
      console.log("Frontend: Project ID:", projectId);
      console.log("Frontend: Selected link:", selectedLink);
      console.log("Frontend: Edit URL:", editLinkUrl);

      const result = await updateProjectLink(
        projectId,
        selectedLink.linkId,
        editLinkUrl,
      );

      console.log("Frontend: API call result:", result);

      if (result.success) {
        console.log("Frontend: Update successful, updating UI");
        // Update project links array
        setProjectLinks((prev) =>
          prev.map((link) =>
            link.linkId === selectedLink.linkId
              ? { ...link, linkUrl: editLinkUrl }
              : link,
          ),
        );
        setIsEditing(false);
        setSelectedLink(null);
        setEditLinkUrl("");
        setCurrentPage(1); // Reset to first page after edit
        console.log("Frontend: UI updated successfully");
      } else {
        console.error("Frontend: API returned false, update failed");
        const errorMessage =
          result.message ||
          "Failed to update project link - API returned false";
        throw new Error(errorMessage);
      }
    } catch (err: any) {
      console.error("Frontend: Project link update error:", err);
      setSaveError(err?.message || "Failed to save changes");
    } finally {
      setSaving(false);
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  // Calculate pagination
  const totalPages = Math.ceil(projectLinks.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayedLinks = projectLinks.slice(startIndex, endIndex);

  if (loading) {
    return (
      <div className="bg-white px-4 py-4 rounded-lg border border-[#F8F9FA] flex flex-col h-full shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Link2 className="h-5 w-5" style={{ color: "#7B7575" }} />
            <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
          </div>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <div className="h-4 bg-gray-200 rounded w-12 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white px-4 py-4 rounded-lg border border-[#F8F9FA] flex flex-col h-full shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <span className="font-bold flex items-center gap-2 text-[#565E6C] text-base">
          <Link2 className="h-5 w-5" style={{ color: "#7B7575" }} />
          Project Links
        </span>
      </div>
      <div className="flex-1">
        {projectLinks.length === 0 ? (
          <span className="text-gray-400 italic text-xs">No links added</span>
        ) : (
          <>
            {displayedLinks.map((link, idx) => (
              <>
                <div
                  key={startIndex + idx}
                  className="flex items-center justify-between py-3"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <a
                      href={link.linkUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-700 hover:text-brand hover:bg-gray-50 px-2 py-1 rounded transition-colors font-medium truncate max-w-[150px]"
                      title={link.linkUrl}
                      style={{ textDecoration: "none" }}
                    >
                      {link.linkTypeName}
                    </a>
                    <span
                      className={
                        link.linkUrl
                          ? "text-green-600 font-semibold text-xs"
                          : "text-red-500 font-semibold text-xs"
                      }
                    >
                      {link.linkUrl ? "Submitted" : "Not Submitted"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {canEdit && (
                      <button
                        className="p-1 hover:bg-blue-100 rounded transition-colors flex-shrink-0"
                        onClick={() => {
                          setSelectedLink(link);
                          setEditLinkUrl(link.linkUrl);
                          setIsEditing(true);
                        }}
                        title="Edit link"
                      >
                        <SquarePen className="h-4 w-4 text-brand" />
                      </button>
                    )}
                    <button
                      className="p-1 hover:bg-gray-100 rounded transition-colors flex-shrink-0"
                      onClick={() => copyToClipboard(link.linkUrl)}
                      title="Copy link"
                    >
                      <Copy className="h-4 w-4 text-gray-600" />
                    </button>
                  </div>
                </div>
                {idx < displayedLinks.length - 1 && (
                  <hr className="border-t border-gray-200 my-1" />
                )}
              </>
            ))}

            {/* Always show pagination when there are links */}
            {projectLinks.length > 0 && (
              <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-200 bg-gray-50 px-3 py-2 rounded">
                <span className="text-sm text-gray-700 font-medium">
                  Page {currentPage} of {totalPages}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="text-sm px-3 py-1.5 rounded bg-brand text-white hover:bg-brand/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() =>
                      setCurrentPage(Math.min(totalPages, currentPage + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="text-sm px-3 py-1.5 rounded bg-brand text-white hover:bg-brand/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
      {/* Modal for editing */}
      {canEdit && isEditing && selectedLink && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Edit Link</h2>
            <div className="mb-4">
              <label className="block font-semibold mb-1">
                {selectedLink.linkTypeName}
              </label>
              <input
                type="text"
                className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-brand"
                value={editLinkUrl}
                onChange={(e) => setEditLinkUrl(e.target.value)}
                placeholder="Enter URL..."
              />
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
                  setSelectedLink(null);
                  setEditLinkUrl("");
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
