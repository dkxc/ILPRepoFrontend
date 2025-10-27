import { useQuery } from "@tanstack/react-query";
import type { ApiBatch } from "../../types/Batch.types";
import type { ApiSession } from "../../types/Session.types";
import type { ApiTraineeDocument } from "../../types/TraineeDocument.types";

const fetchProfile = async () => {
  const res = await fetch("/api/profile");
  if (!res.ok) throw new Error("Network response was not ok for profile");
  return res.json();
};

const fetchProject = async (projectId: number) => {
  const res = await fetch(`/api/project/${projectId}`);
  if (!res.ok) throw new Error("Network response was not ok for project");
  return res.json();
};

const fetchBatch = async (batchId: number) => {
  const res = await fetch(`/api/batch/${batchId}`);
  if (!res.ok) throw new Error("Network response was not ok for batch");
  return res.json();
};

const fetchDocuments = async () => {
  const res = await fetch("/api/documents");
  if (!res.ok) throw new Error("Network response was not ok for documents");
  return res.json();
};

const fetchSessions = async (batchId: number) => {
  const res = await fetch(`/api/batch/${batchId}/sessions`);
  if (!res.ok) throw new Error("Network response was not ok for sessions");
  return res.json();
};

const fetchScores = async () => {
  const res = await fetch("/api/scores");
  if (!res.ok) throw new Error("Network response was not ok for scores");
  return res.json();
};

export function useDashboardData() {
  const profileQuery = useQuery({
    queryKey: ["profile"],
    queryFn: fetchProfile,
  });

  const { projectId, batchId } = profileQuery.data || {};

  // the following queries are dependent on the profile query.
  // they will only run when `projectId` and `batchId` are available.
  const projectQuery = useQuery({
    queryKey: ["project", projectId],
    queryFn: () => fetchProject(projectId),
    enabled: !!projectId,
  });

  const batchQuery = useQuery({
    queryKey: ["batch", batchId],
    queryFn: () => fetchBatch(batchId!),
    enabled: !!batchId,
    select: (batchData: ApiBatch) => ({
      ...batchData,
      startDate: new Date(batchData.startDate),
      endDate: new Date(batchData.endDate),
    }),
  });

  const documentsQuery = useQuery({
    queryKey: ["documents"],
    queryFn: fetchDocuments,
    select: (data) =>
      data.map((doc: ApiTraineeDocument) => ({
        ...doc,
        uploadDate: new Date(doc.uploadDate),
      })),
  });

  const sessionsQuery = useQuery({
    queryKey: ["sessions", batchId],
    queryFn: () => fetchSessions(batchId!),
    enabled: !!batchId,
    select: (sessionsData) =>
      sessionsData.map((session: ApiSession) => ({
        ...session,
        date: new Date(session.date),
      })),
  });

  const scoresQuery = useQuery({
    queryKey: ["scores"],
    queryFn: fetchScores,
  });

  return {
    profileQuery,
    projectQuery,
    batchQuery,
    sessionsQuery,
    documentsQuery,
    scoresQuery,
  };
}
