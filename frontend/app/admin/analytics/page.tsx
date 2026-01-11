"use client"

import { AnalyticsCharts } from "@/components/analytics-charts"
import { Button } from "@/components/ui/button"
import { ArrowLeft, BarChart3, Download } from "lucide-react"
import Link from "next/link"

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      {/* Action Bar */}
      <div className="flex justify-end">
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
