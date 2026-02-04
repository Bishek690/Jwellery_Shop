"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { CustomerNavbar } from "@/components/customer-navbar"
import { LandingFooter } from "@/components/landing-footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, Shield, Package, RotateCcw } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { useCart } from "@/hooks/use-cart"
import Link from "next/link"

export default function CartPage() {
  const router = useRouter()
  const { user, isAuthenticated, isLoading } = useAuth()
  const { cartItems, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart()

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
  const shipping = subtotal > 0 ? (subtotal >= 100000 ? 0 : 500) : 0
  const total = subtotal + shipping
  const freeShippingProgress = subtotal >= 100000 ? 100 : (subtotal / 100000) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-orange-50/30 to-gray-50 flex flex-col">
      <CustomerNavbar />

      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 py-4 sm:py-6 lg:py-8 flex-grow w-full">
        {/* Header */}
        <div className="mb-4 sm:mb-6 lg:mb-8 animate-fade-in-scale">
          <Link href="/shop">
            <Button variant="ghost" className="mb-3 sm:mb-4 text-xs sm:text-sm hover-glow">
              <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              Continue Shopping
            </Button>
          </Link>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-serif text-gray-900 mb-2">Shopping Cart</h1>
          <p className="text-sm sm:text-base text-gray-600">
            {cartItems.length === 0
              ? "Your cart is empty"
              : `${cartItems.length} ${cartItems.length === 1 ? "item" : "items"} in your cart`}
          </p>
        </div>

        {cartItems.length === 0 ? (
          <Card className="text-center py-12 sm:py-16 glass-card animate-fade-in-scale">
            <CardContent>
              <div className="p-4 sm:p-6 bg-orange-100 rounded-full w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-4 sm:mb-6 flex items-center justify-center">
                <ShoppingBag className="h-10 w-10 sm:h-12 sm:w-12 text-orange-600" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-700 mb-2">Your cart is empty</h3>
              <p className="text-sm sm:text-base text-gray-500 mb-4 sm:mb-6">Add some beautiful jewelry to your cart!</p>
              <Link href="/shop">
                <Button className="luxury-gradient hover:shadow-lg transition-all duration-300 text-sm sm:text-base">
                  <ShoppingBag className="h-4 w-4 mr-2" />
                  Browse Collections
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 sm:gap-6 lg:gap-8">
            {/* Cart Items - 2 columns on md/lg, full width on xl */}
            <div className="xl:col-span-8 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                {cartItems.map((item, index) => (
                  <Card key={item.id} className="overflow-hidden glass-card hover-lift animate-fade-in-scale" style={{ animationDelay: `${index * 0.1}s` }}>
                    <CardContent className="p-3 sm:p-4">
                      {/* Product Image */}
                      <div className="relative mb-3">
                        <img
                          src={item.image ? `${process.env.NEXT_PUBLIC_BACKEND_URL}${item.image}` : "/placeholder.svg"}
                          alt={item.name}
                          className="w-full h-32 sm:h-40 md:h-48 object-cover rounded-lg gold-shimmer"
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFromCart(item.id)}
                          className="absolute top-2 right-2 text-red-500 hover:text-red-700 hover:bg-red-50/90 backdrop-blur-sm h-7 w-7 sm:h-8 sm:w-8 p-0"
                        >
                          <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                        </Button>
                      </div>

                      {/* Product Details */}
                      <div className="space-y-2">
                        <div>
                          <h3 className="font-semibold text-sm sm:text-base text-gray-900 line-clamp-2 mb-1">
                            {item.name}
                          </h3>
                          <p className="text-xs text-gray-500">SKU: {item.sku}</p>
                        </div>

                        {/* Badges */}
                        <div className="flex flex-wrap gap-1.5">
                          <Badge variant="outline" className="text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5">
                            {item.metalType}
                          </Badge>
                          <Badge variant="outline" className="text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5">
                            {item.purity}
                          </Badge>
                          <Badge variant="outline" className="text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5">
                            {item.weight}g
                          </Badge>
                        </div>

                        {/* Price */}
                        <div className="pt-2 border-t">
                          <div className="flex items-baseline gap-2 mb-2">
                            <span className="text-base sm:text-lg font-bold text-orange-600">
                              {formatPrice(item.discountPrice || item.price)}
                            </span>
                            {item.discountPrice && (
                              <span className="text-xs sm:text-sm text-gray-500 line-through">
                                {formatPrice(item.price)}
                              </span>
                            )}
                          </div>

                          {/* Quantity Controls */}
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                disabled={item.quantity <= 1}
                                className="h-7 w-7 sm:h-8 sm:w-8 p-0 hover:bg-orange-50"
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="w-8 sm:w-10 text-center font-medium text-sm">
                                {item.quantity}
                              </span>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="h-7 w-7 sm:h-8 sm:w-8 p-0 hover:bg-orange-50"
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>

                            {/* Item Total */}
                            <div className="text-right">
                              <p className="text-xs text-gray-500">Total</p>
                              <p className="font-semibold text-sm text-gray-900">
                                {formatPrice((item.discountPrice || item.price) * item.quantity)}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Clear Cart Button */}
              <Button
                variant="outline"
                onClick={clearCart}
                className="w-full text-red-500 hover:text-red-700 hover:bg-red-50 border-red-200 text-sm sm:text-base py-2 sm:py-2.5"
              >
                <Trash2 className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                Clear Cart
              </Button>
            </div>

            {/* Order Summary - Sidebar */}
            <div className="xl:col-span-4">
              <Card className="sticky top-16 sm:top-20 lg:top-24 glass-card animate-fade-in-scale">
                <CardContent className="p-4 sm:p-6">
                  <h2 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6 font-serif">Order Summary</h2>

                  {/* Free Shipping Progress */}
                  {subtotal > 0 && subtotal < 100000 && (
                    <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-orange-50 rounded-lg border border-orange-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs sm:text-sm font-medium text-orange-700">Free Shipping Progress</span>
                        <span className="text-xs sm:text-sm font-bold text-orange-700">{Math.round(freeShippingProgress)}%</span>
                      </div>
                      <div className="w-full bg-orange-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-orange-500 to-amber-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${freeShippingProgress}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-orange-600 mt-2">
                        Add {formatPrice(100000 - subtotal)} more for free shipping!
                      </p>
                    </div>
                  )}

                  <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                    <div className="flex justify-between text-sm sm:text-base text-gray-600">
                      <span>Subtotal</span>
                      <span className="font-medium">{formatPrice(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-sm sm:text-base text-gray-600">
                      <span>Shipping</span>
                      <span className="font-medium">
                        {shipping === 0 ? (
                          <Badge className="bg-green-500 text-[10px] sm:text-xs">Free</Badge>
                        ) : (
                          formatPrice(shipping)
                        )}
                      </span>
                    </div>
                    <div className="border-t pt-2 sm:pt-3 flex justify-between font-bold text-base sm:text-lg">
                      <span>Total</span>
                      <span className="text-orange-600">{formatPrice(total)}</span>
                    </div>
                  </div>

                  <div className="space-y-2 sm:space-y-3">
                    <Link href="/checkout" className="block">
                      <Button className="w-full luxury-gradient hover:shadow-lg transition-all duration-300 text-sm sm:text-base py-2 sm:py-2.5" size="lg">
                        <ShoppingBag className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                        Proceed to Checkout
                      </Button>
                    </Link>

                    <Link href="/shop" className="block">
                      <Button variant="outline" className="w-full hover:bg-orange-50 text-sm sm:text-base py-2 sm:py-2.5" size="lg">
                        Continue Shopping
                      </Button>
                    </Link>
                  </div>

                  {/* Trust Badges */}
                  <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t space-y-2 sm:space-y-3">
                    <div className="flex items-center text-xs sm:text-sm text-gray-600">
                      <div className="p-1.5 sm:p-2 bg-green-100 rounded-full mr-2 sm:mr-3 flex-shrink-0">
                        <Shield className="h-3 w-3 sm:h-4 sm:w-4 text-green-600" />
                      </div>
                      <span>Secure Payment</span>
                    </div>
                    <div className="flex items-center text-xs sm:text-sm text-gray-600">
                      <div className="p-1.5 sm:p-2 bg-green-100 rounded-full mr-2 sm:mr-3 flex-shrink-0">
                        <Package className="h-3 w-3 sm:h-4 sm:w-4 text-green-600" />
                      </div>
                      <span>100% Authentic Products</span>
                    </div>
                    <div className="flex items-center text-xs sm:text-sm text-gray-600">
                      <div className="p-1.5 sm:p-2 bg-green-100 rounded-full mr-2 sm:mr-3 flex-shrink-0">
                        <RotateCcw className="h-3 w-3 sm:h-4 sm:w-4 text-green-600" />
                      </div>
                      <span>Easy Returns & Exchanges</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>

      <LandingFooter />
    </div>
  )
}