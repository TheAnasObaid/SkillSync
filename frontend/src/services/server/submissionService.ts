import { getServerApi } from "@/lib/serverApi";
import { ISubmission } from "@/types";

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
