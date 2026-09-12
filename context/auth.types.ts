import { ReactNode } from "react";

export type User = {
  id: string;
  email: string;
  // Add other fields returned by your /profile endpoint
};

export type AuthContextType = {
  user: User | null;
  loading: boolean;
  Log_in: () => Promise<void>;
  Log_out: () => Promise<void>;
};

export type AuthProviderProps = {
  children: ReactNode;
};