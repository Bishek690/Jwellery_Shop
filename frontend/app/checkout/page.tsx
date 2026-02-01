"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { CustomerNavbar } from "@/components/customer-navbar"
import { LandingFooter } from "@/components/landing-footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, CreditCard, Wallet, ShoppingBag, MapPin, User as UserIcon, Phone, Mail } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { useCart } from "@/hooks/use-cart"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

export default function CheckoutPage() {
  const router = useRouter()
  const { user, isAuthenticated, isLoading } = useAuth()
  const { cartItems, getCartTotal, clearCart } = useCart()
  const { toast } = useToast()
  const [paymentMethod, setPaymentMethod] = useState("cod")
  const [isProcessing, setIsProcessing] = useState(false)

  // Shipping form state
  const [shippingInfo, setShippingInfo] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
  })

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

  // Redirect if cart is empty
  useEffect(() => {
    if (!isLoading && cartItems.length === 0) {
      router.push("/cart")
    }
  }, [cartItems, isLoading, router])

  // Pre-fill user data
  useEffect(() => {
    if (user) {
      setShippingInfo(prev => ({
        ...prev,
        fullName: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
      }))
    }
  }, [user])

  if (isLoading) {
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

  const subtotal = getCartTotal()
  const shipping = subtotal >= 100000 ? 0 : 500
  const total = subtotal + shipping

  const handlePlaceOrder = async () => {
    // Validate shipping information
    if (!shippingInfo.fullName || !shippingInfo.phone || !shippingInfo.address || !shippingInfo.city) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required shipping details.",
        variant: "destructive",
      })
      return
    }

    setIsProcessing(true)

    try {
      // Prepare order data
      const orderData = {
        items: cartItems,
        subtotal,
        shippingCost: shipping,
        totalAmount: total,
        paymentMethod,
        shippingInfo,
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(orderData),
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Order Placed Successfully!",
          description: `Order #${data.order.orderNumber} has been placed. You'll pay when you receive it.`,
        })
        clearCart()
        router.push("/account/orders")
      } else {
        toast({
          title: "Order Failed",
          description: data.message || "Failed to place order. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error placing order:", error)
      toast({
        title: "Error",
        description: "An error occurred while placing your order. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <CustomerNavbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow">
        {/* Header */}
        <div className="mb-8">
          <Link href="/cart">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Cart
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
          <p className="text-gray-600 mt-2">Complete your purchase</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Shipping and Payment Forms */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-orange-600" />
                  Shipping Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">
                      Full Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="fullName"
                      placeholder="Enter your full name"
                      value={shippingInfo.fullName}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, fullName: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">
                      Phone Number <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="phone"
                      placeholder="Enter your phone number"
                      value={shippingInfo.phone}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, phone: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={shippingInfo.email}
                    onChange={(e) => setShippingInfo({ ...shippingInfo, email: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">
                    Street Address <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="address"
                    placeholder="Enter your street address"
                    value={shippingInfo.address}
                    onChange={(e) => setShippingInfo({ ...shippingInfo, address: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">
                      City <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="city"
                      placeholder="City"
                      value={shippingInfo.city}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, city: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State/Province</Label>
                    <Input
                      id="state"
                      placeholder="State"
                      value={shippingInfo.state}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, state: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zipCode">Postal Code</Label>
                    <Input
                      id="zipCode"
                      placeholder="Postal Code"
                      value={shippingInfo.zipCode}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, zipCode: e.target.value })}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wallet className="h-5 w-5 text-orange-600" />
                  Payment Method
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                  <div className="space-y-3">
                    {/* Cash on Delivery */}
                    <div className="flex items-center space-x-2 border rounded-lg p-4 cursor-pointer hover:bg-gray-50 transition-colors">
                      <RadioGroupItem value="cod" id="cod" />
                      <Label htmlFor="cod" className="flex-1 cursor-pointer">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Wallet className="h-5 w-5 text-green-600" />
                            <div>
                              <p className="font-medium">Cash on Delivery</p>
                              <p className="text-sm text-gray-500">Pay when you receive your order</p>
                            </div>
                          </div>
                          <Badge className="bg-green-500">Available</Badge>
                        </div>
                      </Label>
                    </div>

                    {/* Online Payment */}
                    <div className="flex items-center space-x-2 border rounded-lg p-4 opacity-60">
                      <RadioGroupItem value="online" id="online" disabled />
                      <Label htmlFor="online" className="flex-1 cursor-not-allowed">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <CreditCard className="h-5 w-5 text-blue-600" />
                            <div>
                              <p className="font-medium">Pay Now (Online)</p>
                              <p className="text-sm text-gray-500">Credit/Debit Card, E-Wallet, Banking</p>
                            </div>
                          </div>
                          <Badge variant="outline" className="text-orange-600 border-orange-600">
                            Coming Soon
                          </Badge>
                        </div>
                      </Label>
                    </div>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Cart Items */}
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex gap-3 pb-3 border-b">
                      <img
                        src={item.image ? `${process.env.NEXT_PUBLIC_BACKEND_URL}${item.image}` : "/placeholder.svg"}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{item.name}</p>
                        <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                        <p className="text-sm font-semibold text-orange-600">
                          {formatPrice((item.discountPrice || item.price) * item.quantity)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <Separator />

                {/* Price Breakdown */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium">{shipping === 0 ? "Free" : formatPrice(shipping)}</span>
                  </div>
                  {subtotal > 0 && subtotal < 100000 && (
                    <p className="text-xs text-gray-500">
                      Add {formatPrice(100000 - subtotal)} more for free shipping!
                    </p>
                  )}
                  <Separator />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span className="text-orange-600">{formatPrice(total)}</span>
                  </div>
                </div>

                <Button
                  className="w-full luxury-gradient hover:shadow-lg transition-all duration-300"
                  size="lg"
                  onClick={handlePlaceOrder}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="h-4 w-4 mr-2" />
                      Place Order
                    </>
                  )}
                </Button>

                {/* Trust Badges */}
                <div className="pt-4 border-t space-y-2">
                  <p className="text-xs text-gray-500 flex items-center">
                    <Badge className="mr-2 bg-green-500 text-white">✓</Badge>
                    Secure Checkout
                  </p>
                  <p className="text-xs text-gray-500 flex items-center">
                    <Badge className="mr-2 bg-green-500 text-white">✓</Badge>
                    100% Authentic Products
                  </p>
                  <p className="text-xs text-gray-500 flex items-center">
                    <Badge className="mr-2 bg-green-500 text-white">✓</Badge>
                    Easy Returns within 7 days
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <LandingFooter />
    </div>
  )
}
