"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
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
import { Card, CardContent } from "@/components/ui/card"
import { Plus, Minus, Upload, X, Save, Loader2, Image as ImageIcon, ArrowLeft } from "lucide-react"

interface SaleItem {
  name: string
  quantity: number
  price: number
}

export default function EditSalesRecordPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const [loading, setLoading] = useState(false)
  const [fetchingData, setFetchingData] = useState(true)
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
    status: "completed"
  })

  const [items, setItems] = useState<SaleItem[]>([
    { name: "", quantity: 1, price: 0 }
  ])

  useEffect(() => {
    if (id) {
      fetchSaleData()
    }
  }, [id])

  const fetchSaleData = async () => {
    try {
      setFetchingData(true)
      const response = await fetch(`/api/sales-records/${id}`, {
        credentials: 'include',
      })

      if (response.ok) {
        const sale = await response.json()
        
        setFormData({
          billNumber: sale.billNumber || "",
          customerName: sale.customerName || "",
          customerPhone: sale.customerPhone || "",
          customerEmail: sale.customerEmail || "",
          customerAddress: sale.customerAddress || "",
          saleType: sale.saleType || "product",
          paymentMethod: sale.paymentMethod || "cash",
          discount: sale.discount?.toString() || "0",
          tax: sale.tax?.toString() || "0",
          notes: sale.notes || "",
          status: sale.status || "completed"
        })
        
        const parsedItems = Array.isArray(sale.items) ? sale.items : JSON.parse(sale.items || '[]')
        setItems(parsedItems.length > 0 ? parsedItems : [{ name: "", quantity: 1, price: 0 }])
        
        if (sale.billImage) {
          setImagePreview(`${process.env.NEXT_PUBLIC_BACKEND_URL}${sale.billImage}`)
        }
      } else {
        throw new Error('Failed to fetch sales record')
      }
    } catch (error) {
      setError('Failed to load sales record')
    } finally {
      setFetchingData(false)
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file')
        return
      }

      setBillImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
      setError("")
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
    const newItems = [...items]
    newItems[index] = { ...newItems[index], [field]: value }
    setItems(newItems)
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate required fields
    if (!formData.customerName || !formData.paymentMethod) {
      setError('Please fill all required fields')
      return
    }

    // Validate items
    const hasInvalidItems = items.some(item => !item.name || item.quantity <= 0 || item.price < 0)
    if (hasInvalidItems) {
      setError('Please ensure all items have valid name, quantity, and price')
      return
    }

    setLoading(true)
    setError("")

    try {
      const submitFormData = new FormData()
      
      submitFormData.append('customerName', formData.customerName)
      submitFormData.append('customerPhone', formData.customerPhone)
      submitFormData.append('customerEmail', formData.customerEmail)
      submitFormData.append('customerAddress', formData.customerAddress)
      submitFormData.append('items', JSON.stringify(items))
      submitFormData.append('subtotal', calculateSubtotal().toString())
      submitFormData.append('discount', formData.discount)
      submitFormData.append('tax', formData.tax)
      submitFormData.append('totalAmount', calculateTotal().toString())
      submitFormData.append('paymentMethod', formData.paymentMethod)
      submitFormData.append('status', formData.status)
      submitFormData.append('notes', formData.notes)

      if (billImage) {
        submitFormData.append('billImage', billImage)
      }

      const response = await fetch(`/api/sales-records/${id}`, {
        method: 'PATCH',
        credentials: 'include',
        body: submitFormData
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to update sales record')
      }

      router.push('/admin/sales-records')
    } catch (err: any) {
      setError(err.message || 'Failed to update sales record')
    } finally {
      setLoading(false)
    }
  }

  const subtotal = calculateSubtotal()
  const total = calculateTotal()

  if (fetchingData) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
        </div>
      </div>
    )
  }

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
        <h1 className="text-2xl font-bold">Edit Sales Record - {formData.billNumber}</h1>
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
                <Label>Bill Number</Label>
                <Input
                  value={formData.billNumber}
                  disabled
                  className="bg-gray-50"
                />
              </div>

              <div className="space-y-2">
                <Label>Sale Type</Label>
                <Input
                  value={formData.saleType === 'product' ? 'Product' : 'Raw Metal'}
                  disabled
                  className="bg-gray-50"
                />
              </div>
            </div>

            {/* Customer Information */}
            <div className="space-y-4">
              <h3 className="font-semibold text-sm">Customer Information</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="customerName">Customer Name *</Label>
                  <Input
                    id="customerName"
                    value={formData.customerName}
                    onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                    placeholder="Enter customer name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="customerPhone">Phone</Label>
                  <Input
                    id="customerPhone"
                    value={formData.customerPhone}
                    onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                    placeholder="Enter phone number"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="customerEmail">Email</Label>
                  <Input
                    id="customerEmail"
                    type="email"
                    value={formData.customerEmail}
                    onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                    placeholder="Enter email"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="customerAddress">Address</Label>
                  <Input
                    id="customerAddress"
                    value={formData.customerAddress}
                    onChange={(e) => setFormData({ ...formData, customerAddress: e.target.value })}
                    placeholder="Enter address"
                  />
                </div>
              </div>
            </div>

            {/* Items */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-sm">Items *</h3>
                <Button type="button" size="sm" variant="outline" onClick={addItem}>
                  <Plus className="h-4 w-4 mr-1" />
                  Add Item
                </Button>
              </div>

              {items.map((item, index) => (
                <div key={index} className="grid grid-cols-12 gap-3 p-4 border rounded-lg bg-gray-50">
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

                  <div className="col-span-2 space-y-2">
                    <Label className="text-xs">Total</Label>
                    <div className="h-10 flex items-center font-semibold text-green-700">
                      Rs. {(item.quantity * item.price).toFixed(2)}
                    </div>
                  </div>

                  {items.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeItem(index)}
                      className="col-span-12 h-8 text-red-600 hover:bg-red-50"
                    >
                      <Minus className="h-4 w-4 mr-1" />
                      Remove
                    </Button>
                  )}
                </div>
              ))}
            </div>

            {/* Payment Details */}
            <div className="space-y-4">
              <h3 className="font-semibold text-sm">Payment Details</h3>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="subtotal">Subtotal</Label>
                  <Input
                    id="subtotal"
                    value={`Rs. ${subtotal.toFixed(2)}`}
                    readOnly
                    className="bg-gray-50"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="discount">Discount</Label>
                  <Input
                    id="discount"
                    type="number"
                    value={formData.discount}
                    onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tax">Tax</Label>
                  <Input
                    id="tax"
                    type="number"
                    value={formData.tax}
                    onChange={(e) => setFormData({ ...formData, tax: e.target.value })}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>

              <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg border-2 border-green-200">
                <span className="text-lg font-semibold">Total Amount:</span>
                <span className="text-2xl font-bold text-green-700">Rs. {total.toFixed(2)}</span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="paymentMethod">Payment Method *</Label>
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
                  <Label htmlFor="status">Status</Label>
                  <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Bill Image */}
            <div className="space-y-4">
              <h3 className="font-semibold text-sm">Bill Image</h3>
              
              <div className="flex flex-col gap-4">
                {imagePreview ? (
                  <div className="relative inline-block">
                    <img src={imagePreview} alt="Bill preview" className="max-h-48 rounded-lg border" />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 h-8 w-8"
                      onClick={removeImage}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed rounded-lg p-8 text-center">
                    <ImageIcon className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                    <p className="text-sm text-gray-600 mb-3">No image uploaded</p>
                  </div>
                )}

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  id="billImageEdit"
                />
                
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById('billImageEdit')?.click()}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {imagePreview ? 'Change Image' : 'Upload Image'}
                </Button>
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Additional notes..."
                rows={3}
              />
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="bg-orange-600 hover:bg-orange-700"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Update Sale
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
