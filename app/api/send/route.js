import { NextResponse } from "next/server";
import { buildTimeoffDays } from "@/lib/timeoff";

const DEFAULT_START_DATE = "2027-03-01";
const DEFAULT_END_DATE = "2027-03-03";

async function findEmployee(apiBase, token, companyId) {
  const res = await fetch(`${apiBase}/v1/employments?company_id=${companyId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch employments (status ${res.status})`);
  }
  const data = await res.json();
  const employments = data?.data?.employments || [];
  return employments.find(
    (e) => e.type === "employee" && e.employment_model === "eor" && e.status === "active"
  );
}

async function findApprover(apiBase, token, companyId) {
  const res = await fetch(`${apiBase}/v1/company-managers?company_id=${companyId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch company managers (status ${res.status})`);
  }
  const data = await res.json();
  const managers = data?.data?.company_managers || [];
  return managers[0];
}

export async function POST(request) {
  const token = process.env.REMOTE_API_TOKEN;
  const apiBase = process.env.REMOTE_API_BASE;
  const companyId = process.env.REMOTE_COMPANY_ID;

  if (!token || !apiBase || !companyId) {
    return NextResponse.json(
      { error: "Server is missing REMOTE_API_TOKEN, REMOTE_API_BASE, or REMOTE_COMPANY_ID." },
      { status: 500 }
    );
  }

  let body = {};
  try {
    body = await request.json();
  } catch {
    // no body provided is fine, fall back to defaults below
  }

  const startDate = body.start_date || DEFAULT_START_DATE;
  const endDate = body.end_date || DEFAULT_END_DATE;

  let employmentId = body.employment_id;
  let approverId = body.approver_id;

  try {
    if (!employmentId) {
      const employee = await findEmployee(apiBase, token, companyId);
      if (!employee) {
        return NextResponse.json(
          { error: "No active eor/employee record found to attach the time-off request to." },
          { status: 404 }
        );
      }
      employmentId = employee.id;
    }

    if (!approverId) {
      const approver = await findApprover(apiBase, token, companyId);
      if (!approver) {
        return NextResponse.json(
          { error: "No company manager found to use as approver." },
          { status: 404 }
        );
      }
      approverId = approver.user_id;
    }
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 502 });
  }

  const payload = {
    employment_id: employmentId,
    start_date: startDate,
    end_date: endDate,
    timeoff_days: buildTimeoffDays(startDate, endDate),
    timeoff_type: "paid_time_off",
    timezone: "UTC",
    status: "approved",
    approver_id: approverId,
    approved_at: new Date().toISOString(),
  };

  let remoteRes;
  let remoteBodyText;
  try {
    remoteRes = await fetch(`${apiBase}/v1/timeoff`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    remoteBodyText = await remoteRes.text();
  } catch (err) {
    // network-level failure talking to Remote's sandbox, not our route crashing
    return NextResponse.json(
      { sandboxError: true, error: `Could not reach Remote sandbox: ${err.message}`, payloadSent: payload },
      { status: 502 }
    );
  }

  let remoteBody;
  try {
    remoteBody = JSON.parse(remoteBodyText);
  } catch {
    remoteBody = remoteBodyText;
  }

  if (!remoteRes.ok) {
    // Pass the real sandbox failure through instead of surfacing it as our own route crashing.
    return NextResponse.json({
      sandboxError: true,
      status: remoteRes.status,
      statusText: remoteRes.statusText,
      body: remoteBody,
      payloadSent: payload,
    });
  }

  return NextResponse.json({
    sandboxError: false,
    status: remoteRes.status,
    body: remoteBody,
    payloadSent: payload,
  });
}
