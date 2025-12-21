"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Crown, Gem } from "lucide-react"
import Link from "next/link"

interface DashboardHeaderProps {
  title?: string
  subtitle?: string
  className?: string
}

export function DashboardHeader({ 
  title = "Staff Dashboard", 
  subtitle = "Comprehensive jewelry store management",
  className 
}: DashboardHeaderProps) {
  const [goldRate] = useState(6850) // NPR per tola

  return (
    <div className={`flex items-center justify-between ${className}`}>
      <div className="flex items-center gap-3">
        <div className="p-2 luxury-gradient rounded-xl animate-glow">
          <Crown className="h-8 w-8 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold font-serif text-gray-900">{title}</h1>
          <p className="text-sm text-gray-600">{subtitle}</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="glass-card px-4 py-2 rounded-lg animate-float">
          <div className="flex items-center gap-2">
            <Gem className="h-4 w-4 text-orange-600" />
            <span className="text-sm font-medium">Gold Rate</span>
            <Badge variant="secondary" className="luxury-gradient text-white">
              NPR {goldRate.toLocaleString()}/tola
            </Badge>
          </div>
        </div>
        <Link href="/">
          <Button variant="outline" className="hover:bg-orange-50 transition-all duration-300 bg-transparent">
            Back to Website
          </Button>
        </Link>
        <Link href="/guide">
          <Button variant="outline" className="hover:bg-orange-50 transition-all duration-300 bg-transparent">
            System Guide
          </Button>
        </Link>
      </div>
    </div>
  )
}
