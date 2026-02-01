"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Users, Package, ShoppingCart, BarChart3, TrendingUp, 
  CheckCircle, Clock, AlertCircle, Star, Loader2
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { MetalPriceModal } from "@/components/metal-price-modal";

export default function AdminDashboardDemo() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [showPriceModal, setShowPriceModal] = useState(false);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    ordersToday: 0,
    totalRevenue: 0,
    changes: {
      users: 0,
      revenue: 0,
      orders: 0,
      products: 0,
    }
  });

  // Fetch dashboard stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        
        // Fetch all stats in parallel
        const [dashboardRes, productsRes, ordersRes] = await Promise.all([
          fetch('/api/dashboard/stats', { credentials: 'include' }),
          fetch('/api/products/stats', { credentials: 'include' }),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/admin/stats`, { credentials: 'include' }),
        ]);

        const dashboardData = dashboardRes.ok ? await dashboardRes.json() : {
          totalUsers: 0,
          ordersToday: 0,
          changes: { users: 0, orders: 0 }
        };
        
        const productsData = productsRes.ok ? await productsRes.json() : { 
          totalProducts: 0,
          change: 0
        };

        const ordersData = ordersRes.ok ? await ordersRes.json() : {
          totalRevenue: 0,
          totalOrders: 0,
        };

        setStats({
          totalUsers: dashboardData.totalUsers || 0,
          totalProducts: productsData.totalProducts || 0,
          ordersToday: dashboardData.ordersToday || ordersData.totalOrders || 0,
          totalRevenue: ordersData.totalRevenue || 0,
          changes: {
            users: dashboardData.changes?.users || 0,
            revenue: 0, // Can calculate from previous period if needed
            orders: dashboardData.changes?.orders || 0,
            products: productsData.change || 0,
          }
        });
      } catch (error) {
        console.error('Failed to fetch dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchStats();
    }
  }, [user]);

  // Get role-specific welcome message
  const getWelcomeMessage = () => {
    switch (user?.role) {
      case "admin":
        return {
          title: "Welcome to Admin Dashboard",
          subtitle: "Full system management and control at your fingertips"
        };
      case "staff":
        return {
          title: "Welcome to Staff Dashboard",
          subtitle: "Manage inventory, orders, and customer service efficiently"
        };
      case "accountant":
        return {
          title: "Welcome to Accountant Dashboard",
          subtitle: "Access POS system, analytics, and financial reports"
        };
      default:
        return {
          title: "Welcome to Dashboard",
          subtitle: "Your professional jewelry shop management system"
        };
    }
  };

  const welcomeMessage = getWelcomeMessage();
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NP', {
      style: 'currency',
      currency: 'NPR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Format percentage change
  const formatChange = (change: number) => {
    const sign = change >= 0 ? '+' : '';
    return `${sign}${change}%`;
  };

  // Stats cards configuration
  const statsCards = [
    {
      title: "Total Users",
      value: loading ? "..." : stats.totalUsers.toLocaleString(),
      change: formatChange(stats.changes.users),
      isPositive: stats.changes.users >= 0,
      icon: Users,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      title: "Products",
      value: loading ? "..." : stats.totalProducts.toLocaleString(),
      change: formatChange(stats.changes.products),
      isPositive: stats.changes.products >= 0,
      icon: Package,
      color: "text-amber-600",
      bgColor: "bg-amber-50",
    },
    {
      title: "Orders Today",
      value: loading ? "..." : stats.ordersToday.toLocaleString(),
      change: formatChange(stats.changes.orders),
      isPositive: stats.changes.orders >= 0,
      icon: ShoppingCart,
      color: "text-orange-700", 
      bgColor: "bg-orange-100",
    },
    {
      title: "Total Revenue",
      value: loading ? "..." : formatCurrency(stats.totalRevenue),
      change: formatChange(stats.changes.revenue),
      isPositive: stats.changes.revenue >= 0,
      icon: BarChart3,
      color: "text-amber-700",
      bgColor: "bg-amber-100",
    },
  ];

  return (
    <div className="w-full space-y-6 sm:space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 text-white">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="min-w-0 flex-1">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-2 truncate">
              {welcomeMessage.title}
            </h1>
            <p className="text-sm sm:text-base text-orange-100">
              {welcomeMessage.subtitle}
            </p>
          </div>
          <div className="flex items-center space-x-2 flex-shrink-0">
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30 text-xs sm:text-sm">
              {user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : "User"}
            </Badge>
            <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-300 flex-shrink-0" />
          </div>
        </div>
      </div>

      {/* Update Metal Prices Button - Only for Admin and Staff */}
      {user && (user.role === "admin" || user.role === "staff") && (
        <div className="flex justify-end">
          <Button
            onClick={() => setShowPriceModal(true)}
            className="luxury-gradient hover:shadow-xl transition-all duration-300 animate-fade-in-scale"
          >
            <TrendingUp className="h-4 w-4 mr-2" />
            Update Metal Prices
          </Button>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
        {statsCards.map((stat, index) => {
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
                  {loading ? (
                    <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                  ) : (
                    stat.value
                  )}
                </div>
                <div className="flex items-center text-xs sm:text-sm">
                  <TrendingUp className={`w-3 h-3 mr-1 flex-shrink-0 ${stat.isPositive ? 'text-green-500' : 'text-red-500'}`} />
                  <span className={`font-medium ${stat.isPositive ? 'text-green-600' : 'text-red-600'}`}>{stat.change}</span>
                  <span className="text-gray-500 ml-1 hidden sm:inline">from last month</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Metal Price Modal */}
      <MetalPriceModal
        open={showPriceModal}
        onClose={() => setShowPriceModal(false)}
      />
      
    </div>
  );
}
