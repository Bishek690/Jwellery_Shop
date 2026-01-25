"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Home,
  Settings,
  ShoppingCart,
  Package,
  Users,
  BarChart3,
  Globe,
  UserCheck,
  Code,
  Database,
  Shield,
  Zap,
  Crown,
  ArrowRight,
  ExternalLink,
} from "lucide-react"
import Link from "next/link"

export default function SystemGuide() {
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
                <h1 className="text-2xl font-bold font-serif text-gray-900">System Guide</h1>
                <p className="text-sm text-gray-600">Complete navigation and API documentation</p>
              </div>
            </div>
            <Link href="/">
              <Button className="luxury-gradient hover:shadow-lg transition-all duration-300">
                <Home className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <Tabs defaultValue="navigation" className="space-y-8">
          <TabsList className="glass-card p-1 h-auto">
            <TabsTrigger value="navigation" className="flex items-center gap-2 px-6 py-3">
              <Home className="h-4 w-4" />
              Navigation
            </TabsTrigger>
            <TabsTrigger value="api" className="flex items-center gap-2 px-6 py-3">
              <Code className="h-4 w-4" />
              API Structure
            </TabsTrigger>
            <TabsTrigger value="database" className="flex items-center gap-2 px-6 py-3">
              <Database className="h-4 w-4" />
              Database Schema
            </TabsTrigger>
            <TabsTrigger value="features" className="flex items-center gap-2 px-6 py-3">
              <Zap className="h-4 w-4" />
              Features
            </TabsTrigger>
          </TabsList>

          <TabsContent value="navigation" className="space-y-8 animate-fade-in-scale">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Home className="h-5 w-5 text-orange-600" />
                  Main Entry Points
                </CardTitle>
                <CardDescription>How to access different parts of the system</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Main Dashboard */}
                <div className="border rounded-lg p-4 bg-orange-50/50">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-lg">Main Dashboard</h3>
                    <Badge className="luxury-gradient text-white">Primary Entry</Badge>
                  </div>
                  <p className="text-gray-600 mb-3">
                    The main dashboard is your starting point - accessible at the root URL (/)
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <h4 className="font-medium">Available Tabs:</h4>
                      <ul className="space-y-1 text-sm">
                        <li className="flex items-center gap-2">
                          <BarChart3 className="h-4 w-4 text-orange-600" />
                          Dashboard - Overview & stats
                        </li>
                        <li className="flex items-center gap-2">
                          <Package className="h-4 w-4 text-orange-600" />
                          Inventory - Quick inventory view
                        </li>
                        <li className="flex items-center gap-2">
                          <ShoppingCart className="h-4 w-4 text-orange-600" />
                          POS - Point of sale preview
                        </li>
                        <li className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-orange-600" />
                          Customers - Customer management
                        </li>
                        <li className="flex items-center gap-2">
                          <BarChart3 className="h-4 w-4 text-orange-600" />
                          Analytics - Charts & reports
                        </li>
                      </ul>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-medium">Quick Actions:</h4>
                      <ul className="space-y-1 text-sm">
                        <li>• New Sale (redirects to POS)</li>
                        <li>• Add Product (redirects to Inventory)</li>
                        <li>• New Customer (modal/form)</li>
                        <li>• View Reports (redirects to Analytics)</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Dedicated Pages */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    {
                      title: "Admin Panel",
                      url: "/admin",
                      icon: Settings,
                      description: "Full admin dashboard with sidebar navigation",
                      features: ["User management", "System settings", "Advanced controls"],
                    },
                    {
                      title: "POS System",
                      url: "/pos",
                      icon: ShoppingCart,
                      description: "Complete point-of-sale interface",
                      features: ["Product selection", "Cart management", "Payment processing"],
                    },
                    {
                      title: "Inventory Management",
                      url: "/admin/inventory",
                      icon: Package,
                      description: "Comprehensive inventory control",
                      features: ["Product catalog", "Stock management", "Category organization"],
                    },
                    {
                      title: "Customer Portal",
                      url: "/shop",
                      icon: Globe,
                      description: "Customer-facing shopping interface",
                      features: ["Product browsing", "Search & filters", "Account management"],
                    },
                    {
                      title: "Customer Accounts",
                      url: "/account",
                      icon: UserCheck,
                      description: "Customer account management",
                      features: ["Order history", "Profile settings", "Wishlist management"],
                    },
                    {
                      title: "Analytics Dashboard",
                      url: "/analytics",
                      icon: BarChart3,
                      description: "Detailed reporting and analytics",
                      features: ["Sales reports", "Performance metrics", "Trend analysis"],
                    },
                  ].map((page, index) => (
                    <Card key={index} className="glass-card hover:shadow-lg transition-all duration-300">
                      <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-2 text-base">
                          <page.icon className="h-5 w-5 text-orange-600" />
                          {page.title}
                        </CardTitle>
                        <CardDescription className="text-sm">{page.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="space-y-1">
                          {page.features.map((feature, idx) => (
                            <div key={idx} className="text-xs text-gray-600 flex items-center gap-1">
                              <ArrowRight className="h-3 w-3" />
                              {feature}
                            </div>
                          ))}
                        </div>
                        <Link href={page.url}>
                          <Button size="sm" className="w-full luxury-gradient">
                            Access {page.title}
                            <ExternalLink className="h-3 w-3 ml-1" />
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="api" className="space-y-8 animate-fade-in-scale">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="h-5 w-5 text-orange-600" />
                  API Structure & Endpoints
                </CardTitle>
                <CardDescription>Complete API documentation for the jewelry management system</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* API Endpoints */}
                <div className="space-y-4">
                  {[
                    {
                      category: "Products API",
                      endpoints: [
                        { method: "GET", path: "/api/products", description: "Get all products with pagination" },
                        { method: "POST", path: "/api/products", description: "Create new product" },
                        { method: "PUT", path: "/api/products/:id", description: "Update product by ID" },
                        { method: "DELETE", path: "/api/products/:id", description: "Delete product by ID" },
                        { method: "GET", path: "/api/products/search", description: "Search products by query" },
                      ],
                    },
                    {
                      category: "Sales API",
                      endpoints: [
                        { method: "GET", path: "/api/sales", description: "Get sales history" },
                        { method: "POST", path: "/api/sales", description: "Create new sale transaction" },
                        { method: "GET", path: "/api/sales/stats", description: "Get sales statistics" },
                        { method: "GET", path: "/api/sales/:id", description: "Get sale details by ID" },
                      ],
                    },
                    {
                      category: "Customers API",
                      endpoints: [
                        { method: "GET", path: "/api/customers", description: "Get all customers" },
                        { method: "POST", path: "/api/customers", description: "Create new customer" },
                        { method: "PUT", path: "/api/customers/:id", description: "Update customer info" },
                        { method: "GET", path: "/api/customers/:id/orders", description: "Get customer order history" },
                      ],
                    },
                    {
                      category: "Analytics API",
                      endpoints: [
                        { method: "GET", path: "/api/analytics/dashboard", description: "Get dashboard metrics" },
                        { method: "GET", path: "/api/analytics/sales", description: "Get sales analytics" },
                        { method: "GET", path: "/api/analytics/inventory", description: "Get inventory analytics" },
                        { method: "GET", path: "/api/analytics/customers", description: "Get customer analytics" },
                      ],
                    },
                  ].map((category, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <h3 className="font-semibold text-lg mb-3 text-orange-600">{category.category}</h3>
                      <div className="space-y-2">
                        {category.endpoints.map((endpoint, idx) => (
                          <div key={idx} className="flex items-center gap-4 p-2 bg-gray-50 rounded">
                            <Badge
                              variant={
                                endpoint.method === "GET"
                                  ? "secondary"
                                  : endpoint.method === "POST"
                                    ? "default"
                                    : endpoint.method === "PUT"
                                      ? "outline"
                                      : "destructive"
                              }
                              className="min-w-[60px] justify-center"
                            >
                              {endpoint.method}
                            </Badge>
                            <code className="font-mono text-sm flex-1">{endpoint.path}</code>
                            <span className="text-sm text-gray-600">{endpoint.description}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="database" className="space-y-8 animate-fade-in-scale">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5 text-orange-600" />
                  Database Schema
                </CardTitle>
                <CardDescription>Complete database structure for the jewelry management system</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Database Tables */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {[
                    {
                      table: "products",
                      description: "Jewelry product catalog",
                      fields: [
                        "id (Primary Key)",
                        "name (String)",
                        "category (String)",
                        "price (Decimal)",
                        "cost_price (Decimal)",
                        "weight (Decimal)",
                        "purity (String)",
                        "stock_quantity (Integer)",
                        "description (Text)",
                        "image_url (String)",
                        "created_at (Timestamp)",
                        "updated_at (Timestamp)",
                      ],
                    },
                    {
                      table: "customers",
                      description: "Customer information",
                      fields: [
                        "id (Primary Key)",
                        "name (String)",
                        "email (String)",
                        "phone (String)",
                        "address (Text)",
                        "vip_status (Boolean)",
                        "total_purchases (Decimal)",
                        "created_at (Timestamp)",
                        "updated_at (Timestamp)",
                      ],
                    },
                    {
                      table: "sales",
                      description: "Sales transactions",
                      fields: [
                        "id (Primary Key)",
                        "customer_id (Foreign Key)",
                        "total_amount (Decimal)",
                        "discount (Decimal)",
                        "payment_method (String)",
                        "status (String)",
                        "sale_date (Timestamp)",
                        "created_at (Timestamp)",
                      ],
                    },
                    {
                      table: "sale_items",
                      description: "Individual items in sales",
                      fields: [
                        "id (Primary Key)",
                        "sale_id (Foreign Key)",
                        "product_id (Foreign Key)",
                        "quantity (Integer)",
                        "unit_price (Decimal)",
                        "total_price (Decimal)",
                      ],
                    },
                    {
                      table: "inventory_logs",
                      description: "Stock movement tracking",
                      fields: [
                        "id (Primary Key)",
                        "product_id (Foreign Key)",
                        "change_type (String)",
                        "quantity_change (Integer)",
                        "reason (String)",
                        "created_at (Timestamp)",
                      ],
                    },
                    {
                      table: "users",
                      description: "System users (admin/staff)",
                      fields: [
                        "id (Primary Key)",
                        "username (String)",
                        "email (String)",
                        "password_hash (String)",
                        "role (String)",
                        "permissions (JSON)",
                        "created_at (Timestamp)",
                      ],
                    },
                  ].map((schema, index) => (
                    <Card key={index} className="border">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base text-orange-600">{schema.table}</CardTitle>
                        <CardDescription className="text-sm">{schema.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-1">
                          {schema.fields.map((field, idx) => (
                            <div key={idx} className="text-sm font-mono bg-gray-50 px-2 py-1 rounded">
                              {field}
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="features" className="space-y-8 animate-fade-in-scale">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-orange-600" />
                  System Features & Capabilities
                </CardTitle>
                <CardDescription>Complete overview of all system features and functionalities</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    {
                      category: "Admin Features",
                      icon: Shield,
                      features: [
                        "Complete dashboard with real-time stats",
                        "User management and role-based access",
                        "System configuration and settings",
                        "Advanced reporting and analytics",
                        "Inventory management and tracking",
                        "Customer relationship management",
                      ],
                    },
                    {
                      category: "POS Features",
                      icon: ShoppingCart,
                      features: [
                        "Product search and selection",
                        "Shopping cart management",
                        "Multiple payment methods",
                        "Customer selection and VIP handling",
                        "Receipt generation",
                        "Real-time inventory updates",
                      ],
                    },
                    {
                      category: "Customer Features",
                      icon: Users,
                      features: [
                        "Product browsing and search",
                        "Account management",
                        "Order history tracking",
                        "Wishlist functionality",
                        "VIP status and benefits",
                        "Contact and inquiry forms",
                      ],
                    },
                    {
                      category: "Analytics Features",
                      icon: BarChart3,
                      features: [
                        "Sales performance tracking",
                        "Inventory analytics",
                        "Customer behavior analysis",
                        "Revenue and profit reports",
                        "Trend analysis and forecasting",
                        "Custom date range filtering",
                      ],
                    },
                  ].map((feature, index) => (
                    <Card key={index} className="border">
                      <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-2 text-base">
                          <feature.icon className="h-5 w-5 text-orange-600" />
                          {feature.category}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {feature.features.map((item, idx) => (
                            <li key={idx} className="text-sm flex items-start gap-2">
                              <ArrowRight className="h-3 w-3 mt-0.5 text-orange-600 flex-shrink-0" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
