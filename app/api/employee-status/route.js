import { NextResponse } from "next/server";

// Alex Morgan's real employment id, verified earlier against list-employees.js output.
const DEFAULT_EMPLOYMENT_ID = "2f16636e-21fa-4126-bc59-ce17d8234c51";

export async function GET(request) {
  const token = process.env.REMOTE_API_TOKEN;
  const apiBase = process.env.REMOTE_API_BASE;

  if (!token || !apiBase) {
    return NextResponse.json(
      { error: "Server is missing REMOTE_API_TOKEN or REMOTE_API_BASE." },
      { status: 500 }
    );
  }

  const { searchParams } = new URL(request.url);
  const employmentId = searchParams.get("employment_id") || DEFAULT_EMPLOYMENT_ID;

  let remoteRes;
  let bodyText;
  try {
    remoteRes = await fetch(`${apiBase}/v1/employments/${employmentId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    bodyText = await remoteRes.text();
  } catch (err) {
    return NextResponse.json(
      {
        sandboxError: true,
        error: `Could not reach Remote sandbox: ${err.message}`,
      },
      { status: 502 }
    );
  }

  let body;
  try {
    body = JSON.parse(bodyText);
  } catch {
    body = bodyText;
  }

  if (!remoteRes.ok) {
    return NextResponse.json({
      sandboxError: true,
      status: remoteRes.status,
      statusText: remoteRes.statusText,
      body,
    });
  }

  const employment = body?.data?.employment;

  return NextResponse.json({
    sandboxError: false,
    status: remoteRes.status,
    employment: employment
      ? {
          id: employment.id,
          full_name: employment.full_name,
          status: employment.status,
          employment_lifecycle_stage: employment.employment_lifecycle_stage,
          employment_model: employment.employment_model,
          available_pto: employment.contract_details?.available_pto ?? null,
          updated_at: employment.updated_at,
        }
      : null,
  });
}
