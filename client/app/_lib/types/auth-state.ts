import { AuthUser } from "./auth-user";

export interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isInitializing: boolean;

  setAuth: (accessToken: string, user: AuthUser) => void;
  setAccessToken: (accessToken: string) => void;
  setUser: (user: AuthUser | null) => void;
  setInitializing: (value: boolean) => void;
  clearAuth: () => void;
}
