"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Save, TrendingUp } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface MetalPrice {
  goldPricePerTola: number
  silverPricePerTola: number
  platinumPricePerTola: number
  roseGoldPricePerTola: number
  whiteGoldPricePerTola: number
  diamondPricePerCarat: number
}

interface MetalPriceModalProps {
  open: boolean
  onClose: () => void
  onSuccess?: () => void
}

export function MetalPriceModal({ open, onClose, onSuccess }: MetalPriceModalProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<string>('')
  
  const [formData, setFormData] = useState({
    goldPricePerTola: "",
    silverPricePerTola: "",
    platinumPricePerTola: "",
    roseGoldPricePerTola: "",
    whiteGoldPricePerTola: "",
    diamondPricePerCarat: ""
  })

  useEffect(() => {
    if (open) {
      fetchCurrentPrices()
    }
  }, [open])

  const fetchCurrentPrices = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/metal-prices/current`)
      if (response.ok) {
        const data = await response.json()
        setFormData({
          goldPricePerTola: data.goldPricePerTola?.toString() || "",
          silverPricePerTola: data.silverPricePerTola?.toString() || "",
          platinumPricePerTola: data.platinumPricePerTola?.toString() || "",
          roseGoldPricePerTola: data.roseGoldPricePerTola?.toString() || "",
          whiteGoldPricePerTola: data.whiteGoldPricePerTola?.toString() || "",
          diamondPricePerCarat: data.diamondPricePerCarat?.toString() || ""
        })
        
        // Set the last updated date
        if (data.updatedAt || data.createdAt) {
          const updateDate = new Date(data.updatedAt || data.createdAt)
          const formatted = updateDate.toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })
          setLastUpdated(formatted)
        } else {
          setLastUpdated('Never updated')
        }
      }
    } catch (error) {
      console.error("Error fetching prices:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Check if at least one field is filled
    const hasAnyPrice = Object.values(formData).some(value => value && parseFloat(value) > 0)
    
    if (!hasAnyPrice) {
      toast({
        title: "Error",
        description: "Please enter at least one metal price",
        variant: "destructive"
      })
      return
    }

    try {
      setSubmitting(true)
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/metal-prices/update`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Success",
          description: "Metal prices updated successfully"
        })
        if (onSuccess) {
          onSuccess()
        }
        onClose()
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to update prices",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error("Error updating prices:", error)
      toast({
        title: "Error",
        description: "Failed to update prices",
        variant: "destructive"
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <TrendingUp className="h-6 w-6 text-orange-600" />
            Update Metal Prices
          </DialogTitle>
          <DialogDescription>
            Enter today's market prices. Prices are per tola for metals (11.66 grams) and per carat for diamonds.
            {lastUpdated && (
              <div className="mt-2 text-sm text-gray-600">
                <strong>Last Updated:</strong> {lastUpdated}
              </div>
            )}
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Gold */}
              <div className="space-y-2">
                <Label htmlFor="goldPrice" className="text-sm font-medium">
                  Gold (24K) - Per Tola
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">NPR</span>
                  <Input
                    id="goldPrice"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={formData.goldPricePerTola}
                    onChange={(e) => setFormData({ ...formData, goldPricePerTola: e.target.value })}
                    className="pl-14"
                  />
                </div>
              </div>

              {/* Rose Gold */}
              <div className="space-y-2">
                <Label htmlFor="roseGoldPrice" className="text-sm font-medium">
                  Rose Gold - Per Tola
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">NPR</span>
                  <Input
                    id="roseGoldPrice"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={formData.roseGoldPricePerTola}
                    onChange={(e) => setFormData({ ...formData, roseGoldPricePerTola: e.target.value })}
                    className="pl-14"
                  />
                </div>
              </div>

              {/* White Gold */}
              <div className="space-y-2">
                <Label htmlFor="whiteGoldPrice" className="text-sm font-medium">
                  White Gold - Per Tola
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">NPR</span>
                  <Input
                    id="whiteGoldPrice"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={formData.whiteGoldPricePerTola}
                    onChange={(e) => setFormData({ ...formData, whiteGoldPricePerTola: e.target.value })}
                    className="pl-14"
                  />
                </div>
              </div>

              {/* Silver */}
              <div className="space-y-2">
                <Label htmlFor="silverPrice" className="text-sm font-medium">
                  Silver - Per Tola
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">NPR</span>
                  <Input
                    id="silverPrice"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={formData.silverPricePerTola}
                    onChange={(e) => setFormData({ ...formData, silverPricePerTola: e.target.value })}
                    className="pl-14"
                  />
                </div>
              </div>

              {/* Platinum */}
              <div className="space-y-2">
                <Label htmlFor="platinumPrice" className="text-sm font-medium">
                  Platinum - Per Tola
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">NPR</span>
                  <Input
                    id="platinumPrice"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={formData.platinumPricePerTola}
                    onChange={(e) => setFormData({ ...formData, platinumPricePerTola: e.target.value })}
                    className="pl-14"
                  />
                </div>
              </div>

              {/* Diamond */}
              <div className="space-y-2">
                <Label htmlFor="diamondPrice" className="text-sm font-medium">
                  Diamond - Per Carat
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">NPR</span>
                  <Input
                    id="diamondPrice"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={formData.diamondPricePerCarat}
                    onChange={(e) => setFormData({ ...formData, diamondPricePerCarat: e.target.value })}
                    className="pl-14"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3 justify-end pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={submitting}
                className="luxury-gradient hover:shadow-xl transition-all duration-300"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Update Prices
                  </>
                )}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
