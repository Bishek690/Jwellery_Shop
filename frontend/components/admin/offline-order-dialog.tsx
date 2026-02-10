"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Loader2, Plus, Trash2, Search, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Product {
  id: number
  name: string
  sku: string
  category: string
  price: number
  discountPrice?: number
  weight: number
  metalType: string
  purity: string
  image?: string
  stock: number
}

interface OrderItem extends Product {
  quantity: number
  totalPrice: number
}

interface OfflineOrderDialogProps {
  open: boolean
  onClose: () => void
  onSuccess?: () => void
}

export function OfflineOrderDialog({ open, onClose, onSuccess }: OfflineOrderDialogProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [searchingProducts, setSearchingProducts] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [products, setProducts] = useState<Product[]>([])
  const [selectedItems, setSelectedItems] = useState<OrderItem[]>([])
  const [showManualEntry, setShowManualEntry] = useState(false)
  const [showCustomMetalType, setShowCustomMetalType] = useState(false)
  const [showCustomPurity, setShowCustomPurity] = useState(false)
  const [manualProduct, setManualProduct] = useState({
    name: "",
    sku: "",
    category: "",
    price: "",
    weight: "",
    metalType: "",
    purity: "",
    quantity: "1",
  })
  
  const [formData, setFormData] = useState({
    // Customer Info
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    
    // Shipping Info
    shippingName: "",
    shippingPhone: "",
    shippingEmail: "",
    shippingAddress: "",
    shippingCity: "",
    shippingState: "",
    shippingZipCode: "",
    
    // Order Info
    paymentMethod: "cash",
    paymentStatus: "pending",
    orderStatus: "confirmed",
    shippingCost: "0",
    notes: "",
  })

  useEffect(() => {
    if (open) {
      // Reset form when dialog opens
      setFormData({
        customerName: "",
        customerEmail: "",
        customerPhone: "",
        shippingName: "",
        shippingPhone: "",
        shippingEmail: "",
        shippingAddress: "",
        shippingCity: "",
        shippingState: "",
        shippingZipCode: "",
        paymentMethod: "cod",
        paymentStatus: "pending",
        orderStatus: "confirmed",
        shippingCost: "0",
        notes: "",
      })
      setSelectedItems([])
      setSearchQuery("")
      setProducts([])
    }
  }, [open])

  const searchProducts = async (query: string) => {
    if (!query.trim()) {
      setProducts([])
      return
    }

    setSearchingProducts(true)
    try {
      const response = await fetch(`/api/products?search=${encodeURIComponent(query)}&limit=10`, {
        credentials: "include",
      })
      if (response.ok) {
        const data = await response.json()
        setProducts(data.products || [])
      }
    } catch (error) {
      console.error("Error searching products:", error)
    } finally {
      setSearchingProducts(false)
    }
  }

  const addProductToOrder = (product: Product) => {
    const existingItem = selectedItems.find(item => item.id === product.id)
    if (existingItem) {
      updateQuantity(product.id, existingItem.quantity + 1)
    } else {
      const newItem: OrderItem = {
        ...product,
        quantity: 1,
        totalPrice: product.discountPrice || product.price,
      }
      setSelectedItems([...selectedItems, newItem])
    }
    setSearchQuery("")
    setProducts([])
  }

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity < 1) {
      removeProduct(productId)
      return
    }

    setSelectedItems(
      selectedItems.map(item =>
        item.id === productId
          ? {
              ...item,
              quantity,
              totalPrice: (item.discountPrice || item.price) * quantity,
            }
          : item
      )
    )
  }

  const removeProduct = (productId: number) => {
    setSelectedItems(selectedItems.filter(item => item.id !== productId))
  }

  const addManualProduct = () => {
    if (!manualProduct.name || !manualProduct.price) {
      toast({
        title: "Error",
        description: "Please enter at least product name and price",
        variant: "destructive",
      })
      return
    }

    const newItem: OrderItem = {
      id: Date.now(), // Temporary ID for manual products
      name: manualProduct.name,
      sku: manualProduct.sku || `CUSTOM-${Date.now()}`,
      category: manualProduct.category || "Custom",
      price: parseFloat(manualProduct.price),
      discountPrice: undefined,
      weight: parseFloat(manualProduct.weight) || 0,
      metalType: manualProduct.metalType || "Custom",
      purity: manualProduct.purity || "N/A",
      image: undefined,
      stock: 999,
      quantity: parseInt(manualProduct.quantity) || 1,
      totalPrice: parseFloat(manualProduct.price) * (parseInt(manualProduct.quantity) || 1),
    }

    setSelectedItems([...selectedItems, newItem])
    setManualProduct({
      name: "",
      sku: "",
      category: "",
      price: "",
      weight: "",
      metalType: "",
      purity: "",
      quantity: "1",
    })
    setShowManualEntry(false)
    setShowCustomMetalType(false)
    setShowCustomPurity(false)
    toast({
      title: "Success",
      description: "Custom product added to order",
    })
  }

  const calculateSubtotal = () => {
    return selectedItems.reduce((sum, item) => sum + item.totalPrice, 0)
  }

  const calculateTotal = () => {
    return calculateSubtotal() + parseFloat(formData.shippingCost || "0")
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-NP", {
      style: "currency",
      currency: "NPR",
      maximumFractionDigits: 0,
    }).format(price)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    if (!formData.customerName || !formData.customerEmail || !formData.customerPhone) {
      toast({
        title: "Error",
        description: "Please fill in all customer information",
        variant: "destructive",
      })
      return
    }

    if (selectedItems.length === 0) {
      toast({
        title: "Error",
        description: "Please add at least one product to the order",
        variant: "destructive",
      })
      return
    }

    if (!formData.shippingName || !formData.shippingPhone || !formData.shippingAddress || !formData.shippingCity) {
      toast({
        title: "Error",
        description: "Please fill in all shipping information",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      const orderData = {
        customerInfo: {
          name: formData.customerName,
          email: formData.customerEmail,
          phone: formData.customerPhone,
        },
        items: selectedItems.map(item => ({
          id: item.id,
          name: item.name,
          sku: item.sku,
          category: item.category,
          price: item.price,
          discountPrice: item.discountPrice,
          weight: item.weight,
          metalType: item.metalType,
          purity: item.purity,
          image: item.image,
          quantity: item.quantity,
        })),
        subtotal: calculateSubtotal(),
        shippingCost: parseFloat(formData.shippingCost),
        totalAmount: calculateTotal(),
        paymentMethod: formData.paymentMethod,
        paymentStatus: formData.paymentStatus,
        status: formData.orderStatus,
        shippingInfo: {
          fullName: formData.shippingName,
          phone: formData.shippingPhone,
          email: formData.shippingEmail,
          address: formData.shippingAddress,
          city: formData.shippingCity,
          state: formData.shippingState,
          zipCode: formData.shippingZipCode,
        },
        notes: formData.notes,
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/admin/offline`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(orderData),
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Success",
          description: "Offline order created successfully",
        })
        onClose()
        if (onSuccess) {
          onSuccess()
        }
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to create offline order",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error creating offline order:", error)
      toast({
        title: "Error",
        description: "An error occurred while creating the order",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Create Offline Order</DialogTitle>
          <DialogDescription>
            Create an order for walk-in customers or phone orders
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Customer Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Customer Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="customerName">Full Name *</Label>
                <Input
                  id="customerName"
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  placeholder="John Doe"
                  required
                />
              </div>
              <div>
                <Label htmlFor="customerEmail">Email *</Label>
                <Input
                  id="customerEmail"
                  type="email"
                  value={formData.customerEmail}
                  onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                  placeholder="john@example.com"
                  required
                />
              </div>
              <div>
                <Label htmlFor="customerPhone">Phone *</Label>
                <Input
                  id="customerPhone"
                  value={formData.customerPhone}
                  onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                  placeholder="+977 9800000000"
                  required
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Products */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Order Items</h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowManualEntry(!showManualEntry)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Custom Item
              </Button>
            </div>
            
            {/* Manual Product Entry */}
            {showManualEntry && (
              <div className="border rounded-lg p-4 space-y-3 bg-gray-50">
                <h4 className="font-medium text-sm">Add Custom Product</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="manualName" className="text-xs">Product Name *</Label>
                    <Input
                      id="manualName"
                      value={manualProduct.name}
                      onChange={(e) => setManualProduct({ ...manualProduct, name: e.target.value })}
                      placeholder="Custom Ring"
                      className="h-9"
                    />
                  </div>
                  <div>
                    <Label htmlFor="manualSku" className="text-xs">SKU</Label>
                    <Input
                      id="manualSku"
                      value={manualProduct.sku}
                      onChange={(e) => setManualProduct({ ...manualProduct, sku: e.target.value })}
                      placeholder="AUTO-GENERATED"
                      className="h-9"
                    />
                  </div>
                  <div>
                    <Label htmlFor="manualPrice" className="text-xs">Price (NPR) *</Label>
                    <Input
                      id="manualPrice"
                      type="number"
                      step="0.01"
                      value={manualProduct.price}
                      onChange={(e) => setManualProduct({ ...manualProduct, price: e.target.value })}
                      placeholder="10000"
                      className="h-9"
                    />
                  </div>
                  <div>
                    <Label htmlFor="manualQuantity" className="text-xs">Quantity</Label>
                    <Input
                      id="manualQuantity"
                      type="number"
                      value={manualProduct.quantity}
                      onChange={(e) => setManualProduct({ ...manualProduct, quantity: e.target.value })}
                      placeholder="1"
                      className="h-9"
                    />
                  </div>
                  <div>
                    <Label htmlFor="manualWeight" className="text-xs">Weight (g)</Label>
                    <Input
                      id="manualWeight"
                      type="number"
                      step="0.01"
                      value={manualProduct.weight}
                      onChange={(e) => setManualProduct({ ...manualProduct, weight: e.target.value })}
                      placeholder="5.5"
                      className="h-9"
                    />
                  </div>
                  <div>
                    <Label htmlFor="manualMetalType" className="text-xs">Metal Type</Label>
                    <Select
                      value={showCustomMetalType ? "Other" : manualProduct.metalType}
                      onValueChange={(value) => {
                        if (value === "Other") {
                          setShowCustomMetalType(true)
                          setManualProduct({ ...manualProduct, metalType: "" })
                        } else {
                          setShowCustomMetalType(false)
                          setManualProduct({ ...manualProduct, metalType: value })
                        }
                      }}
                    >
                      <SelectTrigger className="h-9">
                        <SelectValue placeholder="Select metal type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Gold">Gold</SelectItem>
                        <SelectItem value="Silver">Silver</SelectItem>
                        <SelectItem value="Platinum">Platinum</SelectItem>
                        <SelectItem value="Rose Gold">Rose Gold</SelectItem>
                        <SelectItem value="White Gold">White Gold</SelectItem>
                        <SelectItem value="Diamond">Diamond</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    {showCustomMetalType && (
                      <Input
                        value={manualProduct.metalType}
                        onChange={(e) => setManualProduct({ ...manualProduct, metalType: e.target.value })}
                        placeholder="Enter custom metal type"
                        className="h-9 mt-2"
                      />
                    )}
                  </div>
                  <div>
                    <Label htmlFor="manualPurity" className="text-xs">Purity</Label>
                    <Select
                      value={showCustomPurity ? "Other" : manualProduct.purity}
                      onValueChange={(value) => {
                        if (value === "Other") {
                          setShowCustomPurity(true)
                          setManualProduct({ ...manualProduct, purity: "" })
                        } else {
                          setShowCustomPurity(false)
                          setManualProduct({ ...manualProduct, purity: value })
                        }
                      }}
                    >
                      <SelectTrigger className="h-9">
                        <SelectValue placeholder="Select purity" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="24K">24K</SelectItem>
                        <SelectItem value="22K">22K</SelectItem>
                        <SelectItem value="18K">18K</SelectItem>
                        <SelectItem value="14K">14K</SelectItem>
                        <SelectItem value="10K">10K</SelectItem>
                        <SelectItem value=".925">Sterling Silver (.925)</SelectItem>
                        <SelectItem value=".950">Platinum (.950)</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    {showCustomPurity && (
                      <Input
                        value={manualProduct.purity}
                        onChange={(e) => setManualProduct({ ...manualProduct, purity: e.target.value })}
                        placeholder="Enter custom purity"
                        className="h-9 mt-2"
                      />
                    )}
                  </div>
                </div>
                <div className="flex gap-2 justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setShowManualEntry(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    onClick={addManualProduct}
                    className="luxury-gradient"
                  >
                    Add to Order
                  </Button>
                </div>
              </div>
            )}
            
            {/* Product Search */}
            <div className="relative">
              <Label htmlFor="productSearch">Search Products</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  id="productSearch"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value)
                    searchProducts(e.target.value)
                  }}
                  placeholder="Search by name or SKU..."
                  className="pl-10"
                />
                {searchingProducts && (
                  <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 animate-spin text-gray-400" />
                )}
              </div>

              {/* Search Results */}
              {products.length > 0 && (
                <div className="absolute z-10 w-full mt-2 bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {products.map((product) => (
                    <button
                      key={product.id}
                      type="button"
                      onClick={() => addProductToOrder(product)}
                      className="w-full p-3 hover:bg-gray-50 text-left flex items-center gap-3 border-b last:border-b-0"
                    >
                      <img
                        src={product.image ? `${process.env.NEXT_PUBLIC_BACKEND_URL}${product.image}` : "/placeholder.svg"}
                        alt={product.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{product.name}</p>
                        <p className="text-xs text-gray-500">SKU: {product.sku}</p>
                        <p className="text-sm font-semibold text-orange-600">
                          {formatPrice(product.discountPrice || product.price)}
                        </p>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        Stock: {product.stock}
                      </Badge>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Selected Items */}
            {selectedItems.length > 0 && (
              <div className="border rounded-lg p-4 space-y-3">
                {selectedItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 pb-3 border-b last:border-b-0">
                    <img
                      src={item.image ? `${process.env.NEXT_PUBLIC_BACKEND_URL}${item.image}` : "/placeholder.svg"}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">{item.name}</p>
                      <p className="text-xs text-gray-500">SKU: {item.sku}</p>
                      <p className="text-sm font-semibold text-orange-600">
                        {formatPrice(item.discountPrice || item.price)} × {item.quantity} = {formatPrice(item.totalPrice)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        -
                      </Button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        disabled={item.quantity >= item.stock}
                      >
                        +
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={() => removeProduct(item.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <Separator />

          {/* Shipping Information */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Shipping Information</h3>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => {
                  setFormData({
                    ...formData,
                    shippingName: formData.customerName,
                    shippingPhone: formData.customerPhone,
                    shippingEmail: formData.customerEmail,
                  })
                }}
              >
                Same as Customer
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="shippingName">Full Name *</Label>
                <Input
                  id="shippingName"
                  value={formData.shippingName}
                  onChange={(e) => setFormData({ ...formData, shippingName: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="shippingPhone">Phone *</Label>
                <Input
                  id="shippingPhone"
                  value={formData.shippingPhone}
                  onChange={(e) => setFormData({ ...formData, shippingPhone: e.target.value })}
                  required
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="shippingEmail">Email</Label>
                <Input
                  id="shippingEmail"
                  type="email"
                  value={formData.shippingEmail}
                  onChange={(e) => setFormData({ ...formData, shippingEmail: e.target.value })}
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="shippingAddress">Address *</Label>
                <Input
                  id="shippingAddress"
                  value={formData.shippingAddress}
                  onChange={(e) => setFormData({ ...formData, shippingAddress: e.target.value })}
                  placeholder="Street address, building, apartment"
                  required
                />
              </div>
              <div>
                <Label htmlFor="shippingCity">City *</Label>
                <Input
                  id="shippingCity"
                  value={formData.shippingCity}
                  onChange={(e) => setFormData({ ...formData, shippingCity: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="shippingState">State/Province</Label>
                <Input
                  id="shippingState"
                  value={formData.shippingState}
                  onChange={(e) => setFormData({ ...formData, shippingState: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="shippingZipCode">Zip Code</Label>
                <Input
                  id="shippingZipCode"
                  value={formData.shippingZipCode}
                  onChange={(e) => setFormData({ ...formData, shippingZipCode: e.target.value })}
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Order Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Order Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="paymentMethod">Payment Method</Label>
                <Select
                  value={formData.paymentMethod}
                  onValueChange={(value) => setFormData({ ...formData, paymentMethod: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="card">Card</SelectItem>
                    <SelectItem value="cod">Cash on Delivery</SelectItem>
                    <SelectItem value="online">Online Payment</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="paymentStatus">Payment Status</Label>
                <Select
                  value={formData.paymentStatus}
                  onValueChange={(value) => setFormData({ ...formData, paymentStatus: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="orderStatus">Order Status</Label>
                <Select
                  value={formData.orderStatus}
                  onValueChange={(value) => setFormData({ ...formData, orderStatus: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="shipped">Shipped</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="shippingCost">Shipping Cost (NPR)</Label>
                <Input
                  id="shippingCost"
                  type="number"
                  step="0.01"
                  value={formData.shippingCost}
                  onChange={(e) => setFormData({ ...formData, shippingCost: e.target.value })}
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Add any notes about this order..."
                  rows={2}
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Order Summary */}
          <div className="bg-gray-50 p-4 rounded-lg space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal:</span>
              <span className="font-medium">{formatPrice(calculateSubtotal())}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Shipping:</span>
              <span className="font-medium">{formatPrice(parseFloat(formData.shippingCost) || 0)}</span>
            </div>
            <Separator />
            <div className="flex justify-between text-lg font-bold">
              <span>Total:</span>
              <span className="text-orange-600">{formatPrice(calculateTotal())}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 justify-end">
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading || selectedItems.length === 0} className="luxury-gradient">
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Order
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
