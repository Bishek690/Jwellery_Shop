"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, Package, Users, DollarSign, Clock } from "lucide-react"

export function AdminRecentActivity() {
  const activities = [
    {
      id: 1,
      type: "sale",
      title: "New sale completed",
      description: "Diamond necklace set sold to Priya Sharma",
      amount: "NPR 2,85,000",
      time: "2 minutes ago",
      icon: ShoppingCart,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      id: 2,
      type: "inventory",
      title: "Low stock alert",
      description: "Gold bangles (22K) - Only 3 pieces remaining",
      amount: null,
      time: "15 minutes ago",
      icon: Package,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      id: 3,
      type: "customer",
      title: "New customer registered",
      description: "Rajesh Kumar added to customer database",
      amount: null,
      time: "1 hour ago",
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      id: 4,
      type: "sale",
      title: "Payment received",
      description: "Ruby ring collection - Full payment",
      amount: "NPR 95,000",
      time: "2 hours ago",
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      id: 5,
      type: "inventory",
      title: "New stock added",
      description: "Silver earrings collection - 25 pieces",
      amount: null,
      time: "3 hours ago",
      icon: Package,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
  ]

  return (
    <Card className="glass-card animate-fade-in-scale">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-orange-600" />
          Recent Activity
        </CardTitle>
        <CardDescription>Latest updates and transactions in your jewelry store</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity, index) => {
            const Icon = activity.icon

            return (
              <div
                key={activity.id}
                className="flex items-start gap-4 p-3 rounded-lg hover:bg-orange-50/50 transition-colors duration-200 animate-slide-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`p-2 rounded-lg ${activity.bgColor} animate-float`}>
                  <Icon className={`h-4 w-4 ${activity.color}`} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-gray-900">{activity.title}</h4>
                    {activity.amount && (
                      <Badge variant="secondary" className="luxury-gradient text-white">
                        {activity.amount}
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                  <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {activity.time}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
