"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Minus, Upload, X, Save, Loader2, Image as ImageIcon, ArrowLeft } from "lucide-react"

interface SaleItem {
  name: string
  quantity: number
  price: number
}

export default function AddSalesRecordPage() {
  const router = useRouter()
  const fileInputRef = useState<HTMLInputElement | null>(null)[0]
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [billImage, setBillImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  
  const [formData, setFormData] = useState({
    billNumber: "",
    customerName: "",
    customerPhone: "",
    customerEmail: "",
    customerAddress: "",
    saleType: "product",
    paymentMethod: "cash",
    discount: "0",
    tax: "0",
    notes: "",
  })

  const [items, setItems] = useState<SaleItem[]>([
    { name: "", quantity: 1, price: 0 }
  ])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file')
        return
      }

      if (file.size > 5 * 1024 * 1024) {
        setError('Image size must be less than 5MB')
        return
      }

      setBillImage(file)

      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setBillImage(null)
    setImagePreview(null)
  }

  const addItem = () => {
    setItems([...items, { name: "", quantity: 1, price: 0 }])
  }

  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index))
    }
  }

  const updateItem = (index: number, field: keyof SaleItem, value: string | number) => {
    const updatedItems = [...items]
    updatedItems[index] = { ...updatedItems[index], [field]: value }
    setItems(updatedItems)
  }

  const calculateSubtotal = () => {
    return items.reduce((sum, item) => sum + (item.quantity * item.price), 0)
  }

  const calculateTotal = () => {
    const subtotal = calculateSubtotal()
    const discount = parseFloat(formData.discount) || 0
    const tax = parseFloat(formData.tax) || 0
    return subtotal - discount + tax
  }

  const validateForm = () => {
    if (!formData.billNumber || !formData.customerName || !formData.paymentMethod) {
      setError("Please fill in all required fields")
      return false
    }

    if (items.some(item => !item.name || item.quantity <= 0 || item.price <= 0)) {
      setError("Please fill in all item details correctly")
      return false
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setLoading(true)
    setError("")

    try {
      const formDataToSend = new FormData()
      formDataToSend.append('billNumber', formData.billNumber)
      formDataToSend.append('customerName', formData.customerName)
      formDataToSend.append('customerPhone', formData.customerPhone)
      formDataToSend.append('customerEmail', formData.customerEmail)
      formDataToSend.append('customerAddress', formData.customerAddress)
      formDataToSend.append('saleType', formData.saleType)
      formDataToSend.append('paymentMethod', formData.paymentMethod)
      formDataToSend.append('items', JSON.stringify(items))
      formDataToSend.append('subtotal', calculateSubtotal().toString())
      formDataToSend.append('discount', formData.discount)
      formDataToSend.append('tax', formData.tax)
      formDataToSend.append('totalAmount', calculateTotal().toString())
      formDataToSend.append('notes', formData.notes)

      if (billImage) {
        formDataToSend.append('billImage', billImage)
      }

      const response = await fetch('/api/sales-records', {
        method: 'POST',
        credentials: 'include',
        body: formDataToSend,
      })

      if (response.ok) {
        router.push('/admin/sales-records')
      } else {
        const data = await response.json()
        throw new Error(data.message || 'Failed to create sales record')
      }
    } catch (error: any) {
      setError(error.message || 'Failed to create sales record')
    } finally {
      setLoading(false)
    }
  }

  const subtotal = calculateSubtotal()
  const total = calculateTotal()

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h1 className="text-2xl font-bold">New Sales Record</h1>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <Card>
          <CardContent className="pt-6 space-y-6">
            {/* Bill Information */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Bill Number *</Label>
                <Input
                  value={formData.billNumber}
                  onChange={(e) => setFormData({ ...formData, billNumber: e.target.value })}
                  placeholder="Enter bill number"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Sale Type *</Label>
                <Select value={formData.saleType} onValueChange={(value) => setFormData({ ...formData, saleType: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="product">Product</SelectItem>
                    <SelectItem value="raw-metal">Raw Metal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Customer Information */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-900">Customer Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Customer Name *</Label>
                  <Input
                    value={formData.customerName}
                    onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                    placeholder="Enter customer name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input
                    value={formData.customerPhone}
                    onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                    placeholder="Enter phone number"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={formData.customerEmail}
                    onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                    placeholder="Enter email"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Address</Label>
                  <Input
                    value={formData.customerAddress}
                    onChange={(e) => setFormData({ ...formData, customerAddress: e.target.value })}
                    placeholder="Enter address"
                  />
                </div>
              </div>
            </div>

            {/* Items */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-900">Items *</h3>
                <Button type="button" size="sm" onClick={addItem} variant="outline">
                  <Plus className="h-4 w-4 mr-1" />
                  Add Item
                </Button>
              </div>

              {items.map((item, index) => (
                <div key={index} className="grid grid-cols-12 gap-2 items-end p-3 border rounded-lg bg-gray-50">
                  <div className="col-span-5 space-y-2">
                    <Label className="text-xs">Item Name *</Label>
                    <Input
                      value={item.name}
                      onChange={(e) => updateItem(index, 'name', e.target.value)}
                      placeholder="Item name"
                      required
                    />
                  </div>

                  <div className="col-span-2 space-y-2">
                    <Label className="text-xs">Quantity *</Label>
                    <Input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => updateItem(index, 'quantity', parseFloat(e.target.value) || 0)}
                      placeholder="Qty"
                      min="1"
                      required
                    />
                  </div>

                  <div className="col-span-3 space-y-2">
                    <Label className="text-xs">Price *</Label>
                    <Input
                      type="number"
                      value={item.price}
                      onChange={(e) => updateItem(index, 'price', parseFloat(e.target.value) || 0)}
                      placeholder="Price"
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>

                  <div className="col-span-2 flex items-center gap-2">
                    <div className="text-sm font-medium">
                      ₹{(item.quantity * item.price).toFixed(2)}
                    </div>
                    {items.length > 1 && (
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={() => removeItem(index)}
                        className="h-8 w-8 p-0 text-red-600 hover:bg-red-100"
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Payment & Totals */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Payment Method *</Label>
                  <Select value={formData.paymentMethod} onValueChange={(value) => setFormData({ ...formData, paymentMethod: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cash">Cash</SelectItem>
                      <SelectItem value="card">Card</SelectItem>
                      <SelectItem value="wallet">Wallet</SelectItem>
                      <SelectItem value="bank-transfer">Bank Transfer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Discount</Label>
                  <Input
                    type="number"
                    value={formData.discount}
                    onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Tax</Label>
                  <Input
                    type="number"
                    value={formData.tax}
                    onChange={(e) => setFormData({ ...formData, tax: e.target.value })}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>

              <div className="space-y-3 p-4 bg-gray-50 rounded-lg h-fit">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-medium">₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Discount:</span>
                  <span className="font-medium text-red-600">-₹{parseFloat(formData.discount).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax:</span>
                  <span className="font-medium">₹{parseFloat(formData.tax).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-2 border-t">
                  <span>Total:</span>
                  <span className="text-green-700">₹{total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Bill Image Upload */}
            <div className="space-y-4">
              <Label>Bill Image (Optional)</Label>
              <div className="flex items-center gap-4">
                {imagePreview ? (
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Bill preview"
                      className="w-32 h-32 object-cover rounded-lg border-2 border-gray-200"
                    />
                    <Button
                      type="button"
                      onClick={removeImage}
                      size="sm"
                      variant="destructive"
                      className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ) : (
                  <div className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                    <ImageIcon className="h-8 w-8 text-gray-400" />
                  </div>
                )}

                <div className="flex-1">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    id="billImage"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById('billImage')?.click()}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Bill Image
                  </Button>
                  <p className="text-sm text-gray-500 mt-2">
                    JPG, PNG, max 5MB
                  </p>
                </div>
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label>Notes</Label>
              <Textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Add any additional notes..."
                rows={3}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={loading}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="flex-1 luxury-gradient"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Sale
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  )
}
