"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  createProjectImage,
  updateProjectImage,
  deleteProjectImage,
} from "@/features/projects/project.api";
import type {
  Project,
  ProjectById,
  ProjectImage,
  CreateProjectData,
  ProjectStatus,
} from "@/features/projects/project.types";

const initialForm: CreateProjectData = {
  title: "",
  problem: "",
  solution: "",
  fullDescription: "",
  techStack: [],
  githubUrl: "",
  liveDemoUrl: "",
  demoVideoUrl: "",
  projectCategory: "",
  isFeatured: false,
  displayOrder: 0,
  status: "in_progress",
};

const colors = {
  black: "#000000",
  white: "#ffffff",
  muted: "#f5f5f5",
  blue: "#0070f3",
  green: "#28a745",
  red: "#dc3545",
  border: "#000000",
  textMuted: "#666666",
};

type ProjectFormProps = {
  initialData: CreateProjectData;
  editing: boolean;
  saving: boolean;
  onSubmit: (data: CreateProjectData) => Promise<void>;
  onCancel: () => void;
};

function ProjectForm({
  initialData,
  editing,
  saving,
  onSubmit,
  onCancel,
}: ProjectFormProps) {
  const [form, setForm] = useState<CreateProjectData>(initialData);
  const [techInput, setTechInput] = useState("");

  useEffect(() => {
    setForm(initialData);
    setTechInput("");
  }, [initialData]);

  function updateField<K extends keyof CreateProjectData>(
    key: K,
    value: CreateProjectData[K]
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function addTech() {
    const value = techInput.trim();
    if (!value) return;

    setForm((prev) => ({
      ...prev,
      techStack: Array.from(
        new Set([...(prev.techStack ?? []), value])
      ),
    }));
    setTechInput("");
  }

  function removeTech(index: number) {
    setForm((prev) => ({
      ...prev,
      techStack: (prev.techStack ?? []).filter((_, i) => i !== index),
    }));
  }

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void onSubmit(form);
  }

  return (
    <section style={styles.panel}>
      <div style={styles.panelHeader}>
        <div>
          <h2 style={styles.panelTitle}>
            {editing ? "Edit Project" : "Create Project"}
          </h2>
          <p style={styles.panelSubtitle}>
            {editing
              ? "Update project information and publishing settings."
              : "Add a new project to your portfolio."}
          </p>
        </div>
        {editing && (
          <span style={styles.editBadge}>EDITING</span>
        )}
      </div>

      <form onSubmit={submit} style={styles.form}>
        <div style={styles.twoColumn}>
          <Field label="Title" required>
            <input
              required
              value={form.title}
              onChange={(e) => updateField("title", e.target.value)}
              placeholder="Project title"
              style={styles.input}
            />
          </Field>

          <Field label="Category">
            <input
              value={form.projectCategory ?? ""}
              onChange={(e) =>
                updateField("projectCategory", e.target.value)
              }
              placeholder="Web App, SaaS, Portfolio..."
              style={styles.input}
            />
          </Field>
        </div>

        <Field label="Problem Statement">
          <textarea
            rows={3}
            value={form.problem ?? ""}
            onChange={(e) => updateField("problem", e.target.value)}
            placeholder="What problem does this project solve?"
            style={styles.textarea}
          />
        </Field>

        <Field label="Solution">
          <textarea
            rows={3}
            value={form.solution ?? ""}
            onChange={(e) => updateField("solution", e.target.value)}
            placeholder="How does the project solve the problem?"
            style={styles.textarea}
          />
        </Field>

        <Field label="Full Description">
          <textarea
            rows={6}
            value={form.fullDescription ?? ""}
            onChange={(e) =>
              updateField("fullDescription", e.target.value)
            }
            placeholder="Detailed project description..."
            style={styles.textarea}
          />
        </Field>

        <Field label="Tech Stack">
          <div style={styles.inlineInput}>
            <input
              value={techInput}
              onChange={(e) => setTechInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addTech();
                }
              }}
              placeholder="e.g. Next.js"
              style={{ ...styles.input, flex: 1 }}
            />
            <button
              type="button"
              onClick={addTech}
              style={styles.secondaryButton}
            >
              Add
            </button>
          </div>

          {!!form.techStack?.length && (
            <div style={styles.tagList}>
              {form.techStack.map((tech, index) => (
                <span key={`${tech}-${index}`} style={styles.tag}>
                  {tech}
                  <button
                    type="button"
                    onClick={() => removeTech(index)}
                    style={styles.tagRemove}
                    aria-label={`Remove ${tech}`}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </Field>

        <div style={styles.threeColumn}>
          <Field label="GitHub URL">
            <input
              type="url"
              value={form.githubUrl ?? ""}
              onChange={(e) => updateField("githubUrl", e.target.value)}
              placeholder="https://github.com/..."
              style={styles.input}
            />
          </Field>

          <Field label="Live Demo URL">
            <input
              type="url"
              value={form.liveDemoUrl ?? ""}
              onChange={(e) =>
                updateField("liveDemoUrl", e.target.value)
              }
              placeholder="https://..."
              style={styles.input}
            />
          </Field>

          <Field label="Demo Video URL">
            <input
              type="url"
              value={form.demoVideoUrl ?? ""}
              onChange={(e) =>
                updateField("demoVideoUrl", e.target.value)
              }
              placeholder="https://youtube.com/..."
              style={styles.input}
            />
          </Field>
        </div>

        <div style={styles.threeColumn}>
          <Field label="Display Order">
            <input
              type="number"
              min={0}
              value={form.displayOrder ?? 0}
              onChange={(e) =>
                updateField("displayOrder", Number(e.target.value))
              }
              style={styles.input}
            />
          </Field>

          <Field label="Status">
            <select
              value={form.status ?? "in_progress"}
              onChange={(e) =>
                updateField(
                  "status",
                  e.target.value as ProjectStatus
                )
              }
              style={styles.input}
            >
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="archived">Archived</option>
            </select>
          </Field>

          <label style={styles.checkboxField}>
            <input
              type="checkbox"
              checked={form.isFeatured ?? false}
              onChange={(e) =>
                updateField("isFeatured", e.target.checked)
              }
              style={styles.checkbox}
            />
            <span>
              <strong>Featured Project</strong>
              <small style={styles.checkboxHint}>
                Show this project as featured.
              </small>
            </span>
          </label>
        </div>

        <div style={styles.formActions}>
          <button
            type="submit"
            disabled={saving}
            style={{
              ...styles.primaryButton,
              opacity: saving ? 0.65 : 1,
            }}
          >
            {saving
              ? "Saving..."
              : editing
                ? "Update Project"
                : "Create Project"}
          </button>

          {editing && (
            <button
              type="button"
              onClick={onCancel}
              disabled={saving}
              style={styles.secondaryButton}
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </section>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div style={styles.field}>
      <label style={styles.label}>
        {label}
        {required && <span style={styles.required}> *</span>}
      </label>
      {children}
    </div>
  );
}

type ImageManagerProps = {
  project: ProjectById;
  onProjectChange: (project: ProjectById) => void;
  setError: (message: string) => void;
  setMessage: (message: string) => void;
};

function ImageManager({
  project,
  onProjectChange,
  setError,
  setMessage,
}: ImageManagerProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [altText, setAltText] = useState("");
  const [displayOrder, setDisplayOrder] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [imageAction, setImageAction] = useState<string | null>(null);

  const sortedImages = useMemo(
    () =>
      [...(project.images ?? [])].sort(
        (a, b) => a.display_order - b.display_order
      ),
    [project.images]
  );

  function selectFile(event: React.ChangeEvent<HTMLInputElement>) {
    const selected = event.target.files?.[0];

    if (!selected) {
      setFile(null);
      return;
    }

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/svg+xml",
    ];

    if (!allowedTypes.includes(selected.type)) {
      setError("Only JPG, JPEG, PNG, WEBP, and SVG formats are permitted.");
      event.target.value = "";
      setFile(null);
      return;
    }

    if (selected.size > 10 * 1024 * 1024) {
      setError("File size limit is 10 MB.");
      event.target.value = "";
      setFile(null);
      return;
    }

    setFile(selected);
    setError("");
  }

  async function uploadImage(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!file) {
      setError("Please choose an image.");
      return;
    }

    try {
      setUploading(true);
      setError("");
      setMessage("");

      const created = await createProjectImage({
        projectId: project.id,
        image: file,
        altText: altText.trim() || undefined,
        displayOrder,
      });

      onProjectChange({
        ...project,
        images: [...project.images, created],
      });

      setFile(null);
      setAltText("");
      setDisplayOrder(0);

      if (fileRef.current) fileRef.current.value = "";

      setMessage("Image uploaded successfully.");
    } catch (error) {
      console.error(error);
      setError("Failed to upload project image.");
    } finally {
      setUploading(false);
    }
  }

  async function saveImage(
    image: ProjectImage,
    nextAltText: string,
    nextOrder: number
  ) {
    try {
      setImageAction(`update-${image.id}`);
      setError("");
      setMessage("");

      const updated = await updateProjectImage(image.id, {
        altText: nextAltText.trim(),
        displayOrder: nextOrder,
      });

      onProjectChange({
        ...project,
        images: project.images.map((item) =>
          item.id === image.id ? updated : item
        ),
      });

      setMessage("Image details updated.");
    } catch (error) {
      console.error(error);
      setError("Failed to update image.");
    } finally {
      setImageAction(null);
    }
  }

  async function removeImage(image: ProjectImage) {
    if (!window.confirm("Delete this image permanently?")) return;

    try {
      setImageAction(`delete-${image.id}`);
      setError("");
      setMessage("");

      await deleteProjectImage(image.id);

      onProjectChange({
        ...project,
        images: project.images.filter(
          (item) => item.id !== image.id
        ),
      });

      setMessage("Image deleted successfully.");
    } catch (error) {
      console.error(error);
      setError("Failed to delete image.");
    } finally {
      setImageAction(null);
    }
  }

  return (
    <section style={styles.panel}>
      <div style={styles.panelHeader}>
        <div>
          <h2 style={styles.panelTitle}>Project Images</h2>
          <p style={styles.panelSubtitle}>
            Manage screenshots and portfolio media for this project.
          </p>
        </div>
        <span style={styles.countBadge}>
          {project.images.length} {project.images.length === 1 ? "IMAGE" : "IMAGES"}
        </span>
      </div>

      {sortedImages.length > 0 ? (
        <div style={styles.imageGrid}>
          {sortedImages.map((image) => (
            <ProjectImageCard
              key={image.id}
              image={image}
              action={imageAction}
              onUpdate={saveImage}
              onDelete={removeImage}
            />
          ))}
        </div>
      ) : (
        <div style={styles.emptyState}>
          <strong>No images yet</strong>
          <span>Upload the first project screenshot below.</span>
        </div>
      )}

      <form onSubmit={uploadImage} style={styles.uploadBox}>
        <div>
          <h3 style={styles.subHeading}>Upload New Image</h3>
          <p style={styles.panelSubtitle}>
            JPG, JPEG, PNG, WEBP or SVG. Maximum size: 10 MB.
          </p>
        </div>

        <div style={styles.twoColumn}>
          <Field label="Image File" required>
            <input
              ref={fileRef}
              type="file"
              accept=".jpg,.jpeg,.png,.webp,.svg,image/jpeg,image/png,image/webp,image/svg+xml"
              onChange={selectFile}
              style={styles.fileInput}
            />
            {file && (
              <small style={styles.fileName}>
                Selected: {file.name}
              </small>
            )}
          </Field>

          <Field label="Alt Text">
            <input
              value={altText}
              onChange={(e) => setAltText(e.target.value)}
              placeholder="Describe the image"
              style={styles.input}
            />
          </Field>
        </div>

        <div style={styles.uploadFooter}>
          <Field label="Display Order">
            <input
              type="number"
              min={0}
              value={displayOrder}
              onChange={(e) =>
                setDisplayOrder(Number(e.target.value))
              }
              style={styles.input}
            />
          </Field>

          <button
            type="submit"
            disabled={uploading}
            style={{
              ...styles.greenButton,
              opacity: uploading ? 0.65 : 1,
            }}
          >
            {uploading ? "Uploading..." : "Upload Image"}
          </button>
        </div>
      </form>
    </section>
  );
}

function ProjectImageCard({
  image,
  action,
  onUpdate,
  onDelete,
}: {
  image: ProjectImage;
  action: string | null;
  onUpdate: (
    image: ProjectImage,
    altText: string,
    displayOrder: number
  ) => Promise<void>;
  onDelete: (image: ProjectImage) => Promise<void>;
}) {
  const [altText, setAltText] = useState(image.alt_text ?? "");
  const [displayOrder, setDisplayOrder] = useState(image.display_order);

  useEffect(() => {
    setAltText(image.alt_text ?? "");
    setDisplayOrder(image.display_order);
  }, [image.alt_text, image.display_order]);

  const updating = action === `update-${image.id}`;
  const deleting = action === `delete-${image.id}`;
  const busy = Boolean(action);

  return (
    <article style={styles.imageCard}>
      <div style={styles.imagePreview}>
        <img
          src={image.image_url}
          alt={image.alt_text ?? "Project image"}
          style={styles.image}
        />
      </div>

      <div style={styles.imageMeta}>
        <span style={styles.orderBadge}>
          Order {image.display_order}
        </span>
        <span style={styles.idText}>
          {image.id.slice(0, 8)}...
        </span>
      </div>

      <Field label="Alt Text">
        <input
          value={altText}
          onChange={(e) => setAltText(e.target.value)}
          style={styles.inputSmall}
        />
      </Field>

      <Field label="Display Order">
        <input
          type="number"
          min={0}
          value={displayOrder}
          onChange={(e) =>
            setDisplayOrder(Number(e.target.value))
          }
          style={styles.inputSmall}
        />
      </Field>

      <div style={styles.cardActions}>
        <button
          type="button"
          disabled={busy}
          onClick={() =>
            void onUpdate(image, altText, displayOrder)
          }
          style={{
            ...styles.secondaryButton,
            flex: 1,
            opacity: updating || busy ? 0.65 : 1,
          }}
        >
          {updating ? "Saving..." : "Update"}
        </button>

        <button
          type="button"
          disabled={busy}
          onClick={() => void onDelete(image)}
          style={{
            ...styles.dangerButton,
            flex: 1,
            opacity: deleting || busy ? 0.65 : 1,
          }}
        >
          {deleting ? "Deleting..." : "Delete"}
        </button>
      </div>
    </article>
  );
}

export default function ProjectsPage() {
  const { user, loading: authLoading } = useAuth();

  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] =
    useState<ProjectById | null>(null);

  const [editingProjectId, setEditingProjectId] =
    useState<string | null>(null);
  const [formInitialData, setFormInitialData] =
    useState<CreateProjectData>(initialForm);

  const [loading, setLoading] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [savingProject, setSavingProject] = useState(false);
  const [deletingProjectId, setDeletingProjectId] =
    useState<string | null>(null);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [statusFilter, setStatusFilter] =
    useState<ProjectStatus | "all">("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!authLoading && user) {
      void fetchProjects();
    }
  }, [authLoading, user]);

  async function fetchProjects() {
    try {
      setLoading(true);
      setError("");

      const data = await getProjects();
      setProjects(data);
    } catch (error) {
      console.error(error);
      setError("Failed to load projects.");
    } finally {
      setLoading(false);
    }
  }

  async function selectProject(id: string) {
    try {
      setDetailLoading(true);
      setError("");
      setMessage("");

      const detail = await getProjectById(id);
      setSelectedProject(detail);
      setMessage("Project details loaded.");
    } catch (error) {
      console.error(error);
      setError("Failed to load project details.");
    } finally {
      setDetailLoading(false);
    }
  }

  function startCreate() {
    setEditingProjectId(null);
    setFormInitialData({ ...initialForm, techStack: [] });
    setError("");
    setMessage("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function startEdit(project: Project) {
    setEditingProjectId(project.id);
    setFormInitialData({
      title: project.title,
      problem: project.problem ?? "",
      solution: project.solution ?? "",
      fullDescription: project.full_description ?? "",
      techStack: [...(project.tech_stack ?? [])],
      githubUrl: project.github_url ?? "",
      liveDemoUrl: project.live_demo_url ?? "",
      demoVideoUrl: project.demo_video_url ?? "",
      projectCategory: project.project_category ?? "",
      isFeatured: project.is_featured,
      displayOrder: project.display_order,
      status: project.status,
    });

    setError("");
    setMessage("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function cancelEdit() {
    setEditingProjectId(null);
    setFormInitialData({ ...initialForm, techStack: [] });
  }

  async function submitProject(data: CreateProjectData) {
    try {
      setSavingProject(true);
      setError("");
      setMessage("");

      if (editingProjectId) {
        const updated = await updateProject(editingProjectId, data);

        setProjects((prev) =>
          prev.map((project) =>
            project.id === updated.id ? updated : project
          )
        );

        // Project update response intentionally contains project fields,
        // while images belong to ProjectById. Preserve the selected detail.
        if (selectedProject?.id === updated.id) {
          setSelectedProject((prev) =>
            prev ? { ...updated, images: prev.images } : null
          );
        }

        setMessage("Project updated successfully.");
      } else {
        const created = await createProject(data);
        setProjects((prev) => [...prev, created]);
        setMessage("Project created successfully.");
      }

      cancelEdit();
    } catch (error) {
      console.error(error);
      setError(
        editingProjectId
          ? "Failed to update project."
          : "Failed to create project."
      );
    } finally {
      setSavingProject(false);
    }
  }

  async function removeProject(id: string) {
    const project = projects.find((item) => item.id === id);
    if (!project) return;

    if (
      !window.confirm(
        `Delete "${project.title}" permanently? This action cannot be undone.`
      )
    ) {
      return;
    }

    try {
      setDeletingProjectId(id);
      setError("");
      setMessage("");

      await deleteProject(id);

      setProjects((prev) =>
        prev.filter((project) => project.id !== id)
      );

      if (selectedProject?.id === id) {
        setSelectedProject(null);
      }

      if (editingProjectId === id) {
        cancelEdit();
      }

      setMessage("Project deleted successfully.");
    } catch (error) {
      console.error(error);
      setError("Failed to delete project.");
    } finally {
      setDeletingProjectId(null);
    }
  }

  function handleSelectedProjectChange(project: ProjectById) {
    setSelectedProject(project);
  }

  const filteredProjects = useMemo(() => {
    const query = search.trim().toLowerCase();

    return [...projects]
      .filter((project) =>
        statusFilter === "all"
          ? true
          : project.status === statusFilter
      )
      .filter((project) => {
        if (!query) return true;

        return (
          project.title.toLowerCase().includes(query) ||
          (project.project_category ?? "")
            .toLowerCase()
            .includes(query) ||
          project.tech_stack.some((tech) =>
            tech.toLowerCase().includes(query)
          )
        );
      })
      .sort((a, b) => a.display_order - b.display_order);
  }, [projects, search, statusFilter]);

  const stats = useMemo(
    () => ({
      total: projects.length,
      completed: projects.filter(
        (project) => project.status === "completed"
      ).length,
      inProgress: projects.filter(
        (project) => project.status === "in_progress"
      ).length,
      featured: projects.filter(
        (project) => project.is_featured
      ).length,
    }),
    [projects]
  );

  if (authLoading) {
    return <StateScreen text="Loading authentication..." />;
  }

  if (!user) {
    return <StateScreen text="Please login to access projects management." />;
  }

  return (
    <main style={styles.page}>
      <header style={styles.header}>
        <div>
          <p style={styles.eyebrow}>ADMIN / PORTFOLIO</p>
          <h1 style={styles.title}>Projects Management</h1>
          <p style={styles.subtitle}>
            Create, organize, edit and manage project media from one place.
          </p>
        </div>

        <button
          type="button"
          onClick={startCreate}
          style={styles.primaryButton}
        >
          + New Project
        </button>
      </header>

      {(message || error) && (
        <div
          role="alert"
          style={error ? styles.errorAlert : styles.successAlert}
        >
          <strong>{error ? "Error" : "Success"}</strong>
          <span>{error || message}</span>
          <button
            type="button"
            onClick={() => {
              setError("");
              setMessage("");
            }}
            style={styles.alertClose}
          >
            ×
          </button>
        </div>
      )}

      <section style={styles.statsGrid}>
        <Stat label="Total Projects" value={stats.total} />
        <Stat label="Completed" value={stats.completed} />
        <Stat label="In Progress" value={stats.inProgress} />
        <Stat label="Featured" value={stats.featured} />
      </section>

      <ProjectForm
        initialData={formInitialData}
        editing={Boolean(editingProjectId)}
        saving={savingProject}
        onSubmit={submitProject}
        onCancel={cancelEdit}
      />

      <section style={styles.panel}>
        <div style={styles.panelHeader}>
          <div>
            <h2 style={styles.panelTitle}>All Projects</h2>
            <p style={styles.panelSubtitle}>
              Select a project to open its detailed admin view.
            </p>
          </div>
          {loading && <span style={styles.loadingText}>Refreshing...</span>}
        </div>

        <div style={styles.toolbar}>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search title, category or technology..."
            style={{ ...styles.input, flex: 1 }}
          />

          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(
                e.target.value as ProjectStatus | "all"
              )
            }
            style={styles.input}
          >
            <option value="all">All Statuses</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="archived">Archived</option>
          </select>
        </div>

        {loading && projects.length === 0 ? (
          <div style={styles.emptyState}>Loading projects...</div>
        ) : filteredProjects.length === 0 ? (
          <div style={styles.emptyState}>
            <strong>No projects found</strong>
            <span>
              {projects.length
                ? "Try changing the search or filter."
                : "Create your first project above."}
            </span>
          </div>
        ) : (
          <div style={styles.tableWrap}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Project</th>
                  <th style={styles.th}>Category</th>
                  <th style={styles.th}>Status</th>
                  <th style={styles.th}>Featured</th>
                  <th style={styles.th}>Order</th>
                  <th style={{ ...styles.th, textAlign: "right" }}>
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredProjects.map((project) => {
                  const selected =
                    selectedProject?.id === project.id;
                  const deleting =
                    deletingProjectId === project.id;

                  return (
                    <tr
                      key={project.id}
                      style={{
                        ...styles.tr,
                        backgroundColor: selected
                          ? "#f5f5f5"
                          : colors.white,
                      }}
                    >
                      <td style={styles.td}>
                        <div style={styles.projectCell}>
                          <strong>{project.title}</strong>
                          <span style={styles.idText}>
                            {project.id.slice(0, 8)}...
                          </span>
                        </div>
                      </td>

                      <td style={styles.td}>
                        {project.project_category || "—"}
                      </td>

                      <td style={styles.td}>
                        <StatusBadge status={project.status} />
                      </td>

                      <td style={styles.td}>
                        {project.is_featured ? "Yes" : "No"}
                      </td>

                      <td style={styles.td}>
                        {project.display_order}
                      </td>

                      <td style={styles.td}>
                        <div style={styles.actionRow}>
                          <button
                            type="button"
                            onClick={() =>
                              void selectProject(project.id)
                            }
                            style={styles.primarySmall}
                            disabled={detailLoading}
                          >
                            {selected ? "Selected" : "View"}
                          </button>

                          <button
                            type="button"
                            onClick={() => startEdit(project)}
                            style={styles.secondarySmall}
                            disabled={deleting}
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              void removeProject(project.id)
                            }
                            style={styles.dangerSmall}
                            disabled={deleting}
                          >
                            {deleting ? "Deleting..." : "Delete"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {selectedProject && (
        <section style={styles.detailPanel}>
          <div style={styles.detailHeader}>
            <div>
              <p style={styles.eyebrow}>PROJECT DETAIL</p>
              <h2 style={styles.detailTitle}>
                {selectedProject.title}
              </h2>
              <p style={styles.panelSubtitle}>
                Full project data and image CRUD.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setSelectedProject(null)}
              style={styles.secondaryButton}
            >
              Close
            </button>
          </div>

          {detailLoading ? (
            <div style={styles.emptyState}>Loading project details...</div>
          ) : (
            <>
              <div style={styles.detailGrid}>
                <Detail label="Category" value={selectedProject.project_category} />
                <Detail label="Status" value={selectedProject.status} />
                <Detail
                  label="Featured"
                  value={selectedProject.is_featured ? "Yes" : "No"}
                />
                <Detail
                  label="Display Order"
                  value={String(selectedProject.display_order)}
                />
              </div>

              <div style={styles.descriptionGrid}>
                <DetailBlock
                  label="Problem"
                  value={selectedProject.problem}
                />
                <DetailBlock
                  label="Solution"
                  value={selectedProject.solution}
                />
                <DetailBlock
                  label="Description"
                  value={selectedProject.full_description}
                />
              </div>

              <div style={styles.tagList}>
                {selectedProject.tech_stack.map((tech) => (
                  <span key={tech} style={styles.tagStatic}>
                    {tech}
                  </span>
                ))}
              </div>

              <div style={styles.linkRow}>
                {selectedProject.github_url && (
                  <a
                    href={selectedProject.github_url}
                    target="_blank"
                    rel="noreferrer"
                    style={styles.linkButton}
                  >
                    GitHub
                  </a>
                )}
                {selectedProject.live_demo_url && (
                  <a
                    href={selectedProject.live_demo_url}
                    target="_blank"
                    rel="noreferrer"
                    style={styles.linkButton}
                  >
                    Live Demo
                  </a>
                )}
                {selectedProject.demo_video_url && (
                  <a
                    href={selectedProject.demo_video_url}
                    target="_blank"
                    rel="noreferrer"
                    style={styles.linkButton}
                  >
                    Demo Video
                  </a>
                )}
              </div>

              <ImageManager
                project={selectedProject}
                onProjectChange={handleSelectedProjectChange}
                setError={setError}
                setMessage={setMessage}
              />
            </>
          )}
        </section>
      )}
    </main>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div style={styles.statCard}>
      <span style={styles.statLabel}>{label}</span>
      <strong style={styles.statValue}>{value}</strong>
    </div>
  );
}

function StatusBadge({ status }: { status: ProjectStatus }) {
  const label =
    status === "in_progress"
      ? "In Progress"
      : status === "completed"
        ? "Completed"
        : "Archived";

  return (
    <span
      style={{
        ...styles.statusBadge,
        backgroundColor:
          status === "completed"
            ? "#d4edda"
            : status === "archived"
              ? "#f5f5f5"
              : "#e7f1ff",
      }}
    >
      {label}
    </span>
  );
}

function Detail({ label, value }: { label: string; value: string | null }) {
  return (
    <div style={styles.detailItem}>
      <span style={styles.detailLabel}>{label}</span>
      <strong>{value || "—"}</strong>
    </div>
  );
}

function DetailBlock({
  label,
  value,
}: {
  label: string;
  value: string | null;
}) {
  return (
    <div style={styles.detailBlock}>
      <span style={styles.detailLabel}>{label}</span>
      <p style={styles.detailText}>{value || "No information provided."}</p>
    </div>
  );
}

function StateScreen({ text }: { text: string }) {
  return (
    <main style={styles.stateScreen}>
      <p>{text}</p>
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    padding: "28px",
    backgroundColor: colors.white,
    color: colors.black,
    fontFamily: "Arial, sans-serif",
    boxSizing: "border-box",
  },
  header: {
    maxWidth: "1400px",
    margin: "0 auto 24px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
    gap: "20px",
    borderBottom: "2px solid #000000",
    paddingBottom: "20px",
  },
  eyebrow: {
    margin: "0 0 6px",
    fontSize: "11px",
    fontWeight: 700,
    letterSpacing: "1.2px",
    color: colors.textMuted,
  },
  title: {
    margin: 0,
    fontSize: "30px",
    lineHeight: 1.1,
    fontWeight: 800,
  },
  subtitle: {
    margin: "6px 0 0",
    fontSize: "13px",
    lineHeight: 1.5,
    color: colors.textMuted,
  },
  panel: {
    maxWidth: "1400px",
    margin: "0 auto 24px",
    border: "1px solid #000000",
    borderRadius: "6px",
    backgroundColor: colors.white,
    overflow: "hidden",
  },
  detailPanel: {
    maxWidth: "1400px",
    margin: "0 auto 24px",
    border: "2px solid #000000",
    borderRadius: "6px",
    backgroundColor: colors.white,
    overflow: "hidden",
  },
  panelHeader: {
    padding: "18px 20px",
    borderBottom: "1px solid #000000",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "16px",
  },
  panelTitle: {
    margin: 0,
    fontSize: "19px",
    fontWeight: 800,
  },
  panelSubtitle: {
    margin: "5px 0 0",
    fontSize: "12px",
    lineHeight: 1.5,
    color: colors.textMuted,
  },
  detailHeader: {
    padding: "20px",
    borderBottom: "1px solid #000000",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "20px",
  },
  detailTitle: {
    margin: 0,
    fontSize: "25px",
    fontWeight: 800,
  },
  form: {
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  field: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
    minWidth: 0,
  },
  label: {
    fontSize: "12px",
    fontWeight: 700,
  },
  required: {
    color: colors.red,
  },
  input: {
    width: "100%",
    minHeight: "38px",
    padding: "8px 10px",
    border: "1px solid #000000",
    borderRadius: "4px",
    backgroundColor: colors.white,
    color: colors.black,
    fontSize: "13px",
    boxSizing: "border-box",
    outline: "none",
  },
  inputSmall: {
    width: "100%",
    minHeight: "34px",
    padding: "7px 8px",
    border: "1px solid #000000",
    borderRadius: "4px",
    backgroundColor: colors.white,
    color: colors.black,
    fontSize: "12px",
    boxSizing: "border-box",
  },
  textarea: {
    width: "100%",
    padding: "9px 10px",
    border: "1px solid #000000",
    borderRadius: "4px",
    backgroundColor: colors.white,
    color: colors.black,
    fontSize: "13px",
    lineHeight: 1.5,
    resize: "vertical",
    boxSizing: "border-box",
  },
  fileInput: {
    width: "100%",
    padding: "8px",
    border: "1px solid #000000",
    borderRadius: "4px",
    backgroundColor: colors.white,
    color: colors.black,
    fontSize: "12px",
    boxSizing: "border-box",
  },
  fileName: {
    color: colors.textMuted,
    fontSize: "11px",
  },
  twoColumn: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: "16px",
  },
  threeColumn: {
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    gap: "16px",
  },
  inlineInput: {
    display: "flex",
    gap: "8px",
    alignItems: "stretch",
  },
  checkboxField: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    paddingTop: "22px",
    cursor: "pointer",
    fontSize: "13px",
  },
  checkbox: {
    width: "17px",
    height: "17px",
    accentColor: colors.blue,
  },
  checkboxHint: {
    display: "block",
    marginTop: "3px",
    color: colors.textMuted,
    fontSize: "11px",
    fontWeight: 400,
  },
  tagList: {
    display: "flex",
    flexWrap: "wrap",
    gap: "7px",
    marginTop: "8px",
  },
  tag: {
    display: "inline-flex",
    alignItems: "center",
    gap: "7px",
    padding: "5px 8px",
    border: "1px solid #000000",
    borderRadius: "4px",
    backgroundColor: colors.muted,
    fontSize: "11px",
    fontWeight: 700,
  },
  tagStatic: {
    display: "inline-block",
    padding: "5px 9px",
    border: "1px solid #000000",
    borderRadius: "4px",
    backgroundColor: colors.muted,
    fontSize: "11px",
    fontWeight: 700,
  },
  tagRemove: {
    border: 0,
    background: "transparent",
    color: colors.red,
    cursor: "pointer",
    padding: 0,
    fontSize: "15px",
    lineHeight: 1,
  },
  formActions: {
    display: "flex",
    gap: "8px",
    paddingTop: "4px",
  },
  primaryButton: {
    padding: "10px 17px",
    border: "1px solid #000000",
    borderRadius: "4px",
    backgroundColor: colors.blue,
    color: colors.white,
    fontSize: "13px",
    fontWeight: 700,
    cursor: "pointer",
  },
  greenButton: {
    alignSelf: "flex-end",
    padding: "10px 17px",
    border: "1px solid #000000",
    borderRadius: "4px",
    backgroundColor: colors.green,
    color: colors.white,
    fontSize: "13px",
    fontWeight: 700,
    cursor: "pointer",
  },
  secondaryButton: {
    padding: "10px 16px",
    border: "1px solid #000000",
    borderRadius: "4px",
    backgroundColor: colors.white,
    color: colors.black,
    fontSize: "13px",
    fontWeight: 700,
    cursor: "pointer",
  },
  dangerButton: {
    padding: "10px 16px",
    border: "1px solid #000000",
    borderRadius: "4px",
    backgroundColor: colors.red,
    color: colors.white,
    fontSize: "13px",
    fontWeight: 700,
    cursor: "pointer",
  },
  editBadge: {
    padding: "5px 8px",
    border: "1px solid #000000",
    borderRadius: "4px",
    backgroundColor: "#e7f1ff",
    fontSize: "10px",
    fontWeight: 800,
  },
  countBadge: {
    padding: "6px 9px",
    border: "1px solid #000000",
    borderRadius: "4px",
    backgroundColor: colors.muted,
    fontSize: "10px",
    fontWeight: 800,
  },
  statsGrid: {
    maxWidth: "1400px",
    margin: "0 auto 24px",
    display: "grid",
    gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
    gap: "12px",
  },
  statCard: {
    border: "1px solid #000000",
    borderRadius: "6px",
    padding: "14px 16px",
    backgroundColor: colors.white,
  },
  statLabel: {
    display: "block",
    fontSize: "11px",
    fontWeight: 700,
    color: colors.textMuted,
  },
  statValue: {
    display: "block",
    marginTop: "4px",
    fontSize: "25px",
  },
  toolbar: {
    display: "flex",
    gap: "10px",
    padding: "14px 20px",
    borderBottom: "1px solid #000000",
  },
  tableWrap: {
    width: "100%",
    overflowX: "auto",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    minWidth: "800px",
  },
  th: {
    padding: "11px 12px",
    borderBottom: "1px solid #000000",
    backgroundColor: colors.muted,
    textAlign: "left",
    fontSize: "11px",
    fontWeight: 800,
  },
  tr: {
    borderBottom: "1px solid #dddddd",
  },
  td: {
    padding: "11px 12px",
    fontSize: "12px",
    verticalAlign: "middle",
  },
  projectCell: {
    display: "flex",
    flexDirection: "column",
    gap: "3px",
  },
  idText: {
    fontSize: "10px",
    color: colors.textMuted,
  },
  actionRow: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "5px",
    flexWrap: "wrap",
  },
  primarySmall: {
    padding: "6px 9px",
    border: "1px solid #000000",
    borderRadius: "4px",
    backgroundColor: colors.blue,
    color: colors.white,
    fontSize: "11px",
    fontWeight: 700,
    cursor: "pointer",
  },
  secondarySmall: {
    padding: "6px 9px",
    border: "1px solid #000000",
    borderRadius: "4px",
    backgroundColor: colors.white,
    color: colors.black,
    fontSize: "11px",
    fontWeight: 700,
    cursor: "pointer",
  },
  dangerSmall: {
    padding: "6px 9px",
    border: "1px solid #000000",
    borderRadius: "4px",
    backgroundColor: colors.red,
    color: colors.white,
    fontSize: "11px",
    fontWeight: 700,
    cursor: "pointer",
  },
  statusBadge: {
    display: "inline-block",
    padding: "4px 7px",
    border: "1px solid #000000",
    borderRadius: "4px",
    fontSize: "10px",
    fontWeight: 700,
  },
  loadingText: {
    fontSize: "11px",
    color: colors.textMuted,
  },
  detailGrid: {
    padding: "18px 20px",
    display: "grid",
    gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
    gap: "10px",
    borderBottom: "1px solid #dddddd",
  },
  detailItem: {
    display: "flex",
    flexDirection: "column",
    gap: "5px",
    padding: "10px",
    border: "1px solid #dddddd",
    borderRadius: "4px",
    fontSize: "12px",
  },
  detailLabel: {
    fontSize: "10px",
    textTransform: "uppercase",
    letterSpacing: "0.6px",
    color: colors.textMuted,
    fontWeight: 800,
  },
  descriptionGrid: {
    padding: "18px 20px",
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    gap: "12px",
  },
  detailBlock: {
    padding: "12px",
    border: "1px solid #dddddd",
    borderRadius: "4px",
  },
  detailText: {
    margin: "8px 0 0",
    fontSize: "12px",
    lineHeight: 1.6,
    whiteSpace: "pre-wrap",
  },
  linkRow: {
    padding: "0 20px 18px",
    display: "flex",
    gap: "8px",
    flexWrap: "wrap",
  },
  linkButton: {
    display: "inline-block",
    padding: "7px 10px",
    border: "1px solid #000000",
    borderRadius: "4px",
    color: colors.black,
    backgroundColor: colors.white,
    textDecoration: "none",
    fontSize: "11px",
    fontWeight: 700,
  },
  imageGrid: {
    padding: "18px 20px",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))",
    gap: "14px",
  },
  imageCard: {
    border: "1px solid #000000",
    borderRadius: "5px",
    padding: "10px",
    backgroundColor: colors.white,
    display: "flex",
    flexDirection: "column",
    gap: "9px",
  },
  imagePreview: {
    width: "100%",
    height: "155px",
    border: "1px solid #000000",
    borderRadius: "4px",
    backgroundColor: colors.muted,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
    display: "block",
    objectFit: "cover",
  },
  imageMeta: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "8px",
  },
  orderBadge: {
    fontSize: "10px",
    fontWeight: 800,
  },
  cardActions: {
    display: "flex",
    gap: "6px",
    marginTop: "2px",
  },
  uploadBox: {
    margin: "0 20px 20px",
    padding: "16px",
    border: "1px dashed #000000",
    borderRadius: "5px",
    backgroundColor: "#fafafa",
    display: "flex",
    flexDirection: "column",
    gap: "14px",
  },
  subHeading: {
    margin: 0,
    fontSize: "15px",
    fontWeight: 800,
  },
  uploadFooter: {
    display: "grid",
    gridTemplateColumns: "minmax(160px, 220px) 1fr",
    alignItems: "end",
    gap: "12px",
  },
  emptyState: {
    minHeight: "120px",
    padding: "25px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "6px",
    textAlign: "center",
    color: colors.textMuted,
    fontSize: "12px",
  },
  successAlert: {
    maxWidth: "1400px",
    margin: "0 auto 18px",
    padding: "11px 13px",
    border: "1px solid #28a745",
    borderRadius: "4px",
    backgroundColor: "#d4edda",
    color: colors.black,
    display: "flex",
    alignItems: "center",
    gap: "9px",
    fontSize: "12px",
  },
  errorAlert: {
    maxWidth: "1400px",
    margin: "0 auto 18px",
    padding: "11px 13px",
    border: "1px solid #dc3545",
    borderRadius: "4px",
    backgroundColor: "#f8d7da",
    color: colors.black,
    display: "flex",
    alignItems: "center",
    gap: "9px",
    fontSize: "12px",
  },
  alertClose: {
    marginLeft: "auto",
    border: 0,
    background: "transparent",
    color: colors.black,
    fontSize: "18px",
    cursor: "pointer",
    lineHeight: 1,
  },
  stateScreen: {
    minHeight: "100vh",
    padding: "30px",
    backgroundColor: colors.white,
    color: colors.black,
    fontFamily: "Arial, sans-serif",
  },
};

export {};
