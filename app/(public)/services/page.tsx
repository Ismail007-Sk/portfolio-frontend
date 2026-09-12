"use client";

import { useEffect, useState } from "react";

import { 
  Code, Server, Brain, Monitor, CheckCircle, 
  ArrowRight, Send, Cpu 
} from "lucide-react";

import Link from "next/link";
import { getServices } from "@/features/services/service.api";
import type { Service, ServiceTitle } from "@/features/services/service.types";

import Loading from "@/components/shared/loading";
import ErrorMessage from "@/components/shared/error-message";
import styles from "./services.module.css";

// Helper map to assign icons, colors, and static title formatting based on ServiceTitle
const SERVICE_CONFIG: Record<
  ServiceTitle, 
  { icon: React.ReactNode; accent: string; formattedTitle: string }
> = {
  fullstack: {
    icon: <Code size={42} />,
    accent: "purple",
    formattedTitle: "Full-stack\nDevelopment",
  },
  frontend: {
    icon: <Monitor size={42} />,
    accent: "blue",
    formattedTitle: "Frontend\nDevelopment",
  },
  backend: {
    icon: <Server size={42} />,
    accent: "green",
    formattedTitle: "Backend / API\nDevelopment",
  },
  aiml: {
    icon: <Brain size={42} />,
    accent: "orange",
    formattedTitle: "AI / LLM\nIntegration",
  },
  other: {
    icon: <Cpu size={42} />,
    accent: "purple",
    formattedTitle: "Other\nServices",
  },
};

export default function Services() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchServices() {
      try {
        setLoading(true);
        setError(null);
        const data = await getServices();
        
        // Sort services by display_order if present
        const sortedData = [...data].sort(
          (a, b) => (a.display_order ?? 0) - (b.display_order ?? 0)
        );
        
        setServices(sortedData);
      } catch (err: any) {
        setError(err?.message || "Failed to fetch services. Please try again later.");
      } finally {
        setLoading(false);
      }
    }

    fetchServices();
  }, []);

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} />;

  // Core services (fullstack, frontend, backend, aiml)
  const coreServices = services.filter((s) => s.title !== "other");

  // Secondary/Freelance services under the 'other' title category
  const freelanceServiceGroup = services.find((s) => s.title === "other");
  const freelanceItems = freelanceServiceGroup?.services || [];

  return (
    <div className={styles.page}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContainer}>
          <div className={styles.heroGrid}>
            <div className={styles.heroLeft}>
              <h1 className={styles.heroTitle}>
                Services I Provide<br/>
                <span className={styles.heroGradient}>To Build Your Ideas</span>
              </h1>
              <p className={styles.heroDescription}>
                End-to-end digital solutions to help startups, businesses
                and individuals bring their ideas to life with modern
                technologies and AI-driven intelligence.
              </p>
            </div>
            <div className={styles.heroRight}>
              <div className={styles.heroVisual}>
                <div className={styles.heroGlow}></div>
                {/* Local Hero Image */}

                  <img
                    src="/service.png"
                    alt="Services Illustration"
                    width={1000}
                    height={800}
                    className={styles.heroImage}
                  />

              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Services Section */}
      {coreServices.length > 0 && (
        <section className={styles.coreServicesSection}>
          <div className={styles.serviceContainer}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionLabel}>CORE SERVICES</h2>
              <p className={styles.sectionDescription}>
                High-quality, scalable and intelligent solutions tailored to your needs.
              </p>
              <div className={styles.sectionAccent}></div>
            </div>
            
            <div className={styles.coreServicesGrid}>
              {coreServices.map((service) => {
                const config = SERVICE_CONFIG[service.title] || SERVICE_CONFIG.other;
                const accentClass = config.accent.charAt(0).toUpperCase() + config.accent.slice(1);

                return (
                  <div 
                    key={service.id} 
                    className={`${styles.coreServiceCard} ${styles[`coreServiceCard${accentClass}`]}`}
                  >
                    <div className={`${styles.serviceIcon} ${styles[`serviceIcon${accentClass}`]}`}>
                      {config.icon}
                    </div>
                    <h3 className={styles.serviceTitle}>{config.formattedTitle}</h3>
                    <p className={styles.serviceDescription}>{service.description}</p>
                    
                    {service.services && service.services.length > 0 && (
                      <ul className={styles.featureList}>
                        {service.services.map((feature, index) => (
                          <li key={index} className={styles.featureItem}>
                            <CheckCircle size={22} />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Other Freelance Services Section */}
      {freelanceItems.length > 0 && (
        <section className={styles.otherServicesSection}>
          <div className={styles.container}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionLabel}>OTHER SERVICES</h2>
              <p className={styles.sectionDescription}>
                Additional expertise to help grow your business and build amazing digital experiences.
              </p>
              <div className={styles.sectionAccent}></div>
            </div>
            
            <div className={styles.freelanceCard}>
              <div className={styles.freelanceLeft}>
                <div className={styles.topBar}></div>
                <h3 className={styles.freelanceTitle}>
                  Flexible Solutions<br />for Your Unique Needs
                </h3>
                <p className={styles.freelanceDescription}>
                  {freelanceServiceGroup?.description ||
                    "Beyond core development, I offer a range of additional services to help you maintain, improve, and scale your digital presence."}
                </p>
                <div className={styles.bottomBar}></div>
              </div>

              <div className={styles.freelanceRight}>
                <div className={styles.freelanceList}>
                  {freelanceItems.map((item, index) => (
                    <div key={index} className={styles.freelanceItem}>
                      <div className={styles.freelanceCheckIcon}>
                        <CheckCircle size={30} />
                      </div>
                      <div className={styles.freelanceItemContent}>
                        <h4 className={styles.freelanceItemTitle}>{item}</h4>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Final CTA Section */}
      <section className={styles.ctaSection}>
        <div className={styles.container}>
          <div className={styles.ctaCard}>
            <div className={styles.ctaLeft}>
              <div className={styles.ctaIcon}>
                <Send size={48} />
              </div>
            </div>
            <div className={styles.ctaCenter}>
              <p className={styles.ctaSubtitle}>Have a project in mind?</p>
              <h2 className={styles.ctaTitle}>
                Let's build something <span className={styles.ctaGradient}>amazing</span> together!
              </h2>
              <p className={styles.ctaDescription}>
                I'm open to full-time roles, freelance projects and exciting collaborations.
              </p>
            </div>
            <div className={styles.ctaRight}>
              <Link href="/contact">
                <button className={styles.ctaButton}>
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