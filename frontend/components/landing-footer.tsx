"use client"

import { Crown } from "lucide-react"

export function LandingFooter() {
  return (
    <footer className="bg-gray-900 text-white py-12 sm:py-16">
      <div className="container mx-auto px-3 sm:px-4 lg:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 sm:gap-8">
          <div className="sm:col-span-2 lg:col-span-2">
            <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
              <div className="p-2 luxury-gradient rounded-xl">
                <Crown className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-bold font-serif">Shree Hans RKS Jewellers</h3>
                <p className="text-xs sm:text-sm text-gray-400">Premium Jewelry Collection</p>
              </div>
            </div>
            <p className="text-gray-400 mb-4 sm:mb-6 text-xs sm:text-sm lg:text-base">
              Nepal's premier destination for authentic, handcrafted jewelry that celebrates tradition and elegance.
              Three generations of excellence in fine jewelry craftsmanship.
            </p>
            <div className="flex gap-3 sm:gap-4">
              {/* Social media links can be added here */}
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Collections</h4>
            <div className="space-y-1.5 sm:space-y-2">
              <a href="#" className="block text-gray-400 hover:text-white transition-colors text-xs sm:text-sm">
                Diamond Jewelry
              </a>
              <a href="#" className="block text-gray-400 hover:text-white transition-colors text-xs sm:text-sm">
                Gold Ornaments
              </a>
              <a href="#" className="block text-gray-400 hover:text-white transition-colors text-xs sm:text-sm">
                Bridal Sets
              </a>
              <a href="#" className="block text-gray-400 hover:text-white transition-colors text-xs sm:text-sm">
                Custom Designs
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Services</h4>
            <div className="space-y-1.5 sm:space-y-2">
              <a href="#" className="block text-gray-400 hover:text-white transition-colors text-xs sm:text-sm">
                Custom Design
              </a>
              <a href="#" className="block text-gray-400 hover:text-white transition-colors text-xs sm:text-sm">
                Repair & Restoration
              </a>
              <a href="#" className="block text-gray-400 hover:text-white transition-colors text-xs sm:text-sm">
                Certification
              </a>
              <a href="#" className="block text-gray-400 hover:text-white transition-colors text-xs sm:text-sm">
                Consultation
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Support</h4>
            <div className="space-y-1.5 sm:space-y-2">
              <a href="#" className="block text-gray-400 hover:text-white transition-colors text-xs sm:text-sm">
                Contact Us
              </a>
              <a href="#" className="block text-gray-400 hover:text-white transition-colors text-xs sm:text-sm">
                Size Guide
              </a>
              <a href="#" className="block text-gray-400 hover:text-white transition-colors text-xs sm:text-sm">
                Care Instructions
              </a>
              <a href="#" className="block text-gray-400 hover:text-white transition-colors text-xs sm:text-sm">
                Warranty
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 sm:mt-12 pt-6 sm:pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-3 sm:gap-4">
            <p className="text-gray-400 text-center md:text-left text-xs sm:text-sm">
              © 2024 Shree Hans RKS Jewellers. All rights reserved.
            </p>
            <div className="flex gap-4 sm:gap-6 text-xs sm:text-sm">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
