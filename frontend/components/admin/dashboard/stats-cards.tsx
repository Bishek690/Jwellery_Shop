"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, Package, Users, Star, TrendingUp } from "lucide-react"

interface StatsCardsProps {
  className?: string
}

export function StatsCards({ className }: StatsCardsProps) {
  const stats = [
    {
      title: "Today's Sales",
      value: "NPR 2,45,000",
      change: "+12% from yesterday",
      changeType: "positive",
      icon: DollarSign,
      delay: "0s"
    },
    {
      title: "Total Products",
      value: "1,247",
      change: "23 low stock items",
      changeType: "neutral",
      icon: Package,
      delay: "0.1s"
    },
    {
      title: "Active Customers",
      value: "892",
      change: "+5% this month",
      changeType: "positive",
      icon: Users,
      delay: "0.2s"
    },
    {
      title: "Monthly Revenue",
      value: "NPR 45.2L",
      change: "+18% from last month",
      changeType: "positive",
      icon: Star,
      delay: "0.3s"
    }
  ]

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 ${className}`}>
      {stats.map((stat, index) => (
        <Card 
          key={index} 
          className="glass-card hover:shadow-xl transition-all duration-300 animate-slide-in-up" 
          style={{ animationDelay: stat.delay }}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
            <p className={`text-xs flex items-center gap-1 ${
              stat.changeType === "positive" ? "text-green-600" : 
              stat.changeType === "negative" ? "text-red-600" : "text-gray-600"
            }`}>
              {stat.changeType === "positive" && <TrendingUp className="h-3 w-3" />}
              {stat.change}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
