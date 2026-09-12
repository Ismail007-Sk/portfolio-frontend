"use client";

import { useEffect, useState, useMemo } from "react";
import { FaGithub } from "react-icons/fa";
import styles from "./project.module.css";
import {
  ArrowLeft,
  ArrowRight,
  ExternalLink,
  PlayCircle,
  Target,
  Lightbulb,
  Layers,
  BookOpenIcon
} from "lucide-react";

import Loading from "@/components/shared/loading";
import ErrorMessage from "@/components/shared/error-message";
import {
  getProjects,
  getProjectById,
} from "@/features/projects/project.api";
import {
  Project,
  ProjectById,
  ProjectImage,
} from "@/features/projects/project.types";

export default function ProjectPage() {
  const [projectsList, setProjectsList] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [activeProject, setActiveProject] = useState<ProjectById | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [thumbnailImages, setThumbnailImages] = useState<Record<string, ProjectImage>>({});
  const [projectCarouselRef, setProjectCarouselRef] = useState<HTMLDivElement | null>(null);
  const [isLoadingProjects, setIsLoadingProjects] = useState(true);
  const [error, setError] = useState<string | null>(null);

  function getFileUrl(url: string | null): string | null {
    if (!url) return null;
    if (url.startsWith("http://") || url.startsWith("https://")) return url;
    return `${process.env.NEXT_PUBLIC_API_URL}${url}`;
  }

  useEffect(() => {
    let isMounted = true;

    async function fetchProjects() {
      try {
        setIsLoadingProjects(true);
        setError(null);
        const projects = await getProjects();
        if (!isMounted) return;

        if (!projects || projects.length === 0) {
          setProjectsList([]);
          return;
        }

        setProjectsList(projects);
        setSelectedProjectId(projects[0].id);

        const detailResults = await Promise.all(
          projects.map(async (project) => {
            try {
              const detailedProject = await getProjectById(project.id);
              const primaryImage = detailedProject.images?.find((image) => image.display_order === 1) ?? null;
              return { projectId: project.id, project: detailedProject, image: primaryImage };
            } catch {
              return { projectId: project.id, project: null, image: null };
            }
          })
        );

        if (!isMounted) return;

        const thumbnails: Record<string, ProjectImage> = {};
        const detailedProjects: Record<string, ProjectById> = {};

        detailResults.forEach(({ projectId, project, image }) => {
          if (project) detailedProjects[projectId] = project;
          if (image) thumbnails[projectId] = image;
        });

        setThumbnailImages(thumbnails);

        const firstProjectDetail = detailedProjects[projects[0].id];
        if (firstProjectDetail) setActiveProject(firstProjectDetail);
      } catch (err: any) {
        if (!isMounted) return;
        setError(err?.response?.data?.message || err?.message || "Failed to load projects list");
      } finally {
        if (isMounted) setIsLoadingProjects(false);
      }
    }

    fetchProjects();
    return () => { isMounted = false; };
  }, []);

  useEffect(() => {
    if (!selectedProjectId) return;
    if (activeProject?.id === selectedProjectId && activeProject.images) {
      setActiveImageIndex(0);
      return;
    }

    let isMounted = true;

    async function fetchProjectDetail() {
      try {
        setError(null);
        setActiveImageIndex(0);

        const detailedProject = await getProjectById(selectedProjectId!);
        if (isMounted) setActiveProject(detailedProject);
      } catch (err: any) {
        if (!isMounted) return;
        setActiveProject(null);
        setError(err?.response?.data?.message || err?.message || "Failed to load project details");
      }
    }

    fetchProjectDetail();
    return () => { isMounted = false; };
  }, [selectedProjectId]);

  const sortedImages = useMemo(() => {
    if (!activeProject?.images || activeProject.images.length === 0) return [];
    return [...activeProject.images].sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0));
  }, [activeProject]);

  const currentImage: ProjectImage | null = sortedImages[activeImageIndex] || null;

  const handlePrevImage = () => {
    if (sortedImages.length <= 1) return;
    setActiveImageIndex((prev) => (prev === 0 ? sortedImages.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    if (sortedImages.length <= 1) return;
    setActiveImageIndex((prev) => (prev === sortedImages.length - 1 ? 0 : prev + 1));
  };

  const handleScrollProjectsLeft = () => {
    projectCarouselRef?.scrollBy({ left: -200, behavior: "smooth" });
  };

  const handleScrollProjectsRight = () => {
    projectCarouselRef?.scrollBy({ left: 200, behavior: "smooth" });
  };

  const showProblemAndSolution = Boolean(activeProject?.problem?.trim() && activeProject?.solution?.trim());

  if (isLoadingProjects) return <Loading />;
  if (error) return <ErrorMessage message={error} />;
  if (projectsList.length === 0) return <ErrorMessage message="No projects found." />;

  return (
    <div className={styles.container}>
      <main className={styles.mainContent}>
        <h1 className={styles.projectTitle}>{activeProject?.title || "Project Overview"}</h1>

        {/* Hero Showcase */}
        <div className={styles.heroShowcase}>
          {sortedImages.length > 1 && (
            <button className={styles.carouselArrowLeft} onClick={handlePrevImage} type="button">
              <ArrowLeft size={30} />
            </button>
          )}

          <div className={styles.tabletDevice}>
            <div className={styles.cameraDot}></div>
            <div className={styles.tabletScreen}>
              {currentImage ? (
                <img
                  src={getFileUrl(currentImage.image_url) || ""}
                  alt={currentImage.alt_text || activeProject?.title || "Project Screenshot"}
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                />
              ) : (
                <h2 style={{ margin: "auto", color: "#9ca3af" }}> Not available </h2>
              )}
            </div>
          </div>

          {sortedImages.length > 1 && (
            <button className={styles.carouselArrowRight} onClick={handleNextImage} type="button">
              <ArrowRight size={30} />
            </button>
          )}
        </div>

        {/* Thumbnail Project List Carousel */}
        <div className={styles.projectCarouselContainer}>
          <button 
            className={styles.projectCarouselArrow} 
            onClick={handleScrollProjectsLeft} 
            type="button"
            aria-label="Scroll left"
          >
            <ArrowLeft size={25} />
          </button>

          <div ref={setProjectCarouselRef} className={styles.projectCarouselViewport}>
            <div className={styles.projectCarouselTrack}>
              {projectsList.map((project) => {
                const isActive = project.id === selectedProjectId;
                const primaryImg = thumbnailImages[project.id];
                const thumbnailUrl = getFileUrl(primaryImg?.image_url ?? null);

                return (
                  <div
                    key={project.id}
                    onClick={() => {
                      if (project.id === selectedProjectId) return;
                      setSelectedProjectId(project.id);
                      setActiveImageIndex(0);
                    }}
                    className={`${styles.thumbCard} ${isActive ? styles.thumbCardActive : ""}`}
                  >
                    <div className={styles.thumbImagePlaceholder}>
                      {thumbnailUrl && (
                        <img
                          src={thumbnailUrl}
                          alt={primaryImg?.alt_text || project.title}
                          className={styles.thumbImg}
                        />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <button 
            className={styles.projectCarouselArrow} 
            onClick={handleScrollProjectsRight} 
            type="button"
            aria-label="Scroll right"
          >
            <ArrowRight size={25} />
          </button>
        </div>

        {/* Action Buttons Row */}
        {activeProject && (
          <div className={styles.actionButtonsRow}>
            {activeProject.live_demo_url && (
              <a href={activeProject.live_demo_url} target="_blank" rel="noopener noreferrer" className={styles.liveDemoBtn}>
                <ExternalLink size={35} /> Live Demo
              </a>
            )}
            {activeProject.demo_video_url && (
              <a href={activeProject.demo_video_url} target="_blank" rel="noopener noreferrer" className={styles.outlineBtn}>
                <PlayCircle size={35} /> Demo Video
              </a>
            )}
            {activeProject.github_url && (
              <a href={activeProject.github_url} target="_blank" rel="noopener noreferrer" className={styles.outlineBtn}>
                <FaGithub size={35} /> GitHub
              </a>
            )}
            {activeProject.status && (
              <div className={styles.statusBadge}>
                <span className={styles.greenDot}></span> {activeProject.status.replace("_", " ")}
              </div>
            )}
            {activeProject.project_category && (
              <div className={styles.categoryBadge}>{activeProject.project_category}</div>
            )}
          </div>
        )}

        {/* Info Cards Section */}
        {activeProject && (
          <div className={styles.infoCardsSection}>
            {showProblemAndSolution ? (
              <>
                <div className={styles.infoCard}>
                  <div className={styles.cardHeader}>
                    <div className={styles.cardIconBox}><Target size={40} color="#a855f7" /></div>
                    <h3>Problem Statement</h3>
                  </div>
                  <p>{activeProject.problem}</p>
                </div>

                <div className={styles.infoCard}>
                  <div className={styles.cardHeader}>
                    <div className={styles.cardIconBox}><Lightbulb size={40} color="#a855f7" /></div>
                    <h3>Solution</h3>
                  </div>
                  <p>{activeProject.solution}</p>
                </div>
              </>
            ) : activeProject.full_description && (
              <div className={styles.infoCard}>
                <div className={styles.cardHeader}>
                  <div className={styles.cardIconBox}><BookOpenIcon size={40} color="#a855f7" /></div>
                  <h3>Description</h3>
                </div>
                <p>{activeProject.full_description}</p>
              </div>
            )}

            {activeProject?.tech_stack?.length > 0 && (
              <div className={styles.infoCard}>
                <div className={styles.cardHeader}>
                  <div className={styles.cardIconBox}><Layers size={40} color="#a855f7" /></div>
                  <h3>Tech Stack</h3>
                </div>
                <div className={styles.techStackGrid}>
                  {activeProject.tech_stack.map((tech, index) => (
                    <div key={`${tech}-${index}`} className={styles.techPill}>
                      <span>{tech}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}