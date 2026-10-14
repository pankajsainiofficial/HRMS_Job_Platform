const configuredBackendUrl = process.env.BACKEND_URL?.trim();

if (!configuredBackendUrl) {
  throw new Error("BACKEND_URL must be configured");
}

const BACKEND_URL = configuredBackendUrl.replace(/\/+$/, "");

export function getBackendUrl(path: string) {
  return new URL(path.replace(/^\/+/, ""), `${BACKEND_URL}/`);
}

export function getBackendWebSocketUrl() {
  const url = new URL(BACKEND_URL);
  url.protocol = url.protocol === "https:" ? "wss:" : "ws:";
  return url.origin;
}
