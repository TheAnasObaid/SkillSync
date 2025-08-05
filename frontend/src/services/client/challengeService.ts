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
