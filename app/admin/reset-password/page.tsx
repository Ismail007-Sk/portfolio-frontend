"use client";

import { useState } from "react";
import { resetPassword } from "@/features/auth/auth.api";
import type { ResetPasswordData } from "@/features/auth/auth.types";

export default function ResetPasswordAdminPage() {
  const [formData, setFormData] = useState<ResetPasswordData>({
    password: "",
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (formData.password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsSubmitting(true);

    try {
      await resetPassword(formData);
      setSuccessMessage("Password reset successfully.");
      setFormData({ password: "" });
      setConfirmPassword("");
    } catch (err) {
      setError("Failed to reset password. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto", color: "#000000" }}>
      <h1 style={{ marginBottom: "20px", color: "#000000" }}>Reset Password</h1>

      {error && (
        <div style={{ padding: "10px", marginBottom: "20px", backgroundColor: "#fee", border: "1px solid #fcc", borderRadius: "4px", color: "#000000" }}>
          {error}
        </div>
      )}

      {successMessage && (
        <div style={{ padding: "10px", marginBottom: "20px", backgroundColor: "#f5f5f5", border: "1px solid #000000", borderRadius: "4px", color: "#000000" }}>
          {successMessage}
        </div>
      )}

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
        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", marginBottom: "5px", color: "#000000" }}>New Password *</label>
          <input
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ password: e.target.value })}
            required
            style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #000000", color: "#000000", backgroundColor: "#ffffff" }}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", marginBottom: "5px", color: "#000000" }}>Confirm Password *</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
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
            {isSubmitting ? "Saving..." : "Reset Password"}
          </button>
        </div>
      </form>
    </div>
  );
}