const token = process.env.REMOTE_API_TOKEN;

if (!token) {
  console.error("REMOTE_API_TOKEN is not set in the environment.");
  process.exit(1);
}

// Remote-shaped payload, flat top-level fields (confirmed correct shape by Remote's docs).
// Date range moved further out (2027-03-01 to 2027-03-03) to avoid pre-seeded sandbox data.
const payload = {
  employment_id: "2f16636e-21fa-4126-bc59-ce17d8234c51",
  start_date: "2027-03-01",
  end_date: "2027-03-03",
  timeoff_days: [
    { date: "2027-03-01", hours: 8 },
    { date: "2027-03-02", hours: 8 },
    { date: "2027-03-03", hours: 8 },
  ],
  timeoff_type: "paid_time_off",
  timezone: "UTC",
  status: "approved",
  approver_id: "fd807051-f511-492d-a76e-1657682ab112",
  approved_at: new Date().toISOString(),
};

async function main() {
  const res = await fetch("https://gateway.remote-sandbox.com/v1/timeoff", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  console.log("Status:", res.status, res.statusText);
  const text = await res.text();
  console.log("Body:", text);
}

main().catch((err) => {
  console.error("Request failed:", err.message);
  process.exit(1);
});
