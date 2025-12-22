"use client"

import { ReactNode, useEffect } from "react"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, Crown, LogIn, Shield } from "lucide-react"

interface SimpleProtectedRouteProps {
  children: ReactNode
  allowedRoles?: string[]
}

export function SimpleProtectedRoute({ 
  children, 
  allowedRoles = ["admin"] 
}: SimpleProtectedRouteProps) {
  const { user, isLoading, isAuthenticated, logout } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // If not loading and not authenticated, redirect to login
    if (!isLoading && !isAuthenticated) {
      router.push("/auth/login")
      return
    }

    // If authenticated but user role is not allowed
    if (!isLoading && isAuthenticated && user) {
      if (!allowedRoles.includes(user.role)) {
        // If user is a customer, redirect to shop
        if (user.role === "customer") {
          router.push("/shop")
        } else {
          // For other roles, show access denied
          return
        }
      }

      // If user must change password, redirect to change password page
      if (user.mustChangePassword) {
        router.push("/auth/change-password")
        return
      }
    }
  }, [isLoading, isAuthenticated, user, allowedRoles, router])

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="text-gray-600">Verifying authentication...</p>
        </div>
      </div>
    )
  }

  // Show login prompt if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-xl">
          <CardHeader className="text-center">
            <div className="p-3 bg-gradient-to-r from-orange-500 to-amber-600 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-xl font-bold text-gray-900">Authentication Required</CardTitle>
            <CardDescription>
              You need to be logged in to access this page
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button 
              onClick={() => router.push("/auth/login")}
              className="bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white"
            >
              <LogIn className="h-4 w-4 mr-2" />
              Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Show access denied if user doesn't have required role
  if (user && !allowedRoles.includes(user.role)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-xl">
          <CardHeader className="text-center">
            <div className="p-3 bg-gradient-to-r from-red-500 to-red-600 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <AlertCircle className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-xl font-bold text-gray-900">Access Denied</CardTitle>
            <CardDescription>
              You don't have permission to access this area. Required roles: {allowedRoles.join(", ")}
            </CardDescription>
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Current role: <span className="font-medium">{user.role}</span></p>
            </div>
          </CardHeader>
          <CardContent className="text-center space-y-2">
            <Button 
              onClick={logout}
              variant="outline"
              className="w-full"
            >
              Sign Out
            </Button>
            {user.role === "customer" && (
              <Button 
                onClick={() => router.push("/shop")}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
              >
                Go to Shop
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }

  // If authenticated and has proper role, render children
  return <>{children}</>
}
