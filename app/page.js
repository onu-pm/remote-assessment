"use client";

import { Fustat } from "next/font/google";
import { useEffect, useState } from "react";
import styles from "./page.module.css";

const fustat = Fustat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export default function Home() {
  const [personio, setPersonio] = useState(null);
  const [remote, setRemote] = useState(null);
  const [loadError, setLoadError] = useState(null);

  const [sending, setSending] = useState(false);
  const [sendResult, setSendResult] = useState(null);
  const [sendError, setSendError] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const sampleRes = await fetch("/api/sample");
        const sample = await sampleRes.json();
        setPersonio(sample);

        const convertRes = await fetch("/api/convert", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(sample),
        });
        const converted = await convertRes.json();
        setRemote(converted.remote);
      } catch (err) {
        setLoadError(err.message);
      }
    }
    load();
  }, []);

  async function handleSend() {
    setSending(true);
    setSendResult(null);
    setSendError(null);
    try {
      const res = await fetch("/api/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      const data = await res.json();
      setSendResult(data);
    } catch (err) {
      setSendError(err.message);
    } finally {
      setSending(false);
    }
  }

  return (
    <div className={`${styles.page} ${fustat.className}`}>
      <div className={styles.banner}>
        Prototype by Anupam Kalita — not an official Remote product.
      </div>

      <main className={styles.main}>
        <h1 className={styles.title}>Personio → Remote time-off sync</h1>
        <p className={styles.subtitle}>
          A working demo of converting a Personio-style time-off record into
          the shape Remote&apos;s Time Off API expects, then submitting it to
          Remote&apos;s sandbox.
        </p>

        <section className={styles.grid}>
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>What Personio would send</h2>
            <pre className={styles.pre}>
              {personio ? JSON.stringify(personio, null, 2) : "Loading…"}
            </pre>
          </div>

          <div className={styles.card}>
            <h2 className={styles.cardTitle}>What Remote expects</h2>
            <pre className={styles.pre}>
              {remote ? JSON.stringify(remote, null, 2) : "Loading…"}
            </pre>
          </div>
        </section>

        {loadError && <p className={styles.errorText}>{loadError}</p>}

        <div className={styles.actions}>
          <button
            className={styles.button}
            onClick={handleSend}
            disabled={sending}
          >
            {sending ? "Sending…" : "Send to Remote's sandbox"}
          </button>
        </div>

        {sendError && <p className={styles.errorText}>{sendError}</p>}

        {sendResult && (
          <section className={styles.resultCard}>
            {sendResult.sandboxError ? (
              <>
                <h2 className={styles.cardTitle}>Sandbox error (known bug)</h2>
                <p className={styles.bugNote}>
                  Remote&apos;s sandbox returned a server error here.
                  Confirmed reproducible across multiple employees, dates,
                  and payload shapes — this is a genuine bug on their end,
                  not a client error.
                </p>
                <pre className={styles.pre}>
                  {JSON.stringify(sendResult, null, 2)}
                </pre>
              </>
            ) : (
              <>
                <h2 className={styles.cardTitle}>Created successfully</h2>
                <pre className={styles.pre}>
                  {JSON.stringify(sendResult, null, 2)}
                </pre>
              </>
            )}
          </section>
        )}
      </main>
    </div>
  );
}
