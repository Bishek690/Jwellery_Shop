"use client"

import { useState, useEffect } from "react"
import { AdminSidebar } from "./sidebar"
import { SimpleProtectedRoute } from "../shared/simple-protected-route"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"
import { cn } from "@/lib/utils"

interface AdminLayoutWrapperProps {
  children: React.ReactNode
}

export function AdminLayoutWrapper({ children }: AdminLayoutWrapperProps) {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // Check if mobile
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 1024)
    }
    
    checkIsMobile()
    window.addEventListener("resize", checkIsMobile)
    return () => window.removeEventListener("resize", checkIsMobile)
  }, [])

  // Close mobile sidebar when clicking outside
  const handleCloseMobileSidebar = () => {
    setIsMobileSidebarOpen(false)
  }

  return (
    <SimpleProtectedRoute allowedRoles={["admin", "staff"]}>
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50">
        <div className="flex h-screen">
          {/* Desktop Sidebar */}
          {!isMobile && <AdminSidebar />}

          {/* Mobile Sidebar */}
          {isMobile && isMobileSidebarOpen && (
            <AdminSidebar 
              isMobile={true} 
              onClose={handleCloseMobileSidebar}
            />
          )}

          {/* Main Content */}
          <div className="flex-1 flex flex-col min-w-0">
            {/* Mobile Header with Menu Button */}
            {isMobile && (
              <div className="lg:hidden bg-white/95 backdrop-blur-xl border-b border-orange-200/50 p-4">
                <div className="flex items-center justify-between">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsMobileSidebarOpen(true)}
                    className="hover:bg-orange-50 p-2"
                  >
                    <Menu className="h-6 w-6" />
                  </Button>
                  <h1 className="text-lg font-semibold text-gray-900">Admin Panel</h1>
                  <div className="w-10" /> {/* Spacer for centering */}
                </div>
              </div>
            )}
            
            {/* Desktop Header - Placeholder for now */}
            {!isMobile && (
              <div className="bg-white/95 backdrop-blur-xl border-b border-orange-200/50 p-4">
                <h2 className="text-lg font-semibold text-gray-900">Admin Dashboard</h2>
              </div>
            )}
            
            {/* Page Content */}
            <main className="flex-1 p-6 overflow-auto">
              <div className="max-w-7xl mx-auto">
                {children}
              </div>
            </main>
          </div>
        </div>
      </div>
    </SimpleProtectedRoute>
  )
}
