import { refreshAccessToken } from "./refresh";
import { cookies } from "next/headers";

export async function apiFetch(
  input: RequestInfo | URL,
  init: RequestInit = {},
) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const headers = new Headers(init.headers);
  if (accessToken) headers.set("Authorization", `bearer ${accessToken}`);
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/${input}`;
  const response = await fetch(apiUrl, {
    headers,
    credentials: "include",
  });

  console.log(response);
  if (response.status !== 401 && response.status !== 403) {
    return response;
  }

  const newAccessToken = await refreshAccessToken();

  if (!newAccessToken) {
    return response;
  }

  const retryHeaders = new Headers(init.headers);

  retryHeaders.set("Authorization", `Bearer ${newAccessToken}`);

  return fetch(apiUrl, {
    ...init,
    headers: retryHeaders,
    credentials: "include",
  });
}
