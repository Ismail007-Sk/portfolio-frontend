"use client";
import {
  Briefcase,
  Download,
  User,
  CheckCircle,
  ArrowRight,
  CircleAlert
} from "lucide-react";

import { useEffect, useState } from "react";

import styles from "./contact.module.css";
import Loading from "@/components/shared/loading";
import ErrorMessage from "@/components/shared/error-message";

import { getProfiles } from "@/features/profile/profile.api";
import type { Profile } from "@/features/profile/profile.types";

export default function Contact() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchProfile() {
      try {
        setLoading(true);
        setError(false);

        const profiles = await getProfiles();

        if (profiles.length === 0) {
          setError(true);
          return;
        }

        setProfile(profiles[0]);
      } catch (error) {
        console.error("Failed to load profile:", error);
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, []);

  if (loading) {
    return <Loading />;
  }

  if (error || !profile) {
    return (
      <ErrorMessage message="We couldn't load the contact information. Please try again." />
    );
  }

  const isAvailable =
    profile.availability_status === "available_for_jobs" ||
    profile.availability_status === "available_for_freelance" ||
    profile.availability_status === "available_for_both";

  const availabilityText = {
    available_for_jobs: "Available for Full-time Opportunities",
    available_for_freelance: "Available for Freelance Projects",
    available_for_both: "Available for Work",
    not_available: "Currently Not Available",
  }[profile.availability_status];

  const handleDownloadCV = () => {
    if (!profile.cv_url) return;

    const link = document.createElement("a");

    link.href = `${process.env.NEXT_PUBLIC_API_URL}${profile.cv_url}`;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.download = "CV";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const whatsappNumber = profile.phone_number?.replace(/\D/g, "");

  const whatsappUrl = whatsappNumber
    ? `https://wa.me/${whatsappNumber}`
    : null;

  return (
    <div className={styles.page}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContainer}>
          <div className={styles.heroGrid}>
            {/* Hero Content */}
            <div className={styles.heroLeft}>
              <p className={styles.heroLabel}>LET&apos;S CONNECT</p>

              <h1 className={styles.heroTitle}>
                Let&apos;s Build Something
                <br />
                <span className={styles.heroGradient}>Amazing</span> Together!
              </h1>

              <p className={styles.heroDescription}>
                {profile.bio ||
                  "I'm open to freelance projects, full-time opportunities and exciting collaborations. Have a project in mind? Let's connect and turn your ideas into reality."}
              </p>

              <div className={styles.heroButtons}>
                {/* Availability status — NOT a button */}
                <div
                  className={`${styles.statusBadge} ${
                    !isAvailable ? styles.statusBadgeUnavailable : ""
                  }`}
                >
                  <Briefcase size={25} strokeWidth={3} />
                  <span>{availabilityText}</span>
                </div>

                {profile.cv_url && (
                  <button
                    type="button"
                    className={`${styles.buttonCV} ${styles.buttonSecondary}`}
                    onClick={handleDownloadCV}
                  >
                    <Download size={18} />
                    Download CV
                  </button>
                )}
              </div>
            </div>

            {/* Hero Visual */}
            <div className={styles.heroRight}>
              <div className={styles.heroVisualArea}>
                <div className={styles.heroGlow}></div>

                <img
                  src="/contact.png"
                  alt="Profile"
                  width={900}
                  height={800}
                  className={styles.heroImage}
                />

                <div className={styles.heroRightText}>
                  <p>Let&apos;s create</p>

                  <p className={styles.heroRightAccent}>
                    impactful solutions
                  </p>

                  <p>together.</p>
                </div>

                <div className={styles.heroArrow}>
                  <svg
                    viewBox="0 0 100 100"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <defs>
                      <linearGradient
                        id="arrowGradient"
                        x1="15"
                        y1="75"
                        x2="82"
                        y2="15"
                        gradientUnits="userSpaceOnUse"
                      >
                        <stop offset="0%" stopColor="#00e5a8" />
                        <stop offset="45%" stopColor="#00bfff" />
                        <stop offset="100%" stopColor="#8b5cf6" />
                      </linearGradient>
                    </defs>

                    {/* Curved arrow */}
                    <path
                      d="M82 12 C82 45 78 68 58 76 C43 82 27 77 12 72"
                      stroke="url(#arrowGradient)"
                      strokeWidth="2"
                      strokeLinecap="round"
                      fill="none"
                    />

                    {/* Arrowhead */}
                    <path
                      d="M12 72 L32 66"
                      stroke="url(#arrowGradient)"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />

                    <path
                      d="M12 72 L30 84"
                      stroke="url(#arrowGradient)"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Information Card */}
      <section className={styles.contactSection}>
        <div className={styles.container}>
          <div className={styles.contactCard}>
            <div className={styles.contactHeader}>
              <div className={styles.contactIcon}>
                <User size={70} />
              </div>

              <div className={styles.contactHeaderText}>
                <h2 className={styles.contactTitle}>Contact Information</h2>

                <p className={styles.contactDescription}>
                  Reach out to me through any of the following channels.
                </p>
              </div>
            </div>

            <div className={styles.contactRows}>
              {/* Email */}
              <a
                href={`mailto:${profile.email}`}
                className={styles.contactRow}
              >
                <div className={styles.rowIcon}>
                  <img
                    src="/AppIcons/gmail.svg"
                    alt="Email"
                    className={styles.contactBrandIcon}
                  />
                </div>

                <div className={styles.rowContent}>
                  <p className={styles.rowLabel}>Email</p>
                  <p className={styles.rowValue}>{profile.email}</p>
                </div>

                <div className={styles.rowAction}>
                  <span>Send Email</span>
                  <ArrowRight size={20} />
                </div>
              </a>

              {/* LinkedIn */}
              {profile.linkedin_url && (
                <a
                  href={profile.linkedin_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.contactRow}
                >
                  <div className={styles.rowIcon}>
                    <img
                      src="/AppIcons/linkedin.svg"
                      alt="LinkedIn"
                      className={styles.contactBrandIcon}
                    />
                  </div>

                  <div className={styles.rowContent}>
                    <p className={styles.rowLabel}>LinkedIn</p>

                    <p className={styles.rowValue}>
                      {profile.linkedin_url.replace(/^https?:\/\//, "")}
                    </p>
                  </div>

                  <div className={styles.rowAction}>
                    <span>View Profile</span>
                    <ArrowRight size={20} />
                  </div>
                </a>
              )}

              {/* GitHub */}
              {profile.github_url && (
                <a
                  href={profile.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.contactRow}
                >
                  <div className={styles.rowIcon}>
                    <img
                      src="/AppIcons/github.svg"
                      alt="GitHub"
                      className={styles.contactBrandIcon}
                    />
                  </div>

                  <div className={styles.rowContent}>
                    <p className={styles.rowLabel}>GitHub</p>

                    <p className={styles.rowValue}>
                      {profile.github_url.replace(/^https?:\/\//, "")}
                    </p>
                  </div>

                  <div className={styles.rowAction}>
                    <span>View Profile</span>
                    <ArrowRight size={20} />
                  </div>
                </a>
              )}
            </div>
          </div>
        </div>
      </section>


      {/* Availability Section */}
      <section className={styles.availabilitySection}>
        <div className={styles.container}>
          {/* Unavailable State */}
          {!isAvailable ? (
            <div
              className={`${styles.availabilityCard} ${styles.availabilityCardUnavailable}`}
            >
              <div className={styles.availabilityLeft}>
                <div
                  className={`${styles.availabilityIcon} ${styles.availabilityIconUnavailable}`}
                >
                  <CircleAlert size={32} />
                </div>

                <div className={styles.availabilityContent}>
                  <h2
                    className={`${styles.availabilityTitle} ${styles.availabilityTitleUnavailable}`}
                  >
                    Currently Not Available
                  </h2>
                </div>
              </div>
            </div>
          ) : (
            /* Available State */
            <div className={styles.availabilityCard}>
              <div className={styles.availabilityLeft}>
                <div className={styles.availabilityIcon}>
                  <Briefcase size={50} />
                </div>

                <div className={styles.availabilityContent}>
                  <p className={styles.availabilityPrefix}>
                    I&apos;m Available for
                  </p>

                  <h2 className={styles.availabilityTitle}>
                    {profile.availability_status === "available_for_both" && (
                      <>
                        <span className={styles.availabilityGreen}>
                          Freelance
                        </span>{" "}
                        &{" "}
                        <span className={styles.availabilityAccent}>
                          Full-time
                        </span>{" "}
                        Opportunities
                      </>
                    )}

                    {profile.availability_status === "available_for_jobs" && (
                      <>
                        <span className={styles.availabilityAccent}>
                          Full-time
                        </span>{" "}
                        Opportunities
                      </>
                    )}

                    {profile.availability_status ===
                      "available_for_freelance" && (
                      <>
                        <span className={styles.availabilityGreen}>
                          Freelance
                        </span>{" "}
                        Opportunities
                      </>
                    )}
                  </h2>

                  <p className={styles.availabilityDescription}>
                    {profile.bio ||
                      "Open to remote opportunities worldwide. Let's discuss how I can help you or your team achieve your goals."}
                  </p>
                </div>
              </div>

              <div className={styles.availabilityRight}>
                {profile.availability_status === "available_for_jobs" && (
                  <div className={styles.availabilityTag}>
                    <CheckCircle size={25} />
                    <span>Full-time Jobs</span>
                  </div>
                )}

                {profile.availability_status === "available_for_freelance" && (
                  <div className={styles.availabilityTag}>
                    <CheckCircle size={25} />
                    <span>Freelance Projects</span>
                  </div>
                )}

                {profile.availability_status === "available_for_both" && (
                  <>
                    <div className={styles.availabilityTag}>
                      <CheckCircle size={25} />
                      <span>Full-time Jobs</span>
                    </div>

                    <div className={styles.availabilityTag}>
                      <CheckCircle size={25} />
                      <span>Freelance Projects</span>
                    </div>
                  </>
                )}

                <div className={styles.availabilityTag}>
                  <CheckCircle size={25} />
                  <span>Remote Work</span>
                </div>

                <div className={styles.availabilityTag}>
                  <CheckCircle size={25} />
                  <span>Contract Roles</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      {profile.phone_number && (
        <section className={styles.ctaSection}>
          <div className={styles.container}>
            <div className={styles.ctaCard}>
              <div className={styles.ctaLeft}>
                <div className={styles.ctaIcon}>
                    <img
                    src="/AppIcons/whatsapp.svg"
                    alt="WhatsApp"
                    className={styles.ctaBrandIcon}
                  />
                </div>

                <div className={styles.ctaContent}>
                  <h3 className={styles.ctaTitle}>
                    Ready to start a project?
                  </h3>

                  <p className={styles.ctaDescription}>
                    Let&apos;s discuss your requirements and build something
                    amazing together.
                  </p>
                </div>
              </div>

              <div className={styles.ctaRight}>
                <div className={styles.contactDisplay}>
                  <a
                    href={
                      whatsappUrl || `tel:${profile.phone_number}`
                    }
                    target={whatsappUrl ? "_blank" : undefined}
                    rel={
                      whatsappUrl
                        ? "noopener noreferrer"
                        : undefined
                    }
                    className={`${styles.button} ${styles.buttonPrimary}`}
                  >
                    {profile.phone_number}
                  </a>

                  <span className={styles.contactSubtext}>
                    Text or call via WhatsApp
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}