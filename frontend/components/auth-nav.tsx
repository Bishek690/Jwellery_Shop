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
      <div className="flex items-center space-x-2 sm:space-x-4">
        <div className="flex items-center space-x-1 sm:space-x-2">
          <User className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600" />
          <span className="text-xs sm:text-sm font-medium text-gray-700 truncate max-w-[80px] sm:max-w-none">
            {user.name}
          </span>
          <span className="hidden xs:inline text-xs text-gray-500 bg-gray-100 px-1 sm:px-2 py-0.5 sm:py-1 rounded text-nowrap">
            {user.role}
          </span>
        </div>
        <Button
          onClick={logout}
          variant="outline"
          size="sm"
          className="flex items-center space-x-1 px-2 sm:px-3"
        >
          <LogOut className="h-3 w-3 sm:h-4 sm:w-4" />
          <span className="hidden sm:inline">Logout</span>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-1 sm:space-x-2">
      <Link href="/auth/login">
        <Button variant="outline" size="sm" className="px-2 sm:px-3 text-xs sm:text-sm">
          <span className="hidden xs:inline">Login</span>
          <User className="h-3 w-3 sm:h-4 sm:w-4 xs:hidden" />
        </Button>
      </Link>
      <Link href="/auth/signup">
        <Button size="sm" className="bg-amber-600 hover:bg-amber-700 px-2 sm:px-3 text-xs sm:text-sm">
          <span className="hidden xs:inline">Sign Up</span>
          <span className="xs:hidden">+</span>
        </Button>
      </Link>
    </div>
  );
}
