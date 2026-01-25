"use client"

import { useState, useEffect } from "react"
import { AdminLayout } from "@/components/admin/layout/admin-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Star, Check, X, Trash2, Search, Filter, Eye, RotateCcw, ChevronLeft, ChevronRight } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"

interface Review {
  id: number
  userId: string
  name: string
  location: string
  rating: number
  comment: string
  status: 'pending' | 'approved' | 'rejected'
  createdAt: string
  updatedAt: string
  user?: {
    id: string
    name: string
    email: string
  }
}

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedReview, setSelectedReview] = useState<Review | null>(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showViewDialog, setShowViewDialog] = useState(false)
  const [showApproveDialog, setShowApproveDialog] = useState(false)
  const [showRejectDialog, setShowRejectDialog] = useState(false)
  const [showResetDialog, setShowResetDialog] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const { user } = useAuth()

  // Fetch reviews from backend
  const fetchReviews = async () => {
    try {
      setLoading(true)
      const url = statusFilter === "all" 
        ? `${process.env.NEXT_PUBLIC_API_URL}/reviews/admin/all`
        : `${process.env.NEXT_PUBLIC_API_URL}/reviews/admin/all?status=${statusFilter}`
      
      const response = await fetch(url, {
        credentials: 'include',
      })

      if (response.ok) {
        const data = await response.json()
        setReviews(data)
      } else {
        console.error('Failed to fetch reviews')
      }
    } catch (error) {
      console.error('Error fetching reviews:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchReviews()
  }, [statusFilter])

  // Update review status
  const updateReviewStatus = async (reviewId: number, newStatus: 'pending' | 'approved' | 'rejected') => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/reviews/admin/${reviewId}/status`,
        {
          method: 'PATCH',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ status: newStatus }),
        }
      )

      if (response.ok) {
        fetchReviews() // Refresh the list
      } else {
        console.error('Failed to update review status')
      }
    } catch (error) {
      console.error('Error updating review status:', error)
    }
  }

  // Delete review
  const deleteReview = async (reviewId: number) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/reviews/admin/${reviewId}`,
        {
          method: 'DELETE',
          credentials: 'include',
        }
      )

      if (response.ok) {
        fetchReviews() // Refresh the list
        setShowDeleteDialog(false)
        setSelectedReview(null)
      } else {
        console.error('Failed to delete review')
      }
    } catch (error) {
      console.error('Error deleting review:', error)
    }
  }

  // Filter reviews by search query
  const filteredReviews = reviews.filter(review => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    return (
      review.name.toLowerCase().includes(query) ||
      review.location.toLowerCase().includes(query) ||
      review.comment.toLowerCase().includes(query) ||
      review.user?.email.toLowerCase().includes(query)
    )
  })

  // Pagination
  const totalPages = Math.ceil(filteredReviews.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentReviews = filteredReviews.slice(startIndex, endIndex)

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [statusFilter, searchQuery])

  // Render star rating
  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating
                ? 'text-yellow-500 fill-current'
                : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    )
  }

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Review Management</h1>
          <p className="text-gray-600 mt-2">
            Manage customer reviews and ratings
          </p>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search by name, location, email, or comment..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Reviews</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Reviews Table */}
        <Card>
          <CardHeader>
            <CardTitle>Reviews</CardTitle>
            <CardDescription>
              Total: {filteredReviews.length} review(s)
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
                <p className="mt-4 text-gray-600">Loading reviews...</p>
              </div>
            ) : filteredReviews.length === 0 ? (
              <div className="text-center py-12">
                <Star className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                <p className="text-gray-600">No reviews found</p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Customer</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Rating</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {currentReviews.map((review) => (
                      <TableRow key={review.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{review.name}</p>
                            {review.user && (
                              <p className="text-sm text-gray-500">{review.user.email}</p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{review.location}</TableCell>
                        <TableCell>{renderStars(review.rating)}</TableCell>
                        <TableCell>{getStatusBadge(review.status)}</TableCell>
                        <TableCell>
                          {new Date(review.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                setSelectedReview(review)
                                setShowViewDialog(true)
                              }}
                              title="View Details"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            {review.status === 'pending' && (
                              <>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="text-green-600 hover:text-green-700 hover:bg-green-50"
                                  onClick={() => {
                                    setSelectedReview(review)
                                    setShowApproveDialog(true)
                                  }}
                                  title="Approve"
                                >
                                  <Check className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                  onClick={() => {
                                    setSelectedReview(review)
                                    setShowRejectDialog(true)
                                  }}
                                  title="Reject"
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </>
                            )}
                            {review.status !== 'pending' && (
                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50"
                                onClick={() => {
                                  setSelectedReview(review)
                                  setShowResetDialog(true)
                                }}
                                title="Reset to Pending"
                              >
                                <RotateCcw className="h-4 w-4" />
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              onClick={() => {
                                setSelectedReview(review)
                                setShowDeleteDialog(true)
                              }}
                              title="Delete"
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

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4 pt-4 border-t">
                  <div className="text-sm text-gray-500">
                    Showing {startIndex + 1} to {Math.min(endIndex, filteredReviews.length)} of {filteredReviews.length} reviews
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4 mr-1" />
                      Previous
                    </Button>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                        let pageNum;
                        if (totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (currentPage <= 3) {
                          pageNum = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                          pageNum = totalPages - 4 + i;
                        } else {
                          pageNum = currentPage - 2 + i;
                        }
                        return (
                          <Button
                            key={pageNum}
                            variant={currentPage === pageNum ? "default" : "outline"}
                            size="sm"
                            onClick={() => setCurrentPage(pageNum)}
                            className={currentPage === pageNum ? "bg-orange-600 hover:bg-orange-700" : ""}
                          >
                            {pageNum}
                          </Button>
                        );
                      })}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                    >
                      Next
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </div>
              )}
            </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* View Review Dialog */}
      <AlertDialog open={showViewDialog} onOpenChange={setShowViewDialog}>
        <AlertDialogContent className="max-w-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 text-orange-600" />
              Review Details
            </AlertDialogTitle>
          </AlertDialogHeader>
          {selectedReview && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Customer Name</p>
                  <p className="text-base font-semibold">{selectedReview.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Location</p>
                  <p className="text-base">{selectedReview.location}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Rating</p>
                  <div className="mt-1">{renderStars(selectedReview.rating)}</div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Status</p>
                  <div className="mt-1">{getStatusBadge(selectedReview.status)}</div>
                </div>
                {selectedReview.user && (
                  <div className="col-span-2">
                    <p className="text-sm font-medium text-gray-500">Email</p>
                    <p className="text-base">{selectedReview.user.email}</p>
                  </div>
                )}
                <div className="col-span-2">
                  <p className="text-sm font-medium text-gray-500">Date Submitted</p>
                  <p className="text-base">
                    {new Date(selectedReview.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 mb-2">Review Comment</p>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <p className="text-gray-800">{selectedReview.comment}</p>
                </div>
              </div>
            </div>
          )}
          <AlertDialogFooter>
            <AlertDialogCancel>Close</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Review</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this review? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setSelectedReview(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => selectedReview && deleteReview(selectedReview.id)}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Approve Confirmation Dialog */}
      <AlertDialog open={showApproveDialog} onOpenChange={setShowApproveDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <Check className="h-5 w-5 text-green-600" />
              Approve Review
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to approve this review? It will be visible on the website.
            </AlertDialogDescription>
          </AlertDialogHeader>
          {selectedReview && (
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-2">
              <p className="text-sm">
                <span className="font-semibold">Customer:</span> {selectedReview.name}
              </p>
              <p className="text-sm">
                <span className="font-semibold">Rating:</span> {selectedReview.rating}/5 stars
              </p>
              <p className="text-sm text-gray-600 italic">"{selectedReview.comment}"</p>
            </div>
          )}
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setSelectedReview(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (selectedReview) {
                  updateReviewStatus(selectedReview.id, 'approved')
                  setShowApproveDialog(false)
                  setSelectedReview(null)
                }
              }}
              className="bg-green-600 hover:bg-green-700"
            >
              Approve Review
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Reject Confirmation Dialog */}
      <AlertDialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <X className="h-5 w-5 text-red-600" />
              Reject Review
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to reject this review? It will not be visible on the website.
            </AlertDialogDescription>
          </AlertDialogHeader>
          {selectedReview && (
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-2">
              <p className="text-sm">
                <span className="font-semibold">Customer:</span> {selectedReview.name}
              </p>
              <p className="text-sm">
                <span className="font-semibold">Rating:</span> {selectedReview.rating}/5 stars
              </p>
              <p className="text-sm text-gray-600 italic">"{selectedReview.comment}"</p>
            </div>
          )}
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setSelectedReview(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (selectedReview) {
                  updateReviewStatus(selectedReview.id, 'rejected')
                  setShowRejectDialog(false)
                  setSelectedReview(null)
                }
              }}
              className="bg-red-600 hover:bg-red-700"
            >
              Reject Review
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Reset Confirmation Dialog */}
      <AlertDialog open={showResetDialog} onOpenChange={setShowResetDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <RotateCcw className="h-5 w-5 text-yellow-600" />
              Reset to Pending
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to reset this review to pending status? You will need to approve or reject it again.
            </AlertDialogDescription>
          </AlertDialogHeader>
          {selectedReview && (
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-2">
              <p className="text-sm">
                <span className="font-semibold">Customer:</span> {selectedReview.name}
              </p>
              <p className="text-sm">
                <span className="font-semibold">Current Status:</span>{" "}
                <span className={`font-semibold ${selectedReview.status === 'approved' ? 'text-green-600' : 'text-red-600'}`}>
                  {selectedReview.status.charAt(0).toUpperCase() + selectedReview.status.slice(1)}
                </span>
              </p>
            </div>
          )}
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setSelectedReview(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (selectedReview) {
                  updateReviewStatus(selectedReview.id, 'pending')
                  setShowResetDialog(false)
                  setSelectedReview(null)
                }
              }}
              className="bg-yellow-600 hover:bg-yellow-700"
            >
              Reset to Pending
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
