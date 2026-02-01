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
      // Set loading state
      setAuthState(prev => ({ ...prev, isLoading: true }));
      
      // Try to call the backend to clear the HTTP-only cookie
      await userAPI.logout();
      console.log("Server-side logout successful - token cleared");
    } catch (error) {
      console.error("Server-side logout error (will still clear local state):", error);
      // Don't throw the error since we'll clear local state anyway
    } finally {
      // Always clear local state and redirect
      setAuthState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
      });
      
      console.log("Local authentication state cleared");
      
      // Force a page reload to ensure all state is cleared
      window.location.href = "/auth/login";
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
        router.push("/admin");
        break;
      case "accountant":
        router.push("/admin");
        break;
      case "customer":
      default:
        router.push("/shop");
        break;
    }
  };

  // Check authentication status on mount - only run once!
  useEffect(() => {
    checkAuth();
  }, []); // Empty dependency array to prevent infinite loops

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
