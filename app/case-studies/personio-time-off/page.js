"use client";

import { Fustat } from "next/font/google";
import { useState } from "react";
import styles from "./page.module.css";

const fustat = Fustat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const TAKEN_ROWS = [
  {
    name: "Priya Nair",
    leaveType: "Vacation",
    duration: "5 days",
    from: "Jun 15, 2026",
    to: "Jun 19, 2026",
    flag: "🇮🇳",
    country: "India",
  },
  {
    name: "Chris Lee",
    leaveType: "Sick Leave",
    duration: "2 days",
    from: "Jul 2, 2026",
    to: "Jul 3, 2026",
    flag: "🇺🇸",
    country: "United States",
  },
  {
    name: "Ana Costa",
    leaveType: "Parental Leave",
    duration: "10 days",
    from: "May 1, 2026",
    to: "May 10, 2026",
    flag: "🇧🇷",
    country: "Brazil",
  },
  {
    name: "Carmen Ruiz",
    leaveType: "Vacation",
    duration: "3 days",
    from: "Jul 20, 2026",
    to: "Jul 22, 2026",
    flag: "🇪🇸",
    country: "Spain",
  },
  {
    name: "Avery Ng",
    leaveType: "Sick Leave",
    duration: "1 day",
    from: "Jul 8, 2026",
    to: "Jul 8, 2026",
    flag: "🇸🇬",
    country: "Singapore",
  },
  {
    name: "Carlos Silva",
    leaveType: "Vacation",
    duration: "4 days",
    from: "Jun 1, 2026",
    to: "Jun 4, 2026",
    flag: "🇧🇷",
    country: "Brazil",
  },
];

