import { Fustat } from "next/font/google";
import Link from "next/link";
import styles from "./page.module.css";

const fustat = Fustat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const CASE_STUDIES = [
  {
    title: "The gap between documented and adopted",
    hook: "Remote already published the fix for its most common integration mistake. 80% of active customers still aren't using it.",
    href: "/case-studies/sync-adoption-gap",
  },
  {
    title: "Personio's EOR time-off: the bug that wasn't",
    hook: "I found what looked like a sync gap, built toward fixing it, then found out I was wrong — and what the real, smaller problem underneath it was.",
    href: "/case-studies/personio-time-off",
  },
];

export default function CaseStudiesIndex() {
  return (
    <div className={`${styles.page} ${fustat.className}`}>
      <div className={styles.attribution}>
        Prototype by Anupam Kalita — not an official Remote product.
      </div>

      <main className={styles.main}>
        <header className={styles.header}>
          <h1 className={styles.title}>Case studies</h1>
          <p className={styles.subtitle}>
            Angles on Remote&apos;s HRIS integration surface — what&apos;s
            working, what looks broken but isn&apos;t, and what&apos;s
            actually worth fixing.
          </p>
        </header>

        <div className={styles.grid}>
          {CASE_STUDIES.map((cs) => (
            <Link key={cs.href} href={cs.href} className={styles.card}>
              <h2 className={styles.cardTitle}>{cs.title}</h2>
              <p className={styles.cardHook}>{cs.hook}</p>
              <span className={styles.cardLink}>Read case study →</span>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
