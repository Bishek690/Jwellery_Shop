"use client";

import { Button } from "@/components/ui/button";
import { User, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import Link from "next/link";

export function AuthNav() {
  const { user, isAuthenticated, logout, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center space-x-2">
        <div className="h-8 w-8 animate-pulse bg-gray-200 rounded-full"></div>
        <div className="h-4 w-20 animate-pulse bg-gray-200 rounded"></div>
      </div>
    );
  }

  if (isAuthenticated && user) {
    return (
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <User className="h-5 w-5 text-gray-600" />
          <span className="text-sm font-medium text-gray-700">
            {user.name}
          </span>
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
            {user.role}
          </span>
        </div>
        <Button
          onClick={logout}
          variant="outline"
          size="sm"
          className="flex items-center space-x-1"
        >
          <LogOut className="h-4 w-4" />
          <span>Logout</span>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-2">
      <Link href="/auth/login">
        <Button variant="outline" size="sm">
          Login
        </Button>
      </Link>
      <Link href="/auth/signup">
        <Button size="sm" className="bg-amber-600 hover:bg-amber-700">
          Sign Up
        </Button>
      </Link>
    </div>
  );
}
