import { getServerApi } from "@/lib/serverApi";
import { ClientStats, DeveloperStats, IUser } from "@/types";

export const getMyDeveloperStats = async (): Promise<DeveloperStats | null> => {
  try {
    const serverApi = await getServerApi();
    const response = await serverApi.get("/users/me/stats/developer");
    return response.data;
  } catch (error) {
    console.error("Service Error: getMyDeveloperStats failed", error);
    return null;
  }
};

export const getMyClientStats = async (): Promise<ClientStats | null> => {
  try {
    const serverApi = await getServerApi();
    const response = await serverApi.get("/users/me/stats/client");
    return response.data;
  } catch (error) {
    console.error("Service Error: getMyClientStats failed", error);
    return null;
  }
};

/**
 * Fetches a user's public profile information.
 * @param userId The ID of the user to fetch.
 * @returns The user's public profile data or null if not found.
 */
export const getPublicUserProfile = async (
  userId: string
): Promise<IUser | null> => {
  try {
    const serverApi = await getServerApi();
    const response = await serverApi.get(`/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error(
      `Service Error: getPublicUserProfile for user ${userId} failed`,
      error
    );
    return null;
  }
};

/**
 * Fetches a public user profile by ID.
 * For use in CLIENT COMPONENTS.
 * @param userId The ID of the user to fetch.
 * @returns The user's public profile data or null.
 */
export const getPublicUserProfileClient = async (
  userId: string
): Promise<IUser | null> => {
  try {
    const serverApi = await getServerApi();
    const response = await serverApi.get(`/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error(
      `Client Service Error: getPublicUserProfileClient for user ${userId} failed`,
      error
    );
    return null;
  }
};

/**
 * @desc    Fetches the full profile of the currently authenticated user.
 * @note    This is a SERVER-SIDE function.
 * @returns {Promise<IUser | null>} The full user object or null if not found/error.
 */
export const getMyProfileServer = async (): Promise<IUser | null> => {
  try {
    const serverApi = await getServerApi();
    const response = await serverApi.get("/users/me");
    return response.data;
  } catch (error) {
    console.error("Service Error: getMyProfileServer failed", error);
    return null;
  }
};
