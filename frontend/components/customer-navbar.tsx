"use client"

import { useState } from "react"
import { Search, ShoppingBag, User, Heart, Menu, X, Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

export function CustomerNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <nav className="sticky top-0 z-50 glass-card border-b border-border/50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-3 hover-lift">
            <div className="w-10 h-10 luxury-gradient rounded-full flex items-center justify-center shadow-lg">
              <span className="text-primary-foreground font-bold text-lg">SH</span>
            </div>
            <div>
              <span className="font-serif text-xl font-bold text-foreground">Shree Hans RKS</span>
              <p className="text-xs text-muted-foreground">Fine Jewellers</p>
            </div>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/shop"
              className="text-foreground hover:text-primary transition-all duration-300 font-medium relative group"
            >
              Collections
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link
              href="/shop/bridal"
              className="text-foreground hover:text-primary transition-all duration-300 font-medium relative group"
            >
              Bridal
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link
              href="/shop/gold"
              className="text-foreground hover:text-primary transition-all duration-300 font-medium relative group"
            >
              Gold
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link
              href="/shop/diamond"
              className="text-foreground hover:text-primary transition-all duration-300 font-medium relative group"
            >
              Diamond
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link
              href="/shop/custom"
              className="text-foreground hover:text-primary transition-all duration-300 font-medium relative group"
            >
              Custom
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
            </Link>
          </div>

          <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                type="text"
                placeholder="Search luxury jewelry..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-full bg-muted/50 border-border/50 focus:border-primary focus:ring-2 focus:ring-primary/20 hover-glow transition-all duration-300"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" className="hidden md:flex items-center space-x-2 hover-glow">
              <Bell className="w-4 h-4" />
              <span>Notifications</span>
              <Badge className="bg-primary text-primary-foreground text-xs">2</Badge>
            </Button>
            <Button variant="ghost" size="sm" className="hidden md:flex items-center space-x-2 hover-glow">
              <Heart className="w-4 h-4" />
              <span>Wishlist</span>
              <Badge className="bg-red-500 text-white text-xs">3</Badge>
            </Button>
            <Button variant="ghost" size="sm" className="flex items-center space-x-2 hover-glow">
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">Cart</span>
              <Badge className="bg-primary text-primary-foreground text-xs animate-pulse-ring">2</Badge>
            </Button>
            <Link href="/account">
              <Button variant="ghost" size="sm" className="flex items-center space-x-2 hover-glow">
                <User className="w-4 h-4" />
                <span className="hidden sm:inline">Account</span>
              </Button>
            </Link>

            {/* Mobile Menu Button */}
            <Button variant="ghost" size="sm" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden border-t border-border/50 py-4 animate-slide-in-up">
            <div className="flex flex-col space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Search luxury jewelry..."
                  className="pl-10 pr-4 py-2 w-full bg-muted/50 border-border/50 focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <Link href="/shop" className="text-foreground hover:text-primary transition-colors py-2 font-medium">
                Collections
              </Link>
              <Link
                href="/shop/bridal"
                className="text-foreground hover:text-primary transition-colors py-2 font-medium"
              >
                Bridal
              </Link>
              <Link href="/shop/gold" className="text-foreground hover:text-primary transition-colors py-2 font-medium">
                Gold
              </Link>
              <Link
                href="/shop/diamond"
                className="text-foreground hover:text-primary transition-colors py-2 font-medium"
              >
                Diamond
              </Link>
              <Link
                href="/shop/custom"
                className="text-foreground hover:text-primary transition-colors py-2 font-medium"
              >
                Custom
              </Link>
              <div className="flex items-center space-x-4 pt-2 border-t border-border/50">
                <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                  <Bell className="w-4 h-4" />
                  <span>Notifications</span>
                  <Badge className="bg-primary text-primary-foreground text-xs">2</Badge>
                </Button>
                <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                  <Heart className="w-4 h-4" />
                  <span>Wishlist</span>
                  <Badge className="bg-red-500 text-white text-xs">3</Badge>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
