import axios from "axios";

export function createApiClient(baseURL: string) {
  return axios.create({
    baseURL,
    timeout: 10000,
  });
}

export function createHistoryApi(baseURL: string) {
  return axios.create({
    baseURL,
    timeout: 10000,
    // If the history service supports cookie-backed authentication, send its
    // session cookie. It must still enforce authorization server-side.
    withCredentials: true,
  });
}

export const api = createApiClient(process.env.NEXT_PUBLIC_API_URL ?? "");
export const historyApi = createHistoryApi(
  process.env.NEXT_PUBLIC_API_HISTORY_URL ?? "",
);
