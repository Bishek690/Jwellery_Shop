"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye, 
  Package,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Star,
  ChevronLeft,
  ChevronRight,
  X
} from "lucide-react"

interface Product {
  id: string
  name: string
  sku: string
  category: string
  price: number
  cost: number
  stock: number
  minStock: number
  status: string
  metalType: string
  purity: string
  weight: number
  featured: boolean
  image?: string
  createdAt: string
  updatedAt: string
}

interface ProductTableProps {
  onEditProduct: (product: Product) => void
  onDeleteProduct: (productId: string) => void
  onViewProduct: (product: Product) => void
}

export function InventoryProductTable({ onEditProduct, onDeleteProduct, onViewProduct }: ProductTableProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [search, setSearch] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const [totalItems, setTotalItems] = useState(0)

  const categories = [
    "necklaces", "rings", "bangles", "earrings", "pendants", "chains", "bracelets"
  ]

  const statusOptions = [
    { value: "in-stock", label: "In Stock", color: "bg-green-100 text-green-800" },
    { value: "low-stock", label: "Low Stock", color: "bg-yellow-100 text-yellow-800" },
    { value: "out-of-stock", label: "Out of Stock", color: "bg-red-100 text-red-800" }
  ]

  useEffect(() => {
    fetchProducts()
  }, [search, categoryFilter, statusFilter, currentPage])

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [search, categoryFilter, statusFilter])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: itemsPerPage.toString(),
        ...(search && { search }),
        ...(categoryFilter && categoryFilter !== "all" && { category: categoryFilter }),
        ...(statusFilter && statusFilter !== "all" && { status: statusFilter })
      })

      const response = await fetch(`/api/products?${params}`, {
        credentials: 'include',
      })

      if (response.ok) {
        const data = await response.json()
        setProducts(data.products || [])
        setTotalItems(data.pagination?.total || 0)
      }
    } catch (error) {
      console.error('Error fetching products:', error)
      setError('Failed to fetch products')
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'in-stock':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'low-stock':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />
      case 'out-of-stock':
        return <XCircle className="h-4 w-4 text-red-600" />
      default:
        return <Package className="h-4 w-4 text-gray-600" />
    }
  }

  const getStatusBadge = (status: string) => {
    const statusOption = statusOptions.find(opt => opt.value === status)
    if (!statusOption) return null

    return (
      <Badge className={statusOption.color}>
        {statusOption.label}
      </Badge>
    )
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NP', {
      style: 'currency',
      currency: 'NPR',
    }).format(amount)
  }

  // Calculate total pages
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems)

  // Auto-dismiss alerts
  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError("")
        setSuccess("")
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [error, success])

  if (loading) {
    return (
      <Card className="bg-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-white">
      <CardHeader className="px-3 sm:px-6 bg-white">
        <CardTitle className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-2">
          <div className="flex items-center gap-2">
            <Package className="h-4 w-4 sm:h-5 sm:w-5 text-orange-600" />
            <span className="text-lg sm:text-xl">Product Inventory</span>
          </div>
          <Badge variant="secondary" className="self-start sm:ml-auto text-xs">
            {totalItems} products
          </Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="px-3 sm:px-6 bg-white">
        {/* Alerts */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">
            {success}
          </div>
        )}
        
        {/* Filters */}
        <div className="flex flex-col gap-3 sm:gap-4 mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
              <Input
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 sm:pl-10 h-9 sm:h-10 text-sm"
              />
            </div>
            
            <div className="flex gap-2 sm:gap-4">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full sm:w-48 h-9 sm:h-10 text-sm">
                  <SelectValue placeholder="All categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All categories</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-48 h-9 sm:h-10 text-sm">
                  <SelectValue placeholder="All status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All status</SelectItem>
                  {statusOptions.map(status => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="rounded-lg border border-gray-200 overflow-hidden bg-white">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gradient-to-r from-orange-50 to-amber-50 hover:bg-gradient-to-r hover:from-orange-50 hover:to-amber-50">
                  <TableHead className="w-16 bg-transparent font-semibold text-gray-900">S.N.</TableHead>
                  <TableHead className="bg-transparent font-semibold text-gray-900 min-w-[250px]">Product</TableHead>
                  <TableHead className="bg-transparent font-semibold text-gray-900">Category</TableHead>
                  <TableHead className="bg-transparent font-semibold text-gray-900">Price</TableHead>
                  <TableHead className="bg-transparent font-semibold text-gray-900">Stock</TableHead>
                  <TableHead className="bg-transparent font-semibold text-gray-900">Status</TableHead>
                  <TableHead className="bg-transparent font-semibold text-gray-900">Metal</TableHead>
                  <TableHead className="text-right bg-transparent font-semibold text-gray-900 w-32">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="bg-white">
                {products.map((product, index) => (
                  <TableRow key={product.id} className="hover:bg-orange-50/50 bg-white">
                    <TableCell className="font-semibold text-gray-700 bg-white">
                      {startIndex + index + 1}
                    </TableCell>
                    <TableCell className="bg-white">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12 flex-shrink-0">
                          <AvatarImage 
                            src={product.image ? `${process.env.NEXT_PUBLIC_BACKEND_URL}${product.image}` : ''} 
                            alt={product.name} 
                          />
                          <AvatarFallback>
                            <Package className="h-5 w-5" />
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-gray-900 truncate">{product.name}</span>
                            {product.featured && (
                              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 flex-shrink-0" />
                            )}
                          </div>
                          <span className="text-sm text-gray-500">{product.sku}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="bg-white">
                      <Badge variant="outline" className="whitespace-nowrap">
                        {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium bg-white whitespace-nowrap">
                      {formatCurrency(product.price)}
                    </TableCell>
                    <TableCell className="bg-white">
                      <div className="flex flex-col">
                        <span className={product.stock <= product.minStock ? "text-red-600 font-medium" : ""}>
                          {product.stock} units
                        </span>
                        <span className="text-xs text-gray-500">
                          Min: {product.minStock}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="bg-white">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(product.status)}
                        {getStatusBadge(product.status)}
                      </div>
                    </TableCell>
                    <TableCell className="bg-white">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">{product.metalType}</span>
                        {product.purity && (
                          <span className="text-xs text-gray-500">{product.purity}</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="bg-white">
                      <div className="flex items-center gap-1 justify-end">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onViewProduct(product)}
                          className="h-8 w-8 p-0 hover:bg-amber-100 hover:text-amber-700"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onEditProduct(product)}
                          className="h-8 w-8 p-0 hover:bg-blue-100 hover:text-blue-700"
                          title="Edit Product"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onDeleteProduct(product.id)}
                          className="h-8 w-8 p-0 text-red-600 hover:bg-red-100 hover:text-red-700"
                          title="Delete Product"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {products.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Package className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No products found</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4 border-t mt-4">
            <div className="text-sm text-gray-500 text-center sm:text-left">
              Showing {startIndex + 1} to {endIndex} of {totalItems} products
            </div>
            
            <div className="flex items-center justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="h-8 px-3"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">Previous</span>
              </Button>

              <div className="flex items-center gap-1">
                {[...Array(totalPages)].map((_, index) => {
                  const pageNumber = index + 1
                  const isCurrentPage = pageNumber === currentPage
                  
                  if (
                    pageNumber === 1 ||
                    pageNumber === totalPages ||
                    (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                  ) {
                    return (
                      <Button
                        key={pageNumber}
                        variant={isCurrentPage ? "default" : "outline"}
                        size="sm"
                        className={cn(
                          "w-10 h-10",
                          isCurrentPage && "bg-gradient-to-r from-orange-500 to-amber-600 text-white"
                        )}
                        onClick={() => setCurrentPage(pageNumber)}
                      >
                        {pageNumber}
                      </Button>
                    )
                  }
                  
                  if (
                    (pageNumber === currentPage - 2 && currentPage > 3) ||
                    (pageNumber === currentPage + 2 && currentPage < totalPages - 2)
                  ) {
                    return (
                      <span key={pageNumber} className="px-2 py-1 text-gray-500">
                        ...
                      </span>
                    )
                  }
                  
                  return null
                })}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="h-8 px-3"
              >
                <span className="hidden sm:inline">Next</span>
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
