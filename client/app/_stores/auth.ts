import { create } from "zustand";
import { AuthState } from "../_lib/types/auth-state";

export const useAuthStore = create<AuthState>()((set) => ({
  user: null,
  accessToken: null,
  isAuthenticated: false,
  isInitializing: true,

  setAuth: (accessToken, user) =>
    set({
      accessToken,
      user,
      isAuthenticated: true,
    }),

  setAccessToken: (accessToken) =>
    set({
      accessToken,
      isAuthenticated: true,
    }),

  setUser: (user) =>
    set({
      user,
      isAuthenticated: true,
    }),

  setInitializing: (isInitializing) => set({ isInitializing }),

  clearAuth: () =>
    set({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isInitializing: false,
    }),
}));
