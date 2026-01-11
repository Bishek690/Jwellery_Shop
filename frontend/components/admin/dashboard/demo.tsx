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
    <div className="w-full space-y-6 sm:space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 text-white">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="min-w-0 flex-1">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-2 truncate">
              Welcome to Admin Dashboard
            </h1>
            <p className="text-sm sm:text-base text-orange-100">
              Your professional jewelry shop management system is ready to go!
            </p>
          </div>
          <div className="flex items-center space-x-2 flex-shrink-0">
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30 text-xs sm:text-sm">
              Live System
            </Badge>
            <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-300 flex-shrink-0" />
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="glass-card border-white/20 bg-white/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs sm:text-sm font-medium text-gray-600 truncate">
                  {stat.title}
                </CardTitle>
                <div className={`p-1.5 sm:p-2 rounded-lg ${stat.bgColor} flex-shrink-0`}>
                  <Icon className={`w-3 h-3 sm:w-4 sm:h-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent className="space-y-1">
                <div className="text-xl sm:text-2xl font-bold text-gray-900 truncate">
                  {stat.value}
                </div>
                <div className="flex items-center text-xs sm:text-sm">
                  <TrendingUp className="w-3 h-3 text-green-500 mr-1 flex-shrink-0" />
                  <span className="text-green-600 font-medium">{stat.change}</span>
                  <span className="text-gray-500 ml-1 hidden sm:inline">from last month</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
      
    </div>
  );
}
