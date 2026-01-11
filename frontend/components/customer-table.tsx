"use client"

import { useState, useEffect } from "react"
import { Search, Edit, Trash2, Phone, Mail, MapPin, Star, Crown, Eye, ChevronLeft, ChevronRight, AlertCircle, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog"
import { cn } from "@/lib/utils"

interface Customer {
  id: string
  name: string
  email: string
  phone: string
  role: "customer"
  createdAt: string
  updatedAt: string
  totalPurchases?: number
  lastPurchase?: string
  status?: "Regular" | "VIP" | "Premium"
  loyaltyPoints?: number
  address?: string
}

export function CustomerTable() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [searchTerm, setSearchTerm] = useState("")

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [paginatedCustomers, setPaginatedCustomers] = useState<Customer[]>([])

  // Modal states
  const [showViewModal, setShowViewModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [showUpdateConfirm, setShowUpdateConfirm] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)

  // Edit form states
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    phone: ""
  })
  const [editLoading, setEditLoading] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)

  // Calculate pagination
  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage

  // Update paginated data when filtered customers or pagination settings change
  useEffect(() => {
    const paginated = filteredCustomers.slice(startIndex, endIndex)
    setPaginatedCustomers(paginated)
  }, [filteredCustomers, currentPage, itemsPerPage, startIndex, endIndex])

  // Reset to first page when search changes or items per page changes
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, itemsPerPage])

  // Fetch customers (only users with role 'customer')
  const fetchCustomers = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/users', {
        credentials: 'include',
      })

      if (!response.ok) {
        throw new Error('Failed to fetch customers')
      }

      const data = await response.json()
      // Filter only customers
      const customersOnly = data.filter((user: any) => user.role === 'customer')
      setCustomers(customersOnly)
      setFilteredCustomers(customersOnly)
    } catch (error: any) {
      console.error('Fetch customers error:', error)
      setError(error.message || 'Failed to fetch customers')
    } finally {
      setLoading(false)
    }
  }

  // Filter customers based on search term
  useEffect(() => {
    let filtered = customers

    if (searchTerm) {
      filtered = filtered.filter(customer => 
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.phone.includes(searchTerm)
      )
    }

    setFilteredCustomers(filtered)
  }, [customers, searchTerm])

  const handleDeleteCustomer = async (customerId: string, customerName: string) => {
    setSelectedCustomer({ id: customerId, name: customerName } as Customer)
    setShowDeleteConfirm(true)
  }

  const confirmDeleteCustomer = async () => {
    if (!selectedCustomer) return

    try {
      setDeleteLoading(true)
      const response = await fetch(`/api/users/${selectedCustomer.id}`, {
        method: 'DELETE',
        credentials: 'include',
      })

      if (!response.ok) {
        throw new Error('Failed to delete customer')
      }

      setSuccess(`Customer "${selectedCustomer.name}" has been deleted successfully`)
      setCustomers(prev => prev.filter(customer => customer.id !== selectedCustomer.id))
      setShowDeleteConfirm(false)
      setSelectedCustomer(null)
    } catch (error: any) {
      console.error('Delete customer error:', error)
      setError(error.message || 'Failed to delete customer')
    } finally {
      setDeleteLoading(false)
    }
  }

  const handleViewCustomer = (customer: Customer) => {
    setSelectedCustomer(customer)
    setShowViewModal(true)
  }

  const handleEditCustomer = (customer: Customer) => {
    setSelectedCustomer(customer)
    setEditForm({
      name: customer.name,
      email: customer.email,
      phone: customer.phone
    })
    setShowEditModal(true)
  }

  const handleUpdateCustomer = async () => {
    setShowUpdateConfirm(true)
  }

  const confirmUpdateCustomer = async () => {
    if (!selectedCustomer) return

    try {
      setEditLoading(true)
      const response = await fetch(`/api/users/${selectedCustomer.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          ...editForm,
          role: 'customer'
        })
      })

      if (!response.ok) {
        throw new Error('Failed to update customer')
      }

      setCustomers(prev => prev.map(customer => 
        customer.id === selectedCustomer.id ? { 
          ...customer, 
          name: editForm.name,
          email: editForm.email,
          phone: editForm.phone
        } : customer
      ))
      
      setSuccess(`Customer "${editForm.name}" has been updated successfully`)
      setShowEditModal(false)
      setShowUpdateConfirm(false)
      setSelectedCustomer(null)
    } catch (error: any) {
      console.error('Update customer error:', error)
      setError(error.message || 'Failed to update customer')
    } finally {
      setEditLoading(false)
    }
  }

  const getCustomerStatus = (customer: Customer): "Regular" | "VIP" | "Premium" => {
    return customer.status || "Regular"
  }

  const getStatusDisplay = (status: "Regular" | "VIP" | "Premium") => {
    switch (status) {
      case "VIP":
        return { icon: Crown, color: "bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-700 border-amber-300" }
      case "Premium":
        return { icon: Star, color: "bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-700 border-purple-300" }
      default:
        return { icon: null, color: "bg-gradient-to-r from-gray-500/20 to-slate-500/20 text-gray-700 border-gray-300" }
    }
  }

  useEffect(() => {
    fetchCustomers()
  }, [])

  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError("")
        setSuccess("")
      }, 5000)
      
      return () => clearTimeout(timer)
    }
  }, [error, success])

  return (
    <>
      {/* Alerts */}
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-sm">{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="bg-green-50 border-green-200 mb-4">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800 text-sm">{success}</AlertDescription>
        </Alert>
      )}

      {/* Search and Controls */}
      <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:gap-4 sm:items-center sm:justify-between mb-4">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search customers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 border-amber-200 focus:border-amber-400 focus:ring-amber-400/20"
          />
        </div>
        
        <div className="flex items-center gap-2 justify-end">
          <span className="text-xs sm:text-sm text-gray-500 whitespace-nowrap">Show:</span>
          <select
            value={itemsPerPage}
            onChange={(e) => setItemsPerPage(Number(e.target.value))}
            className="px-3 py-2 text-sm border border-gray-300 rounded-md bg-white"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div>

      {/* Customer Table */}
      <div className="rounded-lg border border-amber-200 bg-white/50 backdrop-blur-sm shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
                <TableHead className="font-semibold text-amber-800 w-[60px]">S.N.</TableHead>
                <TableHead className="font-semibold text-amber-800 min-w-[150px]">Customer</TableHead>
                <TableHead className="font-semibold text-amber-800 min-w-[180px] hidden sm:table-cell">Contact</TableHead>
                <TableHead className="font-semibold text-amber-800 min-w-[100px] hidden md:table-cell">Status</TableHead>
                <TableHead className="font-semibold text-amber-800 min-w-[120px] hidden lg:table-cell">Member Since</TableHead>
                <TableHead className="font-semibold text-amber-800 min-w-[120px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center">
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-orange-500" />
                      <span className="text-sm sm:text-base">Loading customers...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredCustomers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <Search className="h-8 w-8 sm:h-12 sm:w-12 text-gray-400 mb-2 sm:mb-4" />
                      <p className="text-sm sm:text-base text-gray-500">
                        {searchTerm ? "No customers found matching your search" : "No customers found"}
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedCustomers.map((customer, index) => {
                  const status = getCustomerStatus(customer)
                  const statusDisplay = getStatusDisplay(status)
                  const StatusIcon = statusDisplay.icon
                  const serialNumber = startIndex + index + 1

                  return (
                    <TableRow
                      key={customer.id}
                      className="hover:bg-amber-50/50 transition-colors duration-200"
                    >
                      <TableCell className="font-medium text-gray-600">
                        {serialNumber}
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium text-gray-900 text-sm sm:text-base">{customer.name}</div>
                          <div className="flex items-center text-xs sm:text-sm text-muted-foreground">
                            <MapPin className="h-3 w-3 mr-1" />
                            <span className="truncate">{customer.address || "No address"}</span>
                          </div>
                          <div className="sm:hidden space-y-1 mt-2">
                            <div className="flex items-center text-xs text-muted-foreground">
                              <Mail className="h-3 w-3 mr-1 text-amber-600" />
                              <span className="truncate">{customer.email}</span>
                            </div>
                            <div className="flex items-center text-xs text-muted-foreground">
                              <Phone className="h-3 w-3 mr-1 text-amber-600" />
                              {customer.phone}
                            </div>
                          </div>
                          <div className="md:hidden mt-2">
                            <Badge className={`${statusDisplay.color} flex items-center gap-1 w-fit text-xs`}>
                              {StatusIcon && <StatusIcon className="h-3 w-3" />}
                              {status}
                            </Badge>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <div className="space-y-1">
                          <div className="flex items-center text-sm">
                            <Mail className="h-3 w-3 mr-2 text-amber-600" />
                            <span className="truncate">{customer.email}</span>
                          </div>
                          <div className="flex items-center text-sm">
                            <Phone className="h-3 w-3 mr-2 text-amber-600" />
                            {customer.phone}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <Badge className={`${statusDisplay.color} flex items-center gap-1 w-fit`}>
                          {StatusIcon && <StatusIcon className="h-3 w-3" />}
                          {status}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <div className="text-sm text-muted-foreground">
                          {new Date(customer.createdAt).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end gap-1 sm:gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-7 w-7 sm:h-8 sm:w-8 p-0 hover:bg-amber-100 hover:text-amber-700"
                            onClick={() => handleViewCustomer(customer)}
                            title="View Details"
                          >
                            <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-7 w-7 sm:h-8 sm:w-8 p-0 hover:bg-blue-100 hover:text-blue-700"
                            onClick={() => handleEditCustomer(customer)}
                            title="Edit Customer"
                          >
                            <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-7 w-7 sm:h-8 sm:w-8 p-0 hover:bg-red-100 hover:text-red-700"
                            onClick={() => handleDeleteCustomer(customer.id, customer.name)}
                            title="Delete Customer"
                          >
                            <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {!loading && filteredCustomers.length > 0 && totalPages > 1 && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 sm:p-4 border-t border-amber-200 bg-gradient-to-r from-amber-50/50 to-orange-50/50">
            <div className="text-xs sm:text-sm text-gray-500 text-center sm:text-left">
              Showing {startIndex + 1} to {Math.min(endIndex, filteredCustomers.length)} of {filteredCustomers.length} customers
            </div>
            
            <div className="flex items-center justify-center gap-1 sm:gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="h-8 px-2 sm:px-3"
              >
                <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline ml-1">Previous</span>
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
                          "h-8 w-8 sm:w-10 sm:h-10 text-xs sm:text-sm",
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
                      <span key={pageNumber} className="px-1 sm:px-2 py-1 text-xs sm:text-sm text-gray-500">
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
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="h-8 px-2 sm:px-3"
              >
                <span className="hidden sm:inline mr-1">Next</span>
                <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <Dialog open={showViewModal} onOpenChange={setShowViewModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Customer Details</DialogTitle>
          </DialogHeader>
          {selectedCustomer && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Name</Label>
                <p className="text-sm text-gray-600">{selectedCustomer.name}</p>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Email</Label>
                <p className="text-sm text-gray-600">{selectedCustomer.email}</p>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Phone</Label>
                <p className="text-sm text-gray-600">{selectedCustomer.phone}</p>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Member Since</Label>
                <p className="text-sm text-gray-600">
                  {new Date(selectedCustomer.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Customer</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Name</Label>
              <Input
                id="edit-name"
                value={editForm.name}
                onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter customer name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-email">Email</Label>
              <Input
                id="edit-email"
                type="email"
                value={editForm.email}
                onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                placeholder="Enter email address"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-phone">Phone</Label>
              <Input
                id="edit-phone"
                value={editForm.phone}
                onChange={(e) => setEditForm(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="Enter phone number"
              />
            </div>
            <div className="flex gap-2 justify-end pt-4">
              <Button
                variant="outline"
                onClick={() => setShowEditModal(false)}
                disabled={editLoading}
              >
                Cancel
              </Button>
              <Button
                onClick={handleUpdateCustomer}
                disabled={editLoading}
                className="bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white"
              >
                {editLoading ? "Updating..." : "Update Customer"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <ConfirmationDialog
        open={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={confirmDeleteCustomer}
        title="Delete Customer"
        description={`Are you sure you want to delete customer "${selectedCustomer?.name}"? This action cannot be undone.`}
        confirmText="Delete Customer"
        cancelText="Cancel"
        type="danger"
        loading={deleteLoading}
      />

      <ConfirmationDialog
        open={showUpdateConfirm}
        onClose={() => setShowUpdateConfirm(false)}
        onConfirm={confirmUpdateCustomer}
        title="Update Customer"
        description={`Are you sure you want to update the details for customer "${editForm.name}"?`}
        confirmText="Update Customer"
        cancelText="Cancel"
        type="info"
        loading={editLoading}
      />
    </>
  )
}
