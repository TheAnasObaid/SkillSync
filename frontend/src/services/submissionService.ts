import apiClient from "@/lib/apiClient";
import { getServerApi } from "@/lib/serverApi";
import { ISubmission, PublicSubmission } from "@/types";

// --- SERVER-SIDE FUNCTIONS ---

export const getMySubmissions = async (): Promise<ISubmission[]> => {
  try {
    const serverApi = await getServerApi();
    const response = await serverApi.get("/submissions/me");
    return response.data;
  } catch (error) {
    console.error("Service Error: getMySubmissions failed", error);
    return [];
  }
};

// --- CLIENT-SIDE FUNCTIONS ---

export const getPublicSubmissionsClient = async (
  challengeId: string
): Promise<PublicSubmission[]> => {
  try {
    // This uses the client-side apiClient
    const response = await apiClient.get(
      `/submissions/challenge/${challengeId}`
    );
    return response.data;
  } catch (error) {
    console.error(
      `Client Service Error: getPublicSubmissionsClient for challenge ${challengeId} failed`,
      error
    );
    return [];
  }
};

export const getSubmissionsForReviewClient = async (
  challengeId: string
): Promise<ISubmission[]> => {
  try {
    const response = await apiClient.get(
      `/submissions/challenge/${challengeId}/review`
    );
    return response.data;
  } catch (error) {
    console.error(
      `Client Service Error: getSubmissionsForReviewClient for challenge ${challengeId} failed`,
      error
    );
    return [];
  }
};
