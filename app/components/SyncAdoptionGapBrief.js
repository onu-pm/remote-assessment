"use client";

import { Fustat } from "next/font/google";
import Link from "next/link";
import { useMemo, useState } from "react";
import styles from "./SyncAdoptionGapBrief.module.css";

const fustat = Fustat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const MONTHLY_BASELINE = 8_800_000;

const MODES = [
  {
    id: "even",
    label: "Spread evenly, 24/7",
    detail: "30 days × 24 hours",
    minutesActive: 30 * 24 * 60,
  },
  {
    id: "business",
    label: "Business hours only",
    detail: "8hr × 22 days",
    minutesActive: 22 * 8 * 60,
  },
  {
    id: "nightly",
    label: "Concentrated nightly batch",
    detail: "1hr × 30 nights",
    minutesActive: 30 * 1 * 60,
  },
];

const CUSTOMER_LIMIT = 300;
const PARTNER_LIMIT = 1000;
const SCALE_MAX = 5200;

const OPTIONS = [
  {
    number: "1",
    title: "More documentation",
    body: "Cheapest, already tried. The guide is thorough, recently updated, and the number is still 80%.",
    tradeoff: "Diminishing returns.",
  },
  {
    number: "2",
    title: "Make it the default in tooling",
    body: "Ship list+webhook as a first-class SDK/CLI/MCP helper so the correct pattern takes less effort than the naive one. Changes the default for new integrations.",
    tradeoff:
      "Real coordinated engineering cost, doesn't fix integrations already live.",
  },
  {
    number: "3",
    title: "Catch it operationally",
    body: "The anti-pattern has a traffic signature (many sequential single-employee GETs from one client ID). Plausibly detectable from existing rate-limit telemetry, turning the 80% into a specific, shrinkable outreach list.",
    tradeoff: "Still needs a human conversation per flagged account — doesn't scale like a tooling default.",
  },
];

const SOURCES = [
  "https://developer.remote.com/docs/sync-workforce-data",
  "https://developer.remote.com/docs/rate-limit",
  "https://developer.remote.com/docs/rate-limit-for-partner",
  "https://developer.remote.com/docs/how-json-schemas-work",
  "https://developer.remote.com/docs/empowering-our-partners-with-robust-json-schemas",
  "https://remote.com/openings/7791136003",
];

function formatNumber(n) {
  return n.toLocaleString("en-US");
}

