"use client"

import { DashboardHeader } from "@/components/admin/dashboard/dashboard-header"
import { DashboardTabs } from "@/components/admin/dashboard/dashboard-tabs"

export default function StaffDashboard() {
  return (
    <div className="space-y-8">
      <DashboardHeader />
      <DashboardTabs />
    </div>
  )
}
