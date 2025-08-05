// ===== File: frontend\src\services\server\submissionService.ts =====
import { getServerApi } from "@/lib/serverApi";
import { ISubmission } from "@/types";

/**
 * @desc    Fetches a single submission by its ID, populating developer and challenge info.
 * @note    This is a SERVER-SIDE function.
 * @param   {string} submissionId - The ID of the submission to fetch.
 * @returns {Promise<ISubmission | null>} A fully populated submission object.
 */
export const getSubmissionDetails = async (
  submissionId: string
): Promise<ISubmission | null> => {
  try {
    const serverApi = await getServerApi();
    // This new endpoint will need to be created on the backend.
    const response = await serverApi.get(
      `/submissions/${submissionId}/details`
    );
    return response.data;
  } catch (error) {
    console.error(
      `Service Error: getSubmissionDetails for submission ${submissionId} failed`,
      error
    );
    return null;
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
