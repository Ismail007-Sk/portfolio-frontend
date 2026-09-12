"use client";

import styles from "./error-message.module.css";

type ErrorMessageProps = {
  onRetry?: () => void;
  onBack?: () => void;
  message?: string;
};

export default function ErrorMessage({
  onRetry,
  onBack,
  message = "We couldn’t load the data. Please check your connection and try again.",
}: ErrorMessageProps) {
  return (
    <main className={styles.page}>
      <div className={styles.decorTop} />
      <div className={styles.decorBottom} />
      <div className={styles.dotsTop} />
      <div className={styles.dotsBottom} />

      <section className={styles.card}>
        <div className={styles.content}>
          {/* Error Icon */}
          <div className={styles.iconWrapper}>
            <div className={styles.warningIcon}>
              <span>!</span>
            </div>
          </div>

          {/* Message */}
          <h1 className={styles.title}>Something went wrong</h1>

          <p className={styles.description}>{message}</p>

          {/* Actions */}
          {/* <div className={styles.actions}>
            <button
              type="button"
              className={styles.retryButton}
              onClick={onRetry}
            >
              <span className={styles.retryIcon}>↻</span>
              <span>Try Again</span>
            </button>

            <button
              type="button"
              className={styles.backButton}
              onClick={onBack}
            >
              <span className={styles.backIcon}>←</span>
              <span>Go Back</span>
            </button>
          </div> */}
        </div>

        {/* Footer */}
        {/* <div className={styles.footer}>
          <div className={styles.helpIcon}>?</div>

          <p>
            If the problem persists,{" "}
            <a href="/contact">contact support.</a>
          </p>
        </div> */}
      </section>
    </main>
  );
}