"use client"

import { useState, useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/hooks/use-auth"
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
  collapsed?: boolean
  onClose?: () => void
  onToggleCollapse?: () => void
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

export function AdminSidebar({ 
  className, 
  isMobile = false, 
  collapsed = false,
  onClose,
  onToggleCollapse 
}: AdminSidebarProps) {
  const [expandedGroups, setExpandedGroups] = useState<string[]>([])
  const [customerCount, setCustomerCount] = useState<number>(0)
  const [totalProductCount, setTotalProductCount] = useState<number>(0)
  const pathname = usePathname()
  const router = useRouter()

  // Get authenticated user
  const { user, logout } = useAuth()

  // Fetch customer count
  const fetchCustomerCount = async () => {
    try {
      const response = await fetch('/api/dashboard/customer-count', {
        credentials: 'include',
      })

      if (response.ok) {
        const data = await response.json()
        setCustomerCount(data.count || 0)
      }
    } catch (error) {
      console.error('Failed to fetch customer count:', error)
      setCustomerCount(0)
    }
  }

  // Fetch product stats for total product count
  const fetchProductStats = async () => {
    try {
      const response = await fetch('/api/products/stats', {
        credentials: 'include',
      })

      if (response.ok) {
        const data = await response.json()
        setTotalProductCount(data.totalProducts || 0)
      }
    } catch (error) {
      console.error('Failed to fetch product stats:', error)
      setTotalProductCount(0)
    }
  }

  // Fetch counts on component mount - only run once when user becomes available
  useEffect(() => {
    if (user && user.id) {
      fetchCustomerCount()
      fetchProductStats()
    }
  }, [user?.id]) // Only depend on user ID to prevent re-fetching on every user object change

  // Menu items with proper navigation and permissions
  const menuItems: MenuItem[] = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      href: "/admin",
      permission: ["admin", "staff", "accountant"],
    },
    {
      id: "inventory",
      label: "Inventory",
      icon: Package,
      href: "/inventory",
      badge: totalProductCount > 0 ? totalProductCount : undefined,
      badgeColor: "secondary",
      permission: ["admin", "staff"],
    },
    {
      id: "user-management",
      label: "User Management",
      icon: User,
      href: "#",
      permission: ["admin"],
      children: [
        {
          id: "create-user",
          label: "Create User",
          icon: User,
          href: "/admin/users/create",
          permission: ["admin"],
        },
        {
          id: "manage-users",
          label: "Manage Users",
          icon: Users,
          href: "/admin/users",
          permission: ["admin"],
        },
      ],
    },
    {
      id: "customers",
      label: "Customers",
      icon: Users,
      href: "/admin/customers",
      badge: customerCount,
      badgeColor: "secondary",
      permission: ["admin", "staff", "accountant"],
    },
    {
      id: "orders",
      label: "Orders",
      icon: ShoppingCart,
      href: "/admin/orders",
      // badge: orderCount,
      badgeColor: "secondary",
      permission: ["admin", "staff"]
    },
    {
      id: "analytics",
      label: "Analytics",
      icon: BarChart3,
      href: "/admin/analytics",
      permission: ["admin", "staff", "accountant"],
    },
    {
      id: "pos",
      label: "POS System",
      icon: ShoppingCart,
      href: "/admin/pos",
      permission: ["admin", "staff"],
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

  // Handle logout using auth hook
  const handleLogout = async () => {
    await logout()
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
    // Special case for admin dashboard
    if (href === "/admin" && pathname === "/admin") return true
    
    // Special case for website/home - only active when exactly on "/"
    if (href === "/" && pathname === "/") return true
    
    // Skip hash links
    if (href === "#") return false
    
    // For user management routes, use exact matching to prevent conflicts
    if (href === "/admin/users" && pathname === "/admin/users") return true
    if (href === "/admin/users/create" && pathname === "/admin/users/create") return true
    
    // For other admin routes, check if path starts with href but not if there's a more specific route
    if (href !== "/admin" && href !== "/" && href !== "#") {
      // Exact match first
      if (pathname === href) return true
      
      // For parent routes, only match if it starts with href + "/" to avoid substring matches
      if (pathname.startsWith(href + "/") && href !== "/admin/users") return true
    }
    
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
              {item.badge !== undefined && item.badge !== null && item.badge !== 0 && (
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
      {/* Sidebar */}
      <div
        className={cn(
          "admin-sidebar bg-white/95 backdrop-blur-xl border-r border-orange-200/50 h-screen flex flex-col shadow-2xl",
          // Mobile state
          isMobile && "mobile-open",
          // Desktop collapsed state
          collapsed && "collapsed",
          className,
        )}
      >
        {/* Header */}
        <div className="p-4 lg:p-6 border-b border-orange-200/50 bg-gradient-to-r from-orange-50 to-amber-50">
          <div className="flex items-center justify-between">
            {(!collapsed || isMobile) && (
              <div className="flex items-center gap-2 lg:gap-3 animate-fade-in-scale min-w-0">
                <div className="p-2 lg:p-2.5 luxury-gradient rounded-xl shadow-lg animate-glow flex-shrink-0">
                  <Crown className="h-5 w-5 lg:h-6 lg:w-6 text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="font-bold text-base lg:text-lg text-gray-900 truncate">Jewelry Shop</h2>
                  <p className="text-xs lg:text-sm text-gray-600 flex items-center gap-1 truncate">
                    <Gem className="h-3 w-3 text-orange-500 flex-shrink-0" />
                    <span className="truncate">Management System</span>
                  </p>
                </div>
              </div>
            )}
            
            {/* Toggle/Close Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={isMobile ? onClose : onToggleCollapse}
              className="hover:bg-orange-100 transition-all duration-300 p-2 rounded-full flex-shrink-0"
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

        {/* Navigation */}
        <nav className="flex-1 p-3 lg:p-4 space-y-1 lg:space-y-2 overflow-y-auto scrollbar-thin scrollbar-thumb-orange-200">
          {filteredMenuItems.map((item, index) => renderMenuItem(item, index))}
        </nav>

        {/* Footer Actions */}
        <div className="p-3 lg:p-4 border-t border-orange-200/50 space-y-2 bg-gradient-to-r from-orange-25 to-amber-25">
          {(!collapsed || isMobile) && (
            <div className="flex gap-2 animate-fade-in-scale">
              <Button
                variant="outline"
                onClick={handleLogout}
                className="flex-1 hover:bg-red-50 border-red-200 text-red-600 hover:text-red-700 text-sm"
              >
                <LogOut className="h-4 w-4 mr-2" />
                <span className="truncate">Logout</span>
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
