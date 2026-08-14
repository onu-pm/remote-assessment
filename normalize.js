// Step 1: real employee record from the previously fetched list (type === 'employee')
const employee = {
  id: "2f16636e-21fa-4126-bc59-ce17d8234c51",
  full_name: "Alex Morgan",
  type: "employee",
  country: { code: "USA", name: "United States" },
};

// Step 2: sample time-off record shaped like it would come from Personio
const personioSample = {
  employee: {
    id: "PERSONIO-EMP-4471",
    email: employee.login_email || "owner+employee-eor-usa-10001@mann-grimes-4zug6i.example.com",
    name: employee.full_name,
  },
  leave_type: "Vacation",
  start_date: "2026-08-14",
  end_date: "2026-08-17",
  status: "Approved",
};

// Step 3: convert Personio shape -> Remote Time Off API shape
const LEAVE_TYPE_MAP = {
  Vacation: "paid_time_off",
};

const STATUS_MAP = {
  Approved: "approved",
};

function isWeekend(date) {
  const day = date.getUTCDay();
  return day === 0 || day === 6;
}

function toRemoteTimeOff(sample, employmentId) {
  const start = new Date(`${sample.start_date}T00:00:00Z`);
  const end = new Date(`${sample.end_date}T00:00:00Z`);

  const timeoff_days = [];
  for (let d = new Date(start); d <= end; d.setUTCDate(d.getUTCDate() + 1)) {
    const dateStr = d.toISOString().slice(0, 10);
    timeoff_days.push({
      date: dateStr,
      hours: isWeekend(d) ? 0 : 8,
    });
  }

  return {
    employment_id: employmentId,
    start_date: sample.start_date,
    end_date: sample.end_date,
    timeoff_days,
    timeoff_type: LEAVE_TYPE_MAP[sample.leave_type] || sample.leave_type,
    timezone: "UTC",
    status: STATUS_MAP[sample.status] || sample.status,
  };
}

const remoteShaped = toRemoteTimeOff(personioSample, employee.id);

console.log("=== Personio-style raw sample ===");
console.log(JSON.stringify(personioSample, null, 2));

console.log("\n=== Converted Remote-shaped result ===");
console.log(JSON.stringify(remoteShaped, null, 2));
