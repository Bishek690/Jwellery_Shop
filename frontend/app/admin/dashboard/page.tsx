"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BarChart3,
  Package,
  Users,
  ShoppingCart,
  TrendingUp,
  Star,
  Gem,
  Crown,
  Sparkles,
  DollarSign,
} from "lucide-react"
import Link from "next/link"
import { CustomerTable } from "@/components/customer-table"
import { AnalyticsCharts } from "@/components/analytics-charts"

export default function AdminDashboard() {
  const [goldRate] = useState(6850) // NPR per tola

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50">
      {/* Header */}
      <header className="glass-card border-b border-orange-200/50 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 animate-slide-in-up">
              <div className="p-2 luxury-gradient rounded-xl animate-glow">
                <Crown className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold font-serif text-gray-900">Admin Dashboard</h1>
                <p className="text-sm text-gray-600">Shree Hans RKS Jewellers Management</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="glass-card px-4 py-2 rounded-lg animate-float">
                <div className="flex items-center gap-2">
                  <Gem className="h-4 w-4 text-orange-600" />
                  <span className="text-sm font-medium">Gold Rate</span>
                  <Badge variant="secondary" className="luxury-gradient text-white">
                    NPR {goldRate.toLocaleString()}/tola
                  </Badge>
                </div>
              </div>
              <Link href="/">
                <Button variant="outline" className="hover:bg-orange-50 transition-all duration-300 bg-transparent">
                  Back to Website
                </Button>
              </Link>
              <Link href="/guide">
                <Button variant="outline" className="hover:bg-orange-50 transition-all duration-300 bg-transparent">
                  System Guide
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <Tabs defaultValue="dashboard" className="space-y-8">
          <TabsList className="glass-card p-1 h-auto">
            <TabsTrigger value="dashboard" className="flex items-center gap-2 px-6 py-3">
              <BarChart3 className="h-4 w-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="inventory" className="flex items-center gap-2 px-6 py-3">
              <Package className="h-4 w-4" />
              Inventory
            </TabsTrigger>
            <TabsTrigger value="pos" className="flex items-center gap-2 px-6 py-3">
              <ShoppingCart className="h-4 w-4" />
              POS System
            </TabsTrigger>
            <TabsTrigger value="customers" className="flex items-center gap-2 px-6 py-3">
              <Users className="h-4 w-4" />
              Customers
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2 px-6 py-3">
              <TrendingUp className="h-4 w-4" />
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-8 animate-fade-in-scale">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="glass-card hover:shadow-xl transition-all duration-300 animate-slide-in-up">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Today's Sales</CardTitle>
                  <DollarSign className="h-4 w-4 text-orange-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">NPR 2,45,000</div>
                  <p className="text-xs text-green-600 flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    +12% from yesterday
                  </p>
                </CardContent>
              </Card>

              <Card
                className="glass-card hover:shadow-xl transition-all duration-300 animate-slide-in-up"
                style={{ animationDelay: "0.1s" }}
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Products</CardTitle>
                  <Package className="h-4 w-4 text-orange-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">1,247</div>
                  <p className="text-xs text-gray-600">23 low stock items</p>
                </CardContent>
              </Card>

              <Card
                className="glass-card hover:shadow-xl transition-all duration-300 animate-slide-in-up"
                style={{ animationDelay: "0.2s" }}
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Customers</CardTitle>
                  <Users className="h-4 w-4 text-orange-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">892</div>
                  <p className="text-xs text-green-600 flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    +5% this month
                  </p>
                </CardContent>
              </Card>

              <Card
                className="glass-card hover:shadow-xl transition-all duration-300 animate-slide-in-up"
                style={{ animationDelay: "0.3s" }}
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
                  <Star className="h-4 w-4 text-orange-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">NPR 45.2L</div>
                  <p className="text-xs text-green-600 flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    +18% from last month
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Featured Products */}
            <Card className="glass-card animate-fade-in-scale">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-orange-600" />
                  Featured Jewelry Collection
                </CardTitle>
                <CardDescription>Premium pieces with exceptional craftsmanship</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    { name: "Diamond Necklace Set", price: "NPR 2,85,000", image: "/sparkling-diamond-necklace.png" },
                    { name: "Gold Bangles (Pair)", price: "NPR 1,45,000", image: "/gold-bangles.jpg" },
                    { name: "Ruby Ring Collection", price: "NPR 95,000", image: "/ruby-rings.jpg" },
                  ].map((product, index) => (
                    <div key={index} className="group cursor-pointer">
                      <div className="relative overflow-hidden rounded-lg bg-gray-100 aspect-square mb-3 gold-shimmer">
                        <img
                          src={product.image || "/placeholder.svg"}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <h3 className="font-medium text-gray-900 group-hover:text-orange-600 transition-colors">
                        {product.name}
                      </h3>
                      <p className="text-lg font-bold text-orange-600">{product.price}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="glass-card animate-fade-in-scale">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Frequently used operations for efficient management</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Link href="/pos">
                    <Button className="h-20 flex-col gap-2 luxury-gradient hover:shadow-lg transition-all duration-300 animate-float w-full">
                      <ShoppingCart className="h-6 w-6" />
                      New Sale
                    </Button>
                  </Link>
                  <Link href="/inventory">
                    <Button
                      variant="outline"
                      className="h-20 flex-col gap-2 hover:bg-orange-50 transition-all duration-300 animate-float bg-transparent w-full"
                      style={{ animationDelay: "0.5s" }}
                    >
                      <Package className="h-6 w-6" />
                      Add Product
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    className="h-20 flex-col gap-2 hover:bg-orange-50 transition-all duration-300 animate-float bg-transparent"
                    style={{ animationDelay: "1s" }}
                  >
                    <Users className="h-6 w-6" />
                    New Customer
                  </Button>
                  <Link href="/analytics">
                    <Button
                      variant="outline"
                      className="h-20 flex-col gap-2 hover:bg-orange-50 transition-all duration-300 animate-float bg-transparent w-full"
                      style={{ animationDelay: "1.5s" }}
                    >
                      <BarChart3 className="h-6 w-6" />
                      View Reports
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="inventory" className="animate-fade-in-scale">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Inventory Management</CardTitle>
                <CardDescription>Manage your jewelry collection and stock levels</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Package className="h-16 w-16 text-orange-600 mx-auto mb-4 animate-float" />
                  <h3 className="text-lg font-semibold mb-2">Inventory System</h3>
                  <p className="text-gray-600 mb-4">Complete inventory management available</p>
                  <Link href="/inventory">
                    <Button className="luxury-gradient">Go to Inventory</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pos" className="animate-fade-in-scale">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Point of Sale System</CardTitle>
                <CardDescription>Modern POS interface for seamless transactions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <ShoppingCart className="h-16 w-16 text-orange-600 mx-auto mb-4 animate-float" />
                  <h3 className="text-lg font-semibold mb-2">POS System</h3>
                  <p className="text-gray-600 mb-4">Advanced point-of-sale system ready</p>
                  <Link href="/pos">
                    <Button className="luxury-gradient">Open POS</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="customers" className="animate-fade-in-scale">
            <CustomerTable />
          </TabsContent>

          <TabsContent value="analytics" className="animate-fade-in-scale">
            <AnalyticsCharts />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
