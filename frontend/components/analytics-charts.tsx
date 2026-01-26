"use client"

import { useState, useEffect } from "react"
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

export function AnalyticsCharts() {
  const [timeRange, setTimeRange] = useState("6months")
  const [groupBy, setGroupBy] = useState("day")
  const [loading, setLoading] = useState(true)
  const [overview, setOverview] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    activeCustomers: 0,
    productsSold: 0,
  })
  const [salesData, setSalesData] = useState<any[]>([])
  const [categoryData, setCategoryData] = useState<any[]>([])
  const [topProducts, setTopProducts] = useState<any[]>([])

  // Fetch all analytics data
  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true)
        
        const [overviewRes, salesRes, categoryRes, productsRes] = await Promise.all([
          fetch(`/api/analytics/overview?timeRange=${timeRange}`, { credentials: 'include' }),
          fetch(`/api/analytics/sales-trend?timeRange=${timeRange}&groupBy=${groupBy}`, { credentials: 'include' }),
          fetch(`/api/analytics/category-distribution?timeRange=${timeRange}`, { credentials: 'include' }),
          fetch(`/api/analytics/top-products?timeRange=${timeRange}&limit=5`, { credentials: 'include' }),
        ])

        const overviewData = overviewRes.ok ? await overviewRes.json() : {}
        const salesTrendData = salesRes.ok ? await salesRes.json() : { data: [] }
        const categoryDistData = categoryRes.ok ? await categoryRes.json() : { data: [] }
        const topProductsData = productsRes.ok ? await productsRes.json() : { data: [] }

        setOverview({
          totalRevenue: overviewData.totalRevenue || 0,
          totalOrders: overviewData.totalOrders || 0,
          activeCustomers: overviewData.activeCustomers || 0,
          productsSold: overviewData.productsSold || 0,
        })
        setSalesData(salesTrendData.data || [])
        setCategoryData(categoryDistData.data || [])
        setTopProducts(topProductsData.data || [])
      } catch (error) {
        console.error('Failed to fetch analytics:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchAnalytics()
  }, [timeRange, groupBy])

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NP', {
      style: 'currency',
      currency: 'NPR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Analytics Dashboard
          </h2>
          <p className="text-sm text-muted-foreground mt-1">Track your jewelry shop performance</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Time Range Selector */}
          <div className="flex gap-2">
            {[
              { key: "1month", label: "1M", color: "from-blue-500 to-cyan-500" },
              { key: "3months", label: "3M", color: "from-purple-500 to-pink-500" },
              { key: "6months", label: "6M", color: "from-amber-500 to-orange-500" },
              { key: "1year", label: "1Y", color: "from-green-500 to-emerald-500" },
            ].map((range) => (
              <Button
                key={range.key}
                variant={timeRange === range.key ? "default" : "outline"}
                size="sm"
                onClick={() => setTimeRange(range.key)}
                className={
                  timeRange === range.key
                    ? `bg-gradient-to-r ${range.color} text-white hover:opacity-90 shadow-lg`
                    : "hover:bg-gray-100"
                }
              >
                {range.label}
              </Button>
            ))}
          </div>
          
          {/* Group By Selector */}
          <div className="flex gap-2 border-l pl-3">
            {[
              { key: "day", label: "Day", icon: "📅" },
              { key: "month", label: "Month", icon: "📆" },
              { key: "year", label: "Year", icon: "🗓️" },
            ].map((group) => (
              <Button
                key={group.key}
                variant={groupBy === group.key ? "default" : "outline"}
                size="sm"
                onClick={() => setGroupBy(group.key)}
                className={
                  groupBy === group.key
                    ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:opacity-90 shadow-lg"
                    : "hover:bg-gray-100"
                }
              >
                <span className="mr-1">{group.icon}</span>
                {group.label}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { 
            title: "Total Revenue", 
            value: formatCurrency(overview.totalRevenue), 
            change: "+12.5%", 
            icon: DollarSign, 
            positive: true,
            gradient: "from-emerald-500 to-teal-600",
            iconBg: "bg-emerald-100",
            iconColor: "text-emerald-600"
          },
          { 
            title: "Total Orders", 
            value: overview.totalOrders.toString(), 
            change: "+8.2%", 
            icon: ShoppingCart, 
            positive: true,
            gradient: "from-blue-500 to-indigo-600",
            iconBg: "bg-blue-100",
            iconColor: "text-blue-600"
          },
          { 
            title: "Active Customers", 
            value: overview.activeCustomers.toString(), 
            change: "+15.3%", 
            icon: Users, 
            positive: true,
            gradient: "from-purple-500 to-pink-600",
            iconBg: "bg-purple-100",
            iconColor: "text-purple-600"
          },
          { 
            title: "Products Sold", 
            value: overview.productsSold.toLocaleString(), 
            change: "+5.4%", 
            icon: Package, 
            positive: true,
            gradient: "from-amber-500 to-orange-600",
            iconBg: "bg-amber-100",
            iconColor: "text-amber-600"
          },
        ].map((metric, index) => (
          <Card
            key={metric.title}
            className="relative overflow-hidden bg-white/80 backdrop-blur-sm border-gray-200 hover:shadow-xl hover:scale-105 transition-all duration-300"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${metric.gradient} opacity-10 rounded-full -mr-16 -mt-16`}></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{metric.title}</CardTitle>
              <div className={`${metric.iconBg} p-2 rounded-lg`}>
                <metric.icon className={`h-4 w-4 ${metric.iconColor}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{metric.value}</div>
              <div className="flex items-center gap-1 mt-1">
                {metric.positive ? (
                  <TrendingUp className="h-4 w-4 text-green-600" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-600" />
                )}
                <Badge 
                  variant={metric.positive ? "default" : "destructive"} 
                  className={`text-xs ${metric.positive ? 'bg-green-100 text-green-700 hover:bg-green-200' : ''}`}
                >
                  {metric.change}
                </Badge>
                <span className="text-xs text-muted-foreground ml-1">vs last period</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Trend */}
        <Card className="bg-white/50 backdrop-blur-sm border-amber-200 hover:shadow-lg transition-all duration-300">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">Sales Trend</CardTitle>
            <CardDescription>
              {groupBy === 'day' ? 'Daily' : groupBy === 'month' ? 'Monthly' : 'Yearly'} sales performance over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            {salesData.length === 0 ? (
              <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                No sales data available for this period
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={salesData}>
                  <defs>
                    <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#EC4899" stopOpacity={0.1} />
                    </linearGradient>
                    <linearGradient id="ordersGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0.1} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis 
                    dataKey="period" 
                    stroke="#6B7280"
                    style={{ fontSize: '12px' }}
                    angle={salesData.length > 15 ? -45 : 0}
                    textAnchor={salesData.length > 15 ? "end" : "middle"}
                    height={salesData.length > 15 ? 80 : 30}
                  />
                  <YAxis 
                    stroke="#6B7280"
                    style={{ fontSize: '12px' }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(255, 255, 255, 0.98)",
                      border: "2px solid #8B5CF6",
                      borderRadius: "12px",
                      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                      padding: "12px"
                    }}
                    formatter={(value: any) => [`NPR ${value.toLocaleString()}`, 'Sales']}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="sales" 
                    stroke="#8B5CF6" 
                    strokeWidth={3} 
                    fill="url(#salesGradient)"
                    animationDuration={1000}
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Category Distribution */}
        <Card className="bg-white/50 backdrop-blur-sm border-amber-200 hover:shadow-lg transition-all duration-300">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">Sales by Category</CardTitle>
            <CardDescription>Distribution of sales across jewelry categories</CardDescription>
          </CardHeader>
          <CardContent>
            {categoryData.length === 0 ? (
              <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                No category data available. Create orders with product categories to see distribution.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({percent }: any) => ` ${((percent || 0) * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    animationDuration={1000}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(255, 255, 255, 0.98)",
                      border: "2px solid #F59E0B",
                      borderRadius: "12px",
                      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                      padding: "12px"
                    }}
                    formatter={(value: any) => [`${value}%`, 'Share']}
                  />
                  <Legend 
                    verticalAlign="bottom" 
                    height={36}
                    iconType="circle"
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
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
          {loading ? (
            <div className="flex items-center justify-center h-40 text-muted-foreground">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
            </div>
          ) : topProducts.length === 0 ? (
            <div className="flex items-center justify-center h-40 text-muted-foreground">
              No product sales data available for this period
            </div>
          ) : (
            <div className="space-y-4">
              {topProducts.map((product, index) => {
                const colors = [
                  { bg: 'from-purple-500 to-pink-500', border: 'border-purple-100', shadow: 'hover:shadow-purple-200' },
                  { bg: 'from-blue-500 to-cyan-500', border: 'border-blue-100', shadow: 'hover:shadow-blue-200' },
                  { bg: 'from-green-500 to-emerald-500', border: 'border-green-100', shadow: 'hover:shadow-green-200' },
                  { bg: 'from-amber-500 to-orange-500', border: 'border-amber-100', shadow: 'hover:shadow-amber-200' },
                  { bg: 'from-red-500 to-rose-500', border: 'border-red-100', shadow: 'hover:shadow-red-200' },
                ];
                const colorScheme = colors[index % colors.length];
                
                return (
                  <div
                    key={product.name}
                    className={`flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-white to-gray-50 border ${colorScheme.border} ${colorScheme.shadow} hover:shadow-md transition-all duration-200 animate-fade-in`}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${colorScheme.bg} flex items-center justify-center text-white font-bold text-sm shadow-lg`}>
                        {index + 1}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{product.name}</div>
                        <div className="text-sm text-muted-foreground flex items-center gap-2">
                          <Package className="h-3 w-3" />
                          {product.sales} units sold
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-lg bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                        {formatCurrency(product.revenue)}
                      </div>
                      <div className="text-xs text-muted-foreground">Revenue</div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
