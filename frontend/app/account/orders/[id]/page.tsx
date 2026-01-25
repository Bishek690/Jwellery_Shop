"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { CustomerNavbar } from "@/components/customer-navbar"
import { LandingFooter } from "@/components/landing-footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { 
  Package, 
  Clock, 
  CheckCircle, 
  XCircle, 
  ArrowLeft, 
  Truck, 
  MapPin,
  Phone,
  Mail,
  Calendar,
  CreditCard
} from "lucide-react"
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

interface TrackingEntry {
  id: number
  status: string
  notes: string
  createdAt: string
  updatedBy: {
    name: string
  } | null
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
  shippingEmail: string
  shippingAddress: string
  shippingCity: string
  shippingState: string
  shippingZipCode: string
  notes: string
  items: OrderItem[]
  tracking: TrackingEntry[]
  createdAt: string
}

export default function OrderDetailPage() {
  const router = useRouter()
  const params = useParams()
  const { user, isAuthenticated, isLoading } = useAuth()
  const { toast } = useToast()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push("/auth/login")
        return
      }
      
      if (user && user.role !== "customer") {
        router.push("/admin")
      }
    }
  }, [isAuthenticated, user, isLoading, router])

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/my-orders/${params.id}`, {
          credentials: "include",
        })

        if (response.ok) {
          const data = await response.json()
          setOrder(data)
        } else {
          toast({
            title: "Error",
            description: "Failed to load order details",
            variant: "destructive",
          })
          router.push("/account/orders")
        }
      } catch (error) {
        console.error("Error fetching order:", error)
        toast({
          title: "Error",
          description: "An error occurred while loading order",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    if (isAuthenticated && user?.role === "customer" && params.id) {
      fetchOrder()
    }
  }, [isAuthenticated, user, params.id, toast, router])

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

  if (!order) {
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
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "confirmed":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "processing":
        return "bg-purple-100 text-purple-800 border-purple-200"
      case "shipped":
        return "bg-indigo-100 text-indigo-800 border-indigo-200"
      case "delivered":
        return "bg-green-100 text-green-800 border-green-200"
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-5 w-5" />
      case "confirmed":
      case "processing":
        return <Package className="h-5 w-5" />
      case "shipped":
        return <Truck className="h-5 w-5" />
      case "delivered":
        return <CheckCircle className="h-5 w-5" />
      case "cancelled":
        return <XCircle className="h-5 w-5" />
      default:
        return <Package className="h-5 w-5" />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-orange-50/30 to-gray-50 flex flex-col">
      <CustomerNavbar />

      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 xl:px-8 py-4 sm:py-6 lg:py-8 flex-grow">
        <div className="mb-4 sm:mb-6 animate-fade-in-scale">
          <Link href="/account/orders">
            <Button variant="ghost" className="mb-3 sm:mb-4 text-xs sm:text-sm hover-glow">
              <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              Back to Orders
            </Button>
          </Link>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-serif text-gray-900 mb-1">
                Order #{order.orderNumber}
              </h1>
              <p className="text-xs sm:text-sm text-gray-600">
                Placed on {new Date(order.createdAt).toLocaleDateString("en-NP", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
            <Badge className={`${getStatusColor(order.status)} flex items-center gap-2 text-sm sm:text-base px-3 sm:px-4 py-2 border-2`}>
              {getStatusIcon(order.status)}
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            {/* Order Items */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">Order Items</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 sm:space-y-4">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex gap-3 sm:gap-4 pb-3 sm:pb-4 border-b last:border-0">
                      <img
                        src={item.productImage ? `${process.env.NEXT_PUBLIC_BACKEND_URL}${item.productImage}` : "/placeholder.svg"}
                        alt={item.productName}
                        className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg gold-shimmer"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm sm:text-base text-gray-900 mb-1">{item.productName}</h4>
                        <p className="text-xs sm:text-sm text-gray-500">SKU: {item.productSku}</p>
                        <div className="flex flex-wrap gap-1.5 mt-1.5">
                          <Badge variant="outline" className="text-[10px] sm:text-xs">{item.metalType}</Badge>
                          <Badge variant="outline" className="text-[10px] sm:text-xs">{item.purity}</Badge>
                          <Badge variant="outline" className="text-[10px] sm:text-xs">{item.weight}g</Badge>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-baseline gap-2">
                            <span className="font-bold text-sm sm:text-base text-orange-600">
                              {formatPrice(item.discountPrice || item.price)}
                            </span>
                            {item.discountPrice && (
                              <span className="text-xs text-gray-500 line-through">
                                {formatPrice(item.price)}
                              </span>
                            )}
                            <span className="text-xs text-gray-500">× {item.quantity}</span>
                          </div>
                          <span className="font-bold text-sm sm:text-base text-gray-900">
                            {formatPrice(item.totalPrice)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Order Tracking */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
                  <Truck className="h-5 w-5 text-orange-600" />
                  Order Tracking
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  {order.tracking.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map((track, index) => (
                    <div key={track.id} className="flex gap-3 sm:gap-4 pb-4 sm:pb-6 last:pb-0">
                      <div className="relative flex flex-col items-center">
                        <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center ${getStatusColor(track.status)} border-2 z-10`}>
                          {getStatusIcon(track.status)}
                        </div>
                        {index < order.tracking.length - 1 && (
                          <div className="w-0.5 h-full bg-gray-200 absolute top-10 bottom-0" />
                        )}
                      </div>
                      <div className="flex-1 pt-1">
                        <p className="font-semibold text-sm sm:text-base text-gray-900 capitalize">
                          {track.status.replace("-", " ")}
                        </p>
                        <p className="text-xs sm:text-sm text-gray-600 mt-1">{track.notes}</p>
                        <p className="text-[10px] sm:text-xs text-gray-500 mt-1">
                          {new Date(track.createdAt).toLocaleString("en-NP", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-4 sm:space-y-6">
            {/* Order Summary */}
            <div className="lg:sticky lg:top-20 space-y-4 sm:space-y-6">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="text-lg sm:text-xl">Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-medium">{formatPrice(order.subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Shipping</span>
                      <span className="font-medium">
                        {order.shippingCost === 0 ? "Free" : formatPrice(order.shippingCost)}
                      </span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-bold text-base sm:text-lg">
                      <span>Total</span>
                      <span className="text-orange-600">{formatPrice(order.totalAmount)}</span>
                    </div>
                  </div>

                  <Separator />

                  {/* Payment Info */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <CreditCard className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-600">Payment Method:</span>
                    </div>
                    <p className="text-sm font-medium ml-6">
                      {order.paymentMethod === "cod" ? "Cash on Delivery" : "Online Payment"}
                    </p>
                    <Badge variant="outline" className="ml-6">
                      {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Shipping Address */}
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-orange-600" />
                    Delivery Address
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="font-semibold text-sm sm:text-base">{order.shippingName}</p>
                    <p className="text-xs sm:text-sm text-gray-600 mt-1">{order.shippingAddress}</p>
                    <p className="text-xs sm:text-sm text-gray-600">
                      {order.shippingCity}{order.shippingState && `, ${order.shippingState}`}
                    </p>
                    {order.shippingZipCode && (
                      <p className="text-xs sm:text-sm text-gray-600">{order.shippingZipCode}</p>
                    )}
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                      <Phone className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span>{order.shippingPhone}</span>
                    </div>
                    {order.shippingEmail && (
                      <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                        <Mail className="h-3 w-3 sm:h-4 sm:w-4" />
                        <span className="truncate">{order.shippingEmail}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <LandingFooter />
    </div>
  )
}
