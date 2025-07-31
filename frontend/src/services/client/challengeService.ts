import apiClient from "@/lib/apiClient";
import { IChallenge } from "@/types";

export const getChallengeById = async (
  id: string
): Promise<IChallenge | null> => {
  try {
    const response = await apiClient.get(`/challenges/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Service Error: getChallengeById(${id}) failed`, error);
    return null;
  }
};

/**
 * Fetches a single public challenge by its ID.
 * This is for use in CLIENT COMPONENTS.
 * @param id The ID of the challenge to fetch.
 * @returns The challenge data or null if not found.
 */
export const getChallengeByIdClient = async (
  id: string
): Promise<IChallenge | null> => {
  try {
    const response = await apiClient.get(`/challenges/${id}`);
    return response.data;
  } catch (error) {
    console.error(
      `Client Service Error: getChallengeByIdClient(${id}) failed`,
      error
    );
    return null;
  }
};
