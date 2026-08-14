import { NextResponse } from "next/server";

// Personio-style sample spanning a weekend (Fri -> Mon) so the 'before' view
// exercises the same weekend-zero-hours case verified against normalize.js.
const PERSONIO_SAMPLE = {
  employee: {
    id: "PERSONIO-EMP-4471",
    email: "owner+employee-eor-usa-10001@mann-grimes-4zug6i.example.com",
    name: "Alex Morgan",
  },
  leave_type: "Vacation",
  start_date: "2026-08-14",
  end_date: "2026-08-17",
  status: "Approved",
};

export async function GET() {
  return NextResponse.json(PERSONIO_SAMPLE);
}
