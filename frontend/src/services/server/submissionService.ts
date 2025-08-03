import { getServerApi } from "@/lib/serverApi";
import { ISubmission } from "@/types";

export const getISubmissonsServer = async (
  challengeId: string
): Promise<ISubmission[]> => {
  try {
    const serverApi = await getServerApi();
    const response = await serverApi.get(
      `/submissions/challenge/${challengeId}`
    );
    return response.data;
  } catch (error) {
    console.error(
      `Service Error: getISubmissonsServer for challenge ${challengeId} failed`,
      error
    );
    return [];
  }
};

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

/**
 * @desc    Fetches all submissions for a specific challenge for client review.
 * @note    This is a SERVER-SIDE function.
 * @param   {string} challengeId - The ID of the challenge.
 * @returns {Promise<ISubmission[]>} An array of submission objects.
 */
export const getSubmissionsForReview = async (
  challengeId: string
): Promise<ISubmission[]> => {
  try {
    const serverApi = await getServerApi();
    const response = await serverApi.get(
      `/submissions/challenge/${challengeId}/review`
    );
    return response.data;
  } catch (error) {
    console.error(
      `Service Error: getSubmissionsForReview for challenge ${challengeId} failed`,
      error
    );
    return [];
  }
};
