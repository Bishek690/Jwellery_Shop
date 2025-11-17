import { AnalyticsCharts } from "@/components/analytics-charts"

export default function AnalyticsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      <div className="container mx-auto px-4 py-8">
        <AnalyticsCharts />
      </div>
    </div>
  )
}
