import { getBackendUrl } from "@/lib/backend";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const response = await fetch(getBackendUrl("/api/candidates/reset-password"), {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      cache: "no-store",
    });
    const data = await response.json();

    return Response.json(data, { status: response.status });
  } catch {
    return Response.json(
      {
        success: false,
        message: "Unable to reset candidate password",
      },
      { status: 502 },
    );
  }
}
