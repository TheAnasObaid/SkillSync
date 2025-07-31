import { getServerApi } from "@/lib/serverApi";
import apiClient from "@/lib/apiClient";
import { ISubmission, IUser, PlatformStats } from "@/types";

// --- SERVER-SIDE FUNCTIONS ---

export const getPlatformStats = async (): Promise<PlatformStats | null> => {
  try {
    const serverApi = await getServerApi();
    const response = await serverApi.get("/admin/stats");
    return response.data;
  } catch (error) {
    console.error("Service Error: getPlatformStats failed", error);
    return null;
  }
};

export const getAllUsers = async (): Promise<IUser[]> => {
  try {
    const serverApi = await getServerApi();
    const response = await serverApi.get("/admin/users");
    return response.data;
  } catch (error) {
    console.error("Service Error: getAllUsers failed", error);
    return [];
  }
};

export const getAllSubmissions = async (): Promise<ISubmission[]> => {
  try {
    const serverApi = await getServerApi();
    const response = await serverApi.get("/admin/submissions");
    return response.data;
  } catch (error) {
    console.error("Service Error: getAllSubmissions failed", error);
    return [];
  }
};

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
