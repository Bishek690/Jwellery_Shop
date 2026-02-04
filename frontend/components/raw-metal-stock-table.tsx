"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Package,
  Search,
  Edit,
  Trash2,
  Plus,
  AlertTriangle,
  CheckCircle,
  XCircle,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  Eye,
  Loader2,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface RawMetalStock {
  id: number
  metalType: string
  purity: string
  quantity: number
  costPerGram: number
  minQuantity: number
  supplier?: string
  location?: string
  notes?: string
  status: string
  totalValue: number
  createdAt: string
  updatedAt: string
}

interface RawMetalStockTableProps {
  onRefresh?: () => void
}

export function RawMetalStockTable({ onRefresh }: RawMetalStockTableProps) {
  const [stocks, setStocks] = useState<RawMetalStock[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [search, setSearch] = useState("")
  const [metalTypeFilter, setMetalTypeFilter] = useState("all")
  const [lowStockFilter, setLowStockFilter] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const [totalItems, setTotalItems] = useState(0)
  
  // Dialogs
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [editConfirmDialogOpen, setEditConfirmDialogOpen] = useState(false)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [adjustDialogOpen, setAdjustDialogOpen] = useState(false)
  const [adjustConfirmDialogOpen, setAdjustConfirmDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedStock, setSelectedStock] = useState<RawMetalStock | null>(null)
  
  // Loading states
  const [isUpdating, setIsUpdating] = useState(false)
  const [isAdjusting, setIsAdjusting] = useState(false)
  
  // Form data
  const [formData, setFormData] = useState({
    metalType: "",
    purity: "",
    quantity: "",
    costPerGram: "",
    minQuantity: "",
    supplier: "",
    location: "",
    notes: "",
  })
  
  const [adjustmentData, setAdjustmentData] = useState({
    adjustment: "",
    notes: "",
  })

  const metalTypes = [
    { value: "gold", label: "Gold", color: "bg-yellow-100 text-yellow-800" },
    { value: "silver", label: "Silver", color: "bg-gray-100 text-gray-800" },
    { value: "platinum", label: "Platinum", color: "bg-purple-100 text-purple-800" },
    { value: "white-gold", label: "White Gold", color: "bg-blue-100 text-blue-800" },
    { value: "rose-gold", label: "Rose Gold", color: "bg-pink-100 text-pink-800" },
  ]

  const purityOptions = [
    "24K", "22K", "18K", "14K", "10K", "999 Gold", "995 Gold",
    "925 Silver", "999 Silver", "950 Platinum", "900 Platinum"
  ]

  useEffect(() => {
    fetchStocks()
  }, [search, metalTypeFilter, lowStockFilter, currentPage])

  useEffect(() => {
    setCurrentPage(1)
  }, [search, metalTypeFilter, lowStockFilter])

  const fetchStocks = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: itemsPerPage.toString(),
        ...(search && { search }),
        ...(metalTypeFilter && metalTypeFilter !== "all" && { metalType: metalTypeFilter }),
        ...(lowStockFilter && { lowStock: "true" })
      })

      const response = await fetch(`/api/raw-metal-stocks?${params}`, {
        credentials: 'include',
      })

      if (response.ok) {
        const data = await response.json()
        setStocks(data.stocks || [])
        setTotalItems(data.pagination?.total || 0)
      } else {
        throw new Error('Failed to fetch raw metal stocks')
      }
    } catch (error) {
      console.error('Error fetching raw metal stocks:', error)
      setError('Failed to fetch raw metal stocks')
    } finally {
      setLoading(false)
    }
  }

  const handleAddStock = async () => {
    try {
      const response = await fetch('/api/raw-metal-stocks', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setSuccess('Raw metal stock added successfully!')
        setAddDialogOpen(false)
        resetForm()
        fetchStocks()
        onRefresh?.()
      } else {
        const data = await response.json()
        throw new Error(data.message || 'Failed to add stock')
      }
    } catch (error: any) {
      setError(error.message || 'Failed to add stock')
    }
  }

  const handleUpdateStock = async () => {
    if (!selectedStock) return

    setIsUpdating(true)
    try {
      const response = await fetch(`/api/raw-metal-stocks/${selectedStock.id}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setSuccess('Raw metal stock updated successfully!')
        setEditConfirmDialogOpen(false)
        setEditDialogOpen(false)
        setSelectedStock(null)
        resetForm()
        fetchStocks()
        onRefresh?.()
      } else {
        const data = await response.json()
        throw new Error(data.message || 'Failed to update stock')
      }
    } catch (error: any) {
      setError(error.message || 'Failed to update stock')
    } finally {
      setIsUpdating(false)
    }
  }

  const handleAdjustStock = async () => {
    if (!selectedStock) return

    setIsAdjusting(true)
    try {
      const response = await fetch(`/api/raw-metal-stocks/${selectedStock.id}/adjust`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(adjustmentData),
      })

      if (response.ok) {
        setSuccess('Stock quantity adjusted successfully!')
        setAdjustConfirmDialogOpen(false)
        setAdjustDialogOpen(false)
        setSelectedStock(null)
        setAdjustmentData({ adjustment: "", notes: "" })
        fetchStocks()
        onRefresh?.()
      } else {
        const data = await response.json()
        throw new Error(data.message || 'Failed to adjust stock')
      }
    } catch (error: any) {
      setError(error.message || 'Failed to adjust stock')
    } finally {
      setIsAdjusting(false)
    }
  }

  const handleDeleteStock = async () => {
    if (!selectedStock) return

    try {
      const response = await fetch(`/api/raw-metal-stocks/${selectedStock.id}`, {
        method: 'DELETE',
        credentials: 'include',
      })

      if (response.ok) {
        setSuccess('Raw metal stock deleted successfully!')
        setDeleteDialogOpen(false)
        setSelectedStock(null)
        fetchStocks()
        onRefresh?.()
      } else {
        throw new Error('Failed to delete stock')
      }
    } catch (error) {
      setError('Failed to delete stock')
    }
  }

  const openEditDialog = (stock: RawMetalStock) => {
    setSelectedStock(stock)
    setFormData({
      metalType: stock.metalType,
      purity: stock.purity,
      quantity: stock.quantity.toString(),
      costPerGram: stock.costPerGram.toString(),
      minQuantity: stock.minQuantity.toString(),
      supplier: stock.supplier || "",
      location: stock.location || "",
      notes: stock.notes || "",
    })
    setEditDialogOpen(true)
  }

  const openAdjustDialog = (stock: RawMetalStock) => {
    setSelectedStock(stock)
    setAdjustmentData({ adjustment: "", notes: "" })
    setAdjustDialogOpen(true)
  }

  const resetForm = () => {
    setFormData({
      metalType: "",
      purity: "",
      quantity: "",
      costPerGram: "",
      minQuantity: "",
      supplier: "",
      location: "",
      notes: "",
    })
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sufficient':
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
    const statusColors = {
      'sufficient': 'bg-green-100 text-green-800',
      'low-stock': 'bg-yellow-100 text-yellow-800',
      'out-of-stock': 'bg-red-100 text-red-800',
    }

    return (
      <Badge className={statusColors[status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800'}>
        {status.replace('-', ' ')}
      </Badge>
    )
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NP', {
      style: 'currency',
      currency: 'NPR',
    }).format(amount)
  }

  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems)

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
    <>
      <Card className="bg-white">
        <CardHeader className="px-3 sm:px-6 bg-white">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
              <Package className="h-4 w-4 sm:h-5 sm:w-5 text-orange-600" />
              <span>Raw Metal Stock</span>
              <Badge variant="secondary" className="text-xs">
                {totalItems} items
              </Badge>
            </CardTitle>
            <Button
              size="sm"
              onClick={() => setAddDialogOpen(true)}
              className="luxury-gradient hover:shadow-lg transition-all duration-300"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Stock
            </Button>
          </div>
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
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by metal type, purity, or supplier..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 h-10 text-sm"
                />
              </div>

              <div className="flex gap-2 sm:gap-4">
                <Select value={metalTypeFilter} onValueChange={setMetalTypeFilter}>
                  <SelectTrigger className="w-full sm:w-48 h-10 text-sm">
                    <SelectValue placeholder="All metals" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All metals</SelectItem>
                    {metalTypes.map(metal => (
                      <SelectItem key={metal.value} value={metal.value}>
                        {metal.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Button
                  variant={lowStockFilter ? "default" : "outline"}
                  size="sm"
                  onClick={() => setLowStockFilter(!lowStockFilter)}
                  className="whitespace-nowrap"
                >
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Low Stock
                </Button>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="rounded-lg border border-gray-200 overflow-hidden bg-white">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gradient-to-r from-orange-50 to-amber-50 hover:bg-gradient-to-r hover:from-orange-50 hover:to-amber-50">
                    <TableHead className="w-12 bg-transparent font-semibold text-gray-900">S.N.</TableHead>
                    <TableHead className="bg-transparent font-semibold text-gray-900">Metal Type</TableHead>
                    <TableHead className="bg-transparent font-semibold text-gray-900">Purity</TableHead>
                    <TableHead className="bg-transparent font-semibold text-gray-900">Quantity (g)</TableHead>
                    <TableHead className="bg-transparent font-semibold text-gray-900">Cost/g</TableHead>
                    <TableHead className="bg-transparent font-semibold text-gray-900">Total Value</TableHead>
                    <TableHead className="bg-transparent font-semibold text-gray-900">Status</TableHead>
                    <TableHead className="bg-transparent font-semibold text-gray-900">Location</TableHead>
                    <TableHead className="text-right bg-transparent font-semibold text-gray-900">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="bg-white">
                  {stocks.map((stock, index) => (
                    <TableRow key={stock.id} className="hover:bg-orange-50/50 bg-white">
                      <TableCell className="font-semibold text-gray-700 bg-white">
                        {startIndex + index + 1}
                      </TableCell>
                      <TableCell className="bg-white">
                        <Badge className={metalTypes.find(m => m.value === stock.metalType)?.color}>
                          {stock.metalType}
                        </Badge>
                      </TableCell>
                      <TableCell className="bg-white font-medium">
                        {stock.purity}
                      </TableCell>
                      <TableCell className="bg-white">
                        <div className="flex flex-col">
                          <span className={Number(stock.quantity) <= Number(stock.minQuantity) ? "text-red-600 font-medium" : "font-medium"}>
                            {Number(stock.quantity).toFixed(3)}g
                          </span>
                          <span className="text-xs text-gray-500">
                            Min: {Number(stock.minQuantity).toFixed(3)}g
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="bg-white font-medium">
                        {formatCurrency(Number(stock.costPerGram))}
                      </TableCell>
                      <TableCell className="bg-white font-semibold text-green-700">
                        {formatCurrency(Number(stock.totalValue))}
                      </TableCell>
                      <TableCell className="bg-white">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(stock.status)}
                          {getStatusBadge(stock.status)}
                        </div>
                      </TableCell>
                      <TableCell className="bg-white text-sm text-gray-600">
                        {stock.location || '-'}
                      </TableCell>
                      <TableCell className="bg-white">
                        <div className="flex items-center gap-1 justify-end">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedStock(stock)
                              setViewDialogOpen(true)
                            }}
                            className="h-8 w-8 p-0 hover:bg-amber-100 hover:text-amber-700"
                            title="View Details"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openAdjustDialog(stock)}
                            className="h-8 w-8 p-0 hover:bg-green-100 hover:text-green-700"
                            title="Adjust Quantity"
                          >
                            <TrendingUp className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openEditDialog(stock)}
                            className="h-8 w-8 p-0 hover:bg-blue-100 hover:text-blue-700"
                            title="Edit Stock"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedStock(stock)
                              setDeleteDialogOpen(true)
                            }}
                            className="h-8 w-8 p-0 text-red-600 hover:bg-red-100 hover:text-red-700"
                            title="Delete Stock"
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

            {stocks.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Package className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No raw metal stocks found</p>
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4 border-t mt-4">
              <div className="text-sm text-gray-500 text-center sm:text-left">
                Showing {startIndex + 1} to {endIndex} of {totalItems} items
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
                  Previous
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
                            "w-8 h-8",
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
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={addDialogOpen || editDialogOpen} onOpenChange={(open) => {
        if (!open) {
          setAddDialogOpen(false)
          setEditDialogOpen(false)
          setSelectedStock(null)
          resetForm()
        }
      }}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editDialogOpen ? 'Edit' : 'Add'} Raw Metal Stock</DialogTitle>
            <DialogDescription>
              {editDialogOpen ? 'Update' : 'Enter'} the details for the raw metal stock
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Metal Type *</Label>
              <Select value={formData.metalType} onValueChange={(value) => setFormData({ ...formData, metalType: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select metal" />
                </SelectTrigger>
                <SelectContent>
                  {metalTypes.map(metal => (
                    <SelectItem key={metal.value} value={metal.value}>
                      {metal.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Purity *</Label>
              <Select value={formData.purity} onValueChange={(value) => setFormData({ ...formData, purity: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select purity" />
                </SelectTrigger>
                <SelectContent>
                  {purityOptions.map(purity => (
                    <SelectItem key={purity} value={purity}>
                      {purity}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Quantity (grams) *</Label>
              <Input
                type="number"
                step="0.001"
                placeholder="0.000"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>Cost per Gram *</Label>
              <Input
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.costPerGram}
                onChange={(e) => setFormData({ ...formData, costPerGram: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>Minimum Quantity (grams)</Label>
              <Input
                type="number"
                step="0.001"
                placeholder="0.000"
                value={formData.minQuantity}
                onChange={(e) => setFormData({ ...formData, minQuantity: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>Supplier</Label>
              <Input
                placeholder="Supplier name"
                value={formData.supplier}
                onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
              />
            </div>

            <div className="space-y-2 col-span-2">
              <Label>Storage Location</Label>
              <Input
                placeholder="Storage location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
            </div>

            <div className="space-y-2 col-span-2">
              <Label>Notes</Label>
              <Textarea
                placeholder="Additional notes..."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setAddDialogOpen(false)
              setEditDialogOpen(false)
              setSelectedStock(null)
              resetForm()
            }}>
              Cancel
            </Button>
            <Button onClick={editDialogOpen ? () => setEditConfirmDialogOpen(true) : handleAddStock} className="luxury-gradient">
              {editDialogOpen ? 'Update' : 'Add'} Stock
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Raw Metal Stock Details</DialogTitle>
          </DialogHeader>
          {selectedStock && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Metal Type</p>
                <p className="mt-1">{selectedStock.metalType}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Purity</p>
                <p className="mt-1">{selectedStock.purity}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Quantity</p>
                <p className="mt-1">{Number(selectedStock.quantity).toFixed(3)}g</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Cost per Gram</p>
                <p className="mt-1">{formatCurrency(Number(selectedStock.costPerGram))}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Total Value</p>
                <p className="mt-1 font-semibold text-green-700">{formatCurrency(Number(selectedStock.totalValue))}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Minimum Quantity</p>
                <p className="mt-1">{Number(selectedStock.minQuantity).toFixed(3)}g</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Status</p>
                <div className="mt-1">{getStatusBadge(selectedStock.status)}</div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Supplier</p>
                <p className="mt-1">{selectedStock.supplier || '-'}</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm font-medium text-gray-500">Location</p>
                <p className="mt-1">{selectedStock.location || '-'}</p>
              </div>
              {selectedStock.notes && (
                <div className="col-span-2">
                  <p className="text-sm font-medium text-gray-500">Notes</p>
                  <p className="mt-1">{selectedStock.notes}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Adjust Quantity Dialog */}
      <Dialog open={adjustDialogOpen} onOpenChange={setAdjustDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adjust Stock Quantity</DialogTitle>
            <DialogDescription>
              Add or remove stock quantity. Use positive numbers to add, negative to remove.
            </DialogDescription>
          </DialogHeader>
          {selectedStock && (
            <div className="space-y-4">
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">Current Quantity</p>
                <p className="text-lg font-semibold">{Number(selectedStock.quantity).toFixed(3)}g</p>
              </div>

              <div className="space-y-2">
                <Label>Adjustment (grams)</Label>
                <Input
                  type="number"
                  step="0.001"
                  placeholder="Enter positive or negative value"
                  value={adjustmentData.adjustment}
                  onChange={(e) => setAdjustmentData({ ...adjustmentData, adjustment: e.target.value })}
                />
                <p className="text-xs text-gray-500">
                  New quantity: {(Number(selectedStock.quantity) + parseFloat(adjustmentData.adjustment || '0')).toFixed(3)}g
                </p>
              </div>

              <div className="space-y-2">
                <Label>Notes</Label>
                <Textarea
                  placeholder="Reason for adjustment..."
                  value={adjustmentData.notes}
                  onChange={(e) => setAdjustmentData({ ...adjustmentData, notes: e.target.value })}
                  rows={3}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setAdjustDialogOpen(false)
              setSelectedStock(null)
              setAdjustmentData({ adjustment: "", notes: "" })
            }}>
              Cancel
            </Button>
            <Button onClick={() => setAdjustConfirmDialogOpen(true)} className="luxury-gradient">
              Adjust Stock
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Confirmation Dialog */}
      <Dialog open={editConfirmDialogOpen} onOpenChange={setEditConfirmDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Update</DialogTitle>
            <DialogDescription>
              Are you sure you want to update this raw metal stock? Please review your changes carefully.
            </DialogDescription>
          </DialogHeader>
          {selectedStock && (
            <div className="space-y-2 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium">Changes to be saved:</p>
              <ul className="text-sm space-y-1 text-gray-700">
                <li>• Metal: {formData.metalType} ({formData.purity})</li>
                <li>• Quantity: {formData.quantity}g</li>
                <li>• Cost per Gram: ₹{formData.costPerGram}</li>
                {formData.location && <li>• Location: {formData.location}</li>}
              </ul>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditConfirmDialogOpen(false)} disabled={isUpdating}>
              Cancel
            </Button>
            <Button onClick={handleUpdateStock} className="luxury-gradient" disabled={isUpdating}>
              {isUpdating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                'Confirm Update'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Adjust Confirmation Dialog */}
      <Dialog open={adjustConfirmDialogOpen} onOpenChange={setAdjustConfirmDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Stock Adjustment</DialogTitle>
            <DialogDescription>
              Please confirm the stock quantity adjustment. This action will update the inventory records.
            </DialogDescription>
          </DialogHeader>
          {selectedStock && (
            <div className="space-y-3">
              <div className="p-4 bg-gray-50 rounded-lg space-y-2">
                <p className="text-sm font-medium">Adjustment Details:</p>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Current Quantity:</span>
                    <span className="font-medium">{Number(selectedStock.quantity).toFixed(3)}g</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Adjustment:</span>
                    <span className={`font-medium ${parseFloat(adjustmentData.adjustment || '0') >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {parseFloat(adjustmentData.adjustment || '0') >= 0 ? '+' : ''}{adjustmentData.adjustment}g
                    </span>
                  </div>
                  <div className="flex justify-between pt-2 border-t">
                    <span className="text-gray-600">New Quantity:</span>
                    <span className="font-bold text-blue-600">
                      {(Number(selectedStock.quantity) + parseFloat(adjustmentData.adjustment || '0')).toFixed(3)}g
                    </span>
                  </div>
                </div>
              </div>
              {adjustmentData.notes && (
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-xs font-medium text-blue-800 mb-1">Notes:</p>
                  <p className="text-sm text-blue-700">{adjustmentData.notes}</p>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setAdjustConfirmDialogOpen(false)} disabled={isAdjusting}>
              Cancel
            </Button>
            <Button onClick={handleAdjustStock} className="luxury-gradient" disabled={isAdjusting}>
              {isAdjusting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Adjusting...
                </>
              ) : (
                'Confirm Adjustment'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Raw Metal Stock</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this raw metal stock? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setDeleteDialogOpen(false)
              setSelectedStock(null)
            }}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteStock}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
