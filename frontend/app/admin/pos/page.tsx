"use client"

import { useState } from "react"
import { POSProductGrid } from "@/components/pos-product-grid"
import { POSCart } from "@/components/pos-cart"
import { POSCustomerSelector } from "@/components/pos-customer-selector"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Crown, Gem, ArrowLeft, Clock, TrendingUp, ShoppingCart } from "lucide-react"
import Link from "next/link"

export default function POSPage() {
  const [selectedProducts, setSelectedProducts] = useState<any[]>([])
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null)
  const [goldRate] = useState(6850) // NPR per tola

  const handleAddToCart = (product: any) => {
    setSelectedProducts(prev => {
      const existing = prev.find(p => p.id === product.id)
      if (existing) {
        return prev.map(p => 
          p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p
        )
      }
      return [...prev, { ...product, quantity: 1 }]
    })
  }

  const handleUpdateCart = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      setSelectedProducts(prev => prev.filter(p => p.id !== productId))
    } else {
      setSelectedProducts(prev => 
        prev.map(p => p.id === productId ? { ...p, quantity } : p)
      )
    }
  }

  const handleRemoveItem = (productId: string) => {
    setSelectedProducts(prev => prev.filter(p => p.id !== productId))
  }

  const handleSelectCustomer = (customer: any) => {
    setSelectedCustomer(customer)
  }

  const handleCheckout = () => {
    console.log('Processing checkout:', { selectedProducts, selectedCustomer })
    // Handle checkout logic
  }

  return (
    <div className="space-y-6">
      {/* Gold Rate Display */}
      <div className="flex justify-end">
        <div className="glass-card px-4 py-2 rounded-lg animate-float">
          <div className="flex items-center gap-2">
            <Gem className="h-4 w-4 text-orange-600" />
            <span className="text-sm font-medium">Gold Rate</span>
            <Badge variant="secondary" className="luxury-gradient text-white">
              NPR {goldRate.toLocaleString()}/tola
            </Badge>
            <TrendingUp className="h-3 w-3 text-green-600" />
          </div>
        </div>
      </div>

      {/* Customer Selection */}
      <POSCustomerSelector 
        selectedCustomer={selectedCustomer}
        onSelectCustomer={handleSelectCustomer}
      />

      {/* Main POS Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Product Grid */}
        <div className="lg:col-span-2">
          <POSProductGrid onAddToCart={handleAddToCart} />
        </div>

        {/* Cart */}
        <div className="lg:col-span-1">
          <POSCart 
            items={selectedProducts}
            onUpdateQuantity={handleUpdateCart}
            onRemoveItem={handleRemoveItem}
            onCheckout={handleCheckout}
          />
        </div>
      </div>
    </div>
  )
}
