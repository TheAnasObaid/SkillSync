import axios from "axios";
import { cookies } from "next/headers";

// This function should ONLY ever be imported within Server Components.
const createServerApi = async () => {
  const cookieStore = await cookies();
  const authToken = cookieStore.get("authToken")?.value;

  const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
      "Content-Type": "application/json",
    },
  });

  // We can set the auth header directly since this instance is created
  // for each unique server request.
  if (authToken) {
    api.defaults.headers.common["Authorization"] = `Bearer ${authToken}`;
  }

  return api;
};

// We export a function that CREATES the client.
// This ensures that `cookies()` is called within the context of a server-side request.
export const getServerApi = () => {
  return createServerApi();
};