export default function SyncAdoptionGapBrief() {
  const [modeId, setModeId] = useState("even");
  const [notesOpen, setNotesOpen] = useState(false);

  const mode = MODES.find((m) => m.id === modeId);
  const requestsPerMinute = useMemo(
    () => Math.round(MONTHLY_BASELINE / mode.minutesActive),
    [mode]
  );

  const barPct = Math.min(100, (requestsPerMinute / SCALE_MAX) * 100);
  const customerPct = (CUSTOMER_LIMIT / SCALE_MAX) * 100;
  const partnerPct = (PARTNER_LIMIT / SCALE_MAX) * 100;

  const barTone =
    requestsPerMinute > PARTNER_LIMIT
      ? styles.barRed
      : requestsPerMinute > CUSTOMER_LIMIT
        ? styles.barAmber
        : styles.barGreen;

  return (
    <div className={`${styles.page} ${fustat.className}`}>
      <div className={styles.attribution}>
        Prototype by Anupam Kalita — not an official Remote product.
      </div>

      <main className={styles.main}>
        {/* Section 1 — Hero */}
        <section className={styles.hero}>
          <h1 className={styles.heroTitle}>
            The gap between documented and adopted
          </h1>
          <p className={styles.heroSubhead}>
            A PM brief on Remote&apos;s own sync-pattern guidance — and why
            publishing the right answer hasn&apos;t been enough to make it
            the common one.
          </p>
          <p className={styles.byline}>
            Prepared by Anupam Kalita, for the Senior Product Manager, HRIS
            Integrations role at Remote.
          </p>

          <div className={styles.statCard}>
            <p className={styles.statNumber}>
              80% of active customers still poll per-employee
            </p>
            <p className={styles.statSub}>
              despite Remote&apos;s own guide showing the fix —{" "}
              <a
                href="https://developer.remote.com/docs/sync-workforce-data"
                target="_blank"
                rel="noopener noreferrer"
              >
                developer.remote.com/docs/sync-workforce-data
              </a>
            </p>
          </div>
        </section>

        {/* Section 2 — The problem */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>The problem</h2>
          <p className={styles.prose}>
            Remote&apos;s own developer documentation states that about 80%
            of active customers read workforce state by polling{" "}
            <code className={styles.code}>
              GET /v1/employments/{"{employment_id}"}
            </code>{" "}
            once per employee in a loop, instead of the recommended
            paginated-list-plus-webhook pattern. Remote&apos;s docs cite one
            customer running roughly 8.8 million calls a month this way.
            Remote&apos;s own words: &ldquo;the single most common mistake we
            see.&rdquo;
          </p>
          <p className={styles.prose}>
            This isn&apos;t undocumented. The guide stating these numbers —
            &ldquo;Sync your workforce data efficiently,&rdquo; updated 29
            days before I checked it — lays out the correct pattern in full:
            one paginated <code className={styles.code}>
              GET /v1/employments
            </code>{" "}
            call as a seed, a webhook subscription for deltas, and an
            occasional full re-list as backstop, with code samples and even
            a machine-readable block for AI coding agents. The guidance is
            available and clear. 80% of active customers still aren&apos;t
            following it.
          </p>
          <p className={styles.prose}>
            The real problem: not &ldquo;integrators don&apos;t know the
            right way,&rdquo; but &ldquo;knowing the right way hasn&apos;t
            made it the default way.&rdquo; Documentation solved the
            knowledge problem, not the adoption problem.
          </p>
        </section>

        {/* Section 3 — Calculator */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>So what</h2>

          <div className={styles.calculatorCard}>
            <p className={styles.calculatorLabel}>
              Traffic pattern for an 8.8M-call/month integration
            </p>

            <div className={styles.modeSwitch}>
              {MODES.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  className={
                    m.id === modeId
                      ? `${styles.modeButton} ${styles.modeButtonActive}`
                      : styles.modeButton
                  }
                  onClick={() => setModeId(m.id)}
                >
                  {m.label}
                  <span className={styles.modeDetail}>{m.detail}</span>
                </button>
              ))}
            </div>

            <div className={styles.resultRow}>
              <span className={styles.resultValue}>
                {formatNumber(requestsPerMinute)}
              </span>
              <span className={styles.resultUnit}>requests / minute</span>
            </div>

            <div className={styles.barTrack}>
              <div
                className={`${styles.barFill} ${barTone}`}
                style={{ width: `${barPct}%` }}
              />
              <div
                className={styles.refLine}
                style={{ left: `${customerPct}%` }}
              />
              <div
                className={styles.refLine}
                style={{ left: `${partnerPct}%` }}
              />
            </div>

            <div className={styles.refLegend}>
              <span className={styles.refLegendItem}>
                <span className={styles.refSwatch} />
                Customer limit: {formatNumber(CUSTOMER_LIMIT)}/min
              </span>
              <span className={styles.refLegendItem}>
                <span className={styles.refSwatch} />
                Partner limit: {formatNumber(PARTNER_LIMIT)}/min
              </span>
            </div>

            <p className={styles.calculatorCaption}>
              Illustrative ranges from Remote&apos;s own published 8.8M/month
              figure — not a confirmed trace of any one customer&apos;s
              actual traffic shape. Shown to demonstrate why this pattern
              risks reliability, not just efficiency. Reference limits from{" "}
              <a
                href="https://developer.remote.com/docs/rate-limit"
                target="_blank"
                rel="noopener noreferrer"
              >
                /docs/rate-limit
              </a>{" "}
              and{" "}
              <a
                href="https://developer.remote.com/docs/rate-limit-for-partner"
                target="_blank"
                rel="noopener noreferrer"
              >
                /docs/rate-limit-for-partner
              </a>
              .
            </p>
          </div>

          <p className={styles.prose}>
            The person managing their own HR system doesn&apos;t know their
            sync uses the wrong endpoint shape — they just see a data source
            that lags or drops. That&apos;s a support conversation
            regardless of whose code caused it. I don&apos;t have visibility
            into Remote&apos;s actual support-ticket volume or infra cost
            from this — only Remote has that data. What the public numbers
            establish is scale: if 80% holds near Remote&apos;s active base,
            this is close to the median integration, not an edge case.
          </p>
        </section>

        {/* Section 4 — What I am not claiming */}
        <details
          className={styles.notClaiming}
          open={notesOpen}
          onToggle={(e) => setNotesOpen(e.target.open)}
        >
          <summary className={styles.notClaimingSummary}>
            <span className={styles.chevron}>▸</span>
            What I am not claiming
          </summary>
          <ul className={styles.notClaimingList}>
            <li>
              Not claiming Remote&apos;s docs are unclear — they&apos;re some
              of the most thorough integration guidance I&apos;ve seen from
              an API-first company.
            </li>
            <li>
              Not claiming to know why the 80% haven&apos;t switched —
              naming plausible mechanisms next, not confirmed ones.
            </li>
            <li>
              Not proposing to rebuild Remote&apos;s sync guidance —
              it&apos;s already correct. The gap is downstream of the docs.
            </li>
          </ul>
        </details>

        {/* Section 5 — Options */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Options</h2>
          <div className={styles.optionsGrid}>
            {OPTIONS.map((opt) => (
              <div key={opt.number} className={styles.optionCard}>
                <span className={styles.optionNumber}>{opt.number}</span>
                <h3 className={styles.optionTitle}>{opt.title}</h3>
                <p className={styles.optionBody}>{opt.body}</p>
                <p className={styles.optionTradeoff}>
                  <strong>Tradeoff:</strong> {opt.tradeoff}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Section 6 — The decision */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>The decision</h2>
          <p className={styles.prose}>
            Recommend running 2 and 3 together, not in sequence: 3 is cheap,
            starts now, and reaches integrations that already exist. 2 is
            the higher-investment fix that stops the number staying at 80%
            for the next cohort.
          </p>
          <div className={styles.caveatCallout}>
            <p className={styles.caveatTitle}>
              What I&apos;d give up by not recommending Option 1 alone
            </p>
            <p className={styles.caveatBody}>
              I haven&apos;t seen engagement data on the guide itself, so
              &ldquo;the docs aren&apos;t working&rdquo; is an inference
              from the 80% figure, not a confirmed diagnosis. If most of
              that 80% predates this guide, the honest recommendation
              shrinks to Option 3 alone. I&apos;d want the age distribution
              of affected integrations before committing engineering time
              to Option 2.
            </p>
          </div>
        </section>

        {/* Section 7 — Questions I can't answer alone */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            Questions I can&apos;t answer alone
          </h2>
          <ul className={styles.questionsList}>
            <li>
              What share of the 80% predates this guide vs. was built after
              and still got it wrong?
            </li>
            <li>Does Remote already have internal detection for this traffic pattern?</li>
            <li>
              What does a 429 from this pattern cost Remote in support
              contact volume today?
            </li>
          </ul>
        </section>

        {/* Section 8 — Footer */}
        <section className={styles.footer}>
          <div className={styles.footerLinks}>
            <Link
              href="/case-studies/personio-time-off"
              className={styles.footerLink}
            >
              <span className={styles.footerLinkTitle}>
                See a working proof point →
              </span>
              <span className={styles.footerLinkBody}>
                A separate case study with a small live prototype pulling
                real employment data from Remote&apos;s sandbox — built to
                test whether I could actually ship against their API, not
                just write about it.
              </span>
            </Link>

            <Link href="/case-studies" className={styles.footerLink}>
              <span className={styles.footerLinkTitle}>
                More case studies →
              </span>
              <span className={styles.footerLinkBody}>
                More angles on this same problem, and others.
              </span>
            </Link>
          </div>

          <div className={styles.sourcesList}>
            <p className={styles.sourcesLabel}>Sources</p>
            {SOURCES.map((src) => (
              <a
                key={src}
                href={src}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.sourceLink}
              >
                {src}
              </a>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
