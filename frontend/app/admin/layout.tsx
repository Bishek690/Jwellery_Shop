"use client"

import { AdminLayout as AdminLayoutComponent } from "@/components/admin/layout/admin-layout"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AdminLayoutComponent allowedRoles={["admin", "staff", "accountant"]}>
      {children}
    </AdminLayoutComponent>
  )
}
