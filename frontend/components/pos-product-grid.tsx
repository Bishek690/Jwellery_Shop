"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search, Plus, Gem, Star, Crown } from "lucide-react"

interface Product {
  id: string
  name: string
  price: number
  category: string
  weight?: string
  purity?: string
  image: string
  inStock: boolean
  featured?: boolean
}

interface POSProductGridProps {
  onAddToCart: (product: Product) => void
}

export function POSProductGrid({ onAddToCart }: POSProductGridProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

  const categories = [
    { id: "all", name: "All Items", icon: Star },
    { id: "necklaces", name: "Necklaces", icon: Crown },
    { id: "rings", name: "Rings", icon: Gem },
    { id: "bangles", name: "Bangles", icon: Star },
    { id: "earrings", name: "Earrings", icon: Gem },
  ]

  const products: Product[] = [
    {
      id: "1",
      name: "Diamond Necklace Set",
      price: 285000,
      category: "necklaces",
      weight: "45g",
      purity: "18K",
      image: "/sparkling-diamond-necklace.png",
      inStock: true,
      featured: true,
    },
    {
      id: "2",
      name: "Gold Bangles Pair",
      price: 145000,
      category: "bangles",
      weight: "65g",
      purity: "22K",
      image: "/gold-bangles.jpg",
      inStock: true,
    },
    {
      id: "3",
      name: "Ruby Ring Collection",
      price: 95000,
      category: "rings",
      weight: "12g",
      purity: "18K",
      image: "/ruby-rings.jpg",
      inStock: true,
      featured: true,
    },
    {
      id: "4",
      name: "Pearl Earrings",
      price: 45000,
      category: "earrings",
      weight: "8g",
      purity: "14K",
      image: "/elegant-pearl-earrings.jpg",
      inStock: true,
    },
    {
      id: "5",
      name: "Emerald Pendant",
      price: 125000,
      category: "necklaces",
      weight: "25g",
      purity: "18K",
      image: "/emerald-pendant-necklace.png",
      inStock: false,
    },
    {
      id: "6",
      name: "Silver Chain",
      price: 15000,
      category: "necklaces",
      weight: "20g",
      purity: "925",
      image: "/silver-chain-necklace.png",
      inStock: true,
    },
  ]

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="space-y-6">
      {/* Search and Categories */}
      <div className="space-y-4">
        <div className="relative animate-slide-in-up">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white/80 border-orange-200/50 focus:border-orange-400 transition-colors"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map((category, index) => {
            const Icon = category.icon
            return (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center gap-2 whitespace-nowrap transition-all duration-300 animate-slide-in-up ${
                  selectedCategory === category.id
                    ? "luxury-gradient text-white shadow-lg animate-glow"
                    : "hover:bg-orange-50 bg-transparent"
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <Icon className="h-4 w-4" />
                {category.name}
              </Button>
            )
          })}
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredProducts.map((product, index) => (
          <Card
            key={product.id}
            className={`glass-card hover:shadow-xl transition-all duration-300 animate-slide-in-up group cursor-pointer ${
              !product.inStock ? "opacity-60" : ""
            }`}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <CardContent className="p-4">
              <div className="relative mb-3">
                <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 gold-shimmer">
                  <img
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                {product.featured && (
                  <Badge className="absolute top-2 right-2 luxury-gradient text-white animate-float">
                    <Star className="h-3 w-3 mr-1" />
                    Featured
                  </Badge>
                )}
                {!product.inStock && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
                    <Badge variant="destructive">Out of Stock</Badge>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <h3 className="font-medium text-sm text-gray-900 group-hover:text-orange-600 transition-colors">
                  {product.name}
                </h3>
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <span>{product.weight}</span>
                  <span>•</span>
                  <span>{product.purity}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-orange-600">NPR {product.price.toLocaleString()}</span>
                  <Button
                    size="sm"
                    onClick={() => onAddToCart(product)}
                    disabled={!product.inStock}
                    className="luxury-gradient hover:shadow-lg transition-all duration-300 animate-float"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12 animate-fade-in-scale">
          <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No products found</h3>
          <p className="text-gray-600">Try adjusting your search or category filter</p>
        </div>
      )}
    </div>
  )
}
