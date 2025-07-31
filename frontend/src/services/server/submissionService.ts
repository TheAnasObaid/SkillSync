import { getServerApi } from "@/lib/serverApi";
import { ISubmission } from "@/types";

export const getPublicSubmissionsServer = async (
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
      `Service Error: getPublicSubmissionsServer for challenge ${challengeId} failed`,
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
