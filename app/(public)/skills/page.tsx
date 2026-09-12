"use client";

import { useEffect, useState } from "react";
import { 
  Layout, Server, Database, Brain, 
  Code, Rocket, ArrowRight, Trophy
} from "lucide-react";
import Link from "next/link";
import Loading from "@/components/shared/loading";
import ErrorMessage from "@/components/shared/error-message";
import { getSkills } from "@/features/skills/skill.api";
import type { Skill } from "@/features/skills/skill.types";
import styles from "./skills.module.css";

function getFileUrl(url: string | null): string | null {
  if (!url) return null;
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return `${process.env.NEXT_PUBLIC_API_URL}${url}`;
}

const CATEGORY_CONFIG: Record<
  string, 
  { label: string; description: string; number: string; icon: any; colorClass?: string; iconClass?: string }
> = {
  frontend: {
    label: "Frontend Development",
    description: "Building responsive, interactive, and modern user interfaces.",
    number: "01",
    icon: Layout,
    colorClass: styles.cardNumberPurple,
    iconClass: styles.cardIconPurple,
  },
  backend: {
    label: "Backend Development",
    description: "Developing robust APIs, backend logic, and secure systems.",
    number: "02",
    icon: Server,
    colorClass: styles.cardNumberBlue,
    iconClass: styles.cardIconBlue,
  },
  database: {
    label: "Database",
    description: "Designing efficient data models and working with relational databases.",
    number: "03",
    icon: Database,
    colorClass: styles.cardNumberGreen,
    iconClass: styles.cardIconGreen,
  },
  aiml: {
    label: "AI / Machine Learning",
    description: "Building intelligent models and AI-powered applications.",
    number: "04",
    icon: Brain,
    colorClass: styles.cardNumberPurple,
    iconClass: styles.cardIconPurple,
  },
  others: {
    label: "Other Technologies & Core CS",
    description: "Foundational CS knowledge, tools, and platforms.",
    number: "05",
    icon: Code,
    colorClass: styles.cardNumberAmber,
    iconClass: styles.cardIconAmber,
  },
};

