"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { 
  Calendar, Code, Send, 
  MapPin, CheckCircle, Brain, Users, 
  Rocket, ArrowRight,
  Building2, Award,
  User
} from "lucide-react";
import Link from "next/link";
import styles from "./experience.module.css";
import { getExperience } from "@/features/experience/experience.api";
import type { Experience } from "@/features/experience/experience.types";
import Loading from "@/components/shared/loading";
import ErrorMessage from "@/components/shared/error-message";

function getFileUrl(url: string | null): string | null {
  if (!url) return null;
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return `${process.env.NEXT_PUBLIC_API_URL}${url}`;
}

export default function ExperiencePage() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [selectedExperience, setSelectedExperience] = useState<Experience | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function fetchData() {
      try {
        setLoading(true);
        const data = await getExperience();
        if (!mounted) return;

        const sortedData = data.sort((a, b) => a.display_order - b.display_order);
        setExperiences(sortedData);
        if (sortedData.length > 0) {
          setSelectedExperience(sortedData[0]);
        }
      } catch (err) {
        console.error("Failed to fetch experiences:", err);
        if (mounted) {
          setError("Failed to load experiences. Please try again later.");
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    fetchData();

    return () => {
      mounted = false;
    };
  }, []);

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} />;

  const formatDate = (dateString: string | null): string => {
    if (!dateString) return "Present";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
  };

  const benefits = [
    {
      icon: <Brain size={42} />,
      title: "Practical Exposure",
      description: "Hands-on experience with real-world projects and industry tools."
    },
    {
      icon: <Code size={42} />,
      title: "Problem Solving",
      description: "Improved analytical skills by solving complex real-world problems."
    },
    {
      icon: <Users size={42} />,
      title: "Collaboration",
      description: "Worked in teams, learned best practices and agile workflows."
    },
    {
      icon: <Rocket size={42} />,
      title: "Professional Growth",
      description: "Enhanced technical skills and gained confidence in delivering solutions."
    }
  ];

  return (
    <div className={styles.page}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContainer}>
          <div className={styles.heroGrid}>
            <div className={styles.heroLeft}>
              <h1 className={styles.heroTitle}>
                My Experience 
                <span className={styles.heroGradient}> Journey</span>
              </h1>
              <p className={styles.heroDescription}>
                A timeline of my professional growth, internships and
                hands-on experience in building real-world solutions.
              </p>
              
            </div>
            
            <div className={styles.heroRight}>
              <div className={styles.heroVisual}>
                <div className={styles.heroGlow}></div>
               
                <img
                  src="/experience.png"
                  alt="Experience Hero"
                  width={1000}
                  height={800}
                  className={styles.heroImage}
                />

              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Experience Timeline Section */}
      <section className={styles.timelineSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionIcon}>
              <Award size={50} />
            </div>
            <h2 className={styles.sectionTitle}>Experience Timeline</h2>
          </div>
          
          <div className={styles.timelineGrid}>
            
            {/* Outer Wrapper for Left Scrollable List */}
            <div className={styles.timelineLeftWrapper}>
              <div className={styles.timelineLeft}>
                <div className={styles.timelineLine}></div>
                
                {experiences.map((exp) => {
                  const isSelected = selectedExperience?.id === exp.id;
                  const iconUrl = getFileUrl(exp.icon_url);

                  return (
                    <div 
                      key={exp.id} 
                      className={`${styles.timelineEntry} ${isSelected ? styles.timelineEntryActive : ""}`}
                      onClick={() => setSelectedExperience(exp)}
                      style={{ cursor: "pointer" }}
                    >
                      <div className={styles.timelineMarker}></div>
                      <div className={styles.timelineCard}>
                        <div className={styles.timelineCardHeader}>
                          <div className={styles.companyLogo}>
                            {iconUrl ? (
                              <Image 
                                src={iconUrl} 
                                alt={exp.company} 
                                width={24} 
                                height={24} 
                              />
                            ) : (
                              <Building2 size={24} />
                            )}
                          </div>
                          <div className={styles.companyInfo}>
                            <h3 className={styles.companyName}>{exp.company}</h3>
                            <span className={`${styles.categoryBadge} ${isSelected ? styles.categoryBadgeActive : ""}`}>
                              {exp.employment_type || "Experience"}
                            </span>
                          </div>
                        </div>
                        <div className={styles.timelineCardFooter}>
                          <div className={styles.timelineMeta}>
                            <Calendar size={18} />
                            <span>
                              {formatDate(exp.start_date)} – {exp.is_current ? "Present" : formatDate(exp.end_date)}
                            </span>
                          </div>
                          <div className={styles.timelineMeta}>
                            <MapPin size={18} />
                            <span style={{ textTransform: "capitalize" }}>
                              {exp.work_status || "N/A"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            
            {/* Timeline Right Details Card */}
            <div className={styles.timelineRight}>
              {selectedExperience ? (
                <div className={styles.detailsCard}>
                  <div className={styles.detailsHeader}>
                    <h2 className={styles.detailsTitle}>{selectedExperience.company}</h2>
                    <span className={`${styles.categoryBadge} ${styles.categoryBadgeActive}`}>
                      {selectedExperience.employment_type || "Experience"}
                    </span>
                  </div>
                  
                  <div className={styles.detailsMeta}>
                    <div className={styles.detailsMetaItem}>
                      <Calendar size={23} />
                      <span>
                        {formatDate(selectedExperience.start_date)} – {selectedExperience.is_current ? "Present" : formatDate(selectedExperience.end_date)}
                      </span>
                    </div>
                    <div className={styles.detailsDivider}></div>
                    <div className={styles.detailsMetaItem}>
                      <MapPin size={23} />
                      <span style={{ textTransform: "capitalize" }}>
                        {selectedExperience.work_status || "N/A"}
                      </span>
                    </div>
                  </div>
                  
                  <div className={styles.detailsDividerLine}></div>
                  
                  <div className={styles.detailsSection}>
                    <div className={styles.detailsSectionHeader}>
                      <User size={30} />
                      <h3 className={styles.detailsSectionTitle}>Role</h3>
                    </div>
                    <p className={styles.detailsSectionText}>{selectedExperience.role}</p>
                    {selectedExperience.description && (
                      <p className={styles.detailsSectionDescription}>
                        {selectedExperience.description}
                      </p>
                    )}
                  </div>
                  
                  {selectedExperience.responsibilities && selectedExperience.responsibilities.length > 0 && (
                    <div className={styles.detailsSection}>
                      <div className={styles.detailsSectionHeader}>
                        <CheckCircle size={27} />
                        <h3 className={styles.detailsSectionTitle}>Responsibilities</h3>
                      </div>
                      <ul className={styles.responsibilitiesList}>
                        {selectedExperience.responsibilities.map((resp, index) => (
                          <li key={index} className={styles.responsibilityItem}>
                            <CheckCircle size={20} />
                            <span>{resp}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {selectedExperience.technologies && selectedExperience.technologies.length > 0 && (
                    <div className={styles.detailsSection}>
                      <div className={styles.detailsSectionHeader}>
                        <Code size={30} />
                        <h3 className={styles.detailsSectionTitle}>Technologies Used</h3>
                      </div>
                      <div className={styles.technologyTags}>
                        {selectedExperience.technologies.map((tech, index) => (
                          <span key={index} className={styles.techTag}>{tech}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className={styles.detailsCard} style={{ textAlign: "center", padding: "2rem" }}>
                  <p>Select an experience to view details.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* What I Gained Section */}
      <section className={styles.gainedSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionIcon}>
              <Award size={50} />
            </div>
            <h2 className={styles.sectionTitle}>What I Gained</h2>
          </div>
          
          <div className={styles.benefitsGrid}>
            {benefits.map((benefit, index) => (
              <div key={index} className={styles.benefitCard}>
                <div className={styles.benefitIcon}>
                  {benefit.icon}
                </div>
                <h3 className={styles.benefitTitle}>{benefit.title}</h3>
                <p className={styles.benefitDescription}>{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* Final Opportunities CTA */}
      <section className={styles.ctaSection}>
        <div className={styles.container}>
          <div className={styles.ctaCard}>
            <div className={styles.ctaLeft}>
              <div className={styles.ctaIcon}>
                <Send size={48} />
              </div>
            </div>
            <div className={styles.ctaCenter}>
              <p className={styles.ctaSubtitle}>Looking for someone to add value to your team?</p>
              <h2 className={styles.ctaTitle}>
                I'm open to <span className={styles.ctaGradient}>exciting opportunities!</span>
              </h2>
            </div>
            <div className={styles.ctaRight}>
              <Link href="/contact">
                <button className={styles.ctaButton}>
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