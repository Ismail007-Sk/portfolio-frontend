"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Award,
  ArrowRight,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Code,
  GraduationCap,
  Rocket,
  Trophy,
  Users,
  BookOpen
} from "lucide-react";

import Loading from "@/components/shared/loading";
import ErrorMessage from "@/components/shared/error-message";

import styles from "./certificates-education.module.css";

import { getCertifications } from "@/features/certificates/certificate.api";
import { getEducation } from "@/features/education/education.api";
import { getAchievements } from "@/features/achievement/achievement.api";

import type { Certification } from "@/features/certificates/certificate.types";
import type { Education } from "@/features/education/education.types";
import type { Achievement } from "@/features/achievement/achievement.types";

function formatDate(date: string | null): string {
  if (!date) {
    return "Date not specified";
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return date;
  }

  return parsedDate.toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
}

function formatEducationPeriod(education: Education): string {
  const start = education.start_date
    ? formatDate(education.start_date)
    : null;

  const end = education.end_date
    ? formatDate(education.end_date)
    : "Present";

  if (!start) {
    return end;
  }

  return `${start} - ${end}`;
}

function getFileUrl(url: string | null): string | null {
  if (!url) {
    return null;
  }

  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }

  return `${process.env.NEXT_PUBLIC_API_URL}${url}`;
}

