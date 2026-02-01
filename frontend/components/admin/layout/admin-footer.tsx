"use client"

import { Heart } from "lucide-react"
import Link from "next/link"
import packageJson from "@/../../package.json"

export function AdminFooter() {
  const currentYear = new Date().getFullYear()
  const version = packageJson.version
  
  return (
    <footer className="bg-white/80 backdrop-blur-sm border-t border-gray-200 mt-auto flex-shrink-0">
      <div className="px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs sm:text-sm text-gray-600">
          {/* Left side - Copyright & Developer info */}
          <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2">
            <p className="flex items-center gap-1">
              <span>© {currentYear} Jewelry Shop.</span>
            </p>
            <span className="text-gray-400 hidden sm:inline">|</span>
            <span className="flex items-center gap-1">
              Developed with <Heart className="h-3 w-3 text-red-500 fill-red-500 animate-pulse" /> by
              <Link 
                  href="https://yourwebsite.com" 
                  target="_blank"
                  className="font-semibold text-orange-600 hover:text-orange-700 transition-colors"
                >
                  Primesoft Tech
                </Link>
              </span>
          </div>

          {/* Right side - Version */}
          <div className="flex items-center">
            <span className="text-gray-500 font-medium">v{version}</span>
          </div>
        </div>
      </div>
    </footer>
  )
}