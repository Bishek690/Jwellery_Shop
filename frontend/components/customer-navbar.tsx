"use client"

import { useState } from "react"
import { Search, ShoppingBag, User, Heart, Menu, X, Bell, Crown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ProfileDropdown } from "@/components/profile-dropdown"
import { useCart } from "@/hooks/use-cart"
import { useWishlist } from "@/hooks/use-wishlist"
import Link from "next/link"

export function CustomerNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const { getCartCount } = useCart()
  const { wishlistCount } = useWishlist()

  return (
    <nav className="sticky top-0 z-50 glass-card border-b border-border/50 shadow-lg">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 xl:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          <Link href="/" className="flex items-center gap-2 sm:gap-3 animate-slide-in-up">
            <div className="p-1.5 sm:p-2 luxury-gradient rounded-xl animate-glow">
              <Crown className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7 text-white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-base sm:text-lg lg:text-xl font-bold font-serif text-gray-900">Shree Hans RKS Jewellers</h1>
              <p className="text-xs text-gray-600">Premium Jewelry Collection</p>
            </div>
          </Link>

          <div className="hidden sm:hidden md:flex items-center space-x-6 lg:space-x-8">
            <Link
              href="/"
              className="text-foreground hover:text-primary transition-all duration-300 font-medium relative group text-sm lg:text-base"
            >
              Home
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link
              href="/shop"
              className="text-foreground hover:text-primary transition-all duration-300 font-medium relative group text-sm lg:text-base"
            >
              Collections
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
            </Link>
           
          </div>

          <div className="flex items-center space-x-1 sm:space-x-2">
            {/* Search Field */}
            <div className="hidden lg:flex relative">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground w-3 h-3" />
              <Input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-7 pr-3 py-1.5 w-48 bg-muted/50 border-border/50 focus:border-primary focus:ring-1 focus:ring-primary/20 hover-glow transition-all duration-300 text-xs"
              />
            </div>
            <Button variant="ghost" size="sm" className="hidden md:flex items-center space-x-1 sm:space-x-2 hover-glow">
              <Bell className="w-4 h-4" />
              <Badge className="bg-primary text-primary-foreground text-xs">2</Badge>
            </Button>
            <Link href="/account/wishlist">
              <Button variant="ghost" size="sm" className="hidden md:flex items-center space-x-1 sm:space-x-2 hover-glow">
                <Heart className="w-4 h-4" />
                {wishlistCount > 0 && (
                  <Badge className="bg-red-500 text-white text-xs">{wishlistCount}</Badge>
                )}
              </Button>
            </Link>
            <Link href="/cart">
              <Button variant="ghost" size="sm" className="flex items-center space-x-1 sm:space-x-2 hover-glow p-1 sm:p-2">
                <ShoppingBag className="w-4 h-4" />
                {getCartCount() > 0 && (
                  <Badge className="bg-primary text-primary-foreground text-xs animate-pulse-ring">
                    {getCartCount()}
                  </Badge>
                )}
              </Button>
            </Link>
            
            {/* Profile Dropdown */}
            <ProfileDropdown />

            {/* Mobile Menu Button */}
            <Button variant="ghost" size="sm" className="md:hidden p-1" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden border-t border-border/50 py-3 px-2 animate-slide-in-up">
            <div className="flex flex-col space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Search luxury jewelry..."
                  className="pl-10 pr-4 py-2 w-full bg-muted/50 border-border/50 focus:border-primary focus:ring-2 focus:ring-primary/20 text-sm"
                />
              </div>
                 <Link href="/" className="text-foreground hover:text-primary transition-colors py-2 font-medium text-sm">
                Home
              </Link>
              <Link href="/shop" className="text-foreground hover:text-primary transition-colors py-2 font-medium text-sm">
                Collections
              </Link>
              <div className="flex flex-col xs:flex-row xs:items-center xs:space-x-4 space-y-2 xs:space-y-0 pt-2 border-t border-border/50">
                <Button variant="ghost" size="sm" className="flex items-center space-x-2 justify-start text-xs">
                  <Bell className="w-4 h-4" />
                  <span>Notifications</span>
                  <Badge className="bg-primary text-primary-foreground text-xs">2</Badge>
                </Button>
                <Link href="/account/wishlist" className="w-full">
                  <Button variant="ghost" size="sm" className="flex items-center space-x-2 justify-start text-xs w-full">
                    <Heart className="w-4 h-4" />
                    <span>Wishlist</span>
                    {wishlistCount > 0 && (
                      <Badge className="bg-red-500 text-white text-xs">{wishlistCount}</Badge>
                    )}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
