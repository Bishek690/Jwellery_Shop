"use client"

import { useState } from "react"
import { TrendingUp, TrendingDown, DollarSign, Users, Package, ShoppingCart } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"

const salesData = [
  { month: "Jan", sales: 125000, orders: 45, customers: 32 },
  { month: "Feb", sales: 145000, orders: 52, customers: 38 },
  { month: "Mar", sales: 165000, orders: 58, customers: 42 },
  { month: "Apr", sales: 185000, orders: 65, customers: 48 },
  { month: "May", sales: 205000, orders: 72, customers: 55 },
  { month: "Jun", sales: 225000, orders: 78, customers: 62 },
]

const categoryData = [
  { name: "Gold Jewelry", value: 45, color: "#F59E0B" },
  { name: "Diamond Jewelry", value: 30, color: "#EC4899" },
  { name: "Silver Jewelry", value: 15, color: "#6B7280" },
  { name: "Precious Stones", value: 10, color: "#8B5CF6" },
]

const topProducts = [
  { name: "Diamond Solitaire Ring", sales: 25, revenue: 125000 },
  { name: "Gold Chain Necklace", sales: 18, revenue: 90000 },
  { name: "Pearl Earrings", sales: 15, revenue: 75000 },
  { name: "Ruby Pendant", sales: 12, revenue: 60000 },
  { name: "Silver Bangles", sales: 10, revenue: 30000 },
]

export function AnalyticsCharts() {
  const [timeRange, setTimeRange] = useState("6months")

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex gap-2">
          {["1month", "3months", "6months", "1year"].map((range) => (
            <Button
              key={range}
              variant={timeRange === range ? "default" : "outline"}
              size="sm"
              onClick={() => setTimeRange(range)}
              className={timeRange === range ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white" : ""}
            >
              {range === "1month" ? "1M" : range === "3months" ? "3M" : range === "6months" ? "6M" : "1Y"}
            </Button>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: "Total Revenue", value: "₹12,45,000", change: "+12.5%", icon: DollarSign, positive: true },
          { title: "Total Orders", value: "370", change: "+8.2%", icon: ShoppingCart, positive: true },
          { title: "Active Customers", value: "277", change: "+15.3%", icon: Users, positive: true },
          { title: "Products Sold", value: "1,245", change: "-2.1%", icon: Package, positive: false },
        ].map((metric, index) => (
          <Card
            key={metric.title}
            className="relative overflow-hidden bg-white/50 backdrop-blur-sm border-amber-200 hover:shadow-lg transition-all duration-300 animate-float"
            style={{ animationDelay: `${index * 200}ms` }}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{metric.title}</CardTitle>
              <metric.icon className="h-4 w-4 text-amber-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{metric.value}</div>
              <div className="flex items-center gap-1 mt-1">
                {metric.positive ? (
                  <TrendingUp className="h-4 w-4 text-green-600" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-600" />
                )}
                <Badge variant={metric.positive ? "default" : "destructive"} className="text-xs">
                  {metric.change}
                </Badge>
              </div>
            </CardContent>
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-orange-500/5 pointer-events-none" />
          </Card>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Trend */}
        <Card className="bg-white/50 backdrop-blur-sm border-amber-200 hover:shadow-lg transition-all duration-300">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">Sales Trend</CardTitle>
            <CardDescription>Monthly sales performance over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={salesData}>
                <defs>
                  <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#F59E0B" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                <XAxis dataKey="month" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(255, 255, 255, 0.95)",
                    border: "1px solid #F59E0B",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  }}
                />
                <Area type="monotone" dataKey="sales" stroke="#F59E0B" strokeWidth={3} fill="url(#salesGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Category Distribution */}
        <Card className="bg-white/50 backdrop-blur-sm border-amber-200 hover:shadow-lg transition-all duration-300">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">Sales by Category</CardTitle>
            <CardDescription>Distribution of sales across jewelry categories</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(255, 255, 255, 0.95)",
                    border: "1px solid #F59E0B",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Top Products */}
      <Card className="bg-white/50 backdrop-blur-sm border-amber-200 hover:shadow-lg transition-all duration-300">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">Top Performing Products</CardTitle>
          <CardDescription>Best selling jewelry items this period</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topProducts.map((product, index) => (
              <div
                key={product.name}
                className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-amber-50/50 to-orange-50/50 border border-amber-100 hover:shadow-md transition-all duration-200 animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center text-white font-bold text-sm">
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{product.name}</div>
                    <div className="text-sm text-muted-foreground">{product.sales} units sold</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-green-600">₹{product.revenue.toLocaleString()}</div>
                  <div className="text-sm text-muted-foreground">Revenue</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
