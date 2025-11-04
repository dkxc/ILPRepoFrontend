import { useQuery } from "@tanstack/react-query";
import type { ApiBatch } from "../../types/Batch.types";
import type { ApiSession } from "../../types/Session.types";
import type { ApiTraineeDocument } from "../../types/TraineeDocument.types";
import type { ProfileData } from "@features/trainee/types/Profile.types";
import type { Project } from "@features/trainee/types/Project.types";
import type { Scores } from "@features/trainee/types/scores/Score.types";
import ApiService from "../../../../services/apiService";

interface DashboardApiResponse {
  profile: ProfileData;
  project: Project;
  batch: ApiBatch;
  scores: Scores;
  sessions: ApiSession[];
  documents: ApiTraineeDocument[];
}

export function useDashboardData() {
  const { data, isLoading, isError, error } = useQuery<DashboardApiResponse>({
    queryKey: ["dashboardData"],
    queryFn: () => ApiService.get("/profile"),
  });

  // Transform the single query's data into the structure expected by the components
  const profileData = {
    data: data?.profile,
    isLoading,
    isError,
    error,
  };

  const projectData = {
    data: data?.project,
    isLoading,
    isError,
    error,
  };

  const batchData = {
    data: data?.batch
      ? {
          ...data.batch,
          startDate: new Date(data.batch.startDate),
          endDate: new Date(data.batch.endDate),
        }
      : undefined,
    isLoading,
    isError,
    error,
  };

  const sessionsData = {
    data: data?.sessions?.map((session) => ({
      ...session,
      date: new Date(session.date),
    })),
    isLoading,
    isError,
    error,
  };

  const documentsData = {
    data: data?.documents?.map((doc) => ({
      ...doc,
      uploadDate: new Date(doc.uploadDate),
    })),
    isLoading,
    isError,
    error,
  };

  const scoresData = {
    data: data?.scores,
    isLoading,
    isError,
    error,
  };

  return {
    profileQuery: profileData,
    projectQuery: projectData,
    batchQuery: batchData,
    sessionsQuery: sessionsData,
    documentsQuery: documentsData,
    scoresQuery: scoresData,
  };
}
