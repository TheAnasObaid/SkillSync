import axios from "axios";
import { cookies } from "next/headers";

const createServerApi = async () => {
  const cookieStore = await cookies();
  const authToken = cookieStore.get("authToken")?.value;

  const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (authToken) {
    api.defaults.headers.common["Authorization"] = `Bearer ${authToken}`;
  }

  return api;
};

export const getServerApi = () => {
  return createServerApi();
};
