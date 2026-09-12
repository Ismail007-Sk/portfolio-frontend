"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import api from "@/lib/api-client";
import { useAuth } from "@/hooks/use-auth";
import { LoginData } from "@/features/auth/auth.types";

export default function AuthPage() {
  const router = useRouter();
  const { Log_in } = useAuth();

  const [formData, setFormData] = useState<LoginData>({
    name: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    try {
      setLoading(true);
      setError("");

      await api.post("/login", formData);

      await Log_in();

      router.replace("/admin");
    } catch (error) {
      setError("Invalid name or password.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          width: "100%",
          maxWidth: "400px",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          padding: "24px",
          border: "1px solid #ddd",
          borderRadius: "8px",
        }}
      >
        <h1 style={{ margin: 0, textAlign: "center" }}>
          Login
        </h1>

        <input
          type="text"
          placeholder="Name"
          value={formData.name}
          onChange={(event) =>
            setFormData({
              ...formData,
              name: event.target.value,
            })
          }
          style={{
            padding: "12px",
            fontSize: "16px",
          }}
        />

        <input
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={(event) =>
            setFormData({
              ...formData,
              password: event.target.value,
            })
          }
          style={{
            padding: "12px",
            fontSize: "16px",
          }}
        />

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: "12px",
            fontSize: "16px",
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {error && (
          <p
            style={{
              margin: 0,
              textAlign: "center",
            }}
          >
            {error}
          </p>
        )}
      </form>
    </main>
  );
}