export default function Skills() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSkills() {
      try {
        setLoading(true);
        const data = await getSkills();
        setSkills(data);
      } catch (err) {
        setError("Failed to load skills.");
      } finally {
        setLoading(false);
      }
    }

    fetchSkills();
  }, []);

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} />;

  const groupedSkills = skills.reduce<Record<string, Skill[]>>((acc, skill) => {
    const key = skill.category.toLowerCase().trim();
    if (!acc[key]) acc[key] = [];
    acc[key].push(skill);
    return acc;
  }, {});

  const categoryKeys = Array.from(
    new Set([...Object.keys(CATEGORY_CONFIG), ...Object.keys(groupedSkills)])
  );

  const mainCategories = categoryKeys.filter((cat) => (groupedSkills[cat]?.length ?? 0) > 0);

  return (
    <div className={styles.page}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContainer}>
          <div className={styles.heroGrid}>
            <div className={styles.heroLeft}>
              <h1 className={styles.heroTitle}>
                Technologies I<br />
                <span className={styles.heroGradient}>Work With</span>
              </h1>
              <p className={styles.heroDescription}>
                A diverse set of skills and technologies that I use to build
                intelligent, scalable and user-centric solutions.
              </p>
              <div className={styles.learningCard}>
                <div className={styles.learningIcon}>
                  <Rocket size={50} />
                </div>
                <div className={styles.learningContent}>
                  <h3 className={styles.learningTitle}>Always Learning</h3>
                  <p className={styles.learningDescription}>
                    Exploring new technologies and<br />
                    improving every day.
                  </p>
                </div>
              </div>
            </div>

            <div className={styles.heroRight}>
              <div className={styles.heroVisual}>
                <div className={styles.heroGlow}></div>
                  <img
                    src="/skills.png"
                    alt="Skills Hero"
                    width={1000}
                    height={800}
                    className={styles.heroImage}
                  />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Domains Grid */}
      {(() => {
        // Separate standard 2x2 grid categories from full-width ones
        const gridCategories = mainCategories.filter((cat) => cat !== "others");
        const hasOthers = mainCategories.includes("others");

        // Helper render function to reuse internal card markup
        const renderCardContent = (catKey: string, index: number) => {
          const config = CATEGORY_CONFIG[catKey] || {
            label: catKey.toUpperCase(),
            description: "Technologies and tools for this domain.",
            number: String(index + 1).padStart(2, "0"),
            icon: Code,
            colorClass: styles.cardNumberPurple,
            iconClass: styles.cardIconPurple,
          };
          const IconComponent = config.icon;
          const catSkills = groupedSkills[catKey] || [];

          return (
            <>
              <div className={styles.cardHeader}>
                <span className={`${styles.cardNumber} ${config.colorClass}`}>
                  {config.number}
                </span>
                <div className={`${styles.cardIcon} ${config.iconClass}`}>
                  <IconComponent size={45} />
                </div>
                <div className={styles.cardHeaderText}>
                  <h3 className={styles.cardTitle}>{config.label}</h3>
                  <p className={styles.cardDescription}>{config.description}</p>
                </div>
              </div>

              <div className={styles.techGroup}>
                <p className={styles.groupLabel}>WORKSTACK</p>
                <div className={styles.techTiles}>
                  {catSkills.map((skill) => {
                    const iconUrl = getFileUrl(skill.icon_url);
                    return (
                      <div key={skill.id} className={styles.techTile}>
                        {iconUrl && (
                          <img
                            src={iconUrl}
                            alt={skill.name}
                            className={styles.skillIcon}
                          />
                        )}
                        <span>{skill.name}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          );
        };

        return (
          <section className={styles.skillsGrid}>
            <div className={styles.container}>
              {/* 2x2 Grid for standard cards */}
              <div className={styles.gridContainer}>
                {gridCategories.map((catKey, index) => (
                  <div key={catKey} className={styles.skillCard}>
                    {renderCardContent(catKey, index)}
                  </div>
                ))}
              </div>

              {/* Standalone Full-Width Block for "Others" */}
              {hasOthers && (
                <div className={styles.otherContainer}>
                  {renderCardContent("others", gridCategories.length)}
                </div>
              )}
            </div>
          </section>
        );
      })()}

      {/* Banner */}
      <section className={styles.statsSection}>
        <div className={styles.container}>
          <div className={styles.statsCard}>
            <div className={styles.statsLeft}>
              <div className={styles.statsIcon}>
                <Trophy size={50} />
              </div>
            </div>
            <div className={styles.statsCenter}>
              <h2 className={styles.statsTitle}>Skills in Action</h2>
              <p className={styles.statsDescription}>
                I love turning ideas into real-world solutions using the
                right technologies and best practices.
              </p>
            </div>
            <div className={styles.statsRight}>
              <div className={styles.stat}>
                <p className={styles.statNumber}>{skills.length}+</p>
                <p className={styles.statLabel}>Technologies</p>
              </div>
              <div className={styles.statDivider}></div>
              <div className={styles.stat}>
                <p className={styles.statNumber}>{Object.keys(groupedSkills).length}</p>
                <p className={styles.statLabel}>Technical Domains</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className={styles.ctaSection}>
        <div className={styles.container}>
          <div className={styles.ctaCard}>
            <div className={styles.ctaLeft}>
              <h2 className={styles.ctaTitle}>Let's build something amazing together!</h2>
              <p className={styles.ctaDescription}>
                I'm always open to new opportunities and collaborations.
              </p>
            </div>
            <div className={styles.ctaRight}>
              <Link href={"/contact"}>
                <button className={`${styles.button} ${styles.buttonPrimary}`}>
                  Let's Connect
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