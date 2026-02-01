"use client"

import { Button } from "@/components/ui/button"
import { Menu, Bell, User } from "lucide-react"
import { usePathname } from "next/navigation"

interface AdminHeaderProps {
  onMenuClick: () => void
}

export function AdminHeader({ onMenuClick }: AdminHeaderProps) {
  const pathname = usePathname()
  
  // Get page title based on current route
  const getPageTitle = () => {
    if (pathname?.includes('/customers')) return 'Customers'
    if (pathname?.includes('/inventory')) return 'Inventory'
    if (pathname?.includes('/analytics')) return 'Analytics'
    if (pathname?.includes('/users')) return 'Users'
    if (pathname?.includes('/orders')) return 'Orders'
    if (pathname?.includes('/pos')) return 'POS'
    if (pathname?.includes('/settings')) return 'Settings'
    return 'Dashboard'
  }

  return (
    <header className="bg-white/95 backdrop-blur-xl border-b border-gray-200 shadow-sm sticky top-0 z-30">
      <div className="px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Left side - Menu button and title */}
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={onMenuClick}
              className="lg:hidden hover:bg-gray-100 p-2 flex-shrink-0"
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div className="hidden sm:block">
              <h2 className="text-lg font-semibold text-gray-900">
                {getPageTitle()}
              </h2>
              <p className="text-xs text-gray-500 hidden md:block">
                Jewelry Management System
              </p>
            </div>
            <div className="sm:hidden">
              <h2 className="text-base font-semibold text-gray-900 truncate">
                {getPageTitle()}
              </h2>
            </div>
          </div>
          
          {/* Right side - Actions */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            <Button
              variant="ghost"
              size="sm"
              className="hover:bg-gray-100 p-2 relative"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="hover:bg-gray-100 p-2"
            >
              <User className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
