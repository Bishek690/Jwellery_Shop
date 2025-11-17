"use client"

import { AdminSidebar } from "@/components/admin-sidebar"
import { AdminHeader } from "@/components/admin-header"
import { AdminStatsCards } from "@/components/admin-stats-cards"
import { AdminRecentActivity } from "@/components/admin-recent-activity"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BarChart3, TrendingUp, Sparkles, Crown, Gem, Star, Award } from "lucide-react"

export default function AdminDashboard() {
  const topProducts = [
    {
      name: "Diamond Necklace Set",
      sales: 12,
      revenue: "NPR 34.2L",
      trend: "+25%",
      image: "/sparkling-diamond-necklace.png",
    },
    {
      name: "Gold Bangles (22K)",
      sales: 28,
      revenue: "NPR 40.6L",
      trend: "+18%",
      image: "/gold-bangles.jpg",
    },
    {
      name: "Ruby Ring Collection",
      sales: 15,
      revenue: "NPR 14.25L",
      trend: "+32%",
      image: "/ruby-rings.jpg",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50">
      <div className="flex">
        {/* Sidebar */}
        <AdminSidebar />

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          <AdminHeader />

          <main className="flex-1 p-6 space-y-8">
            {/* Stats Cards */}
            <section className="animate-fade-in-scale">
              <AdminStatsCards />
            </section>

            {/* Charts and Analytics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Sales Chart */}
              <Card className="glass-card animate-slide-in-up">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-orange-600" />
                    Sales Overview
                  </CardTitle>
                  <CardDescription>Monthly sales performance and trends</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center bg-gradient-to-br from-orange-50 to-amber-50 rounded-lg">
                    <div className="text-center">
                      <BarChart3 className="h-16 w-16 text-orange-600 mx-auto mb-4 animate-float" />
                      <h3 className="text-lg font-semibold mb-2">Sales Analytics</h3>
                      <p className="text-gray-600 mb-4">Interactive charts coming soon</p>
                      <Button className="luxury-gradient">View Details</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Top Products */}
              <Card className="glass-card animate-slide-in-up" style={{ animationDelay: "0.2s" }}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-orange-600" />
                    Top Performing Products
                  </CardTitle>
                  <CardDescription>Best selling jewelry items this month</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {topProducts.map((product, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-4 p-3 rounded-lg hover:bg-orange-50/50 transition-colors animate-slide-in-up"
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-orange-100 to-amber-100 flex items-center justify-center gold-shimmer">
                          <Gem className="h-6 w-6 text-orange-600" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{product.name}</h4>
                          <p className="text-sm text-gray-600">{product.sales} sales</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">{product.revenue}</p>
                          <div className="flex items-center gap-1">
                            <TrendingUp className="h-3 w-3 text-green-600" />
                            <span className="text-xs text-green-600">{product.trend}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity and Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Recent Activity */}
              <div className="lg:col-span-2">
                <AdminRecentActivity />
              </div>

              {/* Quick Actions */}
              <Card className="glass-card animate-fade-in-scale">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-orange-600" />
                    Quick Actions
                  </CardTitle>
                  <CardDescription>Frequently used operations</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Button className="w-full justify-start gap-3 luxury-gradient hover:shadow-lg transition-all duration-300 animate-float">
                      <Crown className="h-4 w-4" />
                      Add Premium Product
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start gap-3 hover:bg-orange-50 transition-all duration-300 animate-float bg-transparent"
                      style={{ animationDelay: "0.5s" }}
                    >
                      <Award className="h-4 w-4" />
                      Generate Report
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start gap-3 hover:bg-orange-50 transition-all duration-300 animate-float bg-transparent"
                      style={{ animationDelay: "1s" }}
                    >
                      <Gem className="h-4 w-4" />
                      Update Gold Rate
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start gap-3 hover:bg-orange-50 transition-all duration-300 animate-float bg-transparent"
                      style={{ animationDelay: "1.5s" }}
                    >
                      <TrendingUp className="h-4 w-4" />
                      View Analytics
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
