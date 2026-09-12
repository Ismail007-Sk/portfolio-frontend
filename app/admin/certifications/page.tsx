"use client";

import { useState, useEffect } from "react";
import {
  createCertification,
  getCertifications,
  updateCertification,
  deleteCertification,
} from "@/features/certificates/certificate.api";
import type { Certification, CreateCertificationData } from "@/features/certificates/certificate.types";
import Loading from "@/components/shared/loading";
import ErrorMessage from "@/components/shared/error-message";

export default function CertificationsAdminPage() {
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState<CreateCertificationData>({
    title: "",
    issuer: "",
    issueDate: "",
    certificateType: "",
    displayOrder: 0,
    certificate: null,
    issuerIcon: null,
  });

  const loadCertifications = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getCertifications();
      setCertifications(data);
    } catch (err) {
      setError("Failed to load certifications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCertifications();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      if (editingId) {
        await updateCertification(editingId, formData);
      } else {
        await createCertification(formData);
      }
      setFormData({
        title: "",
        issuer: "",
        issueDate: "",
        certificateType: "",
        displayOrder: 0,
        certificate: null,
        issuerIcon: null,
      });
      setEditingId(null);
      setShowForm(false);
      await loadCertifications();
    } catch (err) {
      setError(editingId ? "Failed to update certification" : "Failed to create certification");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (certification: Certification) => {
    setEditingId(certification.id);
    setFormData({
      title: certification.title,
      issuer: certification.issuer,
      issueDate: certification.issue_date,
      certificateType: certification.certificate_type || "",
      displayOrder: certification.display_order,
      certificate: null,
      issuerIcon: null,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this certification?")) return;

    try {
      setError(null);
      await deleteCertification(id);
      await loadCertifications();
    } catch (err) {
      setError("Failed to delete certification");
    }
  };

  const handleCancel = () => {
    setFormData({
      title: "",
      issuer: "",
      issueDate: "",
      certificateType: "",
      displayOrder: 0,
      certificate: null,
      issuerIcon: null,
    });
    setEditingId(null);
    setShowForm(false);
  };

  if (loading) return <Loading />;
  if (error && !certifications.length) return <ErrorMessage message={error} />;

  return (
    <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto", color: "#000000" }}>
      <h1 style={{ marginBottom: "20px", color: "#000000" }}>Certifications Management</h1>

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
          Add New Certification
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
            {editingId ? "Edit Certification" : "New Certification"}
          </h2>

          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "5px", color: "#000000" }}>Title *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #000000", color: "#000000", backgroundColor: "#ffffff" }}
            />
          </div>

          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "5px", color: "#000000" }}>Issuer *</label>
            <input
              type="text"
              value={formData.issuer}
              onChange={(e) => setFormData({ ...formData, issuer: e.target.value })}
              required
              style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #000000", color: "#000000", backgroundColor: "#ffffff" }}
            />
          </div>

          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "5px", color: "#000000" }}>Issue Date *</label>
            <input
              type="date"
              value={formData.issueDate}
              onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })}
              required
              style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #000000", color: "#000000", backgroundColor: "#ffffff" }}
            />
          </div>

          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "5px", color: "#000000" }}>Certificate Type</label>
            <input
              type="text"
              value={formData.certificateType}
              onChange={(e) => setFormData({ ...formData, certificateType: e.target.value })}
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
            <label style={{ display: "block", marginBottom: "5px", color: "#000000" }}>Certificate PDF (max 10MB)</label>
            <input
              type="file"
              accept=".pdf"
              onChange={(e) => setFormData({ ...formData, certificate: e.target.files?.[0] || null })}
              style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #000000", color: "#000000", backgroundColor: "#ffffff" }}
            />
          </div>

          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "5px", color: "#000000" }}>Issuer Icon (PNG/JPG/WEBP/SVG, max 10MB)</label>
            <input
              type="file"
              accept=".png,.jpg,.jpeg,.webp,.svg"
              onChange={(e) => setFormData({ ...formData, issuerIcon: e.target.files?.[0] || null })}
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
            <th style={{ padding: "12px", textAlign: "left", borderBottom: "2px solid #000000", color: "#000000" }}>Title</th>
            <th style={{ padding: "12px", textAlign: "left", borderBottom: "2px solid #000000", color: "#000000" }}>Issuer</th>
            <th style={{ padding: "12px", textAlign: "left", borderBottom: "2px solid #000000", color: "#000000" }}>Issue Date</th>
            <th style={{ padding: "12px", textAlign: "left", borderBottom: "2px solid #000000", color: "#000000" }}>Type</th>
            <th style={{ padding: "12px", textAlign: "left", borderBottom: "2px solid #000000", color: "#000000" }}>Order</th>
            <th style={{ padding: "12px", textAlign: "left", borderBottom: "2px solid #000000", color: "#000000" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {certifications.map((certification) => (
            <tr key={certification.id} style={{ borderBottom: "1px solid #cccccc" }}>
              <td style={{ padding: "12px", borderBottom: "1px solid #cccccc", color: "#000000" }}>
                {certification.issuer_icon_url && (
                  <img
                    src={certification.issuer_icon_url}
                    alt=""
                    style={{ width: "30px", height: "30px", marginRight: "10px", verticalAlign: "middle" }}
                  />
                )}
                {certification.title}
              </td>
              <td style={{ padding: "12px", borderBottom: "1px solid #cccccc", color: "#000000" }}>{certification.issuer}</td>
              <td style={{ padding: "12px", borderBottom: "1px solid #cccccc", color: "#000000" }}>{certification.issue_date}</td>
              <td style={{ padding: "12px", borderBottom: "1px solid #cccccc", color: "#000000" }}>{certification.certificate_type || "-"}</td>
              <td style={{ padding: "12px", borderBottom: "1px solid #cccccc", color: "#000000" }}>{certification.display_order}</td>
              <td style={{ padding: "12px", borderBottom: "1px solid #cccccc", color: "#000000" }}>
                <button
                  onClick={() => handleEdit(certification)}
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
                  onClick={() => handleDelete(certification.id)}
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

      {certifications.length === 0 && (
        <div style={{ padding: "40px", textAlign: "center", color: "#000000" }}>
          No certifications found. Create your first certification above.
        </div>
      )}
    </div>
  );
}