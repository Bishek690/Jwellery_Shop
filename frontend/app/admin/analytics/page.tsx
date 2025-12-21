"use client"

import { AnalyticsCharts } from "@/components/analytics-charts"
import { Button } from "@/components/ui/button"
import { ArrowLeft, BarChart3, Download } from "lucide-react"
import Link from "next/link"

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 luxury-gradient rounded-xl animate-glow">
              <BarChart3 className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
              <p className="text-sm text-gray-600">Comprehensive business insights and reports</p>
            </div>
          </div>
        </div>

        <Button variant="outline" className="hover:bg-orange-50">
          <Download className="h-4 w-4 mr-2" />
          Export Report
        </Button>
      </div>

      {/* Analytics Content */}
      <AnalyticsCharts />
    </div>
  )
}
