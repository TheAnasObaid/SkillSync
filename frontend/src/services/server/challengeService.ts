import { getServerApi } from "@/lib/serverApi";
import { IChallenge } from "@/types";

// --- SERVER-SIDE FUNCTIONS ---

export const getAllChallenges = async (): Promise<IChallenge[]> => {
  try {
    const serverApi = await getServerApi();
    const response = await serverApi.get("/challenges");
    return response.data;
  } catch (error) {
    console.error("Service Error: getAllChallenges failed", error);
    return [];
  }
};

export const getChallengeById = async (
  id: string
): Promise<IChallenge | null> => {
  try {
    const serverApi = await getServerApi();
    const response = await serverApi.get(`/challenges/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Service Error: getChallengeById(${id}) failed`, error);
    return null;
  }
};

export const getMyChallenges = async (): Promise<IChallenge[]> => {
  try {
    const serverApi = await getServerApi();
    const response = await serverApi.get("/challenges/me");
    return response.data;
  } catch (error) {
    console.error("Service Error: getMyChallenges failed", error);
    return [];
  }
};
