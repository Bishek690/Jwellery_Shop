"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Sparkles } from "lucide-react"

interface FeaturedProductsProps {
  className?: string
}

export function FeaturedProducts({ className }: FeaturedProductsProps) {
  const products = [
    { 
      name: "Diamond Necklace Set", 
      price: "NPR 2,85,000", 
      image: "/sparkling-diamond-necklace.png" 
    },
    { 
      name: "Gold Bangles (Pair)", 
      price: "NPR 1,45,000", 
      image: "/gold-bangles.jpg" 
    },
    { 
      name: "Ruby Ring Collection", 
      price: "NPR 95,000", 
      image: "/ruby-rings.jpg" 
    },
  ]

  return (
    <Card className={`glass-card animate-fade-in-scale ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-orange-600" />
          Featured Jewelry Collection
        </CardTitle>
        <CardDescription>Premium pieces with exceptional craftsmanship</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {products.map((product, index) => (
            <div key={index} className="group cursor-pointer">
              <div className="relative overflow-hidden rounded-lg bg-gray-100 aspect-square mb-3 gold-shimmer">
                <img
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <h3 className="font-medium text-gray-900 group-hover:text-orange-600 transition-colors line-clamp-2">
                {product.name}
              </h3>
              <p className="text-lg font-bold text-orange-600">{product.price}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
