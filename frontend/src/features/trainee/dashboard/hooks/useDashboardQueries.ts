import { useQuery } from "@tanstack/react-query";
import type { ApiBatch, Batch } from "../../types/Batch.types";
import type { ApiSession, Session } from "../../types/Session.types";
import type {
  TraineeDocument,
  ApiTraineeDocument,
} from "../../types/TraineeDocument.types";
import type { ProfileData } from "@features/trainee/types/Profile.types";
import type { Project } from "@features/trainee/types/Project.types";
import type { Scores } from "@features/trainee/types/scores/Score.types";

export function useDashboardData() {
  const profileQuery = useQuery<ProfileData>({
    queryKey: ["/api/profile"],
  });

  const projectId = profileQuery.data?.projectId;
  const batchId = profileQuery.data?.batchId;

  // the following queries are dependent on the profile query.
  // they will only run when `projectId` and `batchId` are available.
  const projectQuery = useQuery<Project>({
    queryKey: [`/api/project/${projectId}`],
    enabled: !!projectId,
  });

  const batchQuery = useQuery<ApiBatch, Error, Batch>({
    queryKey: [`/api/batch/${batchId}`],
    enabled: !!batchId,
    select: (batchData) => ({
      ...batchData,
      startDate: new Date(batchData.startDate),
      endDate: new Date(batchData.endDate),
    }),
  });

  const documentsQuery = useQuery<
    ApiTraineeDocument[],
    Error,
    TraineeDocument[]
  >({
    queryKey: ["/api/documents"],
    select: (data) =>
      data.map((doc) => ({
        ...doc,
        uploadDate: new Date(doc.uploadDate),
      })),
  });

  const sessionsQuery = useQuery<ApiSession[], Error, Session[]>({
    queryKey: [`/api/batch/${batchId}/sessions`],
    enabled: !!batchId,
    select: (sessionsData: ApiSession[]) =>
      sessionsData.map((session: ApiSession) => ({
        ...session,
        date: new Date(session.date),
      })),
  });

  const scoresQuery = useQuery<Scores>({
    queryKey: ["/api/scores"],
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
