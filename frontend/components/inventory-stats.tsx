"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, AlertTriangle, TrendingUp, DollarSign, Gem, Star, Crown, Award } from "lucide-react"

export function InventoryStats() {
  const stats = [
    {
      title: "Total Products",
      value: "1,247",
      change: "+23 this month",
      trend: "up",
      icon: Package,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      delay: "0s",
    },
    {
      title: "Low Stock Items",
      value: "23",
      change: "Needs attention",
      trend: "warning",
      icon: AlertTriangle,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      delay: "0.1s",
    },
    {
      title: "Total Value",
      value: "NPR 2.4Cr",
      change: "+12.5% this month",
      trend: "up",
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-50",
      delay: "0.2s",
    },
    {
      title: "Categories",
      value: "12",
      change: "Active categories",
      trend: "neutral",
      icon: Gem,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      delay: "0.3s",
    },
    {
      title: "Featured Items",
      value: "45",
      change: "Premium collection",
      trend: "neutral",
      icon: Star,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
      delay: "0.4s",
    },
    {
      title: "VIP Products",
      value: "18",
      change: "Exclusive pieces",
      trend: "neutral",
      icon: Crown,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
      delay: "0.5s",
    },
  ]

  const topCategories = [
    { name: "Necklaces", count: 342, value: "NPR 85.2L", percentage: 28 },
    { name: "Rings", count: 298, value: "NPR 72.4L", percentage: 24 },
    { name: "Bangles", count: 245, value: "NPR 58.9L", percentage: 20 },
    { name: "Earrings", count: 189, value: "NPR 42.1L", percentage: 15 },
    { name: "Pendants", count: 173, value: "NPR 38.7L", percentage: 13 },
  ]

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon

          return (
            <Card
              key={index}
              className="glass-card hover:shadow-xl transition-all duration-300 animate-slide-in-up group cursor-pointer"
              style={{ animationDelay: stat.delay }}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">{stat.title}</CardTitle>
                <div
                  className={`p-2 rounded-lg ${stat.bgColor} group-hover:scale-110 transition-transform duration-300`}
                >
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
                <div className="flex items-center gap-1">
                  {stat.trend === "up" && <TrendingUp className="h-3 w-3 text-green-600" />}
                  {stat.trend === "warning" && <AlertTriangle className="h-3 w-3 text-orange-600" />}
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
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-orange-600" />
            Top Categories by Value
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topCategories.map((category, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-orange-50/50 transition-colors animate-slide-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg luxury-gradient flex items-center justify-center animate-float">
                    <Gem className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{category.name}</h4>
                    <p className="text-sm text-gray-600">{category.count} products</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-orange-600">{category.value}</p>
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full luxury-gradient transition-all duration-1000"
                        style={{ width: `${category.percentage}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-500">{category.percentage}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
