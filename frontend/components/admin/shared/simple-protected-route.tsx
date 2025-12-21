"use client"

import { ReactNode } from "react"

interface SimpleProtectedRouteProps {
  children: ReactNode
  allowedRoles?: string[]
}

export function SimpleProtectedRoute({ 
  children, 
  allowedRoles = ["admin"] 
}: SimpleProtectedRouteProps) {
  // For now, just render children without authentication check
  // to isolate the import issue
  return <>{children}</>
}
