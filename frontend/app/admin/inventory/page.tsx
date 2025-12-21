"use client"

import { useState } from "react"
// import { InventoryStats } from "@/components/inventory-stats"
// import { InventoryProductTable } from "@/components/inventory-product-table"
// import { InventoryAddProduct } from "@/components/inventory-add-product"
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
  quantity: number
  status: string
  lastUpdated: string
}

export default function InventoryPage() {
  const [showAddProduct, setShowAddProduct] = useState(false)
  const [goldRate] = useState(6850) // NPR per tola
  const [lastSync] = useState("2 minutes ago")

  const handleSaveProduct = (product: any) => {
    console.log('Saving product:', product)
    setShowAddProduct(false)
    // Here you would save to your backend
  }

  const handleEditProduct = (product: any) => {
    console.log('Editing product:', product)
  }

  const handleDeleteProduct = (productId: string) => {
    console.log('Deleting product:', productId)
  }

  const handleViewProduct = (product: any) => {
    console.log('Viewing product:', product)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 luxury-gradient rounded-xl animate-glow">
              <Package className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Inventory Management</h1>
              <p className="text-sm text-gray-600">Manage your jewelry collection and stock levels</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Gold Rate Display */}
          <div className="glass-card px-4 py-2 rounded-lg animate-float">
            <div className="flex items-center gap-2">
              <Gem className="h-4 w-4 text-orange-600" />
              <span className="text-sm font-medium">Gold Rate</span>
              <Badge variant="secondary" className="luxury-gradient text-white">
                NPR {goldRate.toLocaleString()}/tola
              </Badge>
            </div>
          </div>

          {/* Last Sync */}
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock className="h-4 w-4" />
            <span>Last sync: {lastSync}</span>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button variant="outline" className="hover:bg-orange-50">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" className="hover:bg-orange-50">
              <Upload className="h-4 w-4 mr-2" />
              Import
            </Button>
            <Button
              onClick={() => setShowAddProduct(true)}
              className="luxury-gradient hover:shadow-lg"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      {showAddProduct ? (
        <div>Add Product Form Coming Soon</div>
      ) : (
        <>
          {/* Stats Section */}
          {/* <InventoryStats /> */}
          
          <div className="glass-card rounded-xl p-6 animate-slide-in-up">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Product Inventory</h2>
                <p className="text-sm text-gray-600 mt-1">Track and manage all your jewelry pieces</p>
              </div>
              <div className="flex items-center gap-4">
                <Badge variant="secondary" className="px-3 py-1">
                  Total: 1,247 items
                </Badge>
                <Badge variant="destructive" className="px-3 py-1">
                  Low Stock: 23 items
                </Badge>
              </div>
            </div>
            <p>Product table will be here</p>
            {/* <InventoryProductTable 
              onEditProduct={handleEditProduct}
              onDeleteProduct={handleDeleteProduct}
              onViewProduct={handleViewProduct}
            /> */}
          </div>
        </>
      )}
      </div>
    </div>
  )
}
