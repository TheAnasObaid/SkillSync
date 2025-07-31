import { getServerApi } from "@/lib/serverApi";
import apiClient from "@/lib/apiClient";
import { ClientStats, DeveloperStats, IUser } from "@/types";

// --- SERVER-SIDE FUNCTIONS ---

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
