"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { CustomerNavbar } from "@/components/customer-navbar"
import { LandingFooter } from "@/components/landing-footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Heart, ShoppingBag, Trash2, ArrowLeft } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { useWishlist } from "@/hooks/use-wishlist"
import { useCart } from "@/hooks/use-cart"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import Image from "next/image"

export default function WishlistPage() {
  const router = useRouter()
  const { user, isAuthenticated, isLoading } = useAuth()
  const { wishlistItems, removeFromWishlist, clearWishlist } = useWishlist()
  const { addToCart } = useCart()
  const { toast } = useToast()

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

  const handleAddToCart = (item: any) => {
    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      discountPrice: item.discountPrice,
      image: item.image,
      metalType: item.metalType,
      purity: item.purity,
      weight: 0, // You might want to add weight to wishlist items
      sku: "", // You might want to add SKU to wishlist items
      category: item.category,
    })

    toast({
      title: "Added to Cart",
      description: `${item.name} has been added to your cart.`,
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background flex flex-col">
      <CustomerNavbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow">
        <div className="mb-8">
          <Link href="/shop">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Shop
            </Button>
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">My Wishlist</h1>
              <p className="text-gray-600">
                {wishlistItems.length === 0
                  ? "Your wishlist is empty"
                  : `${wishlistItems.length} ${wishlistItems.length === 1 ? "item" : "items"} in your wishlist`}
              </p>
            </div>
            {wishlistItems.length > 0 && (
              <Button
                variant="outline"
                onClick={clearWishlist}
                className="text-red-500 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Clear All
              </Button>
            )}
          </div>
        </div>

        {wishlistItems.length === 0 ? (
          <Card className="text-center py-16">
            <CardContent>
              <Heart className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">Your wishlist is empty</h3>
              <p className="text-gray-500 mb-6">Save your favorite items for later!</p>
              <Link href="/shop">
                <Button className="luxury-gradient">
                  <ShoppingBag className="h-4 w-4 mr-2" />
                  Browse Collections
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlistItems.map((item) => (
              <Card key={item.id} className="hover-lift hover-glow">
                <div className="relative">
                  <img
                    src={item.image ? `http://localhost:4000${item.image}` : "/placeholder.svg"}
                    alt={item.name}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  {item.status === "out-of-stock" && (
                    <Badge className="absolute top-2 left-2 bg-red-500 text-white">Out of Stock</Badge>
                  )}
                  {item.status === "low-stock" && (
                    <Badge className="absolute top-2 left-2 bg-orange-500 text-white">Low Stock</Badge>
                  )}
                  {item.discountPrice && (
                    <Badge className="absolute top-2 right-2 bg-green-500 text-white">Sale</Badge>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-2 right-2 bg-white/90 hover:bg-white"
                    onClick={() => removeFromWishlist(item.id)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
                <CardContent className="p-4">
                  <Badge variant="outline" className="text-xs mb-2">
                    {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
                  </Badge>
                  <h4 className="font-medium mb-2 line-clamp-2">{item.name}</h4>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="font-bold text-orange-600 text-lg">
                      {formatPrice(item.discountPrice || item.price)}
                    </span>
                    {item.discountPrice && (
                      <span className="text-sm text-gray-500 line-through">
                        {formatPrice(item.price)}
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2 text-xs text-gray-600 mb-3">
                    <Badge variant="outline" className="text-xs">
                      {item.metalType}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {item.purity}
                    </Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      className="flex-1 luxury-gradient hover:opacity-90"
                      disabled={item.status === "out-of-stock"}
                      onClick={() => handleAddToCart(item)}
                    >
                      <ShoppingBag className="w-4 h-4 mr-1" />
                      {item.status === "out-of-stock" ? "Out of Stock" : "Add to Cart"}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="hover-glow bg-transparent"
                      onClick={() => removeFromWishlist(item.id)}
                    >
                      <Heart className="w-4 h-4 fill-red-500 text-red-500" />
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Added {new Date(item.addedAt).toLocaleDateString()}
                  </p>
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
