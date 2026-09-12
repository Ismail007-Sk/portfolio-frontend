"use client";

import { useState, useEffect } from "react";
import {
  createEducation,
  getEducation,
  updateEducation,
  deleteEducation,
} from "@/features/education/education.api";
import type { Education, CreateEducationData } from "@/features/education/education.types";
import Loading from "@/components/shared/loading";
import ErrorMessage from "@/components/shared/error-message";

export default function EducationAdminPage() {
  const [educationList, setEducationList] = useState<Education[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState<CreateEducationData>({
    institution: "",
    degree: "",
    fieldOfStudy: "",
    startDate: "",
    endDate: null,
    description: "",
    displayOrder: 0,
  });

  const loadEducation = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getEducation();
      setEducationList(data);
    } catch (err) {
      setError("Failed to load education");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEducation();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      if (editingId) {
        await updateEducation(editingId, formData);
      } else {
        await createEducation(formData);
      }
      setFormData({
        institution: "",
        degree: "",
        fieldOfStudy: "",
        startDate: "",
        endDate: null,
        description: "",
        displayOrder: 0,
      });
      setEditingId(null);
      setShowForm(false);
      await loadEducation();
    } catch (err) {
      setError(editingId ? "Failed to update education" : "Failed to create education");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (education: Education) => {
    setEditingId(education.id);
    setFormData({
      institution: education.institution,
      degree: education.degree,
      fieldOfStudy: education.field_of_study || "",
      startDate: education.start_date || "",
      endDate: education.end_date,
      description: education.description || "",
      displayOrder: education.display_order,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this education entry?")) return;

    try {
      setError(null);
      await deleteEducation(id);
      await loadEducation();
    } catch (err) {
      setError("Failed to delete education");
    }
  };

  const handleCancel = () => {
    setFormData({
      institution: "",
      degree: "",
      fieldOfStudy: "",
      startDate: "",
      endDate: null,
      description: "",
      displayOrder: 0,
    });
    setEditingId(null);
    setShowForm(false);
  };

  if (loading) return <Loading />;
  if (error && !educationList.length) return <ErrorMessage message={error} />;

  return (
    <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto", color: "#000000" }}>
      <h1 style={{ marginBottom: "20px", color: "#000000" }}>Education Management</h1>

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
          Add New Education
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
            {editingId ? "Edit Education" : "New Education"}
          </h2>

          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "5px", color: "#000000" }}>Institution *</label>
            <input
              type="text"
              value={formData.institution}
              onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
              required
              style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #000000", color: "#000000", backgroundColor: "#ffffff" }}
            />
          </div>

          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "5px", color: "#000000" }}>Degree *</label>
            <input
              type="text"
              value={formData.degree}
              onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
              required
              style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #000000", color: "#000000", backgroundColor: "#ffffff" }}
            />
          </div>

          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "5px", color: "#000000" }}>Field of Study</label>
            <input
              type="text"
              value={formData.fieldOfStudy}
              onChange={(e) => setFormData({ ...formData, fieldOfStudy: e.target.value })}
              style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #000000", color: "#000000", backgroundColor: "#ffffff" }}
            />
          </div>

          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "5px", color: "#000000" }}>Start Date</label>
            <input
              type="date"
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
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
            <label style={{ display: "block", marginBottom: "5px", color: "#000000" }}>Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
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
            <th style={{ padding: "12px", textAlign: "left", borderBottom: "2px solid #000000", color: "#000000" }}>Institution</th>
            <th style={{ padding: "12px", textAlign: "left", borderBottom: "2px solid #000000", color: "#000000" }}>Degree</th>
            <th style={{ padding: "12px", textAlign: "left", borderBottom: "2px solid #000000", color: "#000000" }}>Field of Study</th>
            <th style={{ padding: "12px", textAlign: "left", borderBottom: "2px solid #000000", color: "#000000" }}>Start Date</th>
            <th style={{ padding: "12px", textAlign: "left", borderBottom: "2px solid #000000", color: "#000000" }}>End Date</th>
            <th style={{ padding: "12px", textAlign: "left", borderBottom: "2px solid #000000", color: "#000000" }}>Order</th>
            <th style={{ padding: "12px", textAlign: "left", borderBottom: "2px solid #000000", color: "#000000" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {educationList.map((education) => (
            <tr key={education.id} style={{ borderBottom: "1px solid #cccccc" }}>
              <td style={{ padding: "12px", borderBottom: "1px solid #cccccc", color: "#000000" }}>{education.institution}</td>
              <td style={{ padding: "12px", borderBottom: "1px solid #cccccc", color: "#000000" }}>{education.degree}</td>
              <td style={{ padding: "12px", borderBottom: "1px solid #cccccc", color: "#000000" }}>{education.field_of_study || "-"}</td>
              <td style={{ padding: "12px", borderBottom: "1px solid #cccccc", color: "#000000" }}>{education.start_date || "-"}</td>
              <td style={{ padding: "12px", borderBottom: "1px solid #cccccc", color: "#000000" }}>{education.end_date || "-"}</td>
              <td style={{ padding: "12px", borderBottom: "1px solid #cccccc", color: "#000000" }}>{education.display_order}</td>
              <td style={{ padding: "12px", borderBottom: "1px solid #cccccc", color: "#000000" }}>
                <button
                  onClick={() => handleEdit(education)}
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
                  onClick={() => handleDelete(education.id)}
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

      {educationList.length === 0 && (
        <div style={{ padding: "40px", textAlign: "center", color: "#000000" }}>
          No education entries found. Create your first education entry above.
        </div>
      )}
    </div>
  );
}