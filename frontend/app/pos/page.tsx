"use client"

import { useState } from "react"
import { POSProductGrid } from "@/components/pos-product-grid"
import { POSCart } from "@/components/pos-cart"
import { POSCustomerSelector } from "@/components/pos-customer-selector"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Crown, Gem, ArrowLeft, Clock, TrendingUp } from "lucide-react"
import Link from "next/link"

interface Product {
  id: string
  name: string
  price: number
  category: string
  weight?: string
  purity?: string
  image: string
  inStock: boolean
  featured?: boolean
}

interface CartItem extends Product {
  quantity: number
}

interface Customer {
  id: string
  name: string
  phone: string
  email: string
  totalPurchases: number
  loyaltyPoints: number
  isVIP: boolean
}

export default function POSSystem() {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [goldRate] = useState(6850)

  const addToCart = (product: Product) => {
    setCartItems((prev) => {
      const existingItem = prev.find((item) => item.id === product.id)
      if (existingItem) {
        return prev.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item))
      }
      return [...prev, { ...product, quantity: 1 }]
    })
  }

  const updateQuantity = (id: string, quantity: number) => {
    setCartItems((prev) => prev.map((item) => (item.id === id ? { ...item, quantity } : item)))
  }

  const removeItem = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id))
  }

  const handleCheckout = (paymentMethod: string, amountPaid: number) => {
    // Handle checkout logic here
    console.log("Checkout:", { cartItems, selectedCustomer, paymentMethod, amountPaid })
    // Reset cart after successful checkout
    setCartItems([])
    setSelectedCustomer(null)
    alert("Sale completed successfully!")
  }

  const currentTime = new Date().toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  })

  return (
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
                  <Crown className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">POS System</h1>
                  <p className="text-sm text-gray-600">Point of Sale Terminal</p>
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
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-140px)]">
          {/* Product Grid */}
          <div className="lg:col-span-2 overflow-y-auto">
            <POSProductGrid onAddToCart={addToCart} />
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-2 space-y-6">
            {/* Customer Selector */}
            <POSCustomerSelector selectedCustomer={selectedCustomer} onSelectCustomer={setSelectedCustomer} />

            {/* Cart */}
            <div className="flex-1">
              <POSCart
                items={cartItems}
                onUpdateQuantity={updateQuantity}
                onRemoveItem={removeItem}
                onCheckout={handleCheckout}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats Footer */}
      <div className="fixed bottom-0 left-0 right-0 glass-card border-t border-orange-200/50 p-4">
        <div className="container mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="text-center animate-fade-in-scale">
                <p className="text-xs text-gray-600">Today's Sales</p>
                <p className="font-bold text-orange-600">NPR 2,45,000</p>
              </div>
              <div className="text-center animate-fade-in-scale" style={{ animationDelay: "0.1s" }}>
                <p className="text-xs text-gray-600">Transactions</p>
                <p className="font-bold text-orange-600">47</p>
              </div>
              <div className="text-center animate-fade-in-scale" style={{ animationDelay: "0.2s" }}>
                <p className="text-xs text-gray-600">Avg. Sale</p>
                <p className="font-bold text-orange-600">NPR 52,128</p>
              </div>
            </div>
            <div className="flex items-center gap-2 animate-fade-in-scale">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <span className="text-sm text-green-600 font-medium">+15.2% vs yesterday</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
