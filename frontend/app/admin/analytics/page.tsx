"use client"

import { useState } from "react"
import { AnalyticsCharts } from "@/components/analytics-charts"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog"

export default function AnalyticsPage() {
  const [exporting, setExporting] = useState(false)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)

  const handleExportClick = () => {
    setShowConfirmDialog(true)
  }

  const handleConfirmExport = async () => {
    setShowConfirmDialog(false)
    await performExport()
  }

  const performExport = async () => {
    console.log('Export CSV started!')
    try {
      setExporting(true)
      console.log('Fetching analytics data...')
      
      // Fetch all analytics data
      const [overviewRes, salesRes, categoryRes, productsRes] = await Promise.all([
        fetch('/api/analytics/overview', { credentials: 'include' }),
        fetch('/api/analytics/sales-trend', { credentials: 'include' }),
        fetch('/api/analytics/category-distribution', { credentials: 'include' }),
        fetch('/api/analytics/top-products?limit=10', { credentials: 'include' }),
      ])
      
      console.log('API responses:', {
        overview: overviewRes.ok,
        sales: salesRes.ok,
        category: categoryRes.ok,
        products: productsRes.ok
      })
      
      const overview = await overviewRes.json()
      const salesTrend = await salesRes.json()
      const categoryDist = await categoryRes.json()
      const topProducts = await productsRes.json()
      
      console.log('Data fetched successfully:', {
        salesTrendCount: salesTrend.data?.length,
        categoryCount: categoryDist.data?.length,
        productsCount: topProducts.data?.length
      })
      
      // Create CSV content
      let csvContent = '# Analytics Report - ' + new Date().toLocaleDateString() + '\n\n'
      
      // Overview section
      csvContent += '## Overview\n'
      csvContent += 'Metric,Value\n'
      csvContent += `Total Revenue,NPR ${overview.totalRevenue || 0}\n`
      csvContent += `Total Orders,${overview.totalOrders || 0}\n`
      csvContent += `Active Customers,${overview.activeCustomers || 0}\n`
      csvContent += `Products Sold,${overview.productsSold || 0}\n\n`
      
      // Sales Trend section
      if (salesTrend.data && salesTrend.data.length > 0) {
        csvContent += '## Sales Trend\n'
        csvContent += 'Period,Sales,Orders,Customers\n'
        salesTrend.data.forEach((item: any) => {
          csvContent += `${item.period || item.month},${item.sales},${item.orders},${item.customers}\n`
        })
        csvContent += '\n'
      }
      
      // Category Distribution section
      if (categoryDist.data && categoryDist.data.length > 0) {
        csvContent += '## Category Distribution\n'
        csvContent += 'Category,Percentage\n'
        categoryDist.data.forEach((item: any) => {
          csvContent += `${item.name},${item.value}%\n`
        })
        csvContent += '\n'
      }
      
      // Top Products section
      if (topProducts.data && topProducts.data.length > 0) {
        csvContent += '## Top Products\n'
        csvContent += 'Product,Units Sold,Revenue\n'
        topProducts.data.forEach((item: any) => {
          csvContent += `${item.name},${item.sales},NPR ${item.revenue}\n`
        })
      }

      // Download CSV
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `analytics-report-${new Date().toISOString().split('T')[0]}.csv`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
      
      console.log('Export completed successfully')
      alert('Analytics report exported successfully!')
    } catch (error) {
      console.error('Export CSV failed:', error)
      alert('Failed to export CSV. Please try again.')
    } finally {
      setExporting(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Confirmation Dialog */}
      <ConfirmationDialog
        open={showConfirmDialog}
        onClose={() => setShowConfirmDialog(false)}
        onConfirm={handleConfirmExport}
        title="Export Analytics Report"
        description="Are you sure you want to export the analytics report as CSV? This will download a file containing Overview metrics, Sales trend data, Category distribution, and Top products."
        confirmText="Export CSV"
        cancelText="Cancel"
        type="info"
        loading={exporting}
      />

      {/* Action Bar */}
      <div className="flex justify-end">
        <Button 
          variant="outline" 
          className="hover:bg-orange-50"
          disabled={exporting}
          onClick={handleExportClick}
        >
          <Download className="h-4 w-4 mr-2" />
          {exporting ? 'Exporting...' : 'Export CSV Report'}
        </Button>
      </div>

      {/* Analytics Content */}
      <AnalyticsCharts />
    </div>
  )
}
