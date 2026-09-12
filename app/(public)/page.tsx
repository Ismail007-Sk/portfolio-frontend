"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Mail,
  ArrowRight,
  Download,
  Send,
  ChevronRight,
  Code,
  Brain,
  Server,
  Monitor,
  Layers,
  Building2,
} from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa6";

import styles from "./page.module.css";
import Loading from "@/components/shared/loading";
import ErrorMessage from "@/components/shared/error-message";

import { getProfiles } from "@/features/profile/profile.api";
import type {
  AvailabilityStatus,
  Profile,
} from "@/features/profile/profile.types";

import {
  getProjects,
  getProjectById,
} from "@/features/projects/project.api";

import { getSkills } from "@/features/skills/skill.api";
import type { Skill } from "@/features/skills/skill.types";

import { getExperience } from "@/features/experience/experience.api";
import type { Experience } from "@/features/experience/experience.types";


// -----------------------------------------------------------------------------
// Types & Constants
// -----------------------------------------------------------------------------

type FeaturedProjectCard = {
  id: string;
  title: string;
  imageUrl: string | null;
  altText: string | null;
};

type AvailabilityCopy = {
  title: string;
  text: string;
};

const AVAILABILITY_COPY: Record<AvailabilityStatus, AvailabilityCopy> = {
  available_for_both: {
    title: "Available for Opportunities",
    text: "Open to Full-time roles, Internships & Freelance projects.",
  },
  available_for_jobs: {
    title: "Available for Jobs",
    text: "Open to Full-time roles and internships.",
  },
  available_for_freelance: {
    title: "Available for Freelance",
    text: "Open to freelance projects and collaborations.",
  },
  not_available: {
    title: "Currently Unavailable",
    text: "Not open to new opportunities at this time.",
  },
};

const HOME_SERVICES = [
  {
    title: "Full-stack Development",
    description:
      "Modern web applications from UI to APIs, databases and cloud deployment.",
    icon: Layers,
    accent: "purple",
  },
  {
    title: "Frontend Development",
    description:
      "Responsive, interactive interfaces with a focus on performance and UX.",
    icon: Monitor,
    accent: "blue",
  },
  {
    title: "Backend / API Development",
    description:
      "Robust APIs, backend logic and secure, scalable server-side systems.",
    icon: Server,
    accent: "green",
  },
  {
    title: "AI / LLM Integration",
    description:
      "Intelligent features using LLMs, RAG pipelines and model integration.",
    icon: Brain,
    accent: "orange",
  },
] as const;


// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

function getFileUrl(url: string | null): string | null {
  if (!url) return null;

  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }

  return `${process.env.NEXT_PUBLIC_API_URL}${url}`;
}

function getErrorMessage(
  error: unknown,
  fallback: string,
): string {
  const typedError = error as {
    response?: {
      data?: {
        message?: string;
      };
    };
    message?: string;
  };

  return (
    typedError?.response?.data?.message ||
    typedError?.message ||
    fallback
  );
}

function pickRandomItems<T>(items: T[], count: number): T[] {
  return [...items]
    .sort(() => Math.random() - 0.5)
    .slice(0, count);
}

function splitName(name: string): {
  first: string;
  rest: string;
} {
  const parts = name.trim().split(/\s+/).filter(Boolean);

  return {
    first: parts[0] ?? "",
    rest: parts.slice(1).join(" "),
  };
}


// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export default function Home() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [featuredProjects, setFeaturedProjects] = useState<
    FeaturedProjectCard[]
  >([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadHomeData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const [
          profilesResult,
          projectsResult,
          skillsResult,
          experienceResult,
        ] = await Promise.allSettled([
          getProfiles(),
          getProjects(),
          getSkills(),
          getExperience(),
        ]);

        if (!isMounted) return;

        // Profile
        if (
          profilesResult.status === "fulfilled" &&
          profilesResult.value.length
        ) {
          setProfile(profilesResult.value[0]);
        } else if (profilesResult.status === "rejected") {
          setError(
            getErrorMessage(
              profilesResult.reason,
              "Failed to load profile data",
            ),
          );
        }

        // Skills
        if (skillsResult.status === "fulfilled") {
          setSkills(skillsResult.value);
        }

        // Experience
        if (experienceResult.status === "fulfilled") {
          const sortedExperience = [...experienceResult.value]
            .sort(
              (a, b) => a.display_order - b.display_order,
            )
            .slice(0, 4);

          setExperiences(sortedExperience);
        }

        // Featured Projects
        if (projectsResult.status === "fulfilled") {
          const featured = projectsResult.value.filter(
            (project) => project.is_featured,
          );

          const detailedProjects = await Promise.all(
            featured.map(async (project) => {
              try {
                const detail = await getProjectById(project.id);

                const firstImage =
                  detail.images?.find(
                    (image) => image.display_order === 1,
                  ) ?? null;

                return {
                  id: detail.id,
                  title: detail.title,
                  imageUrl: getFileUrl(
                    firstImage?.image_url ?? null,
                  ),
                  altText:
                    firstImage?.alt_text ?? detail.title,
                };
              } catch {
                return {
                  id: project.id,
                  title: project.title,
                  imageUrl: null,
                  altText: project.title,
                };
              }
            }),
          );

          if (isMounted) {
            setFeaturedProjects(detailedProjects);
          }
        }
      } catch (err) {
        if (isMounted) {
          setError(
            getErrorMessage(
              err,
              "Failed to load homepage data",
            ),
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadHomeData();

    return () => {
      isMounted = false;
    };
  }, []);

  // ---------------------------------------------------------------------------
  // Derived Data
  // ---------------------------------------------------------------------------

  const previewSkills = useMemo(() => {
    const groupedSkills = skills.reduce<Record<string, Skill[]>>(
      (groups, skill) => {
        const category = skill.category.toLowerCase().trim();

        (groups[category] ??= []).push(skill);

        return groups;
      },
      {},
    );

    return Object.values(groupedSkills).flatMap(
      (categorySkills) =>
        pickRandomItems(categorySkills, 5),
    );
  }, [skills]);

  if (isLoading) {
    return <Loading />;
  }

  if (error && !profile) {
    return <ErrorMessage message={error} />;
  }

  const { first, rest } = splitName(profile?.name ?? "");

  const cvUrl = getFileUrl(profile?.cv_url ?? null);

  const availability =
    profile?.availability_status ?? "available_for_both";

  const availabilityCopy = AVAILABILITY_COPY[availability];

  const isUnavailable =
    availability === "not_available";

  return (
    <div className={styles.page}>

      {/* ------------------------------------------------------------------ */}
      {/* Hero Section */}
      {/* ------------------------------------------------------------------ */}
      <section className={styles.hero}>
        <div className={styles.heroContainer}>
          <div className={styles.heroGrid}>

            <div className={styles.heroLeft}>
              <p className={styles.heroGreeting}>
                Hi, I&apos;m
              </p>

              <h1 className={styles.heroTitle}>
                <span className={styles.heroNameWhite}>
                  {first}
                </span>

                {rest && (
                  <span className={styles.heroNameGradient}>
                    {" "}
                    {rest}
                  </span>
                )}
              </h1>

              <h2 className={styles.heroSubtitle}>
                {profile?.headline ?? ""}
              </h2>

              <p className={styles.heroDescription}>
                {profile?.bio ?? ""}
              </p>

              <div className={styles.heroButtons}>
                <Link
                  href="/projects"
                  className={`${styles.button} ${styles.buttonPrimary}`}
                >
                  View My Work
                  <ArrowRight size={18} />
                </Link>

                {cvUrl ? (
                  <a
                    href={cvUrl}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${styles.button} ${styles.buttonSecondary}`}
                  >
                    Download CV
                    <Download size={18} />
                  </a>
                ) : (
                  <button
                    type="button"
                    disabled
                    className={`${styles.button} ${styles.buttonSecondary}`}
                  >
                    Download CV
                    <Download size={18} />
                  </button>
                )}
              </div>

              <div
                className={
                  styles.socialAndAvailabilityWrapper
                }
              >
                <div className={styles.socialLinks}>
                  {profile?.github_url && (
                    <a
                      href={profile.github_url}
                      className={styles.socialLink}
                      aria-label="GitHub"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FaGithub size={40} />
                    </a>
                  )}

                  {profile?.linkedin_url && (
                    <a
                      href={profile.linkedin_url}
                      className={styles.socialLink}
                      aria-label="LinkedIn"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FaLinkedin size={40} />
                    </a>
                  )}

                  {profile?.email && (
                    <a
                      href={`mailto:${profile.email}`}
                      className={styles.socialLink}
                      aria-label="Email"
                    >
                      <Mail size={40} />
                    </a>
                  )}
                </div>

                <Link
                  href="/contact"
                  className={`${styles.inlineAvailabilityBadge} ${
                    isUnavailable
                      ? styles.badgeUnavailable
                      : styles.badgeAvailable
                  }`}
                >
                  <span
                    className={`${styles.statusDot} ${
                      isUnavailable
                        ? styles.statusDotUnavailable
                        : styles.statusDotAvailable
                    }`}
                  />

                  <span className={styles.badgeText}>
                    {availabilityCopy.title}
                  </span>
                </Link>
              </div>
            </div>

            <div className={styles.heroRight}>
              <div className={styles.profileArea}>
                <div className={styles.profileRing} />

                <img
                  src="/home.png"
                  alt={
                    profile?.name
                      ? `${profile.name} portrait`
                      : "Profile"
                  }
                  width={1300}
                  height={800}
                  className={styles.heroPortrait}
                />
              </div>
            </div>

          </div>
        </div>
      </section>


      {/* ------------------------------------------------------------------ */}
      {/* Featured Projects */}
      {/* ------------------------------------------------------------------ */}
      <section className={styles.section}>
        <div className={styles.container}>

          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>
              Featured Projects
            </h2>

            <Link
              href="/projects"
              className={styles.viewAll}
            >
              View All Projects
              <ChevronRight size={16} />
            </Link>
          </div>

          {featuredProjects.length === 0 ? (
            <p className={styles.emptyState}>
              No featured projects to show yet.
            </p>
          ) : (
            <div className={styles.featuredGrid}>
              {featuredProjects.map((project) => (
                <article
                  key={project.id}
                  className={styles.featuredCard}
                >
                  <div className={styles.featuredThumb}>
                    {project.imageUrl ? (
                      <img
                        src={project.imageUrl}
                        alt={
                          project.altText ||
                          project.title
                        }
                        className={styles.featuredImage}
                      />
                    ) : (
                      <div
                        className={
                          styles.featuredPlaceholder
                        }
                      />
                    )}
                  </div>

                  <div className={styles.featuredFooter}>
                    <h3 className={styles.featuredTitle}>
                      {project.title}
                    </h3>
                  </div>
                </article>
              ))}
            </div>
          )}

        </div>
      </section>


      {/* ------------------------------------------------------------------ */}
      {/* What I Do */}
      {/* ------------------------------------------------------------------ */}
      <section className={styles.section}>
        <div className={styles.container}>

          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>
              What I Do
            </h2>

            <Link
              href="/services"
              className={styles.viewAll}
            >
              View All Services
              <ChevronRight size={16} />
            </Link>
          </div>

          <div className={styles.servicesGrid}>
            {HOME_SERVICES.map((service) => {
              const Icon = service.icon;

              return (
                <div
                  key={service.title}
                  className={styles.serviceCard}
                >
                  <div
                    className={
                      styles.serviceIconWrapper
                    }
                  >
                    <Icon
                      size={50}
                      className={styles.serviceIcon}
                    />
                  </div>

                  <h3 className={styles.serviceTitle}>
                    {service.title}
                  </h3>

                  <p
                    className={
                      styles.serviceDescription
                    }
                  >
                    {service.description}
                  </p>
                </div>
              );
            })}
          </div>

        </div>
      </section>


      {/* ------------------------------------------------------------------ */}
      {/* Technical Skills */}
      {/* ------------------------------------------------------------------ */}
      <section className={styles.section}>
        <div className={styles.container}>

          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>
              Technical Skills
            </h2>

            <Link
              href="/skills"
              className={styles.viewAll}
            >
              View All Skills
              <ChevronRight size={22} />
            </Link>
          </div>

          {previewSkills.length === 0 ? (
            <p className={styles.emptyState}>
              Skills will appear here once they are
              added.
            </p>
          ) : (
            <div className={styles.skillsGrid}>
              {previewSkills.map((skill) => {
                const iconUrl = getFileUrl(
                  skill.icon_url,
                );

                return (
                  <div
                    key={skill.id}
                    className={styles.skillCard}
                  >
                    {iconUrl ? (
                      <img
                        src={iconUrl}
                        alt=""
                        className={styles.skillIcon}
                      />
                    ) : (
                      <Code size={24} />
                    )}

                    <span>{skill.name}</span>
                  </div>
                );
              })}
            </div>
          )}

        </div>
      </section>


      {/* ------------------------------------------------------------------ */}
      {/* Experience & Internships */}
      {/* ------------------------------------------------------------------ */}
      <section className={styles.section}>
        <div className={styles.container}>

          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>
              Experience & Internships
            </h2>

            <Link
              href="/experience"
              className={styles.viewAll}
            >
              View All Experience
              <ChevronRight size={22} />
            </Link>
          </div>

          {experiences.length === 0 ? (
            <p className={styles.emptyState}>
              Experience details will appear here soon.
            </p>
          ) : (
            <div
              className={
                styles.timelineContainer
              }
            >
              <div className={styles.timelineLine} />

              <div className={styles.timelineGrid}>
                {experiences.map((exp) => {
                  const iconUrl = getFileUrl(
                    exp.icon_url,
                  );

                  return (
                    <div
                      key={exp.id}
                      className={styles.timelineItem}
                    >
                      <div
                        className={
                          styles.timelinePoint
                        }
                      />

                      <div
                        className={
                          styles.timelineCard
                        }
                      >
                        <div
                          className={
                            styles.companyLogo
                          }
                        >
                          {iconUrl ? (
                            <img
                              src={iconUrl}
                              alt={exp.company}
                            />
                          ) : (
                            <Building2 size={30} />
                          )}
                        </div>

                        <div
                          className={
                            styles.cardDetails
                          }
                        >
                          <h3
                            className={
                              styles.companyName
                            }
                            title={exp.company}
                          >
                            {exp.company}
                          </h3>

                          <p
                            className={
                              styles.companyRole
                            }
                          >
                            {exp.role}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>
      </section>


      {/* ------------------------------------------------------------------ */}
      {/* Final CTA */}
      {/* ------------------------------------------------------------------ */}
      <section className={styles.ctaSection}>
        <div className={styles.container}>

          <div className={styles.ctaCard}>

            <div className={styles.ctaLeft}>
              <div className={styles.ctaIcon}>
                <Send size={48} />
              </div>
            </div>

            <div className={styles.ctaCenter}>
              <p className={styles.ctaSubtitle}>
                Have a project in mind?
              </p>

              <h2 className={styles.ctaTitle}>
                Let&apos;s build something{" "}
                <span className={styles.ctaGradient}>
                  amazing
                </span>{" "}
                together!
              </h2>

              <p className={styles.ctaDescription}>
                I&apos;m open to full-time roles,
                freelance projects and exciting
                collaborations.
              </p>
            </div>

            <div className={styles.ctaRight}>
              <Link href="/contact">
                <button
                  type="button"
                  className={styles.ctaButton}
                >
                  Contact Me
                  <ArrowRight size={22} />
                </button>
              </Link>
            </div>

          </div>

        </div>
      </section>

    </div>
  );
}

