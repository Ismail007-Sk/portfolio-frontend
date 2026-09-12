"use client";

import { useEffect, useState } from "react";
import { 
  MapPin, Phone, Mail, GitBranch, Link as LinkIcon,
  Download, ArrowRight
} from "lucide-react";
import styles from "./about.module.css";
import Loading from "@/components/shared/loading";
import ErrorMessage from "@/components/shared/error-message";
import { getProfiles } from "@/features/profile/profile.api";
import { Profile } from "@/features/profile/profile.types";

export default function About() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  function getFileUrl(url: string | null): string | null {
    if (!url) return null;
    if (url.startsWith("http://") || url.startsWith("https://")) return url;
    return `${process.env.NEXT_PUBLIC_API_URL}${url}`;
  }

  useEffect(() => {
    let isMounted = true;

    async function fetchProfileData() {
      try {
        setIsLoading(true);
        setError(null);
        
        const profiles = await getProfiles();
        if (!isMounted) return;

        if (profiles && profiles.length > 0) {
          setProfile(profiles[0]);
        } else {
          setProfile(null);
        }
      } catch (err: any) {
        if (!isMounted) return;
        setError(err?.response?.data?.message || err?.message || "Failed to load profile data");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    fetchProfileData();
    return () => { isMounted = false; };
  }, []);

  if (isLoading) return <Loading />;
  if (error) return <ErrorMessage message={error} />;
  if (!profile) return <ErrorMessage message="No profile details found." />;

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

const contactInfo = [
  { 
    icon: <MapPin size={35} />, 
    label: "Location", 
    value: "India, Kolkata", 
    url: "https://www.google.com/maps/search/?api=1&query=Kolkata+India" 
  },
  { 
    icon: <Phone size={35} />, 
    label: "Phone", 
    value: profile.phone_number || "+91 XXXXX XXXXX", 
    url: profile.phone_number 
      ? `https://wa.me/${profile.phone_number.replace(/[^0-9]/g, "")}` 
      : "#" 
  },
  { 
    icon: <Mail size={35} />, 
    label: "Email", 
    value: null, 
    url: `mailto:${profile.email}` 
  },
  { 
    icon: <GitBranch size={35} />, 
    label: "GitHub", 
    value: null, 
    url: profile.github_url 
  },
  { 
    icon: <LinkIcon size={35} />, 
    label: "LinkedIn", 
    value: null, 
    url: profile.linkedin_url 
  }
];

  const profilePic = getFileUrl(profile.profile_pic_url);
  const cvFile = getFileUrl(profile.cv_url);

  return (
    <div className={styles.page}>
      {/* 1. Main About Section */}
      <section className={styles.aboutSection}>
        <div className={styles.container}>
          <div className={styles.aboutGrid}>
            
            {/* Left - Full Height Profile Image Card */}
            <div className={styles.profileCard}>
              {profilePic ? (
                <img 
                  src={profilePic} 
                  alt={profile.name} 
                  className={styles.profileImage}
                />
              ) : (
                <div className={styles.profileAvatarFallback}>
                  <span>{getInitials(profile.name)}</span>
                </div>
              )}
            </div>

            {/* Right - About Text Content */}
            <div className={styles.contentSection}>
              <div className={styles.aboutHeader}>
                <p className={styles.aboutLabel}>ABOUT ME</p>
                <h1 className={styles.aboutTitle}>
                  Who I Am
                  <div className={styles.titleAccent}></div>
                </h1>
              </div>
              
              <p className={styles.aboutDescription}>
                {profile.about_me || "No description provided."}
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 2. Standalone Contact Cards Row (Single Line above CTA) */}
      <section className={styles.contactCardsSection}>
        <div className={styles.container}>
          <div className={styles.contactRowContainer}>
            {contactInfo.map((item, index) => (
              <a 
                key={index} 
                href={item.url || "#"} 
                target={item.url?.startsWith("mailto:") ? "_self" : "_blank"} 
                rel="noopener noreferrer" 
                className={styles.contactCard}
              >
                <div className={styles.contactIcon}>{item.icon}</div>
                <div className={styles.contactDetails}>
                  <span className={styles.contactLabel}>{item.label}</span>
                  {item.value && (
                    <span className={styles.contactValue}>{item.value}</span>
                  )}
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>
      {/* 3. CTA Section */}
      <section className={styles.ctaSection}>
        <div className={styles.container}>
          <div className={styles.ctaCard}>
            <div className={styles.ctaLeft}>
              <h2 className={styles.ctaTitle}>
                I'm always open to new <span className={styles.ctaGradient}>opportunities</span> and exciting <span className={styles.ctaGradient}>projects</span>.
              </h2>
            </div>
            <div className={styles.ctaRight}>
              
              <a href={`mailto:${profile.email}`} className={styles.ctaButtonPrimary}>
                Hire Me
                <ArrowRight size={22} />
              </a>
              {cvFile && (
                <a 
                  href={cvFile} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  download 
                  className={styles.ctaButtonSecondary}
                >
                  Download CV
                  <Download size={22} />
                </a>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}