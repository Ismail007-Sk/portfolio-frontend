"use client";

import { useState, useEffect } from "react";
import {
  createSkill,
  getSkills,
  updateSkill,
  deleteSkill,
} from "@/features/skills/skill.api";
import type { Skill, CreateSkillData } from "@/features/skills/skill.types";
import Loading from "@/components/shared/loading";
import ErrorMessage from "@/components/shared/error-message";

export default function SkillsAdminPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState<CreateSkillData>({
    name: "",
    category: "",
    icon: null,
  });

  const loadSkills = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getSkills();
      setSkills(data);
    } catch (err) {
      setError("Failed to load skills");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSkills();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      if (editingId) {
        await updateSkill(editingId, formData);
      } else {
        await createSkill(formData);
      }
      setFormData({
        name: "",
        category: "",
        icon: null,
      });
      setEditingId(null);
      setShowForm(false);
      await loadSkills();
    } catch (err) {
      setError(editingId ? "Failed to update skill" : "Failed to create skill");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (skill: Skill) => {
    setEditingId(skill.id);
    setFormData({
      name: skill.name,
      category: skill.category,
      icon: null,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this skill?")) return;

    try {
      setError(null);
      await deleteSkill(id);
      await loadSkills();
    } catch (err) {
      setError("Failed to delete skill");
    }
  };

  const handleCancel = () => {
    setFormData({
      name: "",
      category: "",
      icon: null,
    });
    setEditingId(null);
    setShowForm(false);
  };

  if (loading) return <Loading />;
  if (error && !skills.length) return <ErrorMessage message={error} />;

  return (
    <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto", color: "#000000" }}>
      <h1 style={{ marginBottom: "20px", color: "#000000" }}>Skills Management</h1>

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
          Add New Skill
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
            {editingId ? "Edit Skill" : "New Skill"}
          </h2>

          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "5px", color: "#000000" }}>Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #000000", color: "#000000", backgroundColor: "#ffffff" }}
            />
          </div>

          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "5px", color: "#000000" }}>Category *</label>
            <input
              type="text"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              required
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
            <th style={{ padding: "12px", textAlign: "left", borderBottom: "2px solid #000000", color: "#000000" }}>Icon</th>
            <th style={{ padding: "12px", textAlign: "left", borderBottom: "2px solid #000000", color: "#000000" }}>Name</th>
            <th style={{ padding: "12px", textAlign: "left", borderBottom: "2px solid #000000", color: "#000000" }}>Category</th>
            <th style={{ padding: "12px", textAlign: "left", borderBottom: "2px solid #000000", color: "#000000" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {skills.map((skill) => (
            <tr key={skill.id} style={{ borderBottom: "1px solid #cccccc" }}>
              <td style={{ padding: "12px", borderBottom: "1px solid #cccccc", color: "#000000" }}>
                {skill.icon_url && (
                  <img
                    src={skill.icon_url}
                    alt=""
                    style={{ width: "40px", height: "40px", objectFit: "contain" }}
                  />
                )}
              </td>
              <td style={{ padding: "12px", borderBottom: "1px solid #cccccc", color: "#000000" }}>{skill.name}</td>
              <td style={{ padding: "12px", borderBottom: "1px solid #cccccc", color: "#000000" }}>{skill.category}</td>
              <td style={{ padding: "12px", borderBottom: "1px solid #cccccc", color: "#000000" }}>
                <button
                  onClick={() => handleEdit(skill)}
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
                  onClick={() => handleDelete(skill.id)}
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

      {skills.length === 0 && (
        <div style={{ padding: "40px", textAlign: "center", color: "#000000" }}>
          No skills found. Create your first skill above.
        </div>
      )}
    </div>
  );
}