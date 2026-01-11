"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, AlertTriangle, TrendingUp, DollarSign, Gem, Star, Crown, Award } from "lucide-react"

interface ProductStats {
  totalProducts: number
  inStock: number
  lowStock: number
  outOfStock: number
  totalValue: number
  featuredProducts: number
  categories: number
  topCategories?: Array<{
    name: string
    count: number
    value: number
    percentage: number
  }>
}

export function InventoryStats() {
  const [stats, setStats] = useState<ProductStats>({
    totalProducts: 0,
    inStock: 0,
    lowStock: 0,
    outOfStock: 0,
    totalValue: 0,
    featuredProducts: 0,
    categories: 0,
    topCategories: []
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/products/stats', {
        method: 'GET',
        credentials: 'include',
      })

      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error('Error fetching product stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (value: number) => {
    if (value >= 10000000) {
      return `NPR ${(value / 10000000).toFixed(1)}Cr`
    } else if (value >= 100000) {
      return `NPR ${(value / 100000).toFixed(1)}L`
    } else if (value >= 1000) {
      return `NPR ${(value / 1000).toFixed(1)}K`
    } else {
      return `NPR ${value.toLocaleString()}`
    }
  }

  const statsCards = [
    {
      title: "Total Products",
      value: loading ? "..." : (stats.totalProducts ?? 0).toString(),
      change: loading ? "Loading..." : `${stats.inStock ?? 0} in stock`,
      trend: "up",
      icon: Package,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      delay: "0s",
    },
    {
      title: "Low Stock Items",
      value: loading ? "..." : (stats.lowStock ?? 0).toString(),
      change: loading ? "Loading..." : (stats.lowStock ?? 0) > 0 ? "Needs attention" : "All good",
      trend: (stats.lowStock ?? 0) > 0 ? "warning" : "neutral",
      icon: AlertTriangle,
      color: (stats.lowStock ?? 0) > 0 ? "text-orange-600" : "text-green-600",
      bgColor: (stats.lowStock ?? 0) > 0 ? "bg-orange-50" : "bg-green-50",
      delay: "0.1s",
    },
    {
      title: "Total Value",
      value: loading ? "..." : formatCurrency(stats.totalValue ?? 0),
      change: loading ? "Loading..." : "Inventory value",
      trend: "up",
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-50",
      delay: "0.2s",
    },
    {
      title: "Out of Stock",
      value: loading ? "..." : (stats.outOfStock ?? 0).toString(),
      change: loading ? "Loading..." : (stats.outOfStock ?? 0) > 0 ? "Restock needed" : "All stocked",
      trend: (stats.outOfStock ?? 0) > 0 ? "warning" : "neutral",
      icon: Gem,
      color: (stats.outOfStock ?? 0) > 0 ? "text-red-600" : "text-green-600",
      bgColor: (stats.outOfStock ?? 0) > 0 ? "bg-red-50" : "bg-green-50",
      delay: "0.3s",
    },
    {
      title: "Featured Items",
      value: loading ? "..." : (stats.featuredProducts ?? 0).toString(),
      change: "Premium collection",
      trend: "neutral",
      icon: Star,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
      delay: "0.4s",
    },
    {
      title: "Categories",
      value: loading ? "..." : (stats.categories ?? 0).toString(),
      change: loading ? "Loading..." : "Active categories",
      trend: "neutral",
      icon: Crown,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
      delay: "0.5s",
    },
  ]

  // Use dynamic top categories from API or empty array if loading
  const topCategories = stats.topCategories || []

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
        {statsCards.map((stat, index) => {
          const Icon = stat.icon

          return (
            <Card
              key={index}
              className="glass-card hover:shadow-xl transition-all duration-300 animate-slide-in-up group cursor-pointer"
              style={{ animationDelay: stat.delay }}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 px-3 sm:px-4 pt-2">
                <CardTitle className="text-xs sm:text-sm font-medium text-gray-600 truncate pr-2">{stat.title}</CardTitle>
                <div
                  className={`p-1.5 rounded-lg ${stat.bgColor} group-hover:scale-110 transition-transform duration-300 flex-shrink-0`}
                >
                  <Icon className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent className="px-3 sm:px-4 pb-2">
                <div className="text-xl sm:text-2xl font-bold text-gray-900 mb-0.5">{stat.value}</div>
                <div className="flex items-center gap-1">
                  {stat.trend === "up" && <TrendingUp className="h-3 w-3 text-green-600 flex-shrink-0" />}
                  {stat.trend === "warning" && <AlertTriangle className="h-3 w-3 text-orange-600 flex-shrink-0" />}
                  <span
                    className={`text-xs ${
                      stat.trend === "up"
                        ? "text-green-600"
                        : stat.trend === "warning"
                          ? "text-orange-600"
                          : "text-gray-600"
                    }`}
                  >
                    {stat.change}
                  </span>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Top Categories */}
      <Card className="glass-card animate-fade-in-scale">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <Award className="h-5 w-5 text-orange-600" />
            Top Categories by Value
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
            </div>
          ) : topCategories.length > 0 ? (
            <div className="space-y-3">
              {topCategories.map((category, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2.5 rounded-lg hover:bg-orange-50/50 transition-colors animate-slide-in-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg luxury-gradient flex items-center justify-center animate-float">
                      <Gem className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 text-sm">{category.name}</h4>
                      <p className="text-xs text-gray-600">{category.count} products</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-orange-600 text-sm">{formatCurrency(category.value)}</p>
                    <div className="flex items-center gap-2">
                      <div className="w-14 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full luxury-gradient transition-all duration-1000"
                          style={{ width: `${category.percentage}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-500 w-8">{category.percentage}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Package className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No category data available</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
