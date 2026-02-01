"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { 
  Crown, 
  ShoppingBag, 
  Menu, 
  X 
} from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/hooks/use-auth"

export function LandingNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const router = useRouter()
  const { user, isAuthenticated } = useAuth()

  // Handle shop navigation with authentication check
  const handleShopNavigation = () => {
    if (!isAuthenticated || (user && user.role !== "customer")) {
      router.push("/auth/login")
    } else {
      router.push("/shop")
    }
  }

  return (
    <nav className="glass-card border-b border-orange-200/50 sticky top-0 z-50">
      <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 sm:gap-3 animate-slide-in-up">
            <div className="p-1.5 sm:p-2 luxury-gradient rounded-xl animate-glow">
              <Crown className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg sm:text-xl lg:text-2xl font-bold font-serif text-gray-900">Shree Hans RKS Jewellers</h1>
              <p className="text-xs sm:text-sm text-gray-600">Premium Jewelry Collection</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-4 xl:gap-8">
            <Link href="#collections" className="text-gray-700 hover:text-orange-600 transition-colors text-sm xl:text-base">
              Collections
            </Link>
            <Link href="#services" className="text-gray-700 hover:text-orange-600 transition-colors text-sm xl:text-base">
              Services
            </Link>
            <Link href="#about" className="text-gray-700 hover:text-orange-600 transition-colors text-sm xl:text-base">
              About
            </Link>
            <Link href="#testimonials" className="text-gray-700 hover:text-orange-600 transition-colors text-sm xl:text-base">
              Reviews
            </Link>
            <Link href="#contact" className="text-gray-700 hover:text-orange-600 transition-colors text-sm xl:text-base">
              Contact
            </Link>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <Button 
              onClick={handleShopNavigation}
              className="luxury-gradient hover:shadow-lg transition-all duration-300 animate-fade-in-scale text-xs sm:text-sm px-3 sm:px-4 py-2"
            >
              <ShoppingBag className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Shop Now</span>
              <span className="sm:hidden">Shop</span>
            </Button>

            {/* Mobile Menu Button */}
            <Button variant="ghost" size="sm" className="lg:hidden p-1 sm:p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="h-4 w-4 sm:h-5 sm:w-5" /> : <Menu className="h-4 w-4 sm:h-5 sm:w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden mt-3 sm:mt-4 pb-3 sm:pb-4 border-t border-orange-200/50 pt-3 sm:pt-4 animate-fade-in-scale">
            <div className="flex flex-col gap-3 sm:gap-4">
              <Link href="#collections" className="text-gray-700 hover:text-orange-600 transition-colors text-sm sm:text-base">
                Collections
              </Link>
              <Link href="#services" className="text-gray-700 hover:text-orange-600 transition-colors text-sm sm:text-base">
                Services
              </Link>
              <Link href="#about" className="text-gray-700 hover:text-orange-600 transition-colors text-sm sm:text-base">
                About
              </Link>
              <Link href="#testimonials" className="text-gray-700 hover:text-orange-600 transition-colors text-sm sm:text-base">
                Reviews
              </Link>
              <Link href="#contact" className="text-gray-700 hover:text-orange-600 transition-colors text-sm sm:text-base">
                Contact
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
