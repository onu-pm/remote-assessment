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

export default function Home() {
  const [syncState, setSyncState] = useState("idle"); // idle | loading | success | error
  const [previewSynced, setPreviewSynced] = useState(false);

  async function handleSync() {
    setSyncState("loading");
    setPreviewSynced(false);
    try {
      const res = await fetch("/api/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      const data = await res.json();
      setSyncState(data.sandboxError ? "error" : "success");
    } catch {
      setSyncState("error");
    }
  }

  const showingTakenStyle = syncState === "success" || previewSynced;

  return (
    <div className={`${styles.page} ${fustat.className}`}>
      <div className={styles.attribution}>
        Prototype by Anupam Kalita — not an official Remote product.
      </div>

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
            BambooHR already syncs automatically for EOR employees — Personio
            doesn&apos;t yet. The row below shows that gap.
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
                          showingTakenStyle
                            ? styles.dotTaken
                            : syncState === "error"
                              ? styles.dotError
                              : styles.dotWarning
                        }
                      />
                      {previewSynced
                        ? "Taken (preview)"
                        : syncState === "success"
                          ? "Taken"
                          : syncState === "error"
                            ? "Sync failed"
                            : "Not synced"}
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
                    {previewSynced ? (
                      <span className={styles.notesPreview}>
                        Preview only — the live sync above still returned a
                        sandbox error.
                      </span>
                    ) : syncState === "success" ? (
                      "—"
                    ) : syncState === "error" ? (
                      <div className={styles.errorStack}>
                        <span className={styles.notesError}>
                          Sync failed — Remote&apos;s sandbox returned an
                          error here.
                        </span>
                        <button
                          className={styles.previewLink}
                          type="button"
                          onClick={() => setPreviewSynced(true)}
                        >
                          See what this looks like once synced →
                        </button>
                      </div>
                    ) : (
                      <button
                        className={styles.syncButton}
                        onClick={handleSync}
                        disabled={syncState === "loading"}
                        type="button"
                      >
                        {syncState === "loading"
                          ? "Syncing…"
                          : "Sync from Personio"}
                      </button>
                    )}
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
