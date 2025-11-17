"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  BarChart3,
  Settings,
  Crown,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Bell,
  User,
} from "lucide-react"

interface AdminSidebarProps {
  className?: string
}

export function AdminSidebar({ className }: AdminSidebarProps) {
  const [collapsed, setCollapsed] = useState(false)
  const [activeItem, setActiveItem] = useState("dashboard")

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, badge: null },
    { id: "inventory", label: "Inventory", icon: Package, badge: "23" },
    { id: "pos", label: "POS System", icon: ShoppingCart, badge: null },
    { id: "customers", label: "Customers", icon: Users, badge: "5" },
    { id: "analytics", label: "Analytics", icon: BarChart3, badge: null },
    { id: "reports", label: "Reports", icon: TrendingUp, badge: null },
    { id: "settings", label: "Settings", icon: Settings, badge: null },
  ]

  return (
    <div
      className={cn(
        "glass-card border-r border-orange-200/50 h-screen flex flex-col transition-all duration-300 animate-slide-in-up",
        collapsed ? "w-16" : "w-64",
        className,
      )}
    >
      {/* Header */}
      <div className="p-4 border-b border-orange-200/50">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <div className="flex items-center gap-2 animate-fade-in-scale">
              <div className="p-1.5 luxury-gradient rounded-lg animate-glow">
                <Crown className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-sm text-gray-900">Admin Panel</h2>
                <p className="text-xs text-gray-600">Management System</p>
              </div>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCollapsed(!collapsed)}
            className="hover:bg-orange-50 transition-colors"
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-2 space-y-1">
        {menuItems.map((item, index) => {
          const Icon = item.icon
          const isActive = activeItem === item.id

          return (
            <Button
              key={item.id}
              variant={isActive ? "default" : "ghost"}
              className={cn(
                "w-full justify-start gap-3 h-10 transition-all duration-300 animate-slide-in-up",
                isActive ? "luxury-gradient text-white shadow-lg animate-glow" : "hover:bg-orange-50 text-gray-700",
                collapsed && "justify-center px-2",
              )}
              style={{ animationDelay: `${index * 0.1}s` }}
              onClick={() => setActiveItem(item.id)}
            >
              <Icon className="h-4 w-4 flex-shrink-0" />
              {!collapsed && (
                <>
                  <span className="flex-1 text-left">{item.label}</span>
                  {item.badge && (
                    <Badge variant="secondary" className="ml-auto bg-orange-100 text-orange-700">
                      {item.badge}
                    </Badge>
                  )}
                </>
              )}
            </Button>
          )
        })}
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-orange-200/50">
        {!collapsed ? (
          <div className="flex items-center gap-3 animate-fade-in-scale">
            <div className="w-8 h-8 rounded-full luxury-gradient flex items-center justify-center">
              <User className="h-4 w-4 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">Admin User</p>
              <p className="text-xs text-gray-600 truncate">admin@jewellers.com</p>
            </div>
            <Button variant="ghost" size="sm" className="hover:bg-orange-50">
              <Bell className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <Button variant="ghost" size="sm" className="w-full hover:bg-orange-50">
            <User className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  )
}
