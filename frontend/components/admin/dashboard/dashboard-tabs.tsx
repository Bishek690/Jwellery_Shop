"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  BarChart3,
  Package,
  Users,
  ShoppingCart,
  TrendingUp,
} from "lucide-react"
import Link from "next/link"
import { CustomerTable } from "@/components/customer-table"
import { AnalyticsCharts } from "@/components/analytics-charts"
import { StatsCards } from "./stats-cards"
import { FeaturedProducts } from "./featured-products"
import { QuickActions } from "./quick-actions"

interface DashboardTabsProps {
  className?: string
}

export function DashboardTabs({ className }: DashboardTabsProps) {
  return (
    <Tabs defaultValue="dashboard" className={`space-y-8 ${className}`}>
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
        <StatsCards />
        <FeaturedProducts />
        <QuickActions />
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
  )
}
