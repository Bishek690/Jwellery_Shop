"use client"

import { useEffect, ReactNode } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { Crown } from "lucide-react"

interface AdminProtectedRouteProps {
  children: ReactNode
  allowedRoles?: ("admin" | "staff" | "accountant")[]
}

export function AdminProtectedRoute({ 
  children, 
  allowedRoles = ["admin"] 
}: AdminProtectedRouteProps) {
  const { user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Show loading while checking authentication
    if (isLoading) return

    // If not authenticated, redirect to login
    if (!isAuthenticated) {
      router.push("/auth/login")
      return
    }

    // If authenticated but not in allowed roles
    if (user && !allowedRoles.includes(user.role as any)) {
      switch (user.role) {
        case "admin":
          router.push("/admin")
          break
        case "staff":
          router.push("/admin/dashboard")
          break
        case "accountant":
          router.push("/analytics")
          break
        case "customer":
        default:
          router.push("/shop")
          break
      }
      return
    }
  }, [isAuthenticated, isLoading, user, router, allowedRoles])

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 flex items-center justify-center">
        <div className="text-center">
          <div className="p-4 luxury-gradient rounded-full w-fit mx-auto mb-4 animate-spin">
            <Crown className="h-8 w-8 text-white" />
          </div>
          <p className="text-gray-600">Verifying access permissions...</p>
        </div>
      </div>
    )
  }

  // Don't render content if not authenticated or not in allowed roles
  if (!isAuthenticated || !user || !allowedRoles.includes(user.role as any)) {
    return null
  }

  return <>{children}</>
}
