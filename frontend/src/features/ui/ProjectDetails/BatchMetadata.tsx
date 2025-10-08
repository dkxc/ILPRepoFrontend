import React, { useState } from "react";
import {
  SquarePen,
  Plus,
  X,
  Copy,
  FolderPen,
  Users,
  ChartBarStacked,
  Link2,
} from "lucide-react";

interface BatchMetadataProps {
  name: string;
  projectName: string;
  trainees: number;
  techStack: string[];
  repositoryUrl: string;
  figmaUrl: string;
  editable?: boolean;
}

function BatchMetadata({
  name,
  projectName,
  trainees,
  techStack,
  repositoryUrl,
  figmaUrl,
  editable = true,
}: BatchMetadataProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTechStackArr, setEditTechStackArr] = useState<string[]>(techStack);
  const [editTechStackInput, setEditTechStackInput] = useState("");
  const [editRepo, setEditRepo] = useState(repositoryUrl);
  const [editFigma, setEditFigma] = useState(figmaUrl);
  const [currentTechStack, setCurrentTechStack] = useState<string[]>(techStack);
  const [currentRepo, setCurrentRepo] = useState(repositoryUrl);
  const [currentFigma, setCurrentFigma] = useState(figmaUrl);

  return (
    <>
  <div className="px-2 mt-5 mb-6 flex items-center gap-3">
        <h1 className="text-3xl font-extrabold tracking-tight" style={{ color: '#565E6C' }}>{projectName || "ILP Project"}</h1>
  <span className="px-4 py-1 rounded-full bg-bolder text-blue-700 text-sm font-semibold shadow-sm select-none border border-blue-200">Ongoing</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 bg-white px-2 sm:px-4 md:px-8 py-4 gap-y-4 gap-x-2 rounded-t-lg">
        <div className="flex flex-col items-start px-2 py-2">
          <span className="font-bold mb-2 flex items-center gap-2">
            <FolderPen className="h-5 w-5" style={{ color: "#7B7575" }} />
            Batch
          </span>
          <span className="text-gray-800">{name}</span>
        </div>
        <div className="flex flex-col items-start px-2 py-2">
          <span className="font-bold mb-2 flex items-center gap-2">
            <Users className="h-5 w-5" style={{ color: "#7B7575" }} />
            No of Trainees
          </span>
          <span className="text-gray-800">{trainees}</span>
        </div>
        <div className="flex flex-col items-start px-2 py-2">
          <span className="font-bold mb-2 flex items-center gap-2">
            <ChartBarStacked className="h-5 w-5" style={{ color: "#7B7575" }} />
            Tech Stack
          </span>
          <div className="flex flex-wrap gap-2">
            {currentTechStack.length === 0 ? (
              <span className="text-gray-400 italic">Stack not given</span>
            ) : (
              currentTechStack.map((stack, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-full text-sm font-medium bg-bolder text-blue-700 border border-blue-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                  style={{ boxShadow: '0 1px 4px rgba(37,99,235,0.08)' }}
                >
                  {stack}
                </span>
              ))
            )}
          </div>
        </div>
        {/* Links placeholder */}
        <div className="flex flex-col items-start px-2 py-2">
          <span className="font-bold mb-2 flex items-center gap-2">
            <Link2 className="h-5 w-5" style={{ color: "#7B7575" }} />
            Links
          </span>
          <span className="flex gap-4 items-center">
            <span className="flex items-center gap-2">
              <a
                href={currentRepo}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Repository
              </a>
              <button
                className="bg-gray-100 hover:bg-gray-200 rounded-full p-1"
                title="Copy Repository Link"
                type="button"
                onClick={() => navigator.clipboard.writeText(currentRepo)}
              >
                <Copy className="h-4 w-4 text-gray-700" />
              </button>
            </span>
            <span className="flex items-center gap-2">
              <a
                href={currentFigma}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Figma
              </a>
              <button
                className="bg-gray-100 hover:bg-gray-200 rounded-full p-1"
                title="Copy Figma Link"
                type="button"
                onClick={() => navigator.clipboard.writeText(currentFigma)}
              >
                <Copy className="h-4 w-4 text-gray-700" />
              </button>
            </span>
          </span>
        </div>
        {/* Edit placeholder */}
        {editable && (
          <div className="col-span-1 md:col-span-1 flex w-full md:w-auto justify-center md:justify-end items-center px-2 py-2 mt-4 md:mt-0">
            <button
              className="bg-bolder rounded-full p-2 flex items-center justify-center w-full md:w-auto"
              title="Edit"
              onClick={() => setIsEditing(true)}
            >
              <SquarePen className="h-6 w-6 text-blue-700" />
            </button>
          </div>
        )}
      </div>
      {/* Modal for editing */}
      {editable && isEditing && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Edit Project Details</h2>
            <div className="mb-4">
              <label className="block font-semibold mb-1">Tech Stack</label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  className="border rounded px-2 py-1 w-full"
                  value={editTechStackInput}
                  onChange={(e) => setEditTechStackInput(e.target.value)}
                  placeholder="Add tech stack"
                />
                <button
                  className="bg-bolder text-white rounded-full p-2 flex items-center justify-center"
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
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {editTechStackArr.map((stack, idx) => (
                  <span
                    key={idx}
                    className="bg-bolder text-blue-700 px-3 py-1 rounded-full text-sm font-medium flex items-center"
                  >
                    {stack}
                    <button
                      className="ml-2 text-red-500 hover:text-red-700"
                      type="button"
                      onClick={() =>
                        setEditTechStackArr(
                          editTechStackArr.filter((_, i) => i !== idx),
                        )
                      }
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
            <div className="mb-4">
              <label className="block font-semibold mb-1">Repository URL</label>
              <input
                type="text"
                className="border rounded px-2 py-1 w-full"
                value={editRepo}
                onChange={(e) => setEditRepo(e.target.value)}
              />
            </div>
            <div className="mb-6">
              <label className="block font-semibold mb-1">Figma URL</label>
              <input
                type="text"
                className="border rounded px-2 py-1 w-full"
                value={editFigma}
                onChange={(e) => setEditFigma(e.target.value)}
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded bg-bolder text-white"
                onClick={() => {
                  setCurrentTechStack(editTechStackArr);
                  setCurrentRepo(editRepo);
                  setCurrentFigma(editFigma);
                  setIsEditing(false);
                }}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default BatchMetadata;
