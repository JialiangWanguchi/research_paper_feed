import { headers } from "next/headers";

export async function getBaseUrl() {
  const headerStore = await headers();
  const forwardedHost = headerStore.get("x-forwarded-host");
  const host = forwardedHost ?? headerStore.get("host");
  const forwardedProto = headerStore.get("x-forwarded-proto");
  const protocol = forwardedProto ?? (host?.includes("localhost") ? "http" : "https");

  if (host) {
    return `${protocol}://${host}`;
  }

  return process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
}

