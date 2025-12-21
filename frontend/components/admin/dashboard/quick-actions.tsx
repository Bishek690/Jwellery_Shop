"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Package, Users, BarChart3 } from "lucide-react"
import Link from "next/link"

interface QuickActionsProps {
  className?: string
}

export function QuickActions({ className }: QuickActionsProps) {
  const actions = [
    {
      href: "/pos",
      icon: ShoppingCart,
      label: "New Sale",
      variant: "default" as const,
      isPrimary: true,
      delay: "0s"
    },
    {
      href: "/inventory",
      icon: Package,
      label: "Add Product",
      variant: "outline" as const,
      isPrimary: false,
      delay: "0.5s"
    },
    {
      href: "#",
      icon: Users,
      label: "New Customer",
      variant: "outline" as const,
      isPrimary: false,
      delay: "1s"
    },
    {
      href: "/analytics",
      icon: BarChart3,
      label: "View Reports",
      variant: "outline" as const,
      isPrimary: false,
      delay: "1.5s"
    }
  ]

  return (
    <Card className={`glass-card animate-fade-in-scale ${className}`}>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>Frequently used operations for efficient management</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {actions.map((action, index) => (
            <Link key={index} href={action.href}>
              <Button
                className={`h-20 flex-col gap-2 transition-all duration-300 animate-float w-full ${
                  action.isPrimary
                    ? "luxury-gradient hover:shadow-lg"
                    : "hover:bg-orange-50 bg-transparent"
                }`}
                variant={action.variant}
                style={{ animationDelay: action.delay }}
              >
                <action.icon className="h-6 w-6" />
                {action.label}
              </Button>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
