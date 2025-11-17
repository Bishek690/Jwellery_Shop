"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, Package, Users, ShoppingCart, TrendingUp, TrendingDown, Star, Gem } from "lucide-react"

export function AdminStatsCards() {
  const stats = [
    {
      title: "Today's Revenue",
      value: "NPR 3,45,000",
      change: "+15.2%",
      trend: "up",
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-50",
      delay: "0s",
    },
    {
      title: "Total Products",
      value: "1,247",
      change: "23 low stock",
      trend: "warning",
      icon: Package,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      delay: "0.1s",
    },
    {
      title: "Active Customers",
      value: "892",
      change: "+8.1%",
      trend: "up",
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      delay: "0.2s",
    },
    {
      title: "Orders Today",
      value: "47",
      change: "+12.5%",
      trend: "up",
      icon: ShoppingCart,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      delay: "0.3s",
    },
    {
      title: "Monthly Sales",
      value: "NPR 45.2L",
      change: "+18.7%",
      trend: "up",
      icon: Star,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
      delay: "0.4s",
    },
    {
      title: "Premium Items",
      value: "156",
      change: "High value",
      trend: "neutral",
      icon: Gem,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
      delay: "0.5s",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon
        const TrendIcon = stat.trend === "up" ? TrendingUp : stat.trend === "down" ? TrendingDown : null

        return (
          <Card
            key={index}
            className="glass-card hover:shadow-xl transition-all duration-300 animate-slide-in-up group cursor-pointer"
            style={{ animationDelay: stat.delay }}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">{stat.title}</CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor} group-hover:scale-110 transition-transform duration-300`}>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
              <div className="flex items-center gap-1">
                {TrendIcon && (
                  <TrendIcon className={`h-3 w-3 ${stat.trend === "up" ? "text-green-600" : "text-red-600"}`} />
                )}
                <span
                  className={`text-xs ${
                    stat.trend === "up"
                      ? "text-green-600"
                      : stat.trend === "down"
                        ? "text-red-600"
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
  )
}
