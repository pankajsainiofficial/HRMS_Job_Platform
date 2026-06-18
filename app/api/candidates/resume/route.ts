const BACKEND_URL = "http://localhost:4000/api/candidates/resume";

export async function POST(request: Request) {
  try {
    const body = await request.formData();

    const response = await fetch(BACKEND_URL, {
      method: "POST",
      headers: {
        Accept: "application/json",
        Cookie: request.headers.get("cookie") ?? "",
      },
      body,
      cache: "no-store",
    });

    const data = await response.json();

    return Response.json(data, {
      status: response.status,
    });
  } catch {
    return Response.json(
      {
        success: false,
        message: "Unable to upload resume",
      },
      { status: 502 },
    );
  }
}
