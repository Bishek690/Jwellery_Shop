"use client"

import { useState } from "react"
import { Heart, ShoppingBag, Eye, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"

interface Product {
  id: string
  name: string
  price: number
  originalPrice?: number
  image: string
  category: string
  rating: number
  reviews: number
  isNew?: boolean
  isSale?: boolean
}

const products: Product[] = [
  {
    id: "1",
    name: "Diamond Solitaire Ring",
    price: 125000,
    originalPrice: 150000,
    image: "/sparkling-diamond-necklace.png",
    category: "Diamond",
    rating: 4.9,
    reviews: 127,
    isSale: true,
  },
  {
    id: "2",
    name: "Gold Bangles Set",
    price: 85000,
    image: "/gold-bangles.jpg",
    category: "Gold",
    rating: 4.8,
    reviews: 89,
    isNew: true,
  },
  {
    id: "3",
    name: "Ruby Engagement Ring",
    price: 95000,
    image: "/ruby-rings.jpg",
    category: "Precious Stones",
    rating: 4.9,
    reviews: 156,
  },
  {
    id: "4",
    name: "Pearl Drop Earrings",
    price: 45000,
    image: "/elegant-pearl-earrings.jpg",
    category: "Pearl",
    rating: 4.7,
    reviews: 73,
    isNew: true,
  },
  {
    id: "5",
    name: "Emerald Pendant",
    price: 75000,
    image: "/emerald-pendant-necklace.png",
    category: "Precious Stones",
    rating: 4.8,
    reviews: 92,
  },
  {
    id: "6",
    name: "Silver Chain Necklace",
    price: 25000,
    originalPrice: 30000,
    image: "/silver-chain-necklace.png",
    category: "Silver",
    rating: 4.6,
    reviews: 64,
    isSale: true,
  },
]

export function ProductGrid() {
  const [wishlist, setWishlist] = useState<string[]>([])

  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => (prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]))
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price)
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <Card
          key={product.id}
          className="group overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
        >
          <div className="relative overflow-hidden">
            <Image
              src={product.image || "/placeholder.svg"}
              alt={product.name}
              width={300}
              height={300}
              className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
            />

            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-2">
              {product.isNew && <Badge className="bg-green-500 hover:bg-green-600 text-white">New</Badge>}
              {product.isSale && <Badge className="bg-red-500 hover:bg-red-600 text-white">Sale</Badge>}
            </div>

            {/* Action Buttons */}
            <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <Button
                size="sm"
                variant="secondary"
                className="w-10 h-10 rounded-full p-0 bg-white/90 hover:bg-white shadow-md"
                onClick={() => toggleWishlist(product.id)}
              >
                <Heart
                  className={`w-4 h-4 ${wishlist.includes(product.id) ? "fill-red-500 text-red-500" : "text-gray-600"}`}
                />
              </Button>
              <Button
                size="sm"
                variant="secondary"
                className="w-10 h-10 rounded-full p-0 bg-white/90 hover:bg-white shadow-md"
              >
                <Eye className="w-4 h-4 text-gray-600" />
              </Button>
            </div>

            {/* Quick Add to Cart */}
            <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white">
                <ShoppingBag className="w-4 h-4 mr-2" />
                Add to Cart
              </Button>
            </div>
          </div>

          <CardContent className="p-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="text-xs">
                  {product.category}
                </Badge>
                <div className="flex items-center space-x-1">
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  <span className="text-xs text-gray-600">
                    {product.rating} ({product.reviews})
                  </span>
                </div>
              </div>

              <h3 className="font-medium text-gray-900 line-clamp-2 group-hover:text-orange-600 transition-colors">
                {product.name}
              </h3>

              <div className="flex items-center space-x-2">
                <span className="text-lg font-bold text-gray-900">{formatPrice(product.price)}</span>
                {product.originalPrice && (
                  <span className="text-sm text-gray-500 line-through">{formatPrice(product.originalPrice)}</span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
