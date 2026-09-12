// auth.api.ts

import api from "@/lib/api-client";
import type {
  SignupData,
  LoginData,
  ResetPasswordData,
} from "./auth.types";

export async function signup(
  data: SignupData
): Promise<void> {
  await api.post("/signup", data);
}

export async function login(
  data: LoginData
): Promise<void> {
  await api.post("/login", data);
}

export async function resetPassword(
  data: ResetPasswordData
): Promise<void> {
  await api.post("/reset-password", data);
}