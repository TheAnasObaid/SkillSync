import apiClient from "@/lib/apiClient";
import { ISubmission } from "@/types";

export const getISubmissonsClient = async (
  challengeId: string
): Promise<ISubmission[]> => {
  try {
    const response = await apiClient.get(
      `/submissions/challenge/${challengeId}`
    );
    return response.data;
  } catch (error) {
    console.error(
      `Client Service Error: getISubmissonsClient for challenge ${challengeId} failed`,
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
