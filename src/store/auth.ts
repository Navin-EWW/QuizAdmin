import create from "zustand";
import { AuthState } from "../utils/types";
import { persist } from "zustand/middleware";

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      setUser: (user) => set(() => ({ user: user })),
      setToken: (token) => set(() => ({ token: token })),
      removeAll: () => set(() => ({ token: null, user: null })),
    }),
    {
      name: "auth",
      getStorage: () => {
        let rememberMe = localStorage.getItem("rememberMe");
        if (rememberMe !== null) {
          rememberMe = JSON.parse(rememberMe);
        }
        if (typeof rememberMe === "boolean" && !rememberMe) {
          return sessionStorage;
        }
        return localStorage;
      },
    }
  )
);
