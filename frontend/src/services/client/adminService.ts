import apiClient from "@/lib/apiClient";
import { IUser } from "@/types";

// --- CLIENT-SIDE FUNCTIONS (for re-fetching data after an action) ---

export const getAllUsersClient = async (): Promise<IUser[]> => {
  try {
    const response = await apiClient.get("/admin/users");
    return response.data;
  } catch (error) {
    console.error("Client Service Error: getAllUsersClient failed", error);
    return [];
  }
};
