"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import Loading from "@/components/shared/loading";
import ErrorMessage from "@/components/shared/error-message";

import { useAuth } from "@/hooks/use-auth";

import {
  createProfile,
  getProfiles,
  getProfileById,
  updateProfile,
  deleteProfile,
} from "@/features/profile/profile.api";

import type {
  Profile,
  CreateProfileData,
} from "@/features/profile/profile.types";

export default function AdminPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);

  const [formData, setFormData] = useState<CreateProfileData>({
    name: "",
    headline: "",
    bio: "",
    aboutMe: "",
    email: "",
    phoneNumber: "",
    linkedinUrl: "",
    githubUrl: "",
    availabilityStatus: "available_for_both",
    profilePic: null,
    cv: null,
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/auth");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      loadProfiles();
    }
  }, [user]);

  async function loadProfiles() {
    try {
      setLoading(true);
      setMessage("");

      const data = await getProfiles();
      setProfiles(data);
    } catch {
      setMessage("Failed to load profiles.");
    } finally {
      setLoading(false);
    }
  }

  async function handleGetProfile(id: string) {
    try {
      setLoading(true);
      setMessage("");

      const profile = await getProfileById(id);

      setSelectedProfile(profile);

      setFormData({
        name: profile.name ?? "",
        headline: profile.headline ?? "",
        bio: profile.bio ?? "",
        aboutMe: profile.about_me ?? "",
        email: profile.email ?? "",
        phoneNumber: profile.phone_number ?? "",
        linkedinUrl: profile.linkedin_url ?? "",
        githubUrl: profile.github_url ?? "",
        availabilityStatus: profile.availability_status ?? "available_for_both",
        profilePic: undefined,
        cv: undefined,
      });
    } catch {
      setMessage("Failed to get profile.");
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setLoading(true);
      setMessage("");

      await createProfile(formData);

      setMessage("Profile created successfully.");
      resetForm();
      await loadProfiles();
    } catch (error: any) {
      const backendMessage =
        error.response?.data?.error?.message ||
        error.response?.data?.message ||
        "Failed to create profile.";
      setMessage(backendMessage);
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!selectedProfile) return;

    try {
      setLoading(true);
      setMessage("");

      await updateProfile(selectedProfile.id, formData);

      setMessage("Profile updated successfully.");
      resetForm();
      await loadProfiles();
    } catch (error: any) {
      const backendMessage =
        error.response?.data?.error?.message ||
        error.response?.data?.message ||
        "Failed to update profile.";
      setMessage(backendMessage);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this profile?")) {
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      await deleteProfile(id);

      setMessage("Profile deleted successfully.");
      resetForm();
      await loadProfiles();
    } catch {
      setMessage("Failed to delete profile.");
    } finally {
      setLoading(false);
    }
  }

  function resetForm() {
    setSelectedProfile(null);

    setFormData({
      name: "",
      headline: "",
      bio: "",
      aboutMe: "",
      email: "",
      phoneNumber: "",
      linkedinUrl: "",
      githubUrl: "",
      availabilityStatus: "available_for_both",
      profilePic: undefined,
      cv: undefined,
    });
  }

  function handleChange(
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  if (authLoading) {
    return <Loading />;
  }

  if (!user) {
    return null;
  }

  return (
    <main
      style={{
        padding: "40px 20px",
        maxWidth: "800px",
        margin: "0 auto",
        fontSize: "18px",
        color: "#000000",
        backgroundColor: "#ffffff",
      }}
    >
      <h1 style={{ fontSize: "32px", marginBottom: "30px", color: "#000000" }}>
        Profile Management
      </h1>

      {message && <ErrorMessage message={message} />}

      {/* Existing Profiles */}
      <section style={{ marginBottom: "40px" }}>
        <h2 style={{ fontSize: "24px", marginBottom: "15px", color: "#000000" }}>
          Existing Profiles
        </h2>

        {loading && <Loading />}

        {profiles.length === 0 && !loading && (
          <p style={{ color: "#000000" }}>No profiles found.</p>
        )}

        {profiles.map((profile) => (
          <div
            key={profile.id}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "14px",
              marginBottom: "12px",
              border: "1px solid #000000",
              borderRadius: "4px",
              backgroundColor: "#ffffff",
              color: "#000000",
              flexWrap: "wrap",
            }}
          >
            <span
              style={{
                flex: 1,
                minWidth: "180px",
                fontSize: "18px",
                fontWeight: "bold",
                color: "#000000",
              }}
            >
              {profile.name}
            </span>

            <button
              type="button"
              onClick={() => handleGetProfile(profile.id)}
              disabled={loading}
              style={{
                padding: "9px 14px",
                fontSize: "16px",
                cursor: loading ? "not-allowed" : "pointer",
                backgroundColor: "#ffffff",
                color: "#000000",
                border: "1px solid #000000",
                borderRadius: "4px",
              }}
            >
              Get Profile
            </button>

            <button
              type="button"
              onClick={() => handleGetProfile(profile.id)}
              disabled={loading}
              style={{
                padding: "9px 14px",
                fontSize: "16px",
                cursor: loading ? "not-allowed" : "pointer",
                backgroundColor: "#0070f3",
                color: "#ffffff",
                border: "none",
                borderRadius: "4px",
              }}
            >
              Edit
            </button>

            <button
              type="button"
              onClick={() => handleDelete(profile.id)}
              disabled={loading}
              style={{
                padding: "9px 14px",
                fontSize: "16px",
                cursor: loading ? "not-allowed" : "pointer",
                backgroundColor: "#dc3545",
                color: "#ffffff",
                border: "none",
                borderRadius: "4px",
              }}
            >
              Delete
            </button>
          </div>
        ))}
      </section>

      <hr style={{ marginBottom: "40px", borderColor: "#000000" }} />

      {/* Create / Update Form */}
      <section>
        <h2 style={{ fontSize: "24px", marginBottom: "20px", color: "#000000" }}>
          {selectedProfile ? "Update Profile" : "Create Profile"}
        </h2>

        <form
          onSubmit={selectedProfile ? handleUpdate : handleCreate}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            backgroundColor: "#f5f5f5",
            padding: "20px",
            borderRadius: "4px",
            border: "1px solid #000000",
          }}
        >
          <input
            name="name"
            placeholder="Name"
            value={formData.name ?? ""}
            onChange={handleChange}
            style={{
              padding: "12px",
              fontSize: "17px",
              color: "#000000",
              backgroundColor: "#ffffff",
              border: "1px solid #000000",
              borderRadius: "4px",
            }}
          />

          <input
            name="headline"
            placeholder="Headline"
            value={formData.headline ?? ""}
            onChange={handleChange}
            style={{
              padding: "12px",
              fontSize: "17px",
              color: "#000000",
              backgroundColor: "#ffffff",
              border: "1px solid #000000",
              borderRadius: "4px",
            }}
          />

          <textarea
            name="bio"
            placeholder="Bio"
            value={formData.bio ?? ""}
            onChange={handleChange}
            rows={4}
            style={{
              padding: "12px",
              fontSize: "17px",
              color: "#000000",
              backgroundColor: "#ffffff",
              border: "1px solid #000000",
              borderRadius: "4px",
            }}
          />

          <textarea
            name="aboutMe"
            placeholder="About Me"
            value={formData.aboutMe ?? ""}
            onChange={handleChange}
            rows={4}
            style={{
              padding: "12px",
              fontSize: "17px",
              color: "#000000",
              backgroundColor: "#ffffff",
              border: "1px solid #000000",
              borderRadius: "4px",
            }}
          />

          <input
            name="email"
            type="email"
            placeholder="Email"
            value={formData.email ?? ""}
            onChange={handleChange}
            style={{
              padding: "12px",
              fontSize: "17px",
              color: "#000000",
              backgroundColor: "#ffffff",
              border: "1px solid #000000",
              borderRadius: "4px",
            }}
          />

          <input
            name="phoneNumber"
            placeholder="Phone Number"
            value={formData.phoneNumber ?? ""}
            onChange={handleChange}
            style={{
              padding: "12px",
              fontSize: "17px",
              color: "#000000",
              backgroundColor: "#ffffff",
              border: "1px solid #000000",
              borderRadius: "4px",
            }}
          />

          <input
            name="linkedinUrl"
            placeholder="LinkedIn URL"
            value={formData.linkedinUrl ?? ""}
            onChange={handleChange}
            style={{
              padding: "12px",
              fontSize: "17px",
              color: "#000000",
              backgroundColor: "#ffffff",
              border: "1px solid #000000",
              borderRadius: "4px",
            }}
          />

          <input
            name="githubUrl"
            placeholder="GitHub URL"
            value={formData.githubUrl ?? ""}
            onChange={handleChange}
            style={{
              padding: "12px",
              fontSize: "17px",
              color: "#000000",
              backgroundColor: "#ffffff",
              border: "1px solid #000000",
              borderRadius: "4px",
            }}
          />

          <select
            name="availabilityStatus"
            value={formData.availabilityStatus ?? "available_for_both"}
            onChange={handleChange}
            style={{
              padding: "12px",
              fontSize: "17px",
              color: "#000000",
              backgroundColor: "#ffffff",
              border: "1px solid #000000",
              borderRadius: "4px",
            }}
          >
            <option value="available_for_jobs">Available for Jobs</option>
            <option value="available_for_freelance">Available for Freelance</option>
            <option value="available_for_both">Available for Both</option>
            <option value="not_available">Not Available</option>
          </select>

          <label style={{ fontSize: "17px", color: "#000000" }}>
            Profile Picture:
            <input
              type="file"
              accept=".jpg,.jpeg,.png,.webp"
              onChange={(event) => {
                const file = event.target.files?.[0];

                if (
                  file &&
                  !["image/jpeg", "image/png", "image/webp"].includes(file.type)
                ) {
                  setMessage("Only JPG, JPEG, PNG, and WEBP images are allowed.");
                  event.target.value = "";
                  setFormData((prev) => ({ ...prev, profilePic: undefined }));
                  return;
                }

                setFormData((prev) => ({ ...prev, profilePic: file }));
                setMessage("");
              }}
              style={{
                display: "block",
                marginTop: "8px",
                fontSize: "16px",
                color: "#000000",
              }}
            />
          </label>

          <label style={{ fontSize: "17px", color: "#000000" }}>
            CV:
            <input
              type="file"
              accept=".pdf,application/pdf"
              onChange={(event) => {
                const file = event.target.files?.[0];

                if (file && file.type !== "application/pdf") {
                  setMessage("Only PDF files are allowed.");
                  event.target.value = "";
                  setFormData((prev) => ({ ...prev, cv: undefined }));
                  return;
                }

                setFormData((prev) => ({ ...prev, cv: file }));
                setMessage("");
              }}
              style={{
                display: "block",
                marginTop: "8px",
                fontSize: "16px",
                color: "#000000",
              }}
            />
          </label>

          <div style={{ display: "flex", gap: "12px", marginTop: "10px" }}>
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: "12px 18px",
                fontSize: "17px",
                cursor: loading ? "not-allowed" : "pointer",
                backgroundColor: "#0070f3",
                color: "#ffffff",
                border: "none",
                borderRadius: "4px",
              }}
            >
              {selectedProfile ? "Update Profile" : "Create Profile"}
            </button>

            {selectedProfile && (
              <button
                type="button"
                onClick={resetForm}
                style={{
                  padding: "12px 18px",
                  fontSize: "17px",
                  cursor: "pointer",
                  backgroundColor: "#e0e0e0",
                  color: "#000000",
                  border: "1px solid #000000",
                  borderRadius: "4px",
                }}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </section>
    </main>
  );
}