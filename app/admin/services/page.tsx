"use client";

import { useState, useEffect } from "react";
import {
  createService,
  getServices,
  updateService,
  deleteService,
} from "@/features/services/service.api";
import type { Service, CreateServiceData, ServiceTitle } from "@/features/services/service.types";
import Loading from "@/components/shared/loading";
import ErrorMessage from "@/components/shared/error-message";

export default function ServicesAdminPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState<CreateServiceData>({
    title: "fullstack",
    description: "",
    displayOrder: 0,
    services: [],
  });

  const loadServices = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getServices();
      setServices(data);
    } catch (err) {
      setError("Failed to load services");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadServices();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      if (editingId) {
        await updateService(editingId, formData);
      } else {
        await createService(formData);
      }
      setFormData({
        title: "fullstack",
        description: "",
        displayOrder: 0,
        services: [],
      });
      setEditingId(null);
      setShowForm(false);
      await loadServices();
    } catch (err) {
      setError(editingId ? "Failed to update service" : "Failed to create service");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (service: Service) => {
    setEditingId(service.id);
    setFormData({
      title: service.title,
      description: service.description,
      displayOrder: service.display_order,
      services: service.services || [],
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this service?")) return;

    try {
      setError(null);
      await deleteService(id);
      await loadServices();
    } catch (err) {
      setError("Failed to delete service");
    }
  };

  const handleCancel = () => {
    setFormData({
      title: "fullstack",
      description: "",
      displayOrder: 0,
      services: [],
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleServicesChange = (value: string) => {
    const items = value.split(",").map(item => item.trim()).filter(item => item);
    setFormData({ ...formData, services: items });
  };

  if (loading) return <Loading />;
  if (error && !services.length) return <ErrorMessage message={error} />;

  return (
    <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto", color: "#000000" }}>
      <h1 style={{ marginBottom: "20px", color: "#000000" }}>Services Management</h1>

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
          Add New Service
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
            {editingId ? "Edit Service" : "New Service"}
          </h2>

          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "5px", color: "#000000" }}>Title *</label>
            <select
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value as ServiceTitle })}
              required
              style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #000000", color: "#000000", backgroundColor: "#ffffff" }}
            >
              <option value="fullstack">Full Stack</option>
              <option value="frontend">Frontend</option>
              <option value="backend">Backend</option>
              <option value="aiml">AI/ML</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "5px", color: "#000000" }}>Description *</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              required
              style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #000000", color: "#000000", backgroundColor: "#ffffff" }}
            />
          </div>

          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "5px", color: "#000000" }}>Services (comma-separated)</label>
            <input
              type="text"
              value={(formData.services || []).join(", ")}
              onChange={(e) => handleServicesChange(e.target.value)}
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
            <th style={{ padding: "12px", textAlign: "left", borderBottom: "2px solid #000000", color: "#000000" }}>Title</th>
            <th style={{ padding: "12px", textAlign: "left", borderBottom: "2px solid #000000", color: "#000000" }}>Description</th>
            <th style={{ padding: "12px", textAlign: "left", borderBottom: "2px solid #000000", color: "#000000" }}>Services</th>
            <th style={{ padding: "12px", textAlign: "left", borderBottom: "2px solid #000000", color: "#000000" }}>Order</th>
            <th style={{ padding: "12px", textAlign: "left", borderBottom: "2px solid #000000", color: "#000000" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {services.map((service) => (
            <tr key={service.id} style={{ borderBottom: "1px solid #cccccc" }}>
              <td style={{ padding: "12px", borderBottom: "1px solid #cccccc", color: "#000000" }}>
                <strong>{service.title}</strong>
              </td>
              <td style={{ padding: "12px", borderBottom: "1px solid #cccccc", color: "#000000" }}>
                {service.description.length > 100 
                  ? `${service.description.substring(0, 100)}...` 
                  : service.description}
              </td>
              <td style={{ padding: "12px", borderBottom: "1px solid #cccccc", color: "#000000" }}>
                {service.services.length > 0 
                  ? service.services.slice(0, 3).join(", ") + (service.services.length > 3 ? "..." : "")
                  : "-"}
              </td>
              <td style={{ padding: "12px", borderBottom: "1px solid #cccccc", color: "#000000" }}>{service.display_order}</td>
              <td style={{ padding: "12px", borderBottom: "1px solid #cccccc", color: "#000000" }}>
                <button
                  onClick={() => handleEdit(service)}
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
                  onClick={() => handleDelete(service.id)}
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

      {services.length === 0 && (
        <div style={{ padding: "40px", textAlign: "center", color: "#000000" }}>
          No services found. Create your first service above.
        </div>
      )}
    </div>
  );
}