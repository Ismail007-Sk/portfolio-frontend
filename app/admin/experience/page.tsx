"use client";

import { useState, useEffect } from "react";
import {
  createExperience,
  getExperience,
  updateExperience,
  deleteExperience,
} from "@/features/experience/experience.api";
import type { Experience, CreateExperienceData } from "@/features/experience/experience.types";
import Loading from "@/components/shared/loading";
import ErrorMessage from "@/components/shared/error-message";

export default function ExperienceAdminPage() {
  const [experienceList, setExperienceList] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState<CreateExperienceData>({
    company: "",
    role: "",
    employmentType: "",
    startDate: "",
    endDate: null,
    isCurrent: false,
    description: "",
    technologies: [],
    displayOrder: 0,
    workStatus: undefined,
    responsibilities: [],
    icon: null,
  });

  const loadExperience = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getExperience();
      setExperienceList(data);
    } catch (err) {
      setError("Failed to load experience");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadExperience();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      if (editingId) {
        await updateExperience(editingId, formData);
      } else {
        await createExperience(formData);
      }
      setFormData({
        company: "",
        role: "",
        employmentType: "",
        startDate: "",
        endDate: null,
        isCurrent: false,
        description: "",
        technologies: [],
        displayOrder: 0,
        workStatus: undefined,
        responsibilities: [],
        icon: null,
      });
      setEditingId(null);
      setShowForm(false);
      await loadExperience();
    } catch (err) {
      setError(editingId ? "Failed to update experience" : "Failed to create experience");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (experience: Experience) => {
    setEditingId(experience.id);
    setFormData({
      company: experience.company,
      role: experience.role,
      employmentType: experience.employment_type || "",
      startDate: experience.start_date,
      endDate: experience.end_date,
      isCurrent: experience.is_current,
      description: experience.description || "",
      technologies: experience.technologies || [],
      displayOrder: experience.display_order,
      workStatus: experience.work_status || undefined,
      responsibilities: experience.responsibilities || [],
      icon: null,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this experience entry?")) return;

    try {
      setError(null);
      await deleteExperience(id);
      await loadExperience();
    } catch (err) {
      setError("Failed to delete experience");
    }
  };

  const handleCancel = () => {
    setFormData({
      company: "",
      role: "",
      employmentType: "",
      startDate: "",
      endDate: null,
      isCurrent: false,
      description: "",
      technologies: [],
      displayOrder: 0,
      workStatus: undefined,
      responsibilities: [],
      icon: null,
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleArrayChange = (field: "technologies" | "responsibilities", value: string) => {
    const items = value.split(",").map(item => item.trim()).filter(item => item);
    setFormData({ ...formData, [field]: items });
  };

  if (loading) return <Loading />;
  if (error && !experienceList.length) return <ErrorMessage message={error} />;

  return (
    <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto", color: "#000000" }}>
      <h1 style={{ marginBottom: "20px", color: "#000000" }}>Experience Management</h1>

      {error && (
        <div style={{ padding: "10px", marginBottom: "20px", backgroundColor: "#fee", border: "1px solid #fcc", borderRadius: "4px", color: "#000000" }}>
          {error}
        </div>
      )}

      {!showForm ? (
        <button
          onClick={() => setShowForm(true)}
          style={{
            padding: "10px 20px",
            marginBottom: "20px",
            backgroundColor: "#0070f3",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Add New Experience
        </button>
      ) : (
        <form
          onSubmit={handleSubmit}
          style={{
            padding: "20px",
            marginBottom: "20px",
            backgroundColor: "#f5f5f5",
            borderRadius: "4px",
            border: "1px solid #cccccc",
            color: "#000000",
          }}
        >
          <h2 style={{ marginBottom: "15px", color: "#000000" }}>
            {editingId ? "Edit Experience" : "New Experience"}
          </h2>

          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "5px", color: "#000000" }}>Company *</label>
            <input
              type="text"
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              required
              style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #000000", color: "#000000", backgroundColor: "#ffffff" }}
            />
          </div>

          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "5px", color: "#000000" }}>Role *</label>
            <input
              type="text"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              required
              style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #000000", color: "#000000", backgroundColor: "#ffffff" }}
            />
          </div>

          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "5px", color: "#000000" }}>Employment Type</label>
            <input
              type="text"
              value={formData.employmentType}
              onChange={(e) => setFormData({ ...formData, employmentType: e.target.value })}
              style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #000000", color: "#000000", backgroundColor: "#ffffff" }}
            />
          </div>

          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "5px", color: "#000000" }}>Start Date *</label>
            <input
              type="date"
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              required
              style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #000000", color: "#000000", backgroundColor: "#ffffff" }}
            />
          </div>

          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "5px", color: "#000000" }}>End Date</label>
            <input
              type="date"
              value={formData.endDate || ""}
              onChange={(e) => setFormData({ ...formData, endDate: e.target.value || null })}
              style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #000000", color: "#000000", backgroundColor: "#ffffff" }}
            />
          </div>

          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "5px", color: "#000000" }}>
              <input
                type="checkbox"
                checked={formData.isCurrent}
                onChange={(e) => setFormData({ ...formData, isCurrent: e.target.checked })}
                style={{ marginRight: "8px" }}
              />
              Current Position
            </label>
          </div>

          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "5px", color: "#000000" }}>Work Status</label>
            <select
              value={formData.workStatus || ""}
              onChange={(e) => setFormData({ ...formData, workStatus: e.target.value as any || undefined })}
              style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #000000", color: "#000000", backgroundColor: "#ffffff" }}
            >
              <option value="">Select status</option>
              <option value="remote">Remote</option>
              <option value="offline">Offline</option>
              <option value="hybrid">Hybrid</option>
            </select>
          </div>

          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "5px", color: "#000000" }}>Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #000000", color: "#000000", backgroundColor: "#ffffff" }}
            />
          </div>

          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "5px", color: "#000000" }}>Technologies (comma-separated)</label>
            <input
              type="text"
              value={(formData.technologies || []).join(", ")}
              onChange={(e) => handleArrayChange("technologies", e.target.value)}
              style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #000000", color: "#000000", backgroundColor: "#ffffff" }}
            />
          </div>

          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "5px", color: "#000000" }}>Responsibilities (comma-separated)</label>
            <input
              type="text"
              value={(formData.responsibilities || []).join(", ")}
              onChange={(e) => handleArrayChange("responsibilities", e.target.value)}
              style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #000000", color: "#000000", backgroundColor: "#ffffff" }}
            />
          </div>

          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "5px", color: "#000000" }}>Display Order</label>
            <input
              type="number"
              value={formData.displayOrder}
              onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 0 })}
              style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #000000", color: "#000000", backgroundColor: "#ffffff" }}
            />
          </div>

          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "5px", color: "#000000" }}>Icon (PNG/JPG/WEBP/SVG, max 10MB)</label>
            <input
              type="file"
              accept=".png,.jpg,.jpeg,.webp,.svg"
              onChange={(e) => setFormData({ ...formData, icon: e.target.files?.[0] || null })}
              style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #000000", color: "#000000", backgroundColor: "#ffffff" }}
            />
          </div>

          <div style={{ display: "flex", gap: "10px" }}>
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                padding: "10px 20px",
                backgroundColor: "#0070f3",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: isSubmitting ? "not-allowed" : "pointer",
              }}
            >
              {isSubmitting ? "Saving..." : editingId ? "Update" : "Create"}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              disabled={isSubmitting}
              style={{
                padding: "10px 20px",
                backgroundColor: "#e0e0e0",
                color: "#000000",
                border: "1px solid #000000",
                borderRadius: "4px",
                cursor: isSubmitting ? "not-allowed" : "pointer",
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <table style={{ width: "100%", borderCollapse: "collapse", backgroundColor: "#ffffff", color: "#000000", border: "1px solid #000000" }}>
        <thead>
          <tr style={{ borderBottom: "2px solid #000000", backgroundColor: "#f0f0f0" }}>
            <th style={{ padding: "12px", textAlign: "left", borderBottom: "2px solid #000000", color: "#000000" }}>Company</th>
            <th style={{ padding: "12px", textAlign: "left", borderBottom: "2px solid #000000", color: "#000000" }}>Role</th>
            <th style={{ padding: "12px", textAlign: "left", borderBottom: "2px solid #000000", color: "#000000" }}>Type</th>
            <th style={{ padding: "12px", textAlign: "left", borderBottom: "2px solid #000000", color: "#000000" }}>Dates</th>
            <th style={{ padding: "12px", textAlign: "left", borderBottom: "2px solid #000000", color: "#000000" }}>Status</th>
            <th style={{ padding: "12px", textAlign: "left", borderBottom: "2px solid #000000", color: "#000000" }}>Order</th>
            <th style={{ padding: "12px", textAlign: "left", borderBottom: "2px solid #000000", color: "#000000" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {experienceList.map((experience) => (
            <tr key={experience.id} style={{ borderBottom: "1px solid #cccccc" }}>
              <td style={{ padding: "12px", borderBottom: "1px solid #cccccc", color: "#000000" }}>
                {experience.icon_url && (
                  <img
                    src={experience.icon_url}
                    alt=""
                    style={{ width: "30px", height: "30px", marginRight: "10px", verticalAlign: "middle" }}
                  />
                )}
                {experience.company}
              </td>
              <td style={{ padding: "12px", borderBottom: "1px solid #cccccc", color: "#000000" }}>{experience.role}</td>
              <td style={{ padding: "12px", borderBottom: "1px solid #cccccc", color: "#000000" }}>{experience.employment_type || "-"}</td>
              <td style={{ padding: "12px", borderBottom: "1px solid #cccccc", color: "#000000" }}>
                {experience.start_date} - {experience.end_date || "Present"}
                {experience.is_current && " (Current)"}
              </td>
              <td style={{ padding: "12px", borderBottom: "1px solid #cccccc", color: "#000000" }}>{experience.work_status || "-"}</td>
              <td style={{ padding: "12px", borderBottom: "1px solid #cccccc", color: "#000000" }}>{experience.display_order}</td>
              <td style={{ padding: "12px", borderBottom: "1px solid #cccccc", color: "#000000" }}>
                <button
                  onClick={() => handleEdit(experience)}
                  style={{
                    padding: "5px 10px",
                    marginRight: "5px",
                    backgroundColor: "#0070f3",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(experience.id)}
                  style={{
                    padding: "5px 10px",
                    backgroundColor: "#dc3545",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {experienceList.length === 0 && (
        <div style={{ padding: "40px", textAlign: "center", color: "#000000" }}>
          No experience entries found. Create your first experience entry above.
        </div>
      )}
    </div>
  );
}