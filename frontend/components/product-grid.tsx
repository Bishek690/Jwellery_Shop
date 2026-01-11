"use client"

import { useState, useEffect } from "react"
import { Heart, ShoppingBag, Eye, Star, Package, X, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { useCart } from "@/hooks/use-cart"
import { useWishlist } from "@/hooks/use-wishlist"
import Image from "next/image"

interface Product {
  id: string
  name: string
  sku: string
  category: string
  description: string
  price: number
  cost: number
  discountPrice?: number
  weight: number
  metalType: string
  purity: string
  stock: number
  minStock: number
  status: string
  featured: boolean
  image?: string
  createdAt: string
  updatedAt: string
}

interface ProductGridProps {
  category?: string
  priceRange?: string
  sortBy?: string
  searchQuery?: string
  limit?: number
  onProductCountChange?: (count: number) => void
  onTotalProductsChange?: (total: number) => void
}

export function ProductGrid({ 
  category, 
  priceRange, 
  sortBy, 
  searchQuery, 
  limit = 12,
  onProductCountChange,
  onTotalProductsChange 
}: ProductGridProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const { toast } = useToast()
  const { addToCart } = useCart()
  const { toggleWishlist: toggleWishlistItem, isInWishlist } = useWishlist()

  useEffect(() => {
    fetchProducts()
  }, [category, priceRange, sortBy, searchQuery, limit])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      
      // Add filters
      if (category && category !== "all") {
        params.append("category", category)
      }
      
      if (priceRange && priceRange !== "all") {
        if (priceRange.endsWith("+")) {
          // Handle "200000+" case - only minimum price
          const min = priceRange.replace("+", "")
          params.append("minPrice", min)
        } else {
          // Handle range cases like "0-25000"
          const [min, max] = priceRange.split("-")
          if (min) params.append("minPrice", min)
          if (max) params.append("maxPrice", max)
        }
      }
      
      if (searchQuery) {
        params.append("search", searchQuery)
      }
      
      // Add sorting
      if (sortBy) {
        switch (sortBy) {
          case "price-low":
            params.append("sortBy", "price")
            params.append("sortOrder", "ASC")
            break
          case "price-high":
            params.append("sortBy", "price")
            params.append("sortOrder", "DESC")
            break
          case "newest":
            params.append("sortBy", "createdAt")
            params.append("sortOrder", "DESC")
            break
          case "featured":
            params.append("featured", "true")
            break
          case "all":
            // No specific sorting, show all products
            break
        }
      }
      
      params.append("limit", limit.toString())

      const response = await fetch(`/api/products?${params.toString()}`)
      
      if (response.ok) {
        const data = await response.json()
        const fetchedProducts = data.products || []
        const total = data.pagination?.total || fetchedProducts.length
        
        setProducts(fetchedProducts)
        
        if (onProductCountChange) {
          onProductCountChange(fetchedProducts.length)
        }
        
        if (onTotalProductsChange) {
          onTotalProductsChange(total)
        }
      }
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleToggleWishlist = (product: Product) => {
    toggleWishlistItem({
      id: product.id,
      name: product.name,
      price: product.price,
      discountPrice: product.discountPrice,
      image: product.image,
      metalType: product.metalType,
      purity: product.purity,
      stock: product.stock,
      status: product.status,
      category: product.category,
    })

    if (isInWishlist(product.id)) {
      toast({
        title: "Removed from Wishlist",
        description: `${product.name} has been removed from your wishlist.`,
      })
    } else {
      toast({
        title: "Added to Wishlist",
        description: `${product.name} has been added to your wishlist.`,
      })
    }
  }

  const handleAddToCart = (product: Product) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      discountPrice: product.discountPrice,
      image: product.image,
      metalType: product.metalType,
      purity: product.purity,
      weight: product.weight,
      sku: product.sku,
    })

    toast({
      title: "Added to Cart",
      description: `${product.name} has been added to your cart.`,
      action: <Check className="h-4 w-4 text-green-600" />,
    })
  }

  const handleViewProduct = (product: Product) => {
    setSelectedProduct(product)
    setViewDialogOpen(true)
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-NP", {
      style: "currency",
      currency: "NPR",
      maximumFractionDigits: 0,
    }).format(price)
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(12)].map((_, index) => (
          <Card key={index} className="overflow-hidden animate-pulse">
            <div className="h-64 bg-gray-200"></div>
            <CardContent className="p-4">
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-6 bg-gray-200 rounded"></div>
                <div className="h-5 bg-gray-200 rounded w-1/2"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-16">
        <Package className="h-16 w-16 mx-auto mb-4 text-gray-300" />
        <h3 className="text-xl font-semibold text-gray-700 mb-2">No products found</h3>
        <p className="text-gray-500">Try adjusting your filters or search query</p>
      </div>
    )
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <Card
            key={product.id}
            className="glass-card group cursor-pointer hover:shadow-xl transition-all duration-300 animate-fade-in-scale"
          >
            <div className="relative overflow-hidden rounded-t-lg">
              <img
                src={product.image ? `http://localhost:4000${product.image}` : "/placeholder.svg"}
                alt={product.name}
                className="w-full h-48 sm:h-56 lg:h-64 object-cover group-hover:scale-105 transition-transform duration-300 gold-shimmer"
              />
              
              {/* Badges */}
              <Badge className="absolute top-2 sm:top-4 left-2 sm:left-4 luxury-gradient text-white text-xs">
                {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
              </Badge>
              
              {product.featured && (
                <Badge className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 bg-yellow-500 text-white text-xs">
                  <Star className="h-3 w-3 mr-1 fill-current" />
                  Featured
                </Badge>
              )}

              {product.discountPrice && (
                <Badge className="absolute top-2 sm:top-4 right-10 sm:right-12 bg-red-500 text-white text-xs">
                  Sale
                </Badge>
              )}

              {product.stock <= product.minStock && product.stock > 0 && (
                <Badge className="absolute bottom-2 sm:bottom-4 right-2 sm:right-4 bg-orange-500 text-white text-xs">
                  Low Stock
                </Badge>
              )}

              {/* Action Buttons */}
              <Button 
                size="sm" 
                variant="ghost" 
                className="absolute top-2 sm:top-4 right-2 sm:right-4 glass-card hover:bg-white/80 p-1 sm:p-2"
                onClick={(e) => {
                  e.stopPropagation()
                  handleToggleWishlist(product)
                }}
              >
                <Heart className={`h-3 w-3 sm:h-4 sm:w-4 ${isInWishlist(product.id) ? "fill-red-500 text-red-500" : ""}`} />
              </Button>
            </div>

            <CardContent className="p-3 sm:p-4 lg:p-6">
              <div className="flex items-center gap-1 sm:gap-2 mb-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-3 w-3 sm:h-4 sm:w-4 ${i < 4 ? "text-yellow-500 fill-current" : "text-gray-300"}`}
                    />
                  ))}
                </div>
                <span className="text-xs sm:text-sm text-gray-600">({product.stock} in stock)</span>
              </div>

              <h3 className="font-semibold text-sm sm:text-base lg:text-lg mb-2 group-hover:text-orange-600 transition-colors line-clamp-2">
                {product.name}
              </h3>

              <div className="flex items-center gap-1 sm:gap-2 mb-3 sm:mb-4">
                <span className="text-lg sm:text-xl lg:text-2xl font-bold text-orange-600">
                  {formatPrice(product.discountPrice || product.price)}
                </span>
                {product.discountPrice && (
                  <span className="text-xs sm:text-sm text-gray-500 line-through">
                    {formatPrice(product.price)}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 text-xs text-gray-600 mb-3">
                <Badge variant="outline" className="text-xs">
                  {product.metalType}
                </Badge>
                {product.purity && (
                  <Badge variant="outline" className="text-xs">
                    {product.purity}
                  </Badge>
                )}
              </div>

              <div className="flex gap-2">
                <Button 
                  onClick={() => handleViewProduct(product)}
                  variant="outline"
                  className="flex-1 text-xs sm:text-sm py-2 hover:bg-orange-50"
                >
                  <Eye className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  View
                </Button>
                <Button 
                  onClick={(e) => {
                    e.stopPropagation()
                    handleAddToCart(product)
                  }}
                  disabled={product.stock === 0}
                  className="flex-1 luxury-gradient hover:shadow-lg transition-all duration-300 text-xs sm:text-sm py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ShoppingBag className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* View Product Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          {selectedProduct && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-gray-900">
                  {selectedProduct.name}
                </DialogTitle>
                <DialogDescription>
                  SKU: {selectedProduct.sku}
                </DialogDescription>
              </DialogHeader>

              <div className="grid md:grid-cols-2 gap-6 mt-4">
                <div className="relative">
                  <img
                    src={selectedProduct.image ? `http://localhost:4000${selectedProduct.image}` : "/placeholder.svg"}
                    alt={selectedProduct.name}
                    className="w-full h-auto rounded-lg object-cover"
                  />
                  {selectedProduct.featured && (
                    <Badge className="absolute top-4 left-4 bg-yellow-500 text-white">
                      <Star className="h-3 w-3 mr-1 fill-current" />
                      Featured
                    </Badge>
                  )}
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Price</h3>
                    <div className="flex items-center gap-2">
                      <span className="text-3xl font-bold text-orange-600">
                        {formatPrice(selectedProduct.discountPrice || selectedProduct.price)}
                      </span>
                      {selectedProduct.discountPrice && (
                        <>
                          <span className="text-lg text-gray-500 line-through">
                            {formatPrice(selectedProduct.price)}
                          </span>
                          <Badge className="bg-red-500 text-white">
                            Save {formatPrice(selectedProduct.price - selectedProduct.discountPrice)}
                          </Badge>
                        </>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Description</h3>
                    <p className="text-gray-700">{selectedProduct.description}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">Category</h3>
                      <Badge variant="outline">
                        {selectedProduct.category.charAt(0).toUpperCase() + selectedProduct.category.slice(1)}
                      </Badge>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">Status</h3>
                      <Badge className={
                        selectedProduct.status === 'in-stock' ? 'bg-green-100 text-green-800' :
                        selectedProduct.status === 'low-stock' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }>
                        {selectedProduct.status.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                      </Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">Metal Type</h3>
                      <p className="text-gray-900 font-medium">{selectedProduct.metalType}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">Purity</h3>
                      <p className="text-gray-900 font-medium">{selectedProduct.purity}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">Weight</h3>
                      <p className="text-gray-900 font-medium">{selectedProduct.weight}g</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">Stock</h3>
                      <p className="text-gray-900 font-medium">{selectedProduct.stock} units</p>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button 
                      onClick={() => {
                        handleAddToCart(selectedProduct)
                        setViewDialogOpen(false)
                      }}
                      disabled={selectedProduct.stock === 0}
                      className="flex-1 luxury-gradient hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      size="lg"
                    >
                      <ShoppingBag className="h-4 w-4 mr-2" />
                      {selectedProduct.stock === 0 ? "Out of Stock" : "Add to Cart"}
                    </Button>
                    <Button 
                      variant="outline"
                      size="lg"
                      onClick={() => handleToggleWishlist(selectedProduct)}
                      className={isInWishlist(selectedProduct.id) ? "border-red-500" : ""}
                    >
                      <Heart className={`h-4 w-4 ${isInWishlist(selectedProduct.id) ? "fill-red-500 text-red-500" : ""}`} />
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}