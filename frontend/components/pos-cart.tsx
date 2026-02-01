"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { ShoppingCart, Minus, Plus, Trash2, CreditCard, Banknote, Smartphone } from "lucide-react"

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  weight?: string
  purity?: string
  image: string
}

interface POSCartProps {
  items: CartItem[]
  onUpdateQuantity: (id: string, quantity: number) => void
  onRemoveItem: (id: string) => void
  onCheckout: (paymentMethod: string, amountPaid: number) => void
}

export function POSCart({ items, onUpdateQuantity, onRemoveItem, onCheckout }: POSCartProps) {
  const [paymentMethod, setPaymentMethod] = useState("cash")
  const [amountPaid, setAmountPaid] = useState("")
  const [discount, setDiscount] = useState(0)

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const discountAmount = (subtotal * discount) / 100
  const tax = (subtotal - discountAmount) * 0.13 // 13% VAT
  const total = subtotal - discountAmount + tax
  const change = Number.parseFloat(amountPaid) - total

  const paymentMethods = [
    { id: "cash", name: "Cash", icon: Banknote },
    { id: "card", name: "Card", icon: CreditCard },
    { id: "digital", name: "Digital", icon: Smartphone },
  ]

  const handleCheckout = () => {
    if (Number.parseFloat(amountPaid) >= total) {
      onCheckout(paymentMethod, Number.parseFloat(amountPaid))
    }
  }

  return (
    <Card className="glass-card h-full flex flex-col animate-slide-in-up">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2">
          <ShoppingCart className="h-5 w-5 text-orange-600" />
          Shopping Cart
          {items.length > 0 && <Badge className="luxury-gradient text-white animate-float">{items.length}</Badge>}
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col">
        {items.length === 0 ? (
          <div className="flex-1 flex items-center justify-center text-center animate-fade-in-scale">
            <div>
              <ShoppingCart className="h-16 w-16 text-gray-400 mx-auto mb-4 animate-float" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Cart is empty</h3>
              <p className="text-gray-600">Add products to start a sale</p>
            </div>
          </div>
        ) : (
          <>
            {/* Cart Items */}
            <div className="flex-1 space-y-3 mb-6 overflow-y-auto">
              {items.map((item, index) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-orange-50/50 transition-colors animate-slide-in-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 gold-shimmer">
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm text-gray-900 truncate">{item.name}</h4>
                    <p className="text-xs text-gray-600">
                      {item.weight} • {item.purity}
                    </p>
                    <p className="text-sm font-semibold text-orange-600">NPR {item.price.toLocaleString()}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                      className="h-8 w-8 p-0 hover:bg-orange-50"
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                      className="h-8 w-8 p-0 hover:bg-orange-50"
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onRemoveItem(item.id)}
                      className="h-8 w-8 p-0 text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Discount */}
            <div className="space-y-3 mb-4">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700">Discount (%)</label>
                <Input
                  type="number"
                  value={discount}
                  onChange={(e) => setDiscount(Math.max(0, Math.min(100, Number.parseFloat(e.target.value) || 0)))}
                  className="w-20 h-8 text-center"
                  min="0"
                  max="100"
                />
              </div>
            </div>

            {/* Totals */}
            <div className="space-y-2 mb-6 animate-fade-in-scale">
              <div className="flex justify-between text-sm">
                <span>Subtotal:</span>
                <span>NPR {subtotal.toLocaleString()}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Discount ({discount}%):</span>
                  <span>-NPR {discountAmount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span>Tax (13%):</span>
                <span>NPR {tax.toLocaleString()}</span>
              </div>
              <Separator />
              <div className="flex justify-between text-lg font-bold">
                <span>Total:</span>
                <span className="text-orange-600">NPR {total.toLocaleString()}</span>
              </div>
            </div>

            {/* Payment Method */}
            <div className="space-y-3 mb-4">
              <label className="text-sm font-medium text-gray-700">Payment Method</label>
              <div className="grid grid-cols-3 gap-2">
                {paymentMethods.map((method) => {
                  const Icon = method.icon
                  return (
                    <Button
                      key={method.id}
                      variant={paymentMethod === method.id ? "default" : "outline"}
                      size="sm"
                      onClick={() => setPaymentMethod(method.id)}
                      className={`flex flex-col gap-1 h-16 transition-all duration-300 ${
                        paymentMethod === method.id
                          ? "luxury-gradient text-white shadow-lg animate-glow"
                          : "hover:bg-orange-50 bg-transparent"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span className="text-xs">{method.name}</span>
                    </Button>
                  )
                })}
              </div>
            </div>

            {/* Amount Paid */}
            <div className="space-y-3 mb-4">
              <label className="text-sm font-medium text-gray-700">Amount Paid</label>
              <Input
                type="number"
                value={amountPaid}
                onChange={(e) => setAmountPaid(e.target.value)}
                placeholder="Enter amount"
                className="text-lg font-semibold text-center"
              />
              {change >= 0 && amountPaid && (
                <div className="text-center">
                  <span className="text-sm text-gray-600">Change: </span>
                  <span className="text-lg font-bold text-green-600">NPR {change.toLocaleString()}</span>
                </div>
              )}
            </div>

            {/* Checkout Button */}
            <Button
              onClick={handleCheckout}
              disabled={!amountPaid || Number.parseFloat(amountPaid) < total}
              className="w-full h-12 text-lg luxury-gradient hover:shadow-lg transition-all duration-300 animate-glow"
            >
              Complete Sale
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  )
}
