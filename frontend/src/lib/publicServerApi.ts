// ===== File: frontend\src/lib/publicServerApi.ts =====
// This client makes public API calls from the SERVER, without using cookies.
// This allows the pages that use it to be rendered statically.

import axios from "axios";

const publicServerApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default publicServerApi;
