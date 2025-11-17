"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Plus, Upload, Gem, Star, Crown, Save } from "lucide-react"

interface AddProductFormData {
  name: string
  sku: string
  category: string
  price: string
  cost: string
  weight: string
  purity: string
  stock: string
  minStock: string
  description: string
  featured: boolean
  images: string[]
}

interface InventoryAddProductProps {
  onSave: (product: AddProductFormData) => void
  onCancel: () => void
}

export function InventoryAddProduct({ onSave, onCancel }: InventoryAddProductProps) {
  const [formData, setFormData] = useState<AddProductFormData>({
    name: "",
    sku: "",
    category: "",
    price: "",
    cost: "",
    weight: "",
    purity: "",
    stock: "",
    minStock: "",
    description: "",
    featured: false,
    images: [],
  })

  const categories = [
    { value: "necklaces", label: "Necklaces", icon: Crown },
    { value: "rings", label: "Rings", icon: Gem },
    { value: "bangles", label: "Bangles", icon: Star },
    { value: "earrings", label: "Earrings", icon: Gem },
    { value: "pendants", label: "Pendants", icon: Star },
    { value: "chains", label: "Chains", icon: Crown },
  ]

  const purityOptions = ["24K", "22K", "18K", "14K", "10K", "925 Silver", "Pure Silver"]

  const handleInputChange = (field: keyof AddProductFormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  const generateSKU = () => {
    const categoryCode = formData.category.substring(0, 2).toUpperCase()
    const randomNum = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, "0")
    const sku = `${categoryCode}-${randomNum}`
    handleInputChange("sku", sku)
  }

  return (
    <Card className="glass-card animate-fade-in-scale">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="h-5 w-5 text-orange-600" />
          Add New Product
        </CardTitle>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4 animate-slide-in-up">
            <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Enter product name"
                  className="bg-white/80 border-orange-200/50 focus:border-orange-400"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sku">SKU *</Label>
                <div className="flex gap-2">
                  <Input
                    id="sku"
                    value={formData.sku}
                    onChange={(e) => handleInputChange("sku", e.target.value)}
                    placeholder="Product SKU"
                    className="bg-white/80 border-orange-200/50 focus:border-orange-400"
                    required
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={generateSKU}
                    className="hover:bg-orange-50 bg-transparent"
                  >
                    Generate
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                  <SelectTrigger className="bg-white/80 border-orange-200/50">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => {
                      const Icon = category.icon
                      return (
                        <SelectItem key={category.value} value={category.value}>
                          <div className="flex items-center gap-2">
                            <Icon className="h-4 w-4" />
                            {category.label}
                          </div>
                        </SelectItem>
                      )
                    })}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  placeholder="Product description"
                  className="bg-white/80 border-orange-200/50 focus:border-orange-400"
                  rows={3}
                />
              </div>
            </div>
          </div>

          {/* Pricing & Specifications */}
          <div className="space-y-4 animate-slide-in-up" style={{ animationDelay: "0.2s" }}>
            <h3 className="text-lg font-semibold text-gray-900">Pricing & Specifications</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Selling Price (NPR) *</Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => handleInputChange("price", e.target.value)}
                  placeholder="0"
                  className="bg-white/80 border-orange-200/50 focus:border-orange-400"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cost">Cost Price (NPR) *</Label>
                <Input
                  id="cost"
                  type="number"
                  value={formData.cost}
                  onChange={(e) => handleInputChange("cost", e.target.value)}
                  placeholder="0"
                  className="bg-white/80 border-orange-200/50 focus:border-orange-400"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="weight">Weight</Label>
                <Input
                  id="weight"
                  value={formData.weight}
                  onChange={(e) => handleInputChange("weight", e.target.value)}
                  placeholder="e.g., 25g"
                  className="bg-white/80 border-orange-200/50 focus:border-orange-400"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="purity">Purity</Label>
                <Select value={formData.purity} onValueChange={(value) => handleInputChange("purity", value)}>
                  <SelectTrigger className="bg-white/80 border-orange-200/50">
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
          </div>

          {/* Inventory */}
          <div className="space-y-4 animate-slide-in-up" style={{ animationDelay: "0.4s" }}>
            <h3 className="text-lg font-semibold text-gray-900">Inventory</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="stock">Current Stock *</Label>
                <Input
                  id="stock"
                  type="number"
                  value={formData.stock}
                  onChange={(e) => handleInputChange("stock", e.target.value)}
                  placeholder="0"
                  className="bg-white/80 border-orange-200/50 focus:border-orange-400"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="minStock">Minimum Stock Level *</Label>
                <Input
                  id="minStock"
                  type="number"
                  value={formData.minStock}
                  onChange={(e) => handleInputChange("minStock", e.target.value)}
                  placeholder="0"
                  className="bg-white/80 border-orange-200/50 focus:border-orange-400"
                  required
                />
              </div>
            </div>
          </div>

          {/* Settings */}
          <div className="space-y-4 animate-slide-in-up" style={{ animationDelay: "0.6s" }}>
            <h3 className="text-lg font-semibold text-gray-900">Settings</h3>

            <div className="flex items-center justify-between p-4 rounded-lg bg-orange-50/50">
              <div className="flex items-center gap-3">
                <Star className="h-5 w-5 text-orange-600" />
                <div>
                  <Label htmlFor="featured" className="text-sm font-medium">
                    Featured Product
                  </Label>
                  <p className="text-xs text-gray-600">Display this product prominently</p>
                </div>
              </div>
              <Switch
                id="featured"
                checked={formData.featured}
                onCheckedChange={(checked) => handleInputChange("featured", checked)}
              />
            </div>
          </div>

          {/* Image Upload */}
          <div className="space-y-4 animate-slide-in-up" style={{ animationDelay: "0.8s" }}>
            <h3 className="text-lg font-semibold text-gray-900">Product Images</h3>

            <div className="border-2 border-dashed border-orange-200 rounded-lg p-8 text-center hover:border-orange-400 transition-colors">
              <Upload className="h-12 w-12 text-orange-600 mx-auto mb-4 animate-float" />
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Upload Product Images</h4>
              <p className="text-gray-600 mb-4">Drag and drop images here, or click to browse</p>
              <Button type="button" variant="outline" className="hover:bg-orange-50 bg-transparent">
                Choose Files
              </Button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-6 animate-slide-in-up" style={{ animationDelay: "1s" }}>
            <Button
              type="submit"
              className="flex-1 luxury-gradient hover:shadow-lg transition-all duration-300 animate-glow"
            >
              <Save className="h-4 w-4 mr-2" />
              Save Product
            </Button>
            <Button type="button" variant="outline" onClick={onCancel} className="hover:bg-orange-50 bg-transparent">
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
