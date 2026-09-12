import styles from "./loading.module.css";

export default function Loading() {
  return (
    <div className={styles.loadingPage}>
      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={`${styles.skeleton} ${styles.eyebrow}`} />
          <div className={`${styles.skeleton} ${styles.heroTitle}`} />
          <div className={`${styles.skeleton} ${styles.heroTitleShort}`} />

          <div className={styles.heroDescription}>
            <div className={`${styles.skeleton} ${styles.line}`} />
            <div className={`${styles.skeleton} ${styles.line}`} />
            <div className={`${styles.skeleton} ${styles.lineShort}`} />
          </div>

          <div className={styles.heroButtons}>
            <div className={`${styles.skeleton} ${styles.primaryButton}`} />
            <div className={`${styles.skeleton} ${styles.secondaryButton}`} />
          </div>
        </div>

        <div className={`${styles.skeleton} ${styles.heroImage}`} />
      </section>

      {/* Stats / Features strip */}
      <section className={`${styles.skeleton} ${styles.featureStrip}`}>
        {Array.from({ length: 6 }).map((_, index) => (
          <div className={styles.featureItem} key={index}>
            <div className={`${styles.skeleton} ${styles.icon}`} />
            <div>
              <div className={`${styles.skeleton} ${styles.smallLine}`} />
              <div className={`${styles.skeleton} ${styles.tinyLine}`} />
            </div>
          </div>
        ))}
      </section>

      {/* Section */}
      <section className={styles.section}>
        <div className={`${styles.skeleton} ${styles.sectionLabel}`} />
        <div className={`${styles.skeleton} ${styles.sectionTitle}`} />

        <div className={styles.introContent}>
          <div className={styles.introText}>
            <div className={`${styles.skeleton} ${styles.headingLine}`} />
            <div className={`${styles.skeleton} ${styles.line}`} />
            <div className={`${styles.skeleton} ${styles.line}`} />
            <div className={`${styles.skeleton} ${styles.lineShort}`} />
            <div className={`${styles.skeleton} ${styles.smallButton}`} />
          </div>

          <div className={styles.smallCards}>
            {Array.from({ length: 3 }).map((_, index) => (
              <div className={styles.smallCard} key={index}>
                <div className={`${styles.skeleton} ${styles.cardIcon}`} />
                <div className={`${styles.skeleton} ${styles.cardTitle}`} />
                <div className={`${styles.skeleton} ${styles.cardLine}`} />
                <div className={`${styles.skeleton} ${styles.cardLine}`} />
                <div className={`${styles.skeleton} ${styles.cardLineShort}`} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main cards */}
      <section className={styles.section}>
        <div className={`${styles.skeleton} ${styles.sectionLabel}`} />

        <div className={styles.mainCards}>
          {Array.from({ length: 4 }).map((_, index) => (
            <div className={styles.mainCard} key={index}>
              <div className={`${styles.skeleton} ${styles.cardImage}`} />
              <div className={`${styles.skeleton} ${styles.cardTitle}`} />
              <div className={`${styles.skeleton} ${styles.cardLine}`} />
              <div className={`${styles.skeleton} ${styles.cardLine}`} />
              <div className={`${styles.skeleton} ${styles.cardLineShort}`} />

              <div className={styles.cardFooter}>
                <div className={`${styles.skeleton} ${styles.tag}`} />
                <div className={`${styles.skeleton} ${styles.tag}`} />
                <div className={`${styles.skeleton} ${styles.tagSmall}`} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Secondary cards */}
      <section className={styles.section}>
        <div className={`${styles.skeleton} ${styles.sectionLabel}`} />

        <div className={styles.secondaryCards}>
          {Array.from({ length: 8 }).map((_, index) => (
            <div className={styles.secondaryCard} key={index}>
              <div className={`${styles.skeleton} ${styles.avatar}`} />

              <div className={styles.secondaryContent}>
                <div className={`${styles.skeleton} ${styles.smallLine}`} />
                <div className={`${styles.skeleton} ${styles.line}`} />
                <div className={`${styles.skeleton} ${styles.lineShort}`} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className={`${styles.skeleton} ${styles.cta}`}>
        <div className={`${styles.skeleton} ${styles.ctaIcon}`} />

        <div className={styles.ctaContent}>
          <div className={`${styles.skeleton} ${styles.ctaLine}`} />
          <div className={`${styles.skeleton} ${styles.ctaTitle}`} />
          <div className={`${styles.skeleton} ${styles.ctaDescription}`} />
          <div className={`${styles.skeleton} ${styles.ctaButton}`} />
        </div>

        <div className={styles.ctaActions}>
          {Array.from({ length: 4 }).map((_, index) => (
            <div className={`${styles.skeleton} ${styles.actionIcon}`} key={index} />
          ))}
        </div>
      </section>
    </div>
  );
}