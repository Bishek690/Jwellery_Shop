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
import {
  Receipt,
  Search,
  Eye,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  FileText,
  Calendar,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"

interface SalesRecord {
  id: number
  billNumber: string
  customerName: string
  customerPhone?: string
  saleType: string
  items: any[]
  subtotal: number
  discount: number
  tax: number
  totalAmount: number
  paymentMethod: string
  status: string
  billImage?: string
  createdBy: {
    id: string
    name: string
    email: string
  }
  createdAt: string
}

interface SalesRecordsTableProps {
  onRefresh?: () => void
}

export function SalesRecordsTable({ onRefresh }: SalesRecordsTableProps) {
  const router = useRouter()
  const [sales, setSales] = useState<SalesRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [search, setSearch] = useState("")
  const [saleTypeFilter, setSaleTypeFilter] = useState("all")
  const [paymentMethodFilter, setPaymentMethodFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const [totalItems, setTotalItems] = useState(0)

  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedSale, setSelectedSale] = useState<SalesRecord | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const paymentMethods = [
    { value: "cash", label: "Cash" },
    { value: "card", label: "Card" },
    { value: "wallet", label: "Wallet" },
    { value: "bank-transfer", label: "Bank Transfer" },
  ]

  useEffect(() => {
    fetchSales()
  }, [search, saleTypeFilter, paymentMethodFilter, currentPage])

  useEffect(() => {
    setCurrentPage(1)
  }, [search, saleTypeFilter, paymentMethodFilter])

  const fetchSales = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: itemsPerPage.toString(),
        ...(search && { search }),
        ...(saleTypeFilter && saleTypeFilter !== "all" && { saleType: saleTypeFilter }),
        ...(paymentMethodFilter && paymentMethodFilter !== "all" && { paymentMethod: paymentMethodFilter })
      })

      const response = await fetch(`/api/sales-records?${params}`, {
        credentials: 'include',
      })

      if (response.ok) {
        const data = await response.json()
        setSales(data.sales || [])
        setTotalItems(data.pagination?.total || 0)
      } else {
        throw new Error('Failed to fetch sales records')
      }
    } catch (error) {
      console.error('Error fetching sales records:', error)
      setError('Failed to fetch sales records')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteSale = async () => {
    if (!selectedSale) return

    setIsDeleting(true)
    try {
      const response = await fetch(`/api/sales-records/${selectedSale.id}`, {
        method: 'DELETE',
        credentials: 'include',
      })

      if (response.ok) {
        setSuccess('Sales record deleted successfully!')
        setDeleteDialogOpen(false)
        setSelectedSale(null)
        fetchSales()
        onRefresh?.()
      } else {
        throw new Error('Failed to delete sales record')
      }
    } catch (error) {
      setError('Failed to delete sales record')
    } finally {
      setIsDeleting(false)
    }
  }

  const getPaymentMethodBadge = (method: string) => {
    const colors: Record<string, string> = {
      'cash': 'bg-green-100 text-green-800',
      'card': 'bg-blue-100 text-blue-800',
      'wallet': 'bg-purple-100 text-purple-800',
      'bank-transfer': 'bg-indigo-100 text-indigo-800',
    }
    return colors[method] || 'bg-gray-100 text-gray-800'
  }

  const getSaleTypeBadge = (type: string) => {
    return type === 'product' 
      ? 'bg-orange-100 text-orange-800' 
      : 'bg-yellow-100 text-yellow-800'
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NP', {
      style: 'currency',
      currency: 'NPR',
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
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
              <Receipt className="h-5 w-5 text-orange-600" />
              <span>Sales Records</span>
              <Badge variant="secondary" className="text-xs">
                {totalItems} records
              </Badge>
            </CardTitle>
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
                  placeholder="Search by bill no, customer name, or phone..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 h-10 text-sm"
                />
              </div>

              <div className="flex gap-2 sm:gap-4">
                <Select value={saleTypeFilter} onValueChange={setSaleTypeFilter}>
                  <SelectTrigger className="w-full sm:w-48 h-10 text-sm">
                    <SelectValue placeholder="All types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All types</SelectItem>
                    <SelectItem value="product">Product</SelectItem>
                    <SelectItem value="raw-metal">Raw Metal</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={paymentMethodFilter} onValueChange={setPaymentMethodFilter}>
                  <SelectTrigger className="w-full sm:w-48 h-10 text-sm">
                    <SelectValue placeholder="All payments" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All payments</SelectItem>
                    {paymentMethods.map(method => (
                      <SelectItem key={method.value} value={method.value}>
                        {method.label}
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
                    <TableHead className="w-12 bg-transparent font-semibold text-gray-900">S.N.</TableHead>
                    <TableHead className="bg-transparent font-semibold text-gray-900">Bill No.</TableHead>
                    <TableHead className="bg-transparent font-semibold text-gray-900">Customer</TableHead>
                    <TableHead className="bg-transparent font-semibold text-gray-900">Type</TableHead>
                    <TableHead className="bg-transparent font-semibold text-gray-900">Amount</TableHead>
                    <TableHead className="bg-transparent font-semibold text-gray-900">Payment</TableHead>
                    <TableHead className="bg-transparent font-semibold text-gray-900">Date</TableHead>
                    <TableHead className="text-right bg-transparent font-semibold text-gray-900">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="bg-white">
                  {sales.map((sale, index) => (
                    <TableRow key={sale.id} className="hover:bg-orange-50/50 bg-white">
                      <TableCell className="font-semibold text-gray-700 bg-white">
                        {startIndex + index + 1}
                      </TableCell>
                      <TableCell className="bg-white">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-gray-400" />
                          <span className="font-medium">{sale.billNumber}</span>
                        </div>
                      </TableCell>
                      <TableCell className="bg-white">
                        <div className="flex flex-col">
                          <span className="font-medium text-gray-900">{sale.customerName}</span>
                          {sale.customerPhone && (
                            <span className="text-sm text-gray-500">{sale.customerPhone}</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="bg-white">
                        <Badge className={getSaleTypeBadge(sale.saleType)}>
                          {sale.saleType === 'product' ? 'Product' : 'Raw Metal'}
                        </Badge>
                      </TableCell>
                      <TableCell className="bg-white font-semibold text-green-700">
                        {formatCurrency(sale.totalAmount)}
                      </TableCell>
                      <TableCell className="bg-white">
                        <Badge className={getPaymentMethodBadge(sale.paymentMethod)}>
                          {paymentMethods.find(m => m.value === sale.paymentMethod)?.label || sale.paymentMethod}
                        </Badge>
                      </TableCell>
                      <TableCell className="bg-white">
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Calendar className="h-3 w-3" />
                          {formatDate(sale.createdAt)}
                        </div>
                      </TableCell>
                      <TableCell className="bg-white">
                        <div className="flex items-center gap-1 justify-end">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedSale(sale)
                              setViewDialogOpen(true)
                            }}
                            className="h-8 w-8 p-0 hover:bg-blue-100 hover:text-blue-700"
                            title="View Details"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => router.push(`/admin/sales-records/edit/${sale.id}`)}
                            className="h-8 w-8 p-0 hover:bg-orange-100 hover:text-orange-700"
                            title="Edit Record"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedSale(sale)
                              setDeleteDialogOpen(true)
                            }}
                            className="h-8 w-8 p-0 text-red-600 hover:bg-red-100 hover:text-red-700"
                            title="Delete Record"
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

            {sales.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Receipt className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No sales records found</p>
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4 border-t mt-4">
              <div className="text-sm text-gray-500 text-center sm:text-left">
                Showing {startIndex + 1} to {endIndex} of {totalItems} records
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

      {/* View Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Sales Record Details</DialogTitle>
          </DialogHeader>
          {selectedSale && (
            <div className="space-y-4">
              {/* Bill Image */}
              {selectedSale.billImage && (
                <div className="flex justify-center p-4 bg-gray-50 rounded-lg">
                  <img 
                    src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${selectedSale.billImage}`} 
                    alt="Bill"
                    className="max-w-full max-h-64 object-contain rounded"
                  />
                </div>
              )}

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Bill Number</p>
                  <p className="mt-1 font-medium">{selectedSale.billNumber}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Sale Type</p>
                  <Badge className={getSaleTypeBadge(selectedSale.saleType)}>
                    {selectedSale.saleType === 'product' ? 'Product' : 'Raw Metal'}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Customer Name</p>
                  <p className="mt-1">{selectedSale.customerName}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Phone</p>
                  <p className="mt-1">{selectedSale.customerPhone || '-'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Payment Method</p>
                  <Badge className={getPaymentMethodBadge(selectedSale.paymentMethod)}>
                    {paymentMethods.find(m => m.value === selectedSale.paymentMethod)?.label || selectedSale.paymentMethod}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Date</p>
                  <p className="mt-1 text-sm">{formatDate(selectedSale.createdAt)}</p>
                </div>
              </div>

              {/* Items */}
              <div>
                <p className="text-sm font-medium text-gray-500 mb-2">Items</p>
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left">Item</th>
                        <th className="px-4 py-2 text-right">Qty</th>
                        <th className="px-4 py-2 text-right">Price</th>
                        <th className="px-4 py-2 text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(Array.isArray(selectedSale.items) ? selectedSale.items : JSON.parse(selectedSale.items || '[]')).map((item: any, index: number) => (
                        <tr key={index} className="border-t">
                          <td className="px-4 py-2">{item.name}</td>
                          <td className="px-4 py-2 text-right">{item.quantity}</td>
                          <td className="px-4 py-2 text-right">{formatCurrency(item.price)}</td>
                          <td className="px-4 py-2 text-right font-medium">{formatCurrency(item.quantity * item.price)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Totals */}
              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal:</span>
                  <span>{formatCurrency(selectedSale.subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Discount:</span>
                  <span className="text-red-600">-{formatCurrency(selectedSale.discount)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax:</span>
                  <span>{formatCurrency(selectedSale.tax)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-2 border-t">
                  <span>Total:</span>
                  <span className="text-green-700">{formatCurrency(selectedSale.totalAmount)}</span>
                </div>
              </div>

              {/* Created By */}
              <div className="text-sm text-gray-600 pt-2 border-t">
                Created by: {selectedSale.createdBy.name} ({selectedSale.createdBy.email})
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Sales Record</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this sales record? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setDeleteDialogOpen(false)
              setSelectedSale(null)
            }} disabled={isDeleting}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteSale} disabled={isDeleting}>
              {isDeleting ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>


    </>
  )
}
