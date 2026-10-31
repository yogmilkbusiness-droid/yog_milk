"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { AdminUser, AdminRole, ADMIN_PRESET_USERS } from "@/lib/mock/admin-auth";

interface AuthContextType {
  user: AdminUser;
  role: AdminRole;
  isAuthenticated: boolean;
  switchRole: (role: AdminRole) => void;
  login: (email?: string, role?: AdminRole) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = "yog_milk_admin_session_role";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<AdminRole>("OPERATIONS_MANAGER");
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);

  useEffect(() => {
    try {
      const savedRole = localStorage.getItem(STORAGE_KEY) as AdminRole;
      if (savedRole && ADMIN_PRESET_USERS[savedRole]) {
        setRole(savedRole);
      }
      const authState = localStorage.getItem("yog_milk_admin_logged_in");
      if (authState === "false") {
        setIsAuthenticated(false);
      }
    } catch {
      // Local storage not available (SSR)
    }
  }, []);

  const switchRole = (newRole: AdminRole) => {
    setRole(newRole);
    setIsAuthenticated(true);
    try {
      localStorage.setItem(STORAGE_KEY, newRole);
      localStorage.setItem("yog_milk_admin_logged_in", "true");
    } catch {
      // ignore
    }
  };

  const login = (email?: string, targetRole?: AdminRole) => {
    const roleToSet = targetRole || "OPERATIONS_MANAGER";
    setRole(roleToSet);
    setIsAuthenticated(true);
    try {
      localStorage.setItem(STORAGE_KEY, roleToSet);
      localStorage.setItem("yog_milk_admin_logged_in", "true");
    } catch {
      // ignore
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    try {
      localStorage.setItem("yog_milk_admin_logged_in", "false");
    } catch {
      // ignore
    }
  };

  const user = ADMIN_PRESET_USERS[role];

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        isAuthenticated,
        switchRole,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAdminAuth must be used within an AuthProvider");
  }
  return context;
}

