"use client"

import { useState } from "react"
import { InventoryStats } from "@/components/inventory-stats"
import { InventoryProductTable } from "@/components/inventory-product-table"
import { InventoryAddProduct } from "@/components/inventory-add-product"
import { SimpleProtectedRoute } from "@/components/admin/shared/simple-protected-route"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Package, Plus, ArrowLeft, Download, Upload, Gem, Clock } from "lucide-react"
import Link from "next/link"

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

export default function InventoryPage() {
  const [showAddProduct, setShowAddProduct] = useState(false)
  const [goldRate] = useState(6850)

  const handleEditProduct = (product: Product) => {
    console.log("Edit product:", product)
    // Handle edit product logic
  }

  const handleDeleteProduct = (productId: string) => {
    console.log("Delete product:", productId)
    // Handle delete product logic
  }

  const handleViewProduct = (product: Product) => {
    console.log("View product:", product)
    // Handle view product logic
  }

  const handleSaveProduct = (productData: any) => {
    console.log("Save product:", productData)
    // Handle save product logic
    setShowAddProduct(false)
    alert("Product saved successfully!")
  }

  const currentTime = new Date().toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  })

  return (
    <SimpleProtectedRoute allowedRoles={["admin", "staff"]}>
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50">
      {/* Header */}
      <header className="glass-card border-b border-orange-200/50 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 animate-slide-in-up">
              <Link href="/">
                <Button variant="ghost" size="sm" className="hover:bg-orange-50">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              </Link>
              <div className="flex items-center gap-3">
                <div className="p-2 luxury-gradient rounded-xl animate-glow">
                  <Package className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Inventory Management</h1>
                  <p className="text-sm text-gray-600">Manage your jewelry collection</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="glass-card px-3 py-2 rounded-lg animate-float">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-orange-600" />
                  <span className="text-sm font-medium">{currentTime}</span>
                </div>
              </div>
              <div className="glass-card px-3 py-2 rounded-lg animate-float">
                <div className="flex items-center gap-2">
                  <Gem className="h-4 w-4 text-orange-600" />
                  <span className="text-sm font-medium">Gold Rate</span>
                  <Badge variant="secondary" className="luxury-gradient text-white">
                    NPR {goldRate.toLocaleString()}/tola
                  </Badge>
                </div>
              </div>

              {!showAddProduct && (
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="hover:bg-orange-50 bg-transparent">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                  <Button variant="outline" size="sm" className="hover:bg-orange-50 bg-transparent">
                    <Upload className="h-4 w-4 mr-2" />
                    Import
                  </Button>
                  <Button
                    onClick={() => setShowAddProduct(true)}
                    className="luxury-gradient hover:shadow-lg transition-all duration-300 animate-glow"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Product
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8 space-y-8">
        {showAddProduct ? (
          <InventoryAddProduct onSave={handleSaveProduct} onCancel={() => setShowAddProduct(false)} />
        ) : (
          <>
            {/* Stats */}
            <section>
              <InventoryStats />
            </section>

            {/* Product Table */}
            <section>
              <InventoryProductTable
                onEditProduct={handleEditProduct}
                onDeleteProduct={handleDeleteProduct}
                onViewProduct={handleViewProduct}
              />
            </section>
          </>
        )}
      </main>
      </div>
    </SimpleProtectedRoute>
  )
}
