"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Package,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Star,
} from "lucide-react"

interface Product {
  id: string
  name: string
  sku: string
  category: string
  price: number
  cost: number
  weight: string
  purity: string
  stock: number
  minStock: number
  status: "in-stock" | "low-stock" | "out-of-stock"
  featured: boolean
  image: string
  createdAt: string
}

interface InventoryProductTableProps {
  onEditProduct: (product: Product) => void
  onDeleteProduct: (productId: string) => void
  onViewProduct: (product: Product) => void
}

export function InventoryProductTable({ onEditProduct, onDeleteProduct, onViewProduct }: InventoryProductTableProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortBy, setSortBy] = useState("name")

  const products: Product[] = [
    {
      id: "1",
      name: "Diamond Necklace Set",
      sku: "DN-001",
      category: "necklaces",
      price: 285000,
      cost: 220000,
      weight: "45g",
      purity: "18K",
      stock: 5,
      minStock: 2,
      status: "in-stock",
      featured: true,
      image: "/sparkling-diamond-necklace.png",
      createdAt: "2024-01-15",
    },
    {
      id: "2",
      name: "Gold Bangles Pair",
      sku: "GB-002",
      category: "bangles",
      price: 145000,
      cost: 115000,
      weight: "65g",
      purity: "22K",
      stock: 1,
      minStock: 3,
      status: "low-stock",
      featured: false,
      image: "/gold-bangles.jpg",
      createdAt: "2024-01-10",
    },
    {
      id: "3",
      name: "Ruby Ring Collection",
      sku: "RR-003",
      category: "rings",
      price: 95000,
      cost: 75000,
      weight: "12g",
      purity: "18K",
      stock: 0,
      minStock: 2,
      status: "out-of-stock",
      featured: true,
      image: "/ruby-rings.jpg",
      createdAt: "2024-01-08",
    },
    {
      id: "4",
      name: "Pearl Earrings",
      sku: "PE-004",
      category: "earrings",
      price: 45000,
      cost: 35000,
      weight: "8g",
      purity: "14K",
      stock: 8,
      minStock: 3,
      status: "in-stock",
      featured: false,
      image: "/elegant-pearl-earrings.jpg",
      createdAt: "2024-01-05",
    },
    {
      id: "5",
      name: "Emerald Pendant",
      sku: "EP-005",
      category: "necklaces",
      price: 125000,
      cost: 95000,
      weight: "25g",
      purity: "18K",
      stock: 3,
      minStock: 2,
      status: "in-stock",
      featured: false,
      image: "/emerald-pendant-necklace.png",
      createdAt: "2024-01-03",
    },
  ]

  const categories = [
    { value: "all", label: "All Categories" },
    { value: "necklaces", label: "Necklaces" },
    { value: "rings", label: "Rings" },
    { value: "bangles", label: "Bangles" },
    { value: "earrings", label: "Earrings" },
  ]

  const statusOptions = [
    { value: "all", label: "All Status" },
    { value: "in-stock", label: "In Stock" },
    { value: "low-stock", label: "Low Stock" },
    { value: "out-of-stock", label: "Out of Stock" },
  ]

  const filteredProducts = products
    .filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = categoryFilter === "all" || product.category === categoryFilter
      const matchesStatus = statusFilter === "all" || product.status === statusFilter
      return matchesSearch && matchesCategory && matchesStatus
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name)
        case "price":
          return b.price - a.price
        case "stock":
          return a.stock - b.stock
        case "created":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        default:
          return 0
      }
    })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "in-stock":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "low-stock":
        return <AlertTriangle className="h-4 w-4 text-orange-600" />
      case "out-of-stock":
        return <XCircle className="h-4 w-4 text-red-600" />
      default:
        return null
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "in-stock":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">In Stock</Badge>
      case "low-stock":
        return <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">Low Stock</Badge>
      case "out-of-stock":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Out of Stock</Badge>
      default:
        return null
    }
  }

  return (
    <Card className="glass-card animate-fade-in-scale">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5 text-orange-600" />
          Product Inventory
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 animate-slide-in-up">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search products or SKU..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/80 border-orange-200/50 focus:border-orange-400 transition-colors"
            />
          </div>

          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full sm:w-48 bg-white/80 border-orange-200/50">
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

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-48 bg-white/80 border-orange-200/50">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((status) => (
                <SelectItem key={status.value} value={status.value}>
                  {status.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full sm:w-48 bg-white/80 border-orange-200/50">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Sort by Name</SelectItem>
              <SelectItem value="price">Sort by Price</SelectItem>
              <SelectItem value="stock">Sort by Stock</SelectItem>
              <SelectItem value="created">Sort by Date</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        <div className="rounded-lg border border-orange-200/50 overflow-hidden animate-slide-in-up">
          <Table>
            <TableHeader>
              <TableRow className="bg-orange-50/50">
                <TableHead className="w-16"></TableHead>
                <TableHead>Product</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-16"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product, index) => (
                <TableRow
                  key={product.id}
                  className="hover:bg-orange-50/30 transition-colors animate-slide-in-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <TableCell>
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 gold-shimmer">
                      <img
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900">{product.name}</span>
                        {product.featured && (
                          <Badge variant="secondary" className="luxury-gradient text-white animate-float">
                            <Star className="h-3 w-3 mr-1" />
                            Featured
                          </Badge>
                        )}
                      </div>
                      <div className="text-sm text-gray-600">
                        {product.weight} • {product.purity}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <code className="text-sm bg-gray-100 px-2 py-1 rounded">{product.sku}</code>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {product.category}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="font-semibold text-orange-600">NPR {product.price.toLocaleString()}</div>
                      <div className="text-xs text-gray-500">Cost: NPR {product.cost.toLocaleString()}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(product.status)}
                      <span className="font-medium">{product.stock}</span>
                      <span className="text-sm text-gray-500">/ {product.minStock} min</span>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(product.status)}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-orange-50">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="glass-card">
                        <DropdownMenuItem onClick={() => onViewProduct(product)} className="hover:bg-orange-50">
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onEditProduct(product)} className="hover:bg-orange-50">
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Product
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => onDeleteProduct(product.id)}
                          className="text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete Product
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12 animate-fade-in-scale">
            <Package className="h-16 w-16 text-gray-400 mx-auto mb-4 animate-float" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