function getInitials(name) {
  return name
    .split(" ")
    .filter(Boolean)
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function Avatar({ name }) {
  return <div className={styles.avatar}>{getInitials(name)}</div>;
}

function capitalize(value) {
  if (!value) return value;
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function formatLifecycleStage(stage) {
  if (!stage) return stage;
  return stage
    .split("_")
    .map((word) => capitalize(word))
    .join(" ");
}

export default function Home() {
  const [statusCheck, setStatusCheck] = useState("idle"); // idle | loading | loaded | error
  const [statusResult, setStatusResult] = useState(null);

  async function handleCheckStatus() {
    setStatusCheck("loading");
    try {
      const res = await fetch("/api/employee-status");
      const data = await res.json();
      setStatusResult(data);
      setStatusCheck(data.sandboxError ? "error" : "loaded");
    } catch (err) {
      setStatusResult({ sandboxError: true, error: err.message });
      setStatusCheck("error");
    }
  }

  return (
    <div className={`${styles.page} ${fustat.className}`}>
      <div className={styles.attribution}>
        Prototype by Anupam Kalita — not an official Remote product.
      </div>

      <p className={styles.caseStudyIntro}>
        Case study: does Personio&apos;s EOR time-off actually have a gap? —
        short version: no, and here&apos;s the corrected finding, live.
      </p>

      <div className={styles.shell}>
        <aside className={styles.sidebar}>
          <div className={styles.logo}>
            <span className={styles.logoMark}>R</span>
            remote
          </div>

          <nav className={styles.nav}>
            <span className={styles.navItem}>Dashboard</span>
            <span className={styles.navItem}>Team</span>
            <span className={`${styles.navItem} ${styles.navItemActive}`}>
              Time off
            </span>
            <span className={styles.navItem}>Payroll</span>
          </nav>
        </aside>

        <main className={styles.main}>
          <div className={styles.topBar}>
            <div>
              <h1 className={styles.title}>Time off requests</h1>
              <p className={styles.subtitle}>Manage your team&apos;s time off</p>
            </div>
            <button className={styles.addButtonInert} type="button" disabled>
              Add time off
            </button>
          </div>

          <div className={styles.tabs}>
            <span className={`${styles.tab} ${styles.tabActive}`}>
              All pending requests
            </span>
            <span className={styles.tab}>Time off summary</span>
          </div>

          <p className={styles.contextLine}>
            GP employees sync from Personio into Remote. EOR employees work
            the other way — tracked in Remote first, with approvals
            surfacing in Personio&apos;s inbox. These two paths aren&apos;t
            connected in one view today. This row shows what a unified view
            could look like.
          </p>

          <div className={styles.toolbarInert}>
            <input
              className={styles.search}
              type="text"
              placeholder="Search"
              disabled
            />
            <button className={styles.filterButton} type="button" disabled>
              Filter
            </button>
          </div>

          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Requested by</th>
                  <th>Status</th>
                  <th>Leave type</th>
                  <th>Duration</th>
                  <th>Date from</th>
                  <th>Date to</th>
                  <th>Country</th>
                  <th>Notes</th>
                </tr>
              </thead>
              <tbody>
                {TAKEN_ROWS.map((row) => (
                  <tr key={row.name}>
                    <td>
                      <div className={styles.nameCell}>
                        <Avatar name={row.name} />
                        <span className={styles.name}>{row.name}</span>
                        <span className={styles.tag}>GP</span>
                      </div>
                    </td>
                    <td>
                      <span className={styles.statusCell}>
                        <span className={styles.dotTaken} />
                        Taken
                      </span>
                    </td>
                    <td>{row.leaveType}</td>
                    <td>{row.duration}</td>
                    <td>{row.from}</td>
                    <td>{row.to}</td>
                    <td>
                      <span className={styles.countryCell}>
                        <span className={styles.flag}>{row.flag}</span>
                        {row.country}
                      </span>
                    </td>
                    <td className={styles.notesCell}>—</td>
                  </tr>
                ))}

                <tr>
                  <td>
                    <div className={styles.nameCell}>
                      <Avatar name="Alex Morgan" />
                      <div>
                        <span className={styles.name}>Alex Morgan</span>
                        <p className={styles.viaPersonio}>via Personio</p>
                      </div>
                      <span className={styles.tag}>EOR</span>
                    </div>
                  </td>
                  <td>
                    <span className={styles.statusCell}>
                      <span
                        className={
                          statusCheck === "loaded"
                            ? statusResult?.employment?.status === "active"
                              ? styles.dotTaken
                              : styles.dotWarning
                            : statusCheck === "error"
                              ? styles.dotError
                              : styles.dotMuted
                        }
                      />
                      {statusCheck === "loaded"
                        ? capitalize(statusResult?.employment?.status)
                        : statusCheck === "error"
                          ? "Could not load"
                          : statusCheck === "loading"
                            ? "Checking…"
                            : "Not checked yet"}
                    </span>
                  </td>
                  <td>Vacation</td>
                  <td>4 days</td>
                  <td>Aug 14, 2026</td>
                  <td>Aug 17, 2026</td>
                  <td>
                    <span className={styles.countryCell}>
                      <span className={styles.flag}>🇺🇸</span>
                      United States
                    </span>
                  </td>
                  <td className={styles.notesCell}>
                    <p className={styles.sourceNote}>
                      Native EOR record — requested here directly, approval
                      routed to Personio Inbox.
                    </p>

                    {statusCheck === "loaded" && statusResult?.employment && (
                      <p className={styles.statusDetail}>
                        {formatLifecycleStage(
                          statusResult.employment.employment_lifecycle_stage
                        )}
                        {statusResult.employment.available_pto != null &&
                          ` · ${statusResult.employment.available_pto} days PTO available`}
                      </p>
                    )}

                    {statusCheck === "error" && (
                      <p className={styles.notesError}>
                        {statusResult?.status
                          ? `Remote returned ${statusResult.status}${
                              statusResult.statusText
                                ? ` (${statusResult.statusText})`
                                : ""
                            }.`
                          : statusResult?.error ||
                            "Could not reach Remote's sandbox."}
                      </p>
                    )}

                    <button
                      className={styles.syncButton}
                      onClick={handleCheckStatus}
                      disabled={statusCheck === "loading"}
                      type="button"
                    >
                      {statusCheck === "loading"
                        ? "Checking…"
                        : statusCheck === "idle"
                          ? "Refresh"
                          : "Refresh status"}
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className={styles.tableCaption}>
            Once synced, a record is used the same way as any other approved
            time off in Remote — it adjusts payroll automatically and appears
            in Team absences for managers, instead of being entered twice.
          </p>
        </main>
      </div>
    </div>
  );
}
