"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { InventoryStats } from "@/components/inventory-stats"
import { InventoryProductTable } from "@/components/inventory-product-table"
import { RawMetalStockTable } from "@/components/raw-metal-stock-table"
import { AdminLayout } from "@/components/admin/layout/admin-layout"
import { Button } from "@/components/ui/button"
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog"
import { Package, Plus, Layers } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function InventoryPage() {
  const router = useRouter()
  const [viewProduct, setViewProduct] = useState<any>(null)
  const [deleteProductId, setDeleteProductId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)
  const [activeTab, setActiveTab] = useState("products")

  const handleEdit = (product: any) => {
    router.push(`/admin/inventory/edit/${product.id}`)
  }

  const handleEditProduct = (product: any) => {
    router.push(`/admin/inventory/edit/${product.id}`)
  }

  const handleDeleteProduct = async (productId: string) => {
    setIsDeleting(true)
    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete product')
      }

      // Close dialog and trigger refresh
      setDeleteProductId(null)
      setRefreshKey(prev => prev + 1) // Force table to refresh
    } catch (error) {
      console.error('Error deleting product:', error)
      alert('Failed to delete product')
    } finally {
      setIsDeleting(false)
    }
  }

  const handleViewProduct = (product: any) => {
    setViewProduct(product)
  }

  return (
    <div>
      <div className="w-full space-y-4 sm:space-y-6 lg:space-y-8">
        {/* Tab Navigation */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <TabsList className="grid w-full sm:w-auto grid-cols-2">
              <TabsTrigger value="products" className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                <span>Products</span>
              </TabsTrigger>
              <TabsTrigger value="raw-metals" className="flex items-center gap-2">
                <Layers className="h-4 w-4" />
                <span>Raw Metals</span>
              </TabsTrigger>
            </TabsList>

            {activeTab === "products" && (
              <Link href="/admin/inventory/add">
                <Button 
                  size="sm" 
                  className="luxury-gradient hover:shadow-lg transition-all duration-300 animate-glow whitespace-nowrap text-xs sm:text-sm"
                >
                  <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  <span className="hidden xs:inline">Add Product</span>
                  <span className="xs:hidden">Add</span>
                </Button>
              </Link>
            )}
          </div>

          {/* Products Tab */}
          <TabsContent value="products" className="space-y-4 sm:space-y-6">
            {/* Stats Section */}
            <InventoryStats />

            {/* Product Table */}
            <div className="w-full overflow-hidden rounded-lg sm:rounded-xl">
              <InventoryProductTable 
                key={refreshKey}
                onEditProduct={handleEditProduct}
                onDeleteProduct={(id) => setDeleteProductId(id)}
                onViewProduct={handleViewProduct}
              />
            </div>
          </TabsContent>

          {/* Raw Metals Tab */}
          <TabsContent value="raw-metals" className="space-y-4 sm:space-y-6">
            <RawMetalStockTable 
              onRefresh={() => setRefreshKey(prev => prev + 1)}
            />
          </TabsContent>
        </Tabs>
      </div>

      {/* View Product Dialog */}
      <Dialog open={!!viewProduct} onOpenChange={() => setViewProduct(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Product Details</DialogTitle>
            <DialogDescription>View complete product information</DialogDescription>
          </DialogHeader>
          {viewProduct && (
            <div className="space-y-4">
              {/* Product Image */}
              {viewProduct.image && (
                <div className="flex justify-center">
                  <div className="w-48 h-48 rounded-lg overflow-hidden bg-gray-100">
                    <img 
                      src={`${process.env.NEXT_PUBLIC_API_URL}/${viewProduct.image}`} 
                      alt={viewProduct.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}

              {/* Product Info Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Product Name</p>
                  <p className="mt-1 text-sm text-gray-900">{viewProduct.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">SKU</p>
                  <p className="mt-1 text-sm text-gray-900">{viewProduct.sku}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Category</p>
                  <p className="mt-1 text-sm text-gray-900 capitalize">{viewProduct.category}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Price</p>
                  <p className="mt-1 text-sm text-gray-900">₹{viewProduct.price?.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Cost</p>
                  <p className="mt-1 text-sm text-gray-900">₹{viewProduct.cost?.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Stock</p>
                  <p className="mt-1 text-sm text-gray-900">{viewProduct.stock} units</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Min Stock</p>
                  <p className="mt-1 text-sm text-gray-900">{viewProduct.minStock} units</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Metal Type</p>
                  <p className="mt-1 text-sm text-gray-900 capitalize">{viewProduct.metalType}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Purity</p>
                  <p className="mt-1 text-sm text-gray-900">{viewProduct.purity}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Weight</p>
                  <p className="mt-1 text-sm text-gray-900">{viewProduct.weight}g</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Status</p>
                  <Badge 
                    variant={viewProduct.status === 'in-stock' ? 'default' : viewProduct.status === 'low-stock' ? 'secondary' : 'destructive'} 
                    className="mt-1"
                  >
                    {viewProduct.status}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Featured</p>
                  <p className="mt-1 text-sm text-gray-900">{viewProduct.featured ? 'Yes' : 'No'}</p>
                </div>
              </div>

              {/* Description */}
              {viewProduct.description && (
                <div>
                  <p className="text-sm font-medium text-gray-500">Description</p>
                  <p className="mt-1 text-sm text-gray-900">{viewProduct.description}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        open={!!deleteProductId}
        onClose={() => setDeleteProductId(null)}
        onConfirm={() => deleteProductId && handleDeleteProduct(deleteProductId)}
        title="Delete Product"
        description="Are you sure you want to delete this product? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
        loading={isDeleting}
      />
    </div>
  )
}
