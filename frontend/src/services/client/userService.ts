import apiClient from "@/lib/apiClient";
import { IUser } from "@/types";

// --- CLIENT-SIDE FUNCTIONS ---

export const getMyProfileClient = async (): Promise<IUser | null> => {
  try {
    const response = await apiClient.get("/users/me");
    return response.data;
  } catch (error) {
    console.error("Client Service Error: getMyProfileClient failed", error);
    return null;
  }
};
