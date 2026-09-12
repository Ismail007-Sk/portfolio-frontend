// auth.types.ts

export type SignupData = {
  name: string;
  password: string;
};

export type LoginData = {
  name: string;
  password: string;
};

export type ResetPasswordData = {
  password: string;
};