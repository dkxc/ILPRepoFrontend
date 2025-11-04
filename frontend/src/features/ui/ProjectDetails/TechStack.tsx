import { useState, useEffect } from "react";
import Button from "../Button";
import { SquarePen, Plus, X, ChartBarStacked } from "lucide-react";
import { toast } from "sonner";
import { getTechStack, updateTechStack } from "./api";

interface TechStackProps {
  id?: number;
  techStack: string[];
  canEdit?: boolean;
  projectId: string;
}

function TechStack({ techStack, canEdit = false, projectId }: TechStackProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTechStackArr, setEditTechStackArr] = useState<string[]>(techStack);
  const [editTechStackInput, setEditTechStackInput] = useState("");
  const [currentTechStack, setCurrentTechStack] = useState<string[]>(techStack);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 4;

  useEffect(() => {
    const fetchTechStack = async () => {
      setLoading(true);
      const apiData = await getTechStack(projectId);

      if (apiData) {
        setCurrentTechStack(apiData.techStack);
        setEditTechStackArr(apiData.techStack);
      } else {
        // Use props data as fallback
        setCurrentTechStack(techStack);
        setEditTechStackArr(techStack);
      }
      setLoading(false);
    };

    fetchTechStack();
  }, [projectId, techStack]);

  // Show up to 4 tech stacks, no pagination if <= 4
  const displayedStack = currentTechStack.slice(0, itemsPerPage);

  async function handleSaveEdit() {
    setSaving(true);
    setSaveError(null);
    try {
      console.log(
        "Updating tech stack for project:",
        projectId,
        "with stack:",
        editTechStackArr,
      );
      const success = await updateTechStack(projectId, editTechStackArr);
      console.log("Update tech stack result:", success);

      if (success) {
        setCurrentTechStack(editTechStackArr);
        setIsEditing(false);
        toast.success("Tech stack updated successfully!");
      } else {
        toast.error("Failed to update tech stack");
        throw new Error("Failed to update tech stack");
      }
    } catch (err: any) {
      console.error("Tech stack update error:", err);
      toast.error(err?.message || "Failed to save tech stack changes");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div
        className="bg-white px-4 py-2 rounded-lg border border-[#F8F9FA] flex flex-col shadow-sm"
        style={{ minHeight: "80px", maxHeight: "110px" }}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <ChartBarStacked className="h-4 w-4" style={{ color: "#7B7575" }} />
            <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
          </div>
        </div>
        <div className="flex-1">
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div
        className="bg-white px-4 py-2 rounded-lg border border-[#F8F9FA] flex flex-col shadow-sm"
        style={{ minHeight: "80px", maxHeight: "110px" }}
      >
        <div className="flex items-center justify-between mb-3">
          <span className="font-bold flex items-center gap-2 text-[#565E6C] text-base">
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
                  key={idx}
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

        {/* No pagination needed for up to 4 items */}
      </div>
      {/* Modal for editing */}
      {canEdit && isEditing && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
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
                  disabled={
                    editTechStackArr.length >= 4 &&
                    editTechStackInput.trim() === ""
                  }
                  onKeyPress={(e) => {
                    if (e.key === "Enter" && editTechStackArr.length < 4) {
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
                  disabled={
                    editTechStackArr.length >= 4 &&
                    editTechStackInput.trim() === ""
                  }
                  onClick={() => {
                    if (
                      editTechStackArr.length >= 4 &&
                      editTechStackInput.trim() === ""
                    )
                      return;
                    const val = editTechStackInput.trim();
                    if (
                      val &&
                      !editTechStackArr.includes(val) &&
                      editTechStackArr.length < 4
                    ) {
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
                {editTechStackArr.length >= 4 && (
                  <div className="text-xs text-red-500 mt-2 w-full">
                    You can't add more than 4 tech stacks.
                  </div>
                )}
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
