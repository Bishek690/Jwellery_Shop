"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, DollarSign, Gem } from "lucide-react"

interface MetalPrice {
  goldPricePerTola: number
  silverPricePerTola: number
  platinumPricePerTola: number
  roseGoldPricePerTola: number
  whiteGoldPricePerTola: number
  diamondPricePerCarat: number
  createdAt?: string
  updatedAt?: string
}

export function MetalPriceDisplay() {
  const [prices, setPrices] = useState<MetalPrice | null>(null)
  const [loading, setLoading] = useState(true)
  const [lastUpdateDate, setLastUpdateDate] = useState<string>('')
  const [isToday, setIsToday] = useState(false)

  useEffect(() => {
    fetchPrices()
  }, [])

  const formatUpdateDate = (dateString?: string) => {
    if (!dateString) {
      return 'Not updated'
    }
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const isDateToday = (dateString?: string) => {
    if (!dateString) return false
    
    const updateDate = new Date(dateString)
    const today = new Date()
    
    return updateDate.getDate() === today.getDate() &&
           updateDate.getMonth() === today.getMonth() &&
           updateDate.getFullYear() === today.getFullYear()
  }

  const fetchPrices = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/metal-prices/current`)
      if (response.ok) {
        const data = await response.json()
        setPrices(data)
        // Use updatedAt (when price was last modified) or createdAt (when price was first set)
        const updateDate = data.updatedAt || data.createdAt
        setLastUpdateDate(formatUpdateDate(updateDate))
        setIsToday(isDateToday(updateDate))
      }
    } catch (error) {
      console.error("Error fetching prices:", error)
    } finally {
      setLoading(false)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-NP", {
      style: "currency",
      currency: "NPR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(price)
  }

  if (loading || !prices || prices.goldPricePerTola === 0) {
    return null
  }

  return (
    <Card className="glass-card border-amber-200 bg-gradient-to-r from-orange-50 to-amber-50">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-sm font-semibold text-gray-900">
              {isToday ? "Today's Metal Prices" : "Metal Prices"}
            </h3>
            <p className="text-xs text-gray-600">
              {isToday ? lastUpdateDate : `Updated: ${lastUpdateDate}`}
            </p>
          </div>
          <Badge variant="secondary" className="bg-orange-100 text-orange-700 text-xs">
            Live
          </Badge>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <TrendingUp className="h-4 w-4 text-yellow-600 mr-1" />
              <span className="text-xs font-medium text-gray-600">Gold</span>
            </div>
            <p className="text-sm font-bold text-yellow-600">
              {formatPrice(prices.goldPricePerTola)}
              <span className="text-xs font-normal text-gray-500">/tola</span>
            </p>
          </div>

          <div className="text-center border-l border-r border-gray-200">
            <div className="flex items-center justify-center mb-1">
              <DollarSign className="h-4 w-4 text-gray-600 mr-1" />
              <span className="text-xs font-medium text-gray-600">Silver</span>
            </div>
            <p className="text-sm font-bold text-gray-700">
              {formatPrice(prices.silverPricePerTola)}
              <span className="text-xs font-normal text-gray-500">/tola</span>
            </p>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <Gem className="h-4 w-4 text-blue-600 mr-1" />
              <span className="text-xs font-medium text-gray-600">Diamond</span>
            </div>
            <p className="text-sm font-bold text-blue-600">
              {formatPrice(prices.diamondPricePerCarat)}
              <span className="text-xs font-normal text-gray-500">/ct</span>
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
