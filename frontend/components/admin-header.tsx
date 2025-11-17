"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search, Bell, Settings, User, Gem, TrendingUp, Calendar } from "lucide-react"

export function AdminHeader() {
  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <header className="glass-card border-b border-orange-200/50 sticky top-0 z-40 animate-slide-in-up">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Left Section */}
        <div className="flex items-center gap-6">
          <div className="animate-fade-in-scale">
            <h1 className="text-xl font-bold text-gray-900">Good Morning, Admin</h1>
            <p className="text-sm text-gray-600 flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              {currentDate}
            </p>
          </div>

          {/* Search */}
          <div className="relative w-96 animate-slide-in-up" style={{ animationDelay: "0.2s" }}>
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search products, customers, orders..."
              className="pl-10 bg-white/80 border-orange-200/50 focus:border-orange-400 transition-colors"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {/* Gold Rate */}
          <div className="glass-card px-4 py-2 rounded-lg animate-float">
            <div className="flex items-center gap-2">
              <Gem className="h-4 w-4 text-orange-600" />
              <span className="text-sm font-medium">Gold Rate</span>
              <Badge variant="secondary" className="luxury-gradient text-white">
                NPR 6,850/tola
              </Badge>
              <TrendingUp className="h-3 w-3 text-green-600" />
            </div>
          </div>

          {/* Notifications */}
          <Button
            variant="ghost"
            size="sm"
            className="relative hover:bg-orange-50 transition-colors animate-fade-in-scale"
          >
            <Bell className="h-5 w-5" />
            <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-red-500 text-white text-xs">
              3
            </Badge>
          </Button>

          {/* Settings */}
          <Button variant="ghost" size="sm" className="hover:bg-orange-50 transition-colors animate-fade-in-scale">
            <Settings className="h-5 w-5" />
          </Button>

          {/* Profile */}
          <Button variant="ghost" size="sm" className="hover:bg-orange-50 transition-colors animate-fade-in-scale">
            <div className="w-8 h-8 rounded-full luxury-gradient flex items-center justify-center">
              <User className="h-4 w-4 text-white" />
            </div>
          </Button>
        </div>
      </div>
    </header>
  )
}
