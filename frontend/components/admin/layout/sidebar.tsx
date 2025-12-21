"use client"

import { useState, useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
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
  LogOut,
  Menu,
  X,
  Store,
  Gem,
  FileText,
  MessageSquare,
  Globe,
  ChevronDown,
  ChevronUp,
} from "lucide-react"

interface AdminSidebarProps {
  className?: string
  isMobile?: boolean
  onClose?: () => void
}

interface MenuItem {
  id: string
  label: string
  icon: any
  href: string
  badge?: string | number
  badgeColor?: "default" | "destructive" | "secondary"
  permission?: string[]
  children?: MenuItem[]
}

export function AdminSidebar({ className, isMobile = false, onClose }: AdminSidebarProps) {
  const [collapsed, setCollapsed] = useState(false)
  const [expandedGroups, setExpandedGroups] = useState<string[]>([])
  const pathname = usePathname()
  const router = useRouter()

  // Temporary mock user - replace with actual useAuth when fixed
  const user = { role: "admin", name: "Admin User", email: "admin@jewelry.com" }

  // Menu items with proper navigation and permissions
  const menuItems: MenuItem[] = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      href: "/admin",
      permission: ["admin", "staff", "accountant"],
    },
    // {
    //   id: "staff-dashboard",
    //   label: "Staff Dashboard",
    //   icon: Crown,
    //   href: "/admin/dashboard",
    //   permission: ["admin", "staff"],
    // },
    {
      id: "inventory",
      label: "Inventory",
      icon: Package,
      href: "/admin/inventory",
      badge: 23,
      badgeColor: "destructive",
      permission: ["admin", "staff"],
    },
    {
      id: "pos",
      label: "POS System",
      icon: ShoppingCart,
      href: "/admin/pos",
      permission: ["admin", "staff"],
    },
    {
      id: "customers",
      label: "Customers",
      icon: Users,
      href: "/admin/customers",
      badge: 5,
      badgeColor: "secondary",
      permission: ["admin", "staff", "accountant"],
    },
    {
      id: "analytics",
      label: "Analytics",
      icon: BarChart3,
      href: "/admin/analytics",
      permission: ["admin", "staff", "accountant"],
    },
    {
      id: "website",
      label: "Website",
      icon: Globe,
      href: "/",
      permission: ["admin", "staff", "accountant"],
    },
    {
      id: "settings",
      label: "Settings",
      icon: Settings,
      href: "/admin/settings",
      permission: ["admin"],
    },
  ]

  // Filter menu items based on user permissions
  const filteredMenuItems = menuItems.filter(item => 
    !item.permission || (user?.role && item.permission.includes(user.role))
  )

  // Handle navigation
  const handleNavigation = (href: string) => {
    router.push(href)
    if (isMobile && onClose) {
      onClose()
    }
  }

  // Handle logout - simplified version
  const handleLogout = () => {
    // For now just redirect to login
    router.push("/auth/login")
  }

  // Toggle group expansion
  const toggleGroup = (groupId: string) => {
    setExpandedGroups(prev => 
      prev.includes(groupId) 
        ? prev.filter(id => id !== groupId)
        : [...prev, groupId]
    )
  }

  // Check if current path matches menu item
  const isActive = (href: string) => {
    if (href === "/admin" && pathname === "/admin") return true
    if (href !== "/admin" && pathname.startsWith(href)) return true
    return false
  }

  // Mobile overlay effect
  useEffect(() => {
    if (isMobile) {
      document.body.style.overflow = "hidden"
      return () => {
        document.body.style.overflow = "unset"
      }
    }
  }, [isMobile])

  // Render menu item
  const renderMenuItem = (item: MenuItem, index: number, isChild = false) => {
    const Icon = item.icon
    const active = isActive(item.href)
    const hasChildren = item.children && item.children.length > 0
    const isExpanded = expandedGroups.includes(item.id)

    return (
      <div key={item.id} className={cn("animate-slide-in-up", isChild && "ml-4")}>
        <Button
          variant={active ? "default" : "ghost"}
          className={cn(
            "w-full justify-start gap-3 h-12 transition-all duration-300 group",
            active 
              ? "luxury-gradient text-white shadow-lg animate-glow" 
              : "hover:bg-orange-50 text-gray-700 hover:text-orange-700",
            collapsed && !isMobile && "justify-center px-2",
            isChild && "h-10 text-sm"
          )}
          style={{ animationDelay: `${index * 0.1}s` }}
          onClick={() => {
            if (hasChildren && !collapsed) {
              toggleGroup(item.id)
            } else {
              handleNavigation(item.href)
            }
          }}
        >
          <Icon className={cn(
            "flex-shrink-0 transition-transform group-hover:scale-110",
            isChild ? "h-4 w-4" : "h-5 w-5"
          )} />
          
          {(!collapsed || isMobile) && (
            <>
              <span className="flex-1 text-left font-medium">{item.label}</span>
              
              {/* Badge */}
              {item.badge && (
                <Badge 
                  variant={item.badgeColor || "secondary"} 
                  className={cn(
                    "text-xs px-2 py-0.5",
                    item.badgeColor === "destructive" && "bg-red-100 text-red-700 animate-pulse",
                    item.badgeColor === "secondary" && "bg-blue-100 text-blue-700"
                  )}
                >
                  {item.badge}
                </Badge>
              )}
              
              {/* Expand/Collapse Icon */}
              {hasChildren && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-0 h-auto hover:bg-transparent"
                  onClick={(e) => {
                    e.stopPropagation()
                    toggleGroup(item.id)
                  }}
                >
                  {isExpanded ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </Button>
              )}
            </>
          )}
        </Button>
        
        {/* Children */}
        {hasChildren && isExpanded && (!collapsed || isMobile) && (
          <div className="mt-1 space-y-1 animate-slide-in-up">
            {item.children?.map((child, childIndex) => 
              renderMenuItem(child, childIndex, true)
            )}
          </div>
        )}
      </div>
    )
  }

  return (
    <>
      {/* Mobile Overlay */}
      {isMobile && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden animate-fade-in"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "bg-white/95 backdrop-blur-xl border-r border-orange-200/50 h-screen flex flex-col transition-all duration-300 shadow-2xl z-50",
          isMobile 
            ? "fixed left-0 top-0 w-80 animate-slide-in-left" 
            : collapsed 
              ? "w-20 animate-slide-in-right" 
              : "w-72 animate-slide-in-right",
          className,
        )}
      >
        {/* Header */}
        <div className="p-6 border-b border-orange-200/50 bg-gradient-to-r from-orange-50 to-amber-50">
          <div className="flex items-center justify-between">
            {(!collapsed || isMobile) && (
              <div className="flex items-center gap-3 animate-fade-in-scale">
                <div className="p-2.5 luxury-gradient rounded-xl shadow-lg animate-glow">
                  <Crown className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="font-bold text-lg text-gray-900">Jewelry Admin</h2>
                  <p className="text-sm text-gray-600 flex items-center gap-1">
                    <Gem className="h-3 w-3 text-orange-500" />
                    Management System
                  </p>
                </div>
              </div>
            )}
            
            {/* Toggle/Close Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={isMobile ? onClose : () => setCollapsed(!collapsed)}
              className="hover:bg-orange-100 transition-all duration-300 p-2 rounded-full"
            >
              {isMobile ? (
                <X className="h-5 w-5 text-gray-700" />
              ) : collapsed ? (
                <ChevronRight className="h-5 w-5 text-gray-700" />
              ) : (
                <ChevronLeft className="h-5 w-5 text-gray-700" />
              )}
            </Button>
          </div>
        </div>

        {/* User Info */}
        {(!collapsed || isMobile) && user && (
          <div className="p-4 bg-gradient-to-r from-orange-25 to-amber-25 border-b border-orange-200/30">
            <div className="flex items-center gap-3 animate-fade-in-scale">
              <div className="w-10 h-10 rounded-full luxury-gradient flex items-center justify-center shadow-md">
                <User className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate capitalize">
                  {user.name || user.email?.split('@')[0] || 'Admin'}
                </p>
                <p className="text-xs text-gray-600 truncate flex items-center gap-1">
                  <Badge variant="secondary" className="text-xs px-2 py-0 bg-orange-100 text-orange-700">
                    {user.role}
                  </Badge>
                </p>
              </div>
              <Button variant="ghost" size="sm" className="hover:bg-orange-100 p-1.5 rounded-full">
                <Bell className="h-4 w-4 text-gray-600" />
              </Button>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto scrollbar-thin scrollbar-thumb-orange-200">
          {filteredMenuItems.map((item, index) => renderMenuItem(item, index))}
        </nav>

        {/* Footer Actions */}
        <div className="p-4 border-t border-orange-200/50 space-y-2 bg-gradient-to-r from-orange-25 to-amber-25">
          {(!collapsed || isMobile) && (
            <div className="flex gap-2 animate-fade-in-scale">
              <Button
                variant="outline"
                onClick={handleLogout}
                className="flex-1 hover:bg-red-50 border-red-200 text-red-600 hover:text-red-700"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          )}
          
          {collapsed && !isMobile && (
            <div className="space-y-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleNavigation("/")}
                className="w-full hover:bg-orange-50 p-3"
                title="Visit Store"
              >
                <Store className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="w-full hover:bg-red-50 text-red-600 p-3"
                title="Logout"
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
