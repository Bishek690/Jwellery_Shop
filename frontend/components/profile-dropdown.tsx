"use client";

import { useState } from "react";
import { User, LogOut, Settings, ShoppingBag, Heart, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import Link from "next/link";

export function ProfileDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();

  // Close dropdown when clicking outside
  const handleClickOutside = () => {
    setIsOpen(false);
  };

  if (!isAuthenticated || !user) {
    return (
      <Link href="/auth/login">
        <Button variant="ghost" size="sm" className="flex items-center space-x-1 sm:space-x-2 hover-glow px-2 sm:px-3">
          <User className="w-4 h-4" />
          <span className="hidden sm:inline text-xs sm:text-sm">Login</span>
        </Button>
      </Link>
    );
  }

  return (
    <div className="relative">
      <Button 
        variant="ghost" 
        size="sm" 
        className="flex items-center space-x-1 sm:space-x-2 hover-glow px-2 sm:px-3"
        onClick={() => setIsOpen(!isOpen)}
      >
        <User className="w-4 h-4" />
        <span className="hidden sm:inline text-xs sm:text-sm">Profile</span>
      </Button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-10 bg-black/5" 
            onClick={handleClickOutside}
          ></div>
          
          {/* Dropdown */}
          <div 
            className="absolute right-0 top-full mt-2 w-72 sm:w-80 max-w-[90vw] bg-white rounded-lg shadow-xl border border-gray-200 z-20 animate-fade-in-scale"
            onClick={(e) => e.stopPropagation()}
          >
            {/* User Info Header */}
            <div className="p-3 sm:p-4 border-b border-gray-200 bg-gradient-to-r from-amber-50 to-orange-50">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm sm:text-lg flex-shrink-0">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-gray-900 text-sm sm:text-base truncate">{user.name}</h3>
                  <p className="text-xs sm:text-sm text-gray-600 truncate">{user.email}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <span className="text-xs bg-amber-100 text-amber-800 px-1.5 sm:px-2 py-0.5 rounded-full capitalize">
                      {user.role}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="p-1.5 sm:p-2">
              <Link href="/account" onClick={() => setIsOpen(false)}>
                <button className="w-full flex items-center space-x-2 sm:space-x-3 px-2 sm:px-3 py-2 text-xs sm:text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors">
                  <User className="w-4 h-4 flex-shrink-0" />
                  <span>My Account</span>
                </button>
              </Link>
              
              <Link href="/account/orders" onClick={() => setIsOpen(false)}>
                <button className="w-full flex items-center space-x-2 sm:space-x-3 px-2 sm:px-3 py-2 text-xs sm:text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors">
                  <ShoppingBag className="w-4 h-4 flex-shrink-0" />
                  <span>My Orders</span>
                </button>
              </Link>
              
              <Link href="/account/wishlist" onClick={() => setIsOpen(false)}>
                <button className="w-full flex items-center space-x-2 sm:space-x-3 px-2 sm:px-3 py-2 text-xs sm:text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors">
                  <Heart className="w-4 h-4 flex-shrink-0" />
                  <span>Wishlist</span>
                </button>
              </Link>
              
              <Link href="/account/notifications" onClick={() => setIsOpen(false)}>
                <button className="w-full flex items-center space-x-2 sm:space-x-3 px-2 sm:px-3 py-2 text-xs sm:text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors">
                  <Bell className="w-4 h-4 flex-shrink-0" />
                  <span>Notifications</span>
                </button>
              </Link>
              
              <Link href="/account/settings" onClick={() => setIsOpen(false)}>
                <button className="w-full flex items-center space-x-2 sm:space-x-3 px-2 sm:px-3 py-2 text-xs sm:text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors">
                  <Settings className="w-4 h-4 flex-shrink-0" />
                  <span>Settings</span>
                </button>
              </Link>
            </div>

            {/* Logout Button */}
            <div className="p-1.5 sm:p-2 border-t border-gray-200">
              <button 
                onClick={() => {
                  logout();
                  handleClickOutside();
                }}
                className="w-full flex items-center space-x-2 sm:space-x-3 px-2 sm:px-3 py-2 text-xs sm:text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors"
              >
                <LogOut className="w-4 h-4 flex-shrink-0" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
