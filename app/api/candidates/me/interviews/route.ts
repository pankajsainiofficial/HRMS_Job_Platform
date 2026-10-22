import { getBackendUrl } from "@/lib/backend";

export async function GET(request: Request) {
  try {
    const response = await fetch(getBackendUrl("/api/candidates/me/interviews"), {
      headers: {
        Accept: "application/json",
        Cookie: request.headers.get("cookie") ?? "",
      },
      cache: "no-store",
      signal: AbortSignal.timeout(15_000),
    });
    return new Response(await response.text(), {
      status: response.status,
      headers: { "content-type": response.headers.get("content-type") ?? "application/json" },
    });
  } catch (error) {
    return Response.json(
      { success: false, message: error instanceof Error && error.name === "AbortError" ? "The interview calendar took too long to respond. Please reload it." : "The interview calendar service is temporarily unavailable. Your schedules have not been changed.", data: { interviews: [] } },
      { status: 502 },
    );
  }
}
