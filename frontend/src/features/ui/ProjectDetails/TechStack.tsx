import { useState } from "react";
import Button from "../Button";
import { SquarePen, Plus, X, ChartBarStacked } from "lucide-react";

interface TechStackProps {
  id?: number;
  techStack: string[];
  canEdit?: boolean;
}

function TechStack({ id, techStack, canEdit = false }: TechStackProps) {
  // Only keep variables that are used in the render
  const [isEditing, setIsEditing] = useState(false);
  const [editTechStackArr, setEditTechStackArr] = useState<string[]>(techStack);
  const [editTechStackInput, setEditTechStackInput] = useState("");
  const [currentTechStack, setCurrentTechStack] = useState<string[]>(techStack);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 2;

  // Calculate pagination only when rendering
  const totalPages = Math.ceil(currentTechStack.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayedStack = currentTechStack.slice(startIndex, endIndex);

  async function handleSaveEdit() {
    setSaving(true);
    setSaveError(null);
    try {
      const response = await fetch(
        "https://localhost:7153/api/ProjectDetails/edit-techstack",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id,
            stack: editTechStackArr.join(","),
          }),
        },
      );
      if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
      setCurrentTechStack(editTechStackArr);
      setIsEditing(false);
      setCurrentPage(1);
    } catch (err: any) {
      setSaveError(err?.message || "Failed to save changes");
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <div
        className="bg-white px-4 py-2 rounded-lg border border-[#F8F9FA] flex flex-col"
        style={{ minHeight: "80px", maxHeight: "110px" }}
      >
        <div className="flex items-center justify-between mb-3">
          <span className="font-bold flex items-center gap-2 text-gray-700 text-sm">
            <ChartBarStacked className="h-4 w-4" style={{ color: "#7B7575" }} />
            Tech Stack
          </span>
          {canEdit && (
            <Button
              variant="link"
              size="icon"
              className="rounded-full p-2 text-brand hover:bg-brand/10 focus:ring-2 focus:ring-brand/30 transition-colors shadow-none border-none"
              title="Edit Tech Stack"
              onClick={() => setIsEditing(true)}
            >
              <SquarePen className="h-5 w-5" />
            </Button>
          )}
        </div>

        <div className="flex-1 min-h-[150px]">
          {currentTechStack.length === 0 ? (
            <span className="text-gray-400 italic text-xs">No stack added</span>
          ) : (
            <div className="flex flex-wrap gap-2">
              {displayedStack.map((stack, idx) => (
                <span
                  key={startIndex + idx}
                  className="bg-brand text-white px-2 py-1 rounded-full text-xs font-medium border border-blue-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer max-w-[120px] truncate"
                  style={{ boxShadow: "0 1px 4px rgba(37,99,235,0.08)" }}
                  title={stack}
                >
                  {stack}
                </span>
              ))}
            </div>
          )}
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-200">
            <span className="text-xs text-gray-600 font-medium">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() =>
                setCurrentPage(Math.min(totalPages, currentPage + 1))
              }
              disabled={currentPage === totalPages}
              className="text-xs px-3 py-1.5 rounded bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        )}
      </div>
      {/* Modal for editing */}
      {canEdit && isEditing && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Edit Tech Stack</h2>
            <div className="mb-4">
              <label className="block font-semibold mb-1">Tech Stack</label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  className="border rounded px-2 py-1 w-full"
                  value={editTechStackInput}
                  onChange={(e) => setEditTechStackInput(e.target.value)}
                  placeholder="Add tech stack"
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      const val = editTechStackInput.trim();
                      if (val && !editTechStackArr.includes(val)) {
                        setEditTechStackArr([...editTechStackArr, val]);
                        setEditTechStackInput("");
                      }
                    }
                  }}
                />
                <Button
                  variant="default"
                  size="icon"
                  className="bg-brand text-white rounded-full p-2 flex items-center justify-center"
                  type="button"
                  onClick={() => {
                    const val = editTechStackInput.trim();
                    if (val && !editTechStackArr.includes(val)) {
                      setEditTechStackArr([...editTechStackArr, val]);
                      setEditTechStackInput("");
                    }
                  }}
                >
                  <Plus className="h-5 w-5" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {editTechStackArr.map((stack, idx) => (
                  <span
                    key={idx}
                    className="bg-brand text-white px-2 py-1 rounded-full text-xs font-normal flex items-center gap-1 border border-brand/30 max-w-[120px] truncate"
                    title={stack}
                  >
                    {stack}
                    <button
                      className="ml-1 hover:text-red-200 text-white transition-colors"
                      type="button"
                      onClick={() =>
                        setEditTechStackArr(
                          editTechStackArr.filter((_, i) => i !== idx),
                        )
                      }
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
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
                  setEditTechStackArr(currentTechStack);
                  setEditTechStackInput("");
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
    </>
  );
}

export default TechStack;
