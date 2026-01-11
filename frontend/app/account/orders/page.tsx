"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { CustomerNavbar } from "@/components/customer-navbar"
import { LandingFooter } from "@/components/landing-footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Package, Clock, CheckCircle, XCircle, ArrowLeft, ShoppingBag, Truck, Eye } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

interface OrderItem {
  id: number
  productName: string
  productSku: string
  productImage: string
  metalType: string
  purity: string
  weight: number
  price: number
  discountPrice: number | null
  quantity: number
  totalPrice: number
}

interface Order {
  id: number
  orderNumber: string
  subtotal: number
  shippingCost: number
  totalAmount: number
  status: string
  paymentMethod: string
  paymentStatus: string
  shippingName: string
  shippingPhone: string
  shippingAddress: string
  shippingCity: string
  items: OrderItem[]
  tracking: any[]
  createdAt: string
}

export default function OrdersPage() {
  const router = useRouter()
  const { user, isAuthenticated, isLoading } = useAuth()
  const { toast } = useToast()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  // Check if user is authenticated and is a customer
  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push("/auth/login")
        return
      }
      
      if (user && user.role !== "customer") {
        switch (user.role) {
          case "admin":
            router.push("/admin")
            break
          case "staff":
            router.push("/admin/dashboard")
            break
          case "accountant":
            router.push("/analytics")
            break
          default:
            router.push("/auth/login")
            break
        }
      }
    }
  }, [isAuthenticated, user, isLoading, router])

  // Fetch orders
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/my-orders`, {
          credentials: "include",
        })

        if (response.ok) {
          const data = await response.json()
          setOrders(data)
        } else {
          toast({
            title: "Error",
            description: "Failed to load orders",
            variant: "destructive",
          })
        }
      } catch (error) {
        console.error("Error fetching orders:", error)
        toast({
          title: "Error",
          description: "An error occurred while loading orders",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    if (isAuthenticated && user?.role === "customer") {
      fetchOrders()
    }
  }, [isAuthenticated, user, toast])

  if (isLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated || (user && user.role !== "customer")) {
    return null
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-NP", {
      style: "currency",
      currency: "NPR",
      maximumFractionDigits: 0,
    }).format(price)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "confirmed":
        return "bg-blue-100 text-blue-800"
      case "processing":
        return "bg-purple-100 text-purple-800"
      case "shipped":
        return "bg-indigo-100 text-indigo-800"
      case "delivered":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />
      case "confirmed":
      case "processing":
        return <Package className="h-4 w-4" />
      case "shipped":
        return <Truck className="h-4 w-4" />
      case "delivered":
        return <CheckCircle className="h-4 w-4" />
      case "cancelled":
        return <XCircle className="h-4 w-4" />
      default:
        return <Package className="h-4 w-4" />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-orange-50/30 to-gray-50 flex flex-col">
      <CustomerNavbar />

      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 xl:px-8 py-4 sm:py-6 lg:py-8 flex-grow">
        {/* Header */}
        <div className="mb-4 sm:mb-6 lg:mb-8 animate-fade-in-scale">
          <Link href="/account">
            <Button variant="ghost" className="mb-3 sm:mb-4 text-xs sm:text-sm hover-glow">
              <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              Back to Account
            </Button>
          </Link>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-serif text-gray-900 mb-2">My Orders</h1>
          <p className="text-sm sm:text-base text-gray-600">Track and manage your orders</p>
        </div>

        {orders.length === 0 ? (
          <Card className="text-center py-12 sm:py-16 glass-card animate-fade-in-scale">
            <CardContent>
              <div className="p-4 sm:p-6 bg-orange-100 rounded-full w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-4 sm:mb-6 flex items-center justify-center">
                <Package className="h-10 w-10 sm:h-12 sm:w-12 text-orange-600" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-700 mb-2">No orders yet</h3>
              <p className="text-sm sm:text-base text-gray-500 mb-4 sm:mb-6">
                You haven't placed any orders yet. Start shopping to see your orders here!
              </p>
              <Link href="/shop">
                <Button className="luxury-gradient hover:shadow-lg transition-all duration-300 text-sm sm:text-base">
                  <ShoppingBag className="h-4 w-4 mr-2" />
                  Browse Collections
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {orders.map((order, index) => (
              <Card key={order.id} className="overflow-hidden glass-card hover-lift animate-fade-in-scale" style={{ animationDelay: `${index * 0.1}s` }}>
                <CardHeader className="pb-3 sm:pb-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4">
                    <div>
                      <CardTitle className="text-base sm:text-lg mb-1">Order #{order.orderNumber}</CardTitle>
                      <p className="text-xs sm:text-sm text-gray-500">
                        Placed on {new Date(order.createdAt).toLocaleDateString("en-NP", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                    <Badge className={`${getStatusColor(order.status)} flex items-center gap-1 text-xs sm:text-sm px-2 sm:px-3 py-1`}>
                      {getStatusIcon(order.status)}
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3 sm:space-y-4">
                  {/* Order Items */}
                  <div className="space-y-2">
                    {order.items.slice(0, 2).map((item) => (
                      <div key={item.id} className="flex gap-2 sm:gap-3 pb-2 border-b last:border-0">
                        <img
                          src={item.productImage ? `${process.env.NEXT_PUBLIC_BACKEND_URL}${item.productImage}` : "/placeholder.svg"}
                          alt={item.productName}
                          className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-xs sm:text-sm truncate">{item.productName}</p>
                          <p className="text-[10px] sm:text-xs text-gray-500">
                            {item.metalType} • {item.purity} • Qty: {item.quantity}
                          </p>
                          <p className="text-xs sm:text-sm font-semibold text-orange-600">
                            {formatPrice(item.totalPrice)}
                          </p>
                        </div>
                      </div>
                    ))}
                    {order.items.length > 2 && (
                      <p className="text-xs text-gray-500 text-center pt-2">
                        +{order.items.length - 2} more item{order.items.length - 2 > 1 ? "s" : ""}
                      </p>
                    )}
                  </div>

                  {/* Order Summary */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4 pt-3 border-t">
                    <div className="space-y-1">
                      <p className="text-xs sm:text-sm text-gray-600">
                        Total Amount: <span className="font-bold text-orange-600 text-sm sm:text-base">{formatPrice(order.totalAmount)}</span>
                      </p>
                      <p className="text-xs text-gray-500">
                        Payment: {order.paymentMethod === "cod" ? "Cash on Delivery" : "Online"}
                      </p>
                      <p className="text-xs text-gray-500 flex items-start gap-1">
                        <span className="flex-shrink-0">Delivery:</span>
                        <span className="line-clamp-2">{order.shippingAddress}, {order.shippingCity}</span>
                      </p>
                    </div>
                    <Link href={`/account/orders/${order.id}`}>
                      <Button variant="outline" size="sm" className="w-full sm:w-auto hover:bg-orange-50 text-xs sm:text-sm">
                        <Eye className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                        View Details
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <LandingFooter />
    </div>
  )
}
