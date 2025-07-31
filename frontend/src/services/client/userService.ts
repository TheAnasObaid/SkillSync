import apiClient from "@/lib/apiClient";
import { IUser } from "@/types";

/**
 * Fetches the profile of the currently logged-in user.
 * For use in CLIENT COMPONENTS (e.g., profile edit pages).
 * @returns The logged-in user's profile data or null.
 */
export const getMyProfileClient = async (): Promise<IUser | null> => {
  try {
    const response = await apiClient.get("/users/me"); // Uses the /me endpoint
    return response.data;
  } catch (error) {
    console.error("Client Service Error: getMyProfileClient failed", error);
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
    const response = await apiClient.get(`/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error(
      `Client Service Error: getPublicUserProfileClient for user ${userId} failed`,
      error
    );
    return null;
  }
};
