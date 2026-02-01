"use client"

import { AdminSidebar } from "@/components/admin/layout/sidebar"
import { AdminHeader } from "@/components/admin/layout/admin-header"
import { AdminFooter } from "@/components/admin/layout/admin-footer"
import { useState, useEffect } from "react"
import { SimpleProtectedRoute } from "@/components/admin/shared/admn-protected-route"
import ErrorBoundary from "@/components/error-boundary"
import { cn } from "@/lib/utils"

interface AdminLayoutProps {
  children: React.ReactNode
  allowedRoles?: string[]
}

export function AdminLayout({ children, allowedRoles = ["admin", "staff", "accountant"] }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  // Close mobile sidebar when screen size changes to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(false)
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <SimpleProtectedRoute allowedRoles={allowedRoles}>
      <ErrorBoundary>
        <div className="flex h-screen bg-gray-50 overflow-hidden">
          {/* Mobile Overlay */}
          {sidebarOpen && (
            <div 
              className={cn(
                "mobile-sidebar-overlay lg:hidden",
                sidebarOpen && "active"
              )}
              onClick={() => setSidebarOpen(false)}
            />
          )}

          {/* Sidebar */}
          <AdminSidebar 
            isMobile={sidebarOpen}
            collapsed={sidebarCollapsed}
            onClose={() => setSidebarOpen(false)}
            onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          />
          
          {/* Main content area with proper margin */}
          <div className={cn(
            "flex-1 flex flex-col min-w-0 admin-main-content transition-all duration-300",
            sidebarCollapsed && "sidebar-collapsed"
          )}>
            {/* Header */}
            <AdminHeader onMenuClick={() => setSidebarOpen(true)} />
            
            {/* Page content with proper overflow and responsive padding */}
            <main className="flex-1 overflow-auto bg-gradient-to-br from-gray-50 via-white to-orange-50/20">
              <div className="min-h-full w-full px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
                <div className="max-w-[1920px] mx-auto">
                  {children}
                </div>
              </div>
            </main>

            {/* Footer */}
            <AdminFooter />
          </div>
        </div>
      </ErrorBoundary>
    </SimpleProtectedRoute>
  )
}
