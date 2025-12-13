"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { userAPI } from "@/lib/api";

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "admin" | "staff" | "accountant" | "customer";
  mustChangePassword?: boolean;
  createdAt: string;
  updatedAt: string;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
  });
  const router = useRouter();

  const checkAuth = useCallback(async () => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));
      const response = await userAPI.getProfile();
      
      if (response.user) {
        setAuthState({
          user: response.user,
          isLoading: false,
          isAuthenticated: true,
        });
        return response.user;
      }
    } catch (error) {
      setAuthState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
      });
    }
    return null;
  }, []);

  const login = async (credentials: { email: string; password: string }) => {
    try {
      const response = await userAPI.login(credentials);
      
      if (response.user) {
        setAuthState({
          user: response.user,
          isLoading: false,
          isAuthenticated: true,
        });

        // Handle mandatory password change
        if (response.mustChangePassword) {
          router.push("/auth/change-password");
          return { ...response, requiresPasswordChange: true };
        }

        return response;
      }
      
      throw new Error(response.message || "Login failed");
    } catch (error) {
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
      }));
      throw error;
    }
  };

  const logout = async () => {
    try {
      await userAPI.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setAuthState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
      });
      router.push("/auth/login");
    }
  };

  const register = async (userData: {
    name: string;
    email: string;
    phone: string;
    password: string;
  }) => {
    try {
      const response = await userAPI.register(userData);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const changePassword = async (passwordData: {
    currentPassword: string;
    newPassword: string;
  }) => {
    try {
      const response = await userAPI.changePassword(passwordData);
      
      // Update user state to remove mustChangePassword flag
      if (authState.user) {
        setAuthState(prev => ({
          ...prev,
          user: {
            ...prev.user!,
            mustChangePassword: false,
          },
        }));
      }
      
      return response;
    } catch (error) {
      throw error;
    }
  };

  // Redirect based on user role
  const redirectToDashboard = (user: User) => {
    switch (user.role) {
      case "admin":
        router.push("/admin");
        break;
      case "staff":
        router.push("/admin/dashboard");
        break;
      case "accountant":
        router.push("/analytics");
        break;
      case "customer":
      default:
        router.push("/shop");
        break;
    }
  };

  // Check authentication status on mount
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return {
    ...authState,
    login,
    logout,
    register,
    changePassword,
    checkAuth,
    redirectToDashboard,
  };
};
