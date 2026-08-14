const token = process.env.REMOTE_API_TOKEN;

if (!token) {
  console.error("REMOTE_API_TOKEN is not set in the environment.");
  process.exit(1);
}

async function main() {
  const res = await fetch(
    "https://gateway.remote-sandbox.com/v1/company-managers?company_id=5f4135fe-b3a1-4f7c-87a4-0302ea56dae5",
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  console.log("Status:", res.status, res.statusText);
  const text = await res.text();
  console.log("Body:", text);
}

main().catch((err) => {
  console.error("Request failed:", err.message);
  process.exit(1);
});
