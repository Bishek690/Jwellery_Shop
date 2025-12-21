"use client";

import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Users, Package, ShoppingCart, BarChart3, TrendingUp, 
  CheckCircle, Clock, AlertCircle, Star
} from "lucide-react";

export default function AdminDashboardDemo() {
  const stats = [
    {
      title: "Total Users",
      value: "2,847",
      change: "+12%",
      icon: Users,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      title: "Products",
      value: "1,234",
      change: "+5%", 
      icon: Package,
      color: "text-amber-600",
      bgColor: "bg-amber-50",
    },
    {
      title: "Orders Today",
      value: "89",
      change: "+23%",
      icon: ShoppingCart,
      color: "text-orange-700", 
      bgColor: "bg-orange-100",
    },
    {
      title: "Revenue",
      value: "NPR 4,56,700",
      change: "+18%",
      icon: BarChart3,
      color: "text-amber-700",
      bgColor: "bg-amber-100",
    },
  ];

  const recentActivity = [
    { id: 1, type: "order", message: "New order #1234 received", time: "2 min ago", status: "success" },
    { id: 2, type: "user", message: "New user registration", time: "5 min ago", status: "info" },
    { id: 3, type: "product", message: "Product 'Gold Ring' low stock", time: "10 min ago", status: "warning" },
    { id: 4, type: "payment", message: "Payment processed successfully", time: "15 min ago", status: "success" },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome to Admin Dashboard</h1>
            <p className="text-orange-100">
              Your professional jewelry shop management system is ready to go!
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
              Live System
            </Badge>
            <CheckCircle className="w-6 h-6 text-green-300" />
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="glass-card border-white/20 bg-white/50 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`w-4 h-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">
                  {stat.value}
                </div>
                <div className="flex items-center text-sm">
                  <TrendingUp className="w-3 h-3 text-green-500 mr-1" />
                  <span className="text-green-600">{stat.change}</span>
                  <span className="text-gray-500 ml-1">from last month</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Feature Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Sidebar Features */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Star className="w-5 h-5 text-yellow-500" />
              <span>Responsive Admin Sidebar</span>
            </CardTitle>
            <CardDescription>
              Professional sidebar with comprehensive features
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg border border-orange-200">
                <span className="text-sm font-medium">Mobile Responsive</span>
                <CheckCircle className="w-4 h-4 text-orange-600" />
              </div>
              <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg border border-orange-200">
                <span className="text-sm font-medium">Role-Based Access</span>
                <CheckCircle className="w-4 h-4 text-orange-600" />
              </div>
              <div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg border border-amber-200">
                <span className="text-sm font-medium">Luxury Glassmorphism Design</span>
                <CheckCircle className="w-4 h-4 text-amber-600" />
              </div>
              <div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg border border-amber-200">
                <span className="text-sm font-medium">Nested Navigation</span>
                <CheckCircle className="w-4 h-4 text-amber-600" />
              </div>
              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <span className="text-sm font-medium">Safe Auth Integration</span>
                <AlertCircle className="w-4 h-4 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-orange-500" />
              <span>Recent Activity</span>
            </CardTitle>
            <CardDescription>
              Latest updates from your jewelry shop
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center space-x-3 p-3 bg-gray-50/50 rounded-lg border border-gray-200/50">
                  <div className={`w-2 h-2 rounded-full ${
                    activity.status === 'success' ? 'bg-green-400' :
                    activity.status === 'warning' ? 'bg-yellow-400' : 'bg-blue-400'
                  }`}></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {activity.message}
                    </p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4 justify-center">
        <Button className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white">
          View All Products
        </Button>
        <Button variant="outline" className="border-purple-200 hover:bg-purple-50">
          Manage Users
        </Button>
        <Button variant="outline" className="border-purple-200 hover:bg-purple-50">
          Analytics Dashboard
        </Button>
      </div>

      {/* System Info */}
      <Card className="glass-card bg-gradient-to-r from-slate-50 to-purple-50/20">
        <CardContent className="p-6">
          <div className="text-center space-y-2">
            <h3 className="text-lg font-semibold text-gray-900">
              🎉 Admin System Successfully Implemented!
            </h3>
            <p className="text-gray-600">
              Your responsive admin sidebar is now active with full functionality, 
              professional design, and mobile optimization.
            </p>
            <p className="text-sm text-gray-500">
              The system includes safe authentication handling and graceful fallbacks.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
