"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { cn } from "@/lib/utils"
import { useAuth } from "@/hooks/use-auth"
import { 
  Users, 
  Search, 
  Edit, 
  Trash2, 
  Eye, 
  Filter,
  UserCheck,
  Calculator,
  UserPlus,
  Crown,
  ShoppingCart,
  AlertCircle,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Shield
} from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog"
import Link from "next/link"

interface User {
  id: string
  name: string
  email: string
  phone: string
  role: 'admin' | 'staff' | 'accountant' | 'customer'
  createdAt: string
  updatedAt: string
  mustChangePassword?: boolean
}

export default function ManageUsersPage() {
  const { user: currentUser } = useAuth()
  const [users, setUsers] = useState<User[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [filterRole, setFilterRole] = useState<string>("all")
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [paginatedUsers, setPaginatedUsers] = useState<User[]>([])

  // Modal states
  const [showViewModal, setShowViewModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [showUpdateConfirm, setShowUpdateConfirm] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  
  // Edit form states
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    phone: "",
    role: ""
  })
  const [editLoading, setEditLoading] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)

  // Calculate pagination
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage

  // Update paginated data when filtered users or pagination settings change
  useEffect(() => {
    const paginated = filteredUsers.slice(startIndex, endIndex)
    setPaginatedUsers(paginated)
  }, [filteredUsers, currentPage, itemsPerPage, startIndex, endIndex])

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, filterRole, itemsPerPage])

  // Fetch users
  const fetchUsers = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/users', {
        credentials: 'include',
      })

      if (!response.ok) {
        throw new Error('Failed to fetch users')
      }

      const data = await response.json()
      setUsers(data)
      setFilteredUsers(data)
    } catch (error: any) {
      console.error('Fetch users error:', error)
      setError(error.message || 'Failed to fetch users')
    } finally {
      setLoading(false)
    }
  }

  // Filter users based on search and role
  useEffect(() => {
    let filtered = users

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(user => 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phone.includes(searchTerm)
      )
    }

    // Filter by role
    if (filterRole !== "all") {
      filtered = filtered.filter(user => user.role === filterRole)
    }

    setFilteredUsers(filtered)
  }, [users, searchTerm, filterRole])

  // Check if user can be edited
  const canEditUser = (user: User) => {
    // Cannot edit admin users (except yourself)
    if (user.role === 'admin' && user.id !== currentUser?.id) {
      return false
    }
    return true
  }

  // Check if user can be deleted
  const canDeleteUser = (user: User) => {
    // Cannot delete admin users
    if (user.role === 'admin') {
      return false
    }
    // Cannot delete yourself
    if (user.id === currentUser?.id) {
      return false
    }
    return true
  }

  // Delete user
  const handleDeleteUser = async (userId: string, userName: string) => {
    setSelectedUser({ id: userId, name: userName } as User)
    setShowDeleteConfirm(true)
  }

  // Confirm delete user
  const confirmDeleteUser = async () => {
    if (!selectedUser) return

    try {
      setDeleteLoading(true)
      const response = await fetch(`/api/users/${selectedUser.id}`, {
        method: 'DELETE',
        credentials: 'include',
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || 'Failed to delete user')
      }

      setSuccess(`User "${selectedUser.name}" has been deleted successfully`)
      setUsers(prev => prev.filter(user => user.id !== selectedUser.id))
      setShowDeleteConfirm(false)
      setSelectedUser(null)
    } catch (error: any) {
      console.error('Delete user error:', error)
      setError(error.message || 'Failed to delete user')
    } finally {
      setDeleteLoading(false)
    }
  }

  // View user details
  const handleViewUser = (user: User) => {
    setSelectedUser(user)
    setShowViewModal(true)
  }

  // Edit user
  const handleEditUser = (user: User) => {
    if (!canEditUser(user)) {
      setError("You cannot edit admin accounts")
      return
    }

    setSelectedUser(user)
    setEditForm({
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role
    })
    setShowEditModal(true)
  }

  // Update user
  const handleUpdateUser = async () => {
    setShowUpdateConfirm(true)
  }

  // Confirm update user
  const confirmUpdateUser = async () => {
    if (!selectedUser) return

    try {
      setEditLoading(true)
      const response = await fetch(`/api/users/${selectedUser.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(editForm)
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || 'Failed to update user')
      }

      const updatedUser = await response.json()
      
      // Update users list
      setUsers(prev => prev.map(user => 
        user.id === selectedUser.id ? { 
          ...user, 
          name: editForm.name,
          email: editForm.email,
          phone: editForm.phone,
          role: editForm.role as 'admin' | 'staff' | 'accountant' | 'customer'
        } : user
      ))
      
      setSuccess(`User "${editForm.name}" has been updated successfully`)
      setShowEditModal(false)
      setShowUpdateConfirm(false)
      setSelectedUser(null)
    } catch (error: any) {
      console.error('Update user error:', error)
      setError(error.message || 'Failed to update user')
    } finally {
      setEditLoading(false)
    }
  }

  // Get role icon and color
  const getRoleDisplay = (role: string) => {
    switch (role) {
      case 'admin':
        return { icon: Crown, color: 'bg-purple-100 text-purple-800 border-purple-300', label: 'Admin' }
      case 'staff':
        return { icon: UserCheck, color: 'bg-orange-100 text-orange-800 border-orange-300', label: 'Staff' }
      case 'accountant':
        return { icon: Calculator, color: 'bg-green-100 text-green-800 border-green-300', label: 'Accountant' }
      case 'customer':
        return { icon: ShoppingCart, color: 'bg-blue-100 text-blue-800 border-blue-300', label: 'Customer' }
      default:
        return { icon: Users, color: 'bg-gray-100 text-gray-800 border-gray-300', label: 'Unknown' }
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  // Clear alerts after 5 seconds
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
      {/* Action Bar */}
      <div className="flex justify-end mb-6">
        <Link href="/admin/users/create">
          <Button className="bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white">
            <UserPlus className="h-4 w-4 mr-2" />
            Create User
          </Button>
        </Link>
      </div>

      {/* Alerts */}
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="bg-green-50 border-green-200 mb-4">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">{success}</AlertDescription>
        </Alert>
      )}

      {/* Filters and Search */}
      <Card className="mb-6 bg-white">
        <CardHeader>
          <CardTitle>User Management</CardTitle>
          <CardDescription>Search and filter users by role or personal information</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by name, email, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Role Filter */}
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md bg-white"
              >
                <option value="all">All Roles</option>
                <option value="admin">Admin</option>
                <option value="staff">Staff</option>
                <option value="accountant">Accountant</option>
                <option value="customer">Customer</option>
              </select>
            </div>

            {/* Items per page */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500 whitespace-nowrap">Show:</span>
              <select
                value={itemsPerPage}
                onChange={(e) => setItemsPerPage(Number(e.target.value))}
                className="px-3 py-2 border border-gray-300 rounded-md bg-white"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card className="bg-white">
        <CardHeader className="bg-white">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Users ({filteredUsers.length} total)</CardTitle>
              <CardDescription>
                {filterRole !== "all" ? `Showing ${filterRole}s` : "Showing all users"} 
                {filteredUsers.length > 0 && ` - Page ${currentPage} of ${totalPages}`}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="bg-white">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500" />
              <span className="ml-2">Loading users...</span>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">
                {searchTerm || filterRole !== "all" ? "No users found matching your criteria" : "No users found"}
              </p>
            </div>
          ) : (
            <>
              <div className="relative overflow-x-auto rounded-lg border border-gray-200 bg-white">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gradient-to-r from-orange-50 to-amber-50 hover:bg-gradient-to-r hover:from-orange-50 hover:to-amber-50">
                      <TableHead className="w-[80px] font-semibold text-gray-900">S.N.</TableHead>
                      <TableHead className="font-semibold text-gray-900">Name</TableHead>
                      <TableHead className="font-semibold text-gray-900">Email</TableHead>
                      <TableHead className="font-semibold text-gray-900">Phone</TableHead>
                      <TableHead className="font-semibold text-gray-900">Role</TableHead>
                      <TableHead className="font-semibold text-gray-900">Status</TableHead>
                      <TableHead className="font-semibold text-gray-900">Created</TableHead>
                      <TableHead className="text-right w-32 font-semibold text-gray-900">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="bg-white">
                    {paginatedUsers.map((user, index) => {
                      const roleDisplay = getRoleDisplay(user.role)
                      const RoleIcon = roleDisplay.icon
                      const serialNumber = startIndex + index + 1
                      const isAdmin = user.role === 'admin'
                      const canEdit = canEditUser(user)
                      const canDelete = canDeleteUser(user)

                      return (
                        <TableRow key={user.id} className="hover:bg-orange-50/50 bg-white">
                          <TableCell className="font-semibold text-gray-700 bg-white">
                            {serialNumber}
                          </TableCell>
                          <TableCell className="font-medium bg-white">
                            <div className="flex items-center gap-2">
                              {user.name}
                              {isAdmin && (
                                <span title="Admin Account">
                                  <Shield className="h-3 w-3 text-purple-600" />
                                </span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="bg-white">{user.email}</TableCell>
                          <TableCell className="bg-white">{user.phone}</TableCell>
                          <TableCell className="bg-white">
                            <Badge className={roleDisplay.color}>
                              <RoleIcon className="h-3 w-3 mr-1" />
                              {roleDisplay.label}
                            </Badge>
                          </TableCell>
                          <TableCell className="bg-white">
                            {user.mustChangePassword ? (
                              <Badge variant="destructive" className="text-xs">
                                Password Reset Required
                              </Badge>
                            ) : (
                              <Badge variant="secondary" className="text-xs bg-green-100 text-green-800 border-green-300">
                                Active
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-sm text-gray-500 bg-white">
                            {new Date(user.createdAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-right bg-white">
                            <div className="flex gap-1 justify-end">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleViewUser(user)}
                                className="h-8 w-8 p-0 hover:bg-amber-100 hover:text-amber-700"
                                title="View Details"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              {canEdit && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleEditUser(user)}
                                  className="h-8 w-8 p-0 hover:bg-blue-100 hover:text-blue-700"
                                  title="Edit User"
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                              )}
                              {canDelete && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDeleteUser(user.id, user.name)}
                                  className="h-8 w-8 p-0 text-red-600 hover:bg-red-100 hover:text-red-700"
                                  title="Delete User"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4 border-t mt-4 bg-white">
                  <div className="text-sm text-gray-500 text-center sm:text-left">
                    Showing {startIndex + 1} to {Math.min(endIndex, filteredUsers.length)} of {filteredUsers.length} users
                  </div>
                  
                  <div className="flex items-center justify-center gap-2">
                    {/* Previous Button */}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="h-8 px-3"
                    >
                      <ChevronLeft className="h-4 w-4 mr-1" />
                      <span className="hidden sm:inline">Previous</span>
                    </Button>

                    {/* Page Numbers */}
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

                    {/* Next Button */}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="h-8 px-3"
                    >
                      <span className="hidden sm:inline">Next</span>
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* View User Modal */}
      <Dialog open={showViewModal} onOpenChange={setShowViewModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Name</Label>
                <p className="text-sm text-gray-600">{selectedUser.name}</p>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Email</Label>
                <p className="text-sm text-gray-600">{selectedUser.email}</p>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Phone</Label>
                <p className="text-sm text-gray-600">{selectedUser.phone}</p>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Role</Label>
                <div className="flex items-center">
                  {(() => {
                    const roleDisplay = getRoleDisplay(selectedUser.role)
                    const RoleIcon = roleDisplay.icon
                    return (
                      <Badge className={roleDisplay.color}>
                        <RoleIcon className="h-3 w-3 mr-1" />
                        {roleDisplay.label}
                      </Badge>
                    )
                  })()}
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Status</Label>
                <div>
                  {selectedUser.mustChangePassword ? (
                    <Badge variant="destructive" className="text-xs">
                      Password Reset Required
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="text-xs bg-green-100 text-green-800 border-green-300">
                      Active
                    </Badge>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Created</Label>
                <p className="text-sm text-gray-600">
                  {new Date(selectedUser.createdAt).toLocaleString()}
                </p>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Last Updated</Label>
                <p className="text-sm text-gray-600">
                  {new Date(selectedUser.updatedAt).toLocaleString()}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit User Modal */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Name</Label>
              <Input
                id="edit-name"
                value={editForm.name}
                onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter user name"
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
            <div className="space-y-2">
              <Label htmlFor="edit-role">Role</Label>
              <select
                id="edit-role"
                value={editForm.role}
                onChange={(e) => setEditForm(prev => ({ ...prev, role: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white"
                disabled={selectedUser?.role === 'admin'}
              >
                <option value="customer">Customer</option>
                <option value="staff">Staff</option>
                <option value="accountant">Accountant</option>
                {/* Admin option is never shown for changing roles */}
                {selectedUser?.role === 'admin' && (
                  <option value="admin">Admin</option>
                )}
              </select>
              {selectedUser?.role === 'admin' && (
                <p className="text-xs text-gray-500 mt-1">
                  <Shield className="h-3 w-3 inline mr-1" />
                  Admin role cannot be changed
                </p>
              )}
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
                onClick={handleUpdateUser}
                disabled={editLoading}
                className="bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white"
              >
                {editLoading ? "Updating..." : "Update User"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        open={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={confirmDeleteUser}
        title="Delete User"
        description={`Are you sure you want to delete user "${selectedUser?.name}"? This action cannot be undone and will permanently remove all user data.`}
        confirmText="Delete User"
        cancelText="Cancel"
        type="danger"
        loading={deleteLoading}
      />

      {/* Update Confirmation Dialog */}
      <ConfirmationDialog
        open={showUpdateConfirm}
        onClose={() => setShowUpdateConfirm(false)}
        onConfirm={confirmUpdateUser}
        title="Update User"
        description={`Are you sure you want to update the details for user "${editForm.name}"? The changes will be applied immediately.`}
        confirmText="Update User"
        cancelText="Cancel"
        type="info"
        loading={editLoading}
      />
    </>
  )
}
