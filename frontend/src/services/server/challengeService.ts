// ===== File: frontend\src/services/server/challengeService.ts =====
import publicServerApi from "@/lib/publicServerApi";
import { getServerApi } from "@/lib/serverApi"; // Used for authenticated server calls
import { IChallenge } from "@/types";

// FIX: Explicitly tell Next.js that this entire route segment is dynamic.
// This is the modern, correct way to handle dynamic pages and will remove the build warning.
export const dynamic = "force-dynamic";

export const getAllChallenges = async (): Promise<IChallenge[]> => {
  try {
    // FIX: Use the publicServerApiClient for fetching public challenges.
    // This client does not interact with 'cookies()', allowing this page to be static.
    const response = await publicServerApi.get("/challenges");
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
    // getChallengeById might also be called from public pages,
    // so it should ideally use publicServerApiClient if the data is public.
    // If it *can* sometimes return more detailed data for authenticated users,
    // then dynamic rendering might be acceptable, but typically, public by ID is static.
    // For consistency with getAllChallenges, we'll switch it to publicClient for now.
    const response = await publicServerApi.get(`/challenges/${id}`); // FIX
    return response.data;
  } catch (error) {
    console.error(`Service Error: getChallengeById(${id}) failed`, error);
    return null;
  }
};

export const getMyChallenges = async (): Promise<IChallenge[]> => {
  try {
    // This is for "my" challenges, so it's user-specific and needs authentication.
    // getServerApi() is correctly used here and will force dynamic rendering.
    const serverApi = await getServerApi();
    const response = await serverApi.get("/challenges/me");
    return response.data;
  } catch (error) {
    console.error("Service Error: getMyChallenges failed", error);
    return [];
  }
};