export default function CertificatesEducation() {
  const cardsPerPage = 4;

  const [certifications, setCertifications] = useState<Certification[]>(
    []
  );
  const [education, setEducation] = useState<Education[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);

  /*
   * =========================
   * CERTIFICATION CAROUSEL
   * =========================
   */

  const [certificationPage, setCertificationPage] = useState(0);
  const [certificationActiveCard, setCertificationActiveCard] =
    useState(0);

  /*
   * =========================
   * ACHIEVEMENT CAROUSEL
   * =========================
   */

  const [achievementPage, setAchievementPage] = useState(0);
  const [achievementActiveCard, setAchievementActiveCard] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadPageData() {
      try {
        setLoading(true);
        setError(null);

        const [
          certificationData,
          educationData,
          achievementData,
        ] = await Promise.all([
          getCertifications(),
          getEducation(),
          getAchievements(),
        ]);

        if (!mounted) {
          return;
        }

        setCertifications(
          [...certificationData].sort(
            (a, b) => a.display_order - b.display_order
          )
        );

        setEducation(
          [...educationData].sort(
            (a, b) => a.display_order - b.display_order
          )
        );

        setAchievements(
          [...achievementData].sort(
            (a, b) => a.display_order - b.display_order
          )
        );
      } catch (err) {
        console.error(
          "Failed to load certificates and education page:",
          err
        );

        if (mounted) {
          setError(
            "Unable to load certificates, education and achievements."
          );
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadPageData();

    return () => {
      mounted = false;
    };
  }, []);

  /*
   * =========================
   * CERTIFICATION PAGINATION
   * =========================
   */

  const certificationTotalPages = Math.ceil(
    certifications.length / cardsPerPage
  );

  const visibleCertifications = certifications.slice(
    certificationPage * cardsPerPage,
    certificationPage * cardsPerPage + cardsPerPage
  );

  useEffect(() => {
    if (certificationTotalPages === 0) {
      setCertificationPage(0);
      setCertificationActiveCard(0);
      return;
    }

    if (certificationPage >= certificationTotalPages) {
      setCertificationPage(certificationTotalPages - 1);
      setCertificationActiveCard(0);
      return;
    }

    const currentPageCardCount =
      certificationPage === certificationTotalPages - 1
        ? certifications.length - certificationPage * cardsPerPage
        : cardsPerPage;

    if (certificationActiveCard >= currentPageCardCount) {
      setCertificationActiveCard(
        Math.max(0, currentPageCardCount - 1)
      );
    }
  }, [
    certifications.length,
    certificationPage,
    certificationActiveCard,
    certificationTotalPages,
  ]);

  const nextCertification = () => {
    if (visibleCertifications.length === 0) {
      return;
    }

    if (
      certificationActiveCard <
      visibleCertifications.length - 1
    ) {
      setCertificationActiveCard(
        (previous) => previous + 1
      );
      return;
    }

    if (certificationPage < certificationTotalPages - 1) {
      setCertificationPage(
        (previous) => previous + 1
      );
      setCertificationActiveCard(0);
      return;
    }

    setCertificationPage(0);
    setCertificationActiveCard(0);
  };

  const prevCertification = () => {
    if (visibleCertifications.length === 0) {
      return;
    }

    if (certificationActiveCard > 0) {
      setCertificationActiveCard(
        (previous) => previous - 1
      );
      return;
    }

    if (certificationPage > 0) {
      const previousPage = certificationPage - 1;
      const previousPageStart =
        previousPage * cardsPerPage;

      const previousPageCardCount = Math.min(
        cardsPerPage,
        certifications.length - previousPageStart
      );

      setCertificationPage(previousPage);
      setCertificationActiveCard(
        Math.max(0, previousPageCardCount - 1)
      );

      return;
    }

    const lastPage = certificationTotalPages - 1;
    const lastPageStart = lastPage * cardsPerPage;

    const lastPageCardCount = Math.min(
      cardsPerPage,
      certifications.length - lastPageStart
    );

    setCertificationPage(lastPage);
    setCertificationActiveCard(
      Math.max(0, lastPageCardCount - 1)
    );
  };

  /*
   * =========================
   * ACHIEVEMENT PAGINATION
   * =========================
   */

  const achievementTotalPages = Math.ceil(
    achievements.length / cardsPerPage
  );

  const visibleAchievements = achievements.slice(
    achievementPage * cardsPerPage,
    achievementPage * cardsPerPage + cardsPerPage
  );

  useEffect(() => {
    if (achievementTotalPages === 0) {
      setAchievementPage(0);
      setAchievementActiveCard(0);
      return;
    }

    if (achievementPage >= achievementTotalPages) {
      setAchievementPage(achievementTotalPages - 1);
      setAchievementActiveCard(0);
      return;
    }

    const currentPageCardCount =
      achievementPage === achievementTotalPages - 1
        ? achievements.length - achievementPage * cardsPerPage
        : cardsPerPage;

    if (achievementActiveCard >= currentPageCardCount) {
      setAchievementActiveCard(
        Math.max(0, currentPageCardCount - 1)
      );
    }
  }, [
    achievements.length,
    achievementPage,
    achievementActiveCard,
    achievementTotalPages,
  ]);

  const nextAchievement = () => {
    if (visibleAchievements.length === 0) {
      return;
    }

    if (
      achievementActiveCard <
      visibleAchievements.length - 1
    ) {
      setAchievementActiveCard(
        (previous) => previous + 1
      );
      return;
    }

    if (achievementPage < achievementTotalPages - 1) {
      setAchievementPage(
        (previous) => previous + 1
      );
      setAchievementActiveCard(0);
      return;
    }

    setAchievementPage(0);
    setAchievementActiveCard(0);
  };

  const prevAchievement = () => {
    if (visibleAchievements.length === 0) {
      return;
    }

    if (achievementActiveCard > 0) {
      setAchievementActiveCard(
        (previous) => previous - 1
      );
      return;
    }

    if (achievementPage > 0) {
      const previousPage = achievementPage - 1;
      const previousPageStart =
        previousPage * cardsPerPage;

      const previousPageCardCount = Math.min(
        cardsPerPage,
        achievements.length - previousPageStart
      );

      setAchievementPage(previousPage);
      setAchievementActiveCard(
        Math.max(0, previousPageCardCount - 1)
      );

      return;
    }

    const lastPage = achievementTotalPages - 1;
    const lastPageStart = lastPage * cardsPerPage;

    const lastPageCardCount = Math.min(
      cardsPerPage,
      achievements.length - lastPageStart
    );

    setAchievementPage(lastPage);
    setAchievementActiveCard(
      Math.max(0, lastPageCardCount - 1)
    );
  };

  /*
   * =========================
   * ACTIVE CARD STYLE
   * =========================
   *
   * We don't use a new CSS selector because
   * .certCardActive doesn't exist in the current CSS.
   */

  const getCardStyle = (isActive: boolean) => ({
    opacity: isActive ? 1 : 0.7,
    transform: isActive ? "scale(1)" : "scale(0.95)",
  });

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  return (
    <div className={styles.page}>
      {/* =========================
          HERO SECTION
      ========================= */}
      <section className={styles.hero}>
        <div className={styles.heroContainer}>
          <div className={styles.heroGrid}>
            <div className={styles.heroLeft}>
              <h1 className={styles.heroTitle}>
                Certificates &<br/>
                <span className={styles.heroGradient}>
                  Education
                </span>
              </h1>

              <p className={styles.heroDescription}>
                My academic background, professional certifications
                and key achievements that reflect my continuous
                learning and passion for growth.
              </p>
            </div>

            <div className={styles.heroRight}>
              <div className={styles.academicVisual}>
                <div className={styles.academicGlow} />

                <img
                  src="/certificate.png"
                  alt="Certificates and education"
                  width={1000}
                  height={800}
                  className={styles.academicImage}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================
          CERTIFICATIONS SECTION
      ========================= */}
      <section className={styles.certificationsSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionHeaderLeft}>
              <div className={styles.sectionIcon}>
                <Award size={48} />
              </div>

              <h2 className={styles.sectionTitle}>
                Certifications
              </h2>
            </div>
          </div>

          {certifications.length === 0 ? (
            <div className={styles.emptyState}>
              No certifications available yet.
            </div>
          ) : (
            <>
              <div className={styles.carouselContainer}>
                <button
                  type="button"
                  className={styles.carouselNav}
                  onClick={prevCertification}
                  aria-label="Previous certification"
                >
                  <ChevronLeft size={20} />
                </button>

                <div
                  className={styles.carousel}
                >
                  {visibleCertifications.map(
                    (certification, index) => {
                      const isActive =
                        index === certificationActiveCard;

                      return (
                        <div
                          key={certification.id}
                          className={styles.certCard}
                          style={getCardStyle(isActive)}
                        >
                          <div className={styles.certLogo}>
                            {certification.issuer_icon_url ? (
                              <img
                                src={
                                  getFileUrl(
                                    certification.issuer_icon_url
                                  ) ?? ""
                                }
                                alt={
                                  certification.issuer ??
                                  "Certificate issuer"
                                }
                                className={
                                  styles.certLogoImage
                                }
                              />
                            ) : (
                              certification.issuer ??
                              "Certification"
                            )}
                          </div>

                          <h3 className={styles.certTitle}>
                            {certification.title}
                          </h3>

                          <div className={styles.certHeader}>
                            <p
                              className={
                                styles.certOrganization
                              }
                            >
                              {certification.issuer ??
                                "Unknown issuer"}
                            </p>

                            {certification.certificate_type && (
                              <span
                                className={
                                  styles.certBadge
                                }
                              >
                                {
                                  certification.certificate_type
                                }
                              </span>
                            )}
                          </div>

                          <div className={styles.certDate}>
                            <Calendar size={25} />

                            <span>
                              {formatDate(
                                certification.issue_date
                              )}
                            </span>
                          </div>

                          {certification.certificate_url && (
                            <a
                              href={
                                getFileUrl(
                                  certification.certificate_url
                                ) ?? ""
                              }
                              target="_blank"
                              rel="noopener noreferrer"
                              className={
                                styles.certViewButton
                              }
                            >
                              View Certificate
                            </a>
                          )}
                        </div>
                      );
                    }
                  )}
                </div>

                <button
                  type="button"
                  className={styles.carouselNav}
                  onClick={nextCertification}
                  aria-label="Next certification"
                >
                  <ChevronRight size={20} />
                </button>
              </div>

              <div className={styles.carouselDots}>
                {Array.from({
                  length: certificationTotalPages,
                }).map((_, index) => (
                  <button
                    type="button"
                    key={index}
                    aria-label={`Go to certification page ${
                      index + 1
                    }`}
                    className={`${styles.dot} ${
                      index === certificationPage
                        ? styles.dotActive
                        : ""
                    }`}
                    onClick={() => {
                      setCertificationPage(index);
                      setCertificationActiveCard(0);
                    }}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* =========================
          EDUCATION SECTION
      ========================= */}
      <section className={styles.educationSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionHeaderLeft}>
              <div className={styles.sectionIcon}>
                <GraduationCap size={50} />
              </div>

              <h2 className={styles.sectionTitle}>Education</h2>
            </div>
          </div>

          {education.length === 0 ? (
            <div className={styles.emptyState}>
              No education information available yet.
            </div>
          ) : (
            <div className={styles.timeline}>
              <div className={styles.timelineLine} />

              {education.map((item, index) => {
                const isCollege =
                  item.institution.toLowerCase().includes("mckv") ||
                  item.degree.toLowerCase().includes("b.tech") ||
                  item.degree.toLowerCase().includes("btech");

                const institutionIcon = isCollege
                  ? "/EducationIcon/mckv.png"
                  : "/EducationIcon/childrens.png";

                return (
                  <div
                    key={item.id}
                    className={styles.educationEntry}
                  >
                    {/* Timeline Icon */}
                    <div className={styles.timelineIcon}>
                      <div className={styles.timelineIconBox}>
                        {index === 0 ? (
                          <GraduationCap size={45} />
                        ) : (
                          <BookOpen size={40} />
                        )}
                      </div>
                    </div>

                    {/* Education Card */}
                    <div className={styles.eduCard}>
                      {/* Left: Date / Status / Score */}
                      <div className={styles.eduLeft}>
                        <p className={styles.eduYear}>
                          {formatEducationPeriod(item)}
                        </p>

                        {item.description && (
                          <p className={styles.eduValue}>
                            {item.description}
                          </p>
                        )}
                      </div>

                      {/* Center: Education Details */}
                      <div className={styles.eduCenter}>
                        <h3 className={styles.eduTitle}>
                          {item.degree}
                        </h3>

                        {item.field_of_study && (
                          <p className={styles.eduSubtitle}>
                          {item.field_of_study}
                          </p>
                        )}

                        <p className={styles.eduInstitution}>
                          {item.institution}
                        </p>

                      </div>

                      {/* Right: Institution Logo */}
                      <div className={styles.eduRight}>
                        <div className={styles.institutionLogo}>
                          <img
                            src={institutionIcon}
                            alt={`${item.institution} logo`}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* =========================
          ACHIEVEMENTS SECTION
      ========================= */}
      <section className={styles.achievementsSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionHeaderLeft}>
              <div className={styles.sectionIcon}>
                <Trophy size={45} />
              </div>

              <h2 className={styles.sectionTitle}>
                Achievements
              </h2>
            </div>
          </div>

          {achievements.length === 0 ? (
            <div className={styles.emptyState}>
              No achievements available yet.
            </div>
          ) : (
            <>
              <div className={styles.carouselContainer}>
                <button
                  type="button"
                  className={styles.carouselNav}
                  onClick={prevAchievement}
                  aria-label="Previous achievement"
                >
                  <ChevronLeft size={20} />
                </button>

                <div
                  className={styles.carousel}
                  style={{
                    display: "grid",
                    gap: "24px",
                  }}
                >
                  {visibleAchievements.map(
                    (achievement, index) => {
                      const fallbackIcons = [
                        <Award
                          key="award"
                          size={45}
                        />,
                        <Code
                          key="code"
                          size={45}
                        />,
                        <Trophy
                          key="trophy"
                          size={45}
                        />,
                        <Users
                          key="users"
                          size={45}
                        />,
                      ];

                      const isActive =
                        index === achievementActiveCard;

                      return (
                        <div
                          key={achievement.id}
                          className={styles.achievementCard}
                          style={getCardStyle(isActive)}
                        >
                          <div
                            className={
                              styles.achievementIcon
                            }
                          >
                            {achievement.icon_url ? (
                              <img
                                src={
                                  getFileUrl(
                                    achievement.icon_url
                                  ) ?? ""
                                }
                                alt=""
                                className={
                                  styles.achievementIconImage
                                }
                              />
                            ) : (
                              fallbackIcons[
                                index %
                                  fallbackIcons.length
                              ]
                            )}
                          </div>

                          <h3
                            className={
                              styles.achievementTitle
                            }
                          >
                            {achievement.title}
                          </h3>

                          {achievement.issuer && (
                            <p
                              className={
                                styles.achievementIssuer
                              }
                            >
                              {achievement.issuer}
                            </p>
                          )}

                          {achievement.category && (
                            <p
                              className={
                                styles.achievementCategory
                              }
                            >
                              {achievement.category}
                            </p>
                          )}

                          {achievement.description && (
                            <p
                              className={
                                styles.achievementDescription
                              }
                            >
                              {achievement.description}
                            </p>
                          )}

                          {achievement.achievement_date && (
                            <div
                              className={
                                styles.certDate
                              }
                            >
                              <Calendar size={22} />

                              <span>
                                {formatDate(
                                  achievement.achievement_date
                                )}
                              </span>
                            </div>
                          )}

                          {achievement.achievement_url && (
                            <a
                              href={
                                achievement.achievement_url
                              }
                              target="_blank"
                              rel="noopener noreferrer"
                              className={
                                styles.certViewButton
                              }
                            >
                              View 
                              <ArrowRight size={20} />
                            </a>
                          )}
                        </div>
                      );
                    }
                  )}
                </div>

                <button
                  type="button"
                  className={styles.carouselNav}
                  onClick={nextAchievement}
                  aria-label="Next achievement"
                >
                  <ChevronRight size={20} />
                </button>
              </div>

              <div className={styles.carouselDots}>
                {Array.from({
                  length: achievementTotalPages,
                }).map((_, index) => (
                  <button
                    type="button"
                    key={index}
                    aria-label={`Go to achievement page ${
                      index + 1
                    }`}
                    className={`${styles.dot} ${
                      index === achievementPage
                        ? styles.dotActive
                        : ""
                    }`}
                    onClick={() => {
                      setAchievementPage(index);
                      setAchievementActiveCard(0);
                    }}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* =========================
          ALWAYS LEARNING BANNER
      ========================= */}
      <section className={styles.learningBanner}>
        <div className={styles.container}>
          <div className={styles.bannerCard}>
            <div className={styles.bannerLeft}>
              <div className={styles.bannerIcon}>
                <Rocket size={45} />
              </div>
            </div>

            <div className={styles.bannerCenter}>
              <h2 className={styles.bannerTitle}>
                Always learning. Always growing.
              </h2>

              <p className={styles.bannerDescription}>
                I believe in continuous improvement and constantly
                upgrading my skills to stay ahead of the curve.
              </p>
            </div>

            <div className={styles.bannerRight}>
              <div className={styles.stat}>
                <p className={styles.statNumber}>
                  {certifications.length}+
                </p>

                <p className={styles.statLabel}>
                  Certifications
                </p>
              </div>

              <div className={styles.statDivider} />

              <div className={styles.stat}>
                <p className={styles.statNumber}>
                  {achievements.length}+
                </p>

                <p className={styles.statLabel}>
                  Achievements
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================
          FINAL CTA
      ========================= */}
      <section className={styles.ctaSection}>
        <div className={styles.container}>
          <div className={styles.ctaCard}>
            <div className={styles.ctaLeft}>
              <h2 className={styles.ctaTitle}>
                Let's achieve something great together!
              </h2>

              <p className={styles.ctaDescription}>
                I'm always open to new opportunities and
                collaborations.
              </p>
            </div>

            <div className={styles.ctaRight}>
              <Link
                href="/contact"
                className={`${styles.button} ${styles.buttonPrimary}`}
              >
                Let's Connect
                <ArrowRight size={22} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}