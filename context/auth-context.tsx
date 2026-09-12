"use client";

import {
  createContext,
  useEffect,
  useState,
} from "react";

import api from "@/lib/api-client";

import {
  AuthContextType,
  AuthProviderProps,
  User,
} from "./auth.types";

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export default function AuthProvider({
  children,
}: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Runs when the app starts
  useEffect(() => {
    fetchUser();
  }, []);

  // Get current logged-in user
  async function fetchUser(): Promise<void> {
    try {
      const response = await api.get<User>("/me");

      setUser(response.data);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  // Called after successful login
  async function Log_in(): Promise<void> {
    await fetchUser();
  }

  // Called while logging out
  async function Log_out(): Promise<void> {
    try {
      await api.post("/logout");
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setUser(null);
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        Log_in,
        Log_out,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}