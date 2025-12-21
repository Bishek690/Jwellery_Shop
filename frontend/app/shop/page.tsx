"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { CustomerNavbar } from "@/components/customer-navbar"
import { ProductGrid } from "@/components/product-grid"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Filter, X } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"

export default function ShopPage() {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [priceRange, setPriceRange] = useState("all")
  const [sortBy, setSortBy] = useState("featured")
  const [showFilters, setShowFilters] = useState(false)
  const router = useRouter()
  const { user, isAuthenticated, isLoading } = useAuth()

  // Check if user is authenticated and is a customer
  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        // Redirect to login if not authenticated
        router.push("/auth/login")
        return
      }
      
      if (user && user.role !== "customer") {
        // Redirect non-customers to their appropriate dashboard
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

  // Show loading state while checking authentication
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

  // Show nothing while redirecting
  if (!isAuthenticated || (user && user.role !== "customer")) {
    return null
  }

  const categories = [
    { value: "all", label: "All Categories" },
    { value: "bridal", label: "Bridal Collection" },
    { value: "gold", label: "Gold Jewelry" },
    { value: "diamond", label: "Diamond Jewelry" },
    { value: "silver", label: "Silver Jewelry" },
    { value: "pearl", label: "Pearl Jewelry" },
    { value: "precious-stones", label: "Precious Stones" },
  ]

  const priceRanges = [
    { value: "all", label: "All Prices" },
    { value: "0-25000", label: "Under ₹25,000" },
    { value: "25000-50000", label: "₹25,000 - ₹50,000" },
    { value: "50000-100000", label: "₹50,000 - ₹1,00,000" },
    { value: "100000+", label: "Above ₹1,00,000" },
  ]

  const sortOptions = [
    { value: "featured", label: "Featured" },
    { value: "price-low", label: "Price: Low to High" },
    { value: "price-high", label: "Price: High to Low" },
    { value: "newest", label: "Newest First" },
    { value: "rating", label: "Highest Rated" },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <CustomerNavbar />

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-orange-50 to-orange-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-serif font-bold text-gray-900 mb-4">Exquisite Jewelry Collection</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover our handcrafted jewelry pieces, each telling a unique story of elegance and craftsmanship
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters and Sort */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
          <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="lg:hidden">
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>

            <div className="hidden lg:flex items-center space-x-4">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={priceRange} onValueChange={setPriceRange}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Price Range" />
                </SelectTrigger>
                <SelectContent>
                  {priceRanges.map((range) => (
                    <SelectItem key={range.value} value={range.value}>
                      {range.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">Sort by:</span>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Mobile Filters */}
        {showFilters && (
          <div className="lg:hidden bg-white rounded-lg border p-4 mb-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">Filters</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowFilters(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Category</label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Price Range</label>
                <Select value={priceRange} onValueChange={setPriceRange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {priceRanges.map((range) => (
                      <SelectItem key={range.value} value={range.value}>
                        {range.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )}

        {/* Active Filters */}
        <div className="flex items-center space-x-2 mb-6">
          {selectedCategory !== "all" && (
            <Badge variant="secondary" className="flex items-center space-x-1">
              <span>{categories.find((c) => c.value === selectedCategory)?.label}</span>
              <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedCategory("all")} />
            </Badge>
          )}
          {priceRange !== "all" && (
            <Badge variant="secondary" className="flex items-center space-x-1">
              <span>{priceRanges.find((p) => p.value === priceRange)?.label}</span>
              <X className="w-3 h-3 cursor-pointer" onClick={() => setPriceRange("all")} />
            </Badge>
          )}
        </div>

        {/* Product Grid */}
        <ProductGrid />

        {/* Load More */}
        <div className="text-center mt-12">
          <Button variant="outline" size="lg" className="px-8 bg-transparent">
            Load More Products
          </Button>
        </div>
      </div>
    </div>
  )
}
