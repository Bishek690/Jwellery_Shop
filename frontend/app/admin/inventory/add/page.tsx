"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { AdminLayout } from "@/components/admin/layout/admin-layout"
import { 
  Plus, 
  Save, 
  Star, 
  Crown, 
  Gem, 
  ArrowLeft,
  Package,
  AlertCircle,
  CheckCircle,
  Loader2,
  Camera,
  X,
  Image as ImageIcon,
  TrendingUp
} from "lucide-react"
import Link from "next/link"

interface AddProductFormData {
  name: string
  sku: string
  category: string
  description: string
  price: string
  cost: string
  discountPrice: string
  weight: string
  metalType: string
  purity: string
  stock: string
  minStock: string
  featured: boolean
  image?: File
}

export default function AddProductPage() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [formData, setFormData] = useState<AddProductFormData>({
    name: "",
    sku: "",
    category: "",
    description: "",
    price: "",
    cost: "",
    discountPrice: "",
    weight: "",
    metalType: "",
    purity: "",
    stock: "0",
    minStock: "1",
    featured: false
  })

  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState("")
  const [error, setError] = useState("")
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  const categories = [
    { value: "necklaces", label: "Necklaces", icon: Crown, color: "text-purple-600" },
    { value: "rings", label: "Rings", icon: Gem, color: "text-blue-600" },
    { value: "bangles", label: "Bangles", icon: Star, color: "text-yellow-600" },
    { value: "earrings", label: "Earrings", icon: Gem, color: "text-pink-600" },
    { value: "pendants", label: "Pendants", icon: Star, color: "text-green-600" },
    { value: "chains", label: "Chains", icon: Crown, color: "text-indigo-600" },
    { value: "bracelets", label: "Bracelets", icon: Star, color: "text-orange-600" },
  ]

  const metalTypes = [
    { value: "gold", label: "Gold", color: "bg-yellow-100 text-yellow-800" },
    { value: "silver", label: "Silver", color: "bg-gray-100 text-gray-800" },
    { value: "white-gold", label: "White Gold", color: "bg-blue-100 text-blue-800" },
    { value: "rose-gold", label: "Rose Gold", color: "bg-pink-100 text-pink-800" },
    { value: "platinum", label: "Platinum", color: "bg-purple-100 text-purple-800" },
    { value: "diamond", label: "Diamond", color: "bg-red-100 text-red-800" },
  ]

  const purityOptions = ["24K", "22K", "18K", "14K", "10K", "925 Silver", "Pure Silver", "Flawless Diamond", "Lab Created Diamond"]

  const handleInputChange = (field: keyof AddProductFormData, value: string | boolean | File) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (error) setError("")
  }

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

      setFormData(prev => ({ ...prev, image: file }))
      
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setFormData(prev => ({ ...prev, image: undefined }))
    setImagePreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const generateSKU = () => {
    if (!formData.category) {
      setError("Please select a category first")
      return
    }
    const categoryCode = formData.category.substring(0, 2).toUpperCase()
    const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, "0")
    const sku = `${categoryCode}-${randomNum}`
    handleInputChange("sku", sku)
  }

  const validateForm = () => {
    const required = ['name', 'sku', 'category', 'price', 'cost', 'stock', 'minStock', 'metalType']
    const missing = required.filter(field => !formData[field as keyof AddProductFormData])
    
    if (missing.length > 0) {
      setError(`Please fill in all required fields: ${missing.join(', ')}`)
      return false
    }

    if (parseFloat(formData.price) <= 0) {
      setError("Price must be greater than 0")
      return false
    }

    if (parseFloat(formData.cost) <= 0) {
      setError("Cost must be greater than 0")
      return false
    }

    // Validate discount price if provided
    if (formData.discountPrice && formData.discountPrice.trim() !== '') {
      const discountVal = parseFloat(formData.discountPrice)
      const priceVal = parseFloat(formData.price)
      const costVal = parseFloat(formData.cost)

      if (isNaN(discountVal) || discountVal < 0) {
        setError("Discount price must be a positive number")
        return false
      }

      if (discountVal >= priceVal) {
        setError("Discount price must be less than the regular price")
        return false
      }

      if (discountVal < costVal) {
        setError("Discount price should not be less than cost price to avoid losses")
        return false
      }
    }

    if (parseInt(formData.stock) < 0) {
      setError("Stock cannot be negative")
      return false
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setLoading(true)
    setError("")
    setSuccess("")

    try {
      const formDataToSend = new FormData()
      formDataToSend.append('name', formData.name)
      formDataToSend.append('sku', formData.sku)
      formDataToSend.append('category', formData.category)
      formDataToSend.append('description', formData.description)
      formDataToSend.append('price', formData.price)
      formDataToSend.append('cost', formData.cost)
      if (formData.discountPrice && formData.discountPrice.trim() !== '') {
        formDataToSend.append('discountPrice', formData.discountPrice)
      }
      formDataToSend.append('weight', formData.weight || '0')
      formDataToSend.append('metalType', formData.metalType)
      formDataToSend.append('purity', formData.purity)
      formDataToSend.append('stock', formData.stock)
      formDataToSend.append('minStock', formData.minStock)
      formDataToSend.append('featured', formData.featured.toString())
      
      if (formData.image) {
        formDataToSend.append('image', formData.image)
      }

      const response = await fetch('/api/products', {
        method: 'POST',
        credentials: 'include',
        body: formDataToSend,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to create product')
      }

      setSuccess("Product created successfully! Redirecting...")
      
      // Reset form
      setFormData({
        name: "",
        sku: "",
        category: "",
        description: "",
        price: "",
        cost: "",
        discountPrice: "",
        weight: "",
        metalType: "",
        purity: "",
        stock: "0",
        minStock: "1",
        featured: false
      })
      setImagePreview(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }

      setTimeout(() => {
        router.push('/admin/inventory')
      }, 2000)

    } catch (error: any) {
      setError(error.message || "Failed to create product")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      {/* Back Button */}
      <div className="mb-4">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="hover:bg-orange-50 gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Inventory</span>
        </Button>
      </div>

      {/* Page Header */}
      <div className="mb-4 sm:mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 luxury-gradient rounded-xl animate-glow">
            <Plus className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">Add New Product</h1>
            <p className="text-xs sm:text-sm text-gray-600 mt-1 hidden sm:block">Create a new jewelry product for your inventory</p>
          </div>
        </div>
      </div>

      {/* Form Card */}
      <Card className="max-w-4xl mx-auto bg-white">
        <CardHeader className="p-4 sm:p-6 bg-white">
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <Package className="h-4 w-4 sm:h-5 sm:w-5 text-orange-600" />
            Product Information
          </CardTitle>
        </CardHeader>

        <CardContent className="p-4 sm:p-6 bg-white">
          {/* Success/Error Messages */}
          {success && (
            <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              {success}
            </div>
          )}
          {error && (
            <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Image Upload Section */}
            <div className="space-y-4">
              <Label className="text-base font-semibold">Product Image</Label>
              <div className="flex items-center gap-4">
                {imagePreview ? (
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Product preview"
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
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full sm:w-auto"
                  >
                    <Camera className="h-4 w-4 mr-2" />
                    Choose Image
                  </Button>
                  <p className="text-sm text-gray-500 mt-2">
                    Upload a product image (JPG, PNG, max 5MB)
                  </p>
                </div>
              </div>
            </div>

            {/* Basic Information */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full luxury-gradient flex items-center justify-center text-white font-bold text-sm">1</span>
                Basic Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Product Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="Enter product name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                          <div className="flex items-center gap-2">
                            <cat.icon className={`h-4 w-4 ${cat.color}`} />
                            {cat.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sku" className="flex items-center gap-2">
                    SKU *
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={generateSKU}
                      className="h-6 px-2 text-xs"
                    >
                      Generate
                    </Button>
                  </Label>
                  <Input
                    id="sku"
                    value={formData.sku}
                    onChange={(e) => handleInputChange("sku", e.target.value)}
                    placeholder="Product SKU"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="metalType">Metal Type *</Label>
                  <Select value={formData.metalType} onValueChange={(value) => handleInputChange("metalType", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select metal type" />
                    </SelectTrigger>
                    <SelectContent>
                      {metalTypes.map((metal) => (
                        <SelectItem key={metal.value} value={metal.value}>
                          <Badge className={metal.color}>{metal.label}</Badge>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  placeholder="Describe your product..."
                  rows={3}
                />
              </div>
            </div>

            {/* Pricing & Specifications */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full luxury-gradient flex items-center justify-center text-white font-bold text-sm">2</span>
                Pricing & Specifications
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="price">Selling Price (NPR) *</Label>
                  <Input
                    id="price"
                    type="number"
                    value={formData.price}
                    onChange={(e) => handleInputChange("price", e.target.value)}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="discountPrice" className="flex items-center gap-1">
                    Discount Price (NPR)
                    <span className="text-xs text-gray-500">(Optional)</span>
                  </Label>
                  <Input
                    id="discountPrice"
                    type="number"
                    value={formData.discountPrice}
                    onChange={(e) => handleInputChange("discountPrice", e.target.value)}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                  />
                  {formData.discountPrice && parseFloat(formData.discountPrice) > 0 && (
                    <p className="text-xs text-green-600">
                      Save: ₹{(parseFloat(formData.price || "0") - parseFloat(formData.discountPrice)).toFixed(2)}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cost">Cost Price (NPR) *</Label>
                  <Input
                    id="cost"
                    type="number"
                    value={formData.cost}
                    onChange={(e) => handleInputChange("cost", e.target.value)}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="weight">Weight (grams)</Label>
                  <Input
                    id="weight"
                    type="number"
                    value={formData.weight}
                    onChange={(e) => handleInputChange("weight", e.target.value)}
                    placeholder="0.0"
                    min="0"
                    step="0.1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="purity">Purity</Label>
                  <Select value={formData.purity} onValueChange={(value) => handleInputChange("purity", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select purity" />
                    </SelectTrigger>
                    <SelectContent>
                      {purityOptions.map((purity) => (
                        <SelectItem key={purity} value={purity}>
                          {purity}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Profit Margin Display */}
              {formData.price && formData.cost && (
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium text-green-800">Profit Analysis</span>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm text-green-700">
                      Regular Profit: NPR {(parseFloat(formData.price) - parseFloat(formData.cost)).toFixed(2)} 
                      ({((parseFloat(formData.price) - parseFloat(formData.cost)) / parseFloat(formData.price) * 100).toFixed(1)}%)
                    </div>
                    {formData.discountPrice && parseFloat(formData.discountPrice) > 0 && (
                      <div className="text-sm text-amber-700">
                        Discounted Profit: NPR {(parseFloat(formData.discountPrice) - parseFloat(formData.cost)).toFixed(2)} 
                        ({((parseFloat(formData.discountPrice) - parseFloat(formData.cost)) / parseFloat(formData.discountPrice) * 100).toFixed(1)}%)
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Inventory */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full luxury-gradient flex items-center justify-center text-white font-bold text-sm">3</span>
                Inventory
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="stock">Current Stock *</Label>
                  <Input
                    id="stock"
                    type="number"
                    value={formData.stock}
                    onChange={(e) => handleInputChange("stock", e.target.value)}
                    placeholder="0"
                    min="0"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="minStock">Minimum Stock Alert *</Label>
                  <Input
                    id="minStock"
                    type="number"
                    value={formData.minStock}
                    onChange={(e) => handleInputChange("minStock", e.target.value)}
                    placeholder="1"
                    min="1"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Settings */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full luxury-gradient flex items-center justify-center text-white font-bold text-sm">4</span>
                Settings
              </h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-amber-50 rounded-lg border border-amber-200">
                  <div className="flex items-center gap-3">
                    <Star className="h-5 w-5 text-amber-600" />
                    <div>
                      <Label className="text-sm font-medium">Featured Product</Label>
                      <p className="text-xs text-gray-600">Show this product prominently on the website</p>
                    </div>
                  </div>
                  <Switch
                    checked={formData.featured}
                    onCheckedChange={(checked) => handleInputChange("featured", checked)}
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-8">
              <Button
                type="submit"
                disabled={loading}
                className="flex-1 luxury-gradient hover:shadow-lg transition-all duration-300 disabled:opacity-50 h-12"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Create Product
                  </>
                )}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => router.push('/admin/inventory')} 
                className="hover:bg-orange-50 bg-transparent h-12 px-8"
                disabled={loading}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
