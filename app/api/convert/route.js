import { NextResponse } from "next/server";
import { convertPersonioToRemote } from "@/lib/timeoff";

// POST body: a Personio-style record, e.g.
// {
//   "employee": { "id": "...", "email": "...", "name": "..." },
//   "leave_type": "Vacation",
//   "start_date": "2026-08-14",
//   "end_date": "2026-08-17",
//   "status": "Approved",
//   "employment_id": "<optional: real Remote employment id, resolved separately at send-time if omitted>"
// }
export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Request body must be valid JSON." }, { status: 400 });
  }

  const { start_date, end_date, leave_type, status, employment_id } = body || {};

  if (!start_date || !end_date || !leave_type || !status) {
    return NextResponse.json(
      { error: "Missing required fields: start_date, end_date, leave_type, status." },
      { status: 400 }
    );
  }

  const remoteShaped = convertPersonioToRemote(body, employment_id || null);

  return NextResponse.json({
    personio: body,
    remote: remoteShaped,
  });
}
