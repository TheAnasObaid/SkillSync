import { cookies } from "next/headers";

type FetchOptions = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  headers?: HeadersInit;
  body?: any;
  tags?: string[];
  cache?: RequestCache;
};

async function fetchApi(path: string, options: FetchOptions = {}) {
  const {
    method = "GET",
    headers = {},
    body,
    tags,
    cache = "default",
  } = options;

  const defaultHeaders: HeadersInit = {
    "Content-Type": "application/json",
    ...headers,
  };

  // Handle Authentication Token
  // On the server, we use `next/headers` to get the cookie.
  // On the client, this block is skipped, and we rely on the apiClient interceptor.
  if (typeof window === "undefined") {
    const cookieStore = await cookies();
    const authToken = cookieStore.get("authToken")?.value;
    if (authToken) {
      (defaultHeaders as Record<string, string>)[
        "Authorization"
      ] = `Bearer ${authToken}`;
    }
  }

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${path}`, {
      method,
      headers: defaultHeaders,
      body: body ? JSON.stringify(body) : undefined,
      cache, // Next.js cache control
      next: {
        tags, // Next.js tag-based revalidation
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "API request failed");
    }

    // Handle responses with no content
    if (response.status === 204) {
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error(`API Error fetching ${path}:`, error);
    // Re-throw the error to be caught by the calling component or function
    throw error;
  }
}

// Convenience methods for different HTTP verbs
export const api = {
  get: (path: string, options?: Omit<FetchOptions, "method" | "body">) =>
    fetchApi(path, { ...options, method: "GET" }),
  post: (
    path: string,
    body: any,
    options?: Omit<FetchOptions, "method" | "body">
  ) => fetchApi(path, { ...options, method: "POST", body }),
  put: (
    path: string,
    body: any,
    options?: Omit<FetchOptions, "method" | "body">
  ) => fetchApi(path, { ...options, method: "PUT", body }),
  patch: (
    path: string,
    body: any,
    options?: Omit<FetchOptions, "method" | "body">
  ) => fetchApi(path, { ...options, method: "PATCH", body }),
  delete: (path: string, options?: Omit<FetchOptions, "method" | "body">) =>
    fetchApi(path, { ...options, method: "DELETE" }),
};
