"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { CustomerNavbar } from "@/components/customer-navbar"
import { LandingNavbar } from "@/components/landing-navbar"
import { LandingFooter } from "@/components/landing-footer"
import { MetalPriceDisplay } from "@/components/metal-price-display"
import {
  Search,
  Star,
  Gem,
  Crown,
  Sparkles,
  Heart,
  ShoppingBag,
  Phone,
  Mail,
  MapPin,
  Award,
  Shield,
  Truck,
  Users,
} from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/hooks/use-auth"

interface Product {
  id: string
  name: string
  sku: string
  category: string
  description: string
  price: number
  cost: number
  discountPrice?: number
  weight: number
  metalType: string
  purity: string
  stock: number
  minStock: number
  status: string
  featured: boolean
  image?: string
  createdAt: string
  updatedAt: string
}

export default function CustomerLandingPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [showReviewModal, setShowReviewModal] = useState(false)
  const [selectedRating, setSelectedRating] = useState(0)
  const [reviewForm, setReviewForm] = useState({
    name: '',
    location: '',
    comment: ''
  })
  const [submittingReview, setSubmittingReview] = useState(false)
  const [reviewMessage, setReviewMessage] = useState('')
  const router = useRouter()
  const { user, isAuthenticated } = useAuth()

  // Fetch featured products
  useEffect(() => {
    fetchFeaturedProducts()
  }, [])

  const fetchFeaturedProducts = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/products?featured=true&limit=6', {
        method: 'GET',
      })

      if (response.ok) {
        const data = await response.json()
        setFeaturedProducts(data.products || [])
      }
    } catch (error) {
      console.error('Error fetching featured products:', error)
    } finally {
      setLoading(false)
    }
  }

  // Handle shop navigation with authentication check
  const handleShopNavigation = () => {
    if (!isAuthenticated || (user && user.role !== "customer")) {
      router.push("/auth/login")
    } else {
      router.push("/shop")
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NP', {
      style: 'currency',
      currency: 'NPR',
    }).format(amount)
  }

  const [approvedReviews, setApprovedReviews] = useState<any[]>([])

  // Contact form state
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  })
  const [submittingContact, setSubmittingContact] = useState(false)
  const [contactMessage, setContactMessage] = useState('')

  // Fetch approved reviews from backend
  useEffect(() => {
    fetchApprovedReviews()
  }, [])

  const fetchApprovedReviews = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reviews/approved`)
      if (response.ok) {
        const data = await response.json()
        // Only show approved reviews from backend
        if (data.length > 0) {
          setApprovedReviews(data)
        }
      }
    } catch (error) {
      console.error('Error fetching reviews:', error)
    }
  }

  // Handle review submission
  const handleSubmitReview = async () => {
    if (selectedRating === 0) {
      setReviewMessage('Please select a rating')
      return
    }

    if (!reviewForm.name || !reviewForm.location || !reviewForm.comment) {
      setReviewMessage('Please fill in all fields')
      return
    }

    try {
      setSubmittingReview(true)
      setReviewMessage('')

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reviews`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: reviewForm.name,
          location: reviewForm.location,
          rating: selectedRating,
          comment: reviewForm.comment
        })
      })

      const data = await response.json()

      if (response.ok) {
        setReviewMessage('Thank you! Your review has been submitted and will appear after admin approval.')
        setTimeout(() => {
          setShowReviewModal(false)
          setReviewForm({ name: '', location: '', comment: '' })
          setSelectedRating(0)
          setReviewMessage('')
        }, 3000)
      } else {
        setReviewMessage(data.message || 'Failed to submit review')
      }
    } catch (error) {
      console.error('Error submitting review:', error)
      setReviewMessage('Failed to submit review. Please try again.')
    } finally {
      setSubmittingReview(false)
    }
  }

  // Handle contact form submission
  const handleSubmitContact = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!contactForm.name || !contactForm.email || !contactForm.message) {
      setContactMessage('Please fill in all required fields')
      return
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(contactForm.email)) {
      setContactMessage('Please enter a valid email address')
      return
    }

    try {
      setSubmittingContact(true)
      setContactMessage('')

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/contacts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(contactForm)
      })

      const data = await response.json()

      if (response.ok) {
        setContactMessage(data.message || 'Thank you! Your message has been sent successfully.')
        setContactForm({ name: '', email: '', phone: '', subject: '', message: '' })
        setTimeout(() => {
          setContactMessage('')
        }, 5000)
      } else {
        setContactMessage(data.message || 'Failed to send message. Please try again.')
      }
    } catch (error) {
      console.error('Error submitting contact form:', error)
      setContactMessage('Failed to send message. Please try again.')
    } finally {
      setSubmittingContact(false)
    }
  }

  const services = [
    {
      icon: Gem,
      title: "Custom Jewelry Design",
      description: "Create unique pieces tailored to your vision with our master craftsmen",
      features: ["3D Design Preview", "Personal Consultation", "Lifetime Warranty"],
    },
    {
      icon: Award,
      title: "Jewelry Repair & Restoration",
      description: "Expert restoration services to bring your precious pieces back to life",
      features: ["Free Assessment", "Original Techniques", "Quick Turnaround"],
    },
    {
      icon: Shield,
      title: "Certification & Appraisal",
      description: "Professional certification and appraisal services for insurance",
      features: ["GIA Certified", "Insurance Documentation", "Market Valuation"],
    },
    {
      icon: Crown,
      title: "Bridal Collections",
      description: "Complete bridal jewelry sets for your special day",
      features: ["Traditional Designs", "Modern Styles", "Matching Sets"],
    },
  ]

  const certifications = [
    { name: "GIA Certified", logo: "/placeholder-z5qam.png" },
    { name: "Nepal Gold Association", logo: "/placeholder-0wf8r.png" },
    { name: "ISO 9001:2015", logo: "/iso-9001-certification-logo.png" },
    { name: "Hallmark Certified", logo: "/placeholder-wzu54.png" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50">
      {/* Navigation - Conditional based on authentication */}
      {isAuthenticated && user?.role === "customer" ? (
        <CustomerNavbar />
      ) : (
        <LandingNavbar />
      )}

      {/* Hero Section */}
      <section className="relative py-12 sm:py-16 lg:py-20 overflow-hidden">
        <div className="container mx-auto px-3 sm:px-4 lg:px-6">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="animate-slide-in-up">
              <Badge className="luxury-gradient text-white mb-3 sm:mb-4 animate-float text-xs sm:text-sm">
                <Award className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                Nepal's Premier Jewelry Store
              </Badge>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold font-serif text-gray-900 mb-4 sm:mb-6 text-balance leading-tight">
                Exquisite Jewelry for
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600"> Life's Precious Moments</span>
              </h1>
              <p className="text-base sm:text-lg lg:text-xl text-gray-600 mb-6 sm:mb-8 text-pretty">
                Discover our handcrafted collection of gold, diamond, and precious stone jewelry. Each piece tells a
                story of tradition, elegance, and timeless beauty.
              </p>

              {/* Search Bar */}
              <div className="relative mb-6 sm:mb-8">
                <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 sm:h-5 sm:w-5" />
                <Input
                  placeholder="Search for rings, necklaces, earrings..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 sm:pl-12 pr-3 sm:pr-4 py-3 sm:py-4 text-sm sm:text-base lg:text-lg glass-card border-orange-200/50 focus:border-orange-400"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Button
                  onClick={handleShopNavigation}
                  size="lg"
                  className="luxury-gradient hover:shadow-xl transition-all duration-300 animate-fade-in-scale text-sm sm:text-base px-4 sm:px-6 py-3 sm:py-4"
                >
                  <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                  Explore Collection
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="hover:bg-orange-50 transition-all duration-300 bg-transparent text-xs sm:text-sm px-3 sm:px-4 py-3 sm:py-4"
                >
                  <Phone className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">Call Us: +977-1-4567890</span>
                  <span className="sm:hidden">Call Us</span>
                </Button>
              </div>
            </div>

            <div className="relative animate-fade-in-scale order-first lg:order-last">
              <div className="relative">
                <img
                  src="/sparkling-diamond-necklace.png"
                  alt="Featured Jewelry"
                  className="w-full h-auto rounded-xl sm:rounded-2xl shadow-xl sm:shadow-2xl gold-shimmer"
                />
                <div className="absolute -top-2 sm:-top-4 -right-2 sm:-right-4 glass-card p-2 sm:p-4 rounded-lg sm:rounded-xl animate-float">
                  <div className="flex items-center gap-1 sm:gap-2">
                    <Star className="h-3 w-3 sm:h-5 sm:w-5 text-yellow-500 fill-current" />
                    <span className="font-bold text-xs sm:text-base">4.9</span>
                    <span className="text-sm text-gray-600">(500+ reviews)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 sm:py-16 bg-white/50">
        <div className="container mx-auto px-3 sm:px-4 lg:px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {[
              { icon: Shield, title: "Certified Authentic", desc: "100% genuine gold & diamonds" },
              { icon: Truck, title: "Free Delivery", desc: "Free shipping across Nepal" },
              { icon: Award, title: "Lifetime Warranty", desc: "Comprehensive coverage" },
              { icon: Users, title: "Expert Craftsmen", desc: "Traditional artisanship" },
            ].map((feature, index) => (
              <Card
                key={index}
                className="glass-card text-center hover:shadow-lg transition-all duration-300 animate-slide-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="pt-3 sm:pt-4 lg:pt-6 p-3 sm:p-4 lg:p-6">
                  <feature.icon className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 text-orange-600 mx-auto mb-2 sm:mb-3 lg:mb-4 animate-float" />
                  <h3 className="font-semibold mb-1 sm:mb-2 text-xs sm:text-sm lg:text-base">{feature.title}</h3>
                  <p className="text-xs sm:text-sm text-gray-600">{feature.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Collections */}
      <section id="collections" className="py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto px-3 sm:px-4 lg:px-6">
          {/* Metal Prices Display */}
          <div className="mb-8 sm:mb-12 animate-slide-in-up">
            <MetalPriceDisplay />
          </div>

          <div className="text-center mb-12 sm:mb-16 animate-slide-in-up">
            <Badge className="luxury-gradient text-white mb-3 sm:mb-4 text-xs sm:text-sm">
              <Gem className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              Featured Collections
            </Badge>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-serif text-gray-900 mb-3 sm:mb-4">Handpicked for You</h2>
            <p className="text-sm sm:text-base lg:text-xl text-gray-600 max-w-2xl mx-auto text-pretty">
              Discover our most popular pieces, each crafted with precision and designed to celebrate life's special
              moments.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {loading ? (
              // Loading skeleton
              [...Array(6)].map((_, index) => (
                <Card key={index} className="glass-card animate-pulse">
                  <div className="h-48 sm:h-56 lg:h-64 bg-gray-200 rounded-t-lg"></div>
                  <CardContent className="p-3 sm:p-4 lg:p-6">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-6 bg-gray-200 rounded mb-2"></div>
                    <div className="h-8 bg-gray-200 rounded mb-3"></div>
                    <div className="h-10 bg-gray-200 rounded"></div>
                  </CardContent>
                </Card>
              ))
            ) : featuredProducts.length > 0 ? (
              featuredProducts.map((product, index) => (
                <Card
                  key={product.id}
                  className="glass-card group cursor-pointer hover:shadow-xl transition-all duration-300 animate-fade-in-scale"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="relative overflow-hidden rounded-t-lg">
                    <img
                      src={product.image ? `${process.env.NEXT_PUBLIC_API_URL}/${product.image}` : "/placeholder.svg"}
                      alt={product.name}
                      className="w-full h-48 sm:h-56 lg:h-64 object-cover group-hover:scale-105 transition-transform duration-300 gold-shimmer"
                    />
                    <Button size="sm" variant="ghost" className="absolute top-2 sm:top-4 right-2 sm:right-4 glass-card hover:bg-white/80 p-1 sm:p-2">
                      <Heart className="h-3 w-3 sm:h-4 sm:w-4" />
                    </Button>
                    <Badge className="absolute top-2 sm:top-4 left-2 sm:left-4 luxury-gradient text-white text-xs">
                      {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
                    </Badge>
                    {product.featured && (
                      <Badge className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 bg-yellow-500 text-white text-xs">
                        <Star className="h-3 w-3 mr-1 fill-current" />
                        Featured
                      </Badge>
                    )}
                  </div>
                  <CardContent className="p-3 sm:p-4 lg:p-6">
                    <div className="flex items-center gap-1 sm:gap-2 mb-2">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-3 w-3 sm:h-4 sm:w-4 ${i < 4 ? "text-yellow-500 fill-current" : "text-gray-300"}`}
                          />
                        ))}
                      </div>
                      <span className="text-xs sm:text-sm text-gray-600">({product.stock} in stock)</span>
                    </div>
                    <h3 className="font-semibold text-sm sm:text-base lg:text-lg mb-2 group-hover:text-orange-600 transition-colors line-clamp-2">
                      {product.name}
                    </h3>
                    <div className="flex items-center gap-1 sm:gap-2 mb-3 sm:mb-4">
                      <span className="text-lg sm:text-xl lg:text-2xl font-bold text-orange-600">
                        {formatCurrency(product.discountPrice || product.price)}
                      </span>
                      {product.discountPrice && (
                        <span className="text-xs sm:text-sm text-gray-500 line-through">
                          {formatCurrency(product.price)}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-600 mb-3">
                      <Badge variant="outline" className="text-xs">
                        {product.metalType}
                      </Badge>
                      {product.purity && (
                        <Badge variant="outline" className="text-xs">
                          {product.purity}
                        </Badge>
                      )}
                    </div>
                    <Button 
                      onClick={handleShopNavigation}
                      className="w-full luxury-gradient hover:shadow-lg transition-all duration-300 text-xs sm:text-sm py-2"
                    >
                      <ShoppingBag className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                      Add to Cart
                    </Button>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <Gem className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                <p className="text-gray-500">No featured products available at the moment.</p>
              </div>
            )}
          </div>

          <div className="text-center mt-8 sm:mt-12">
            <Button
              onClick={handleShopNavigation}
              size="lg"
              variant="outline"
              className="hover:bg-orange-50 transition-all duration-300 bg-transparent text-sm sm:text-base px-4 sm:px-6 py-2 sm:py-3"
            >
              View All Collections
            </Button>
          </div>
        </div>
      </section>

      <section id="services" className="py-12 sm:py-16 lg:py-20 bg-white/50">
        <div className="container mx-auto px-3 sm:px-4 lg:px-6">
          <div className="text-center mb-12 sm:mb-16 animate-slide-in-up">
            <Badge className="luxury-gradient text-white mb-3 sm:mb-4 text-xs sm:text-sm">
              <Crown className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              Our Services
            </Badge>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-serif text-gray-900 mb-3 sm:mb-4">Professional Jewelry Services</h2>
            <p className="text-sm sm:text-base lg:text-xl text-gray-600 max-w-2xl mx-auto text-pretty">
              From custom design to expert repairs, we offer comprehensive jewelry services with decades of experience
              and traditional craftsmanship.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {services.map((service, index) => (
              <Card
                key={index}
                className="glass-card group hover:shadow-xl transition-all duration-300 animate-fade-in-scale"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-4 sm:p-5 lg:p-6 text-center">
                  <div className="p-2 sm:p-3 lg:p-4 luxury-gradient rounded-full w-fit mx-auto mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300">
                    <service.icon className="h-5 w-5 sm:h-6 sm:w-6 lg:h-8 lg:w-8 text-white" />
                  </div>
                  <h3 className="font-semibold text-sm sm:text-base lg:text-lg mb-2 sm:mb-3 group-hover:text-orange-600 transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 mb-3 sm:mb-4 text-xs sm:text-sm">{service.description}</p>
                  <div className="space-y-1 sm:space-y-2">
                    {service.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-500">
                        <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-orange-500 rounded-full flex-shrink-0"></div>
                        <span className="text-center">{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-8 sm:mt-12">
            <Button size="lg" className="luxury-gradient hover:shadow-xl transition-all duration-300 text-sm sm:text-base px-4 sm:px-6 py-2 sm:py-3">
              <Phone className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2" />
              Book Consultation
            </Button>
          </div>
        </div>
      </section>

      <section id="about" className="py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto px-3 sm:px-4 lg:px-6">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="animate-slide-in-up order-2 lg:order-1">
              <Badge className="luxury-gradient text-white mb-3 sm:mb-4 text-xs sm:text-sm">
                <Award className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                Our Story
              </Badge>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-serif text-gray-900 mb-4 sm:mb-6">Three Generations of Excellence</h2>
              <p className="text-sm sm:text-base lg:text-lg text-gray-600 mb-4 sm:mb-6 text-pretty">
                Since 1975, Shree Hans RKS Jewellers has been Nepal's trusted name in fine jewelry. Founded by master
                craftsman Hans Bahadur, our family business has grown from a small workshop to Nepal's premier jewelry
                destination.
              </p>
              <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8 text-pretty">
                We combine traditional Nepali craftsmanship with modern design techniques, ensuring each piece meets the
                highest standards of quality and beauty. Our commitment to authenticity and customer satisfaction has
                earned us the trust of thousands of families across Nepal.
              </p>

              <div className="grid grid-cols-3 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
                <div className="text-center">
                  <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-orange-600 mb-1 sm:mb-2">50+</div>
                  <div className="text-xs sm:text-sm text-gray-600">Years Experience</div>
                </div>
                <div className="text-center">
                  <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-orange-600 mb-1 sm:mb-2">10K+</div>
                  <div className="text-xs sm:text-sm text-gray-600">Happy Customers</div>
                </div>
                <div className="text-center">
                  <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-orange-600 mb-1 sm:mb-2">500+</div>
                  <div className="text-xs sm:text-sm text-gray-600">Unique Designs</div>
                </div>
              </div>

              <Button
                size="lg"
                variant="outline"
                className="hover:bg-orange-50 transition-all duration-300 bg-transparent text-sm sm:text-base px-4 sm:px-6 py-2 sm:py-3"
              >
                <Users className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2" />
                Meet Our Team
              </Button>
            </div>

            <div className="relative animate-fade-in-scale order-1 lg:order-2">
              <img
                src="/traditional-jewelry-craftsman-working.jpg"
                alt="Master Craftsman at Work"
                className="w-full h-auto rounded-xl sm:rounded-2xl shadow-xl sm:shadow-2xl"
              />
              <div className="absolute -bottom-3 sm:-bottom-6 -left-3 sm:-left-6 glass-card p-3 sm:p-6 rounded-lg sm:rounded-xl animate-float">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="p-1 sm:p-2 luxury-gradient rounded-lg">
                    <Award className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
                  </div>
                  <div>
                    <div className="font-bold text-xs sm:text-sm lg:text-base">Master Craftsman</div>
                    <div className="text-xs sm:text-sm text-gray-600">50+ Years Experience</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 bg-white/50">
        <div className="container mx-auto px-3 sm:px-4 lg:px-6">
          <div className="text-center mb-8 sm:mb-12 animate-slide-in-up">
            <Badge className="luxury-gradient text-white mb-3 sm:mb-4 text-xs sm:text-sm">
              <Shield className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              Trusted & Certified
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-bold font-serif text-gray-900 mb-3 sm:mb-4">Our Certifications</h2>
            <p className="text-sm sm:text-base lg:text-lg text-gray-600 max-w-2xl mx-auto text-pretty">
              We maintain the highest standards of quality and authenticity, certified by leading jewelry organizations.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {certifications.map((cert, index) => (
              <div
                key={index}
                className="glass-card p-3 sm:p-4 lg:p-6 text-center hover:shadow-lg transition-all duration-300 animate-fade-in-scale"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <img
                  src={cert.logo || "/placeholder.svg"}
                  alt={cert.name}
                  className="h-8 sm:h-10 lg:h-12 mx-auto mb-2 sm:mb-3 opacity-70 hover:opacity-100 transition-opacity duration-300"
                />
                <p className="text-xs sm:text-sm font-medium text-gray-700">{cert.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-12 sm:py-16 lg:py-20 bg-white/50 overflow-hidden">
        <div className="container mx-auto px-3 sm:px-4 lg:px-6">
          <div className="text-center mb-12 sm:mb-16 animate-slide-in-up">
            <Badge className="luxury-gradient text-white mb-3 sm:mb-4 text-xs sm:text-sm">
              <Users className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              Customer Reviews
            </Badge>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-serif text-gray-900 mb-3 sm:mb-4">What Our Customers Say</h2>
            <p className="text-sm sm:text-base lg:text-xl text-gray-600 max-w-2xl mx-auto text-pretty">
              Join thousands of satisfied customers who trust us for their precious jewelry needs.
            </p>
          </div>

          {approvedReviews.length > 0 ? (
            <div className="relative">
              <div className="overflow-hidden">
                <div 
                  className="flex gap-4 sm:gap-6 lg:gap-8 animate-scroll-reviews"
                  style={{
                    animation: 'scroll-left 90s linear infinite',
                  }}
                >
                  {/* Duplicate reviews for seamless loop */}
                  {[...approvedReviews, ...approvedReviews].map((testimonial, index) => (
                    <Card
                      key={index}
                      className="glass-card hover:shadow-lg transition-all duration-300 flex-shrink-0 w-[280px] sm:w-[320px] lg:w-[380px]"
                    >
                      <CardContent className="p-4 sm:p-5 lg:p-6">
                        <div className="flex items-center mb-3 sm:mb-4">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <Star key={i} className="h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5 text-yellow-500 fill-current" />
                          ))}
                        </div>
                        <p className="text-gray-700 mb-3 sm:mb-4 italic text-xs sm:text-sm lg:text-base line-clamp-3">"{testimonial.comment}"</p>
                        <div className="flex items-center gap-2 sm:gap-3">
                          <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-full bg-gradient-to-br from-orange-400 to-amber-600 flex items-center justify-center text-white font-semibold">
                            {testimonial.name.charAt(0)}
                          </div>
                          <div>
                            <h4 className="font-semibold text-xs sm:text-sm lg:text-base">{testimonial.name}</h4>
                            <p className="text-xs sm:text-sm text-gray-600">{testimonial.location}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <Star className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <p className="text-gray-500">No reviews yet. Be the first to share your experience!</p>
            </div>
          )}
        </div>

        {/* Add CSS for animation */}
        <style jsx>{`
          @keyframes scroll-left {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(-50%);
            }
          }
          
          .animate-scroll-reviews:hover {
            animation-play-state: paused;
          }
        `}</style>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto px-3 sm:px-4 lg:px-6">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            <div className="animate-slide-in-up">
              <Badge className="luxury-gradient text-white mb-3 sm:mb-4 text-xs sm:text-sm">
                <MapPin className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                Visit Our Store
              </Badge>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-serif text-gray-900 mb-4 sm:mb-6">Get in Touch</h2>
              <p className="text-sm sm:text-base lg:text-xl text-gray-600 mb-6 sm:mb-8 text-pretty">
                Visit our showroom to experience our exquisite collection in person. Our expert staff is ready to help
                you find the perfect piece.
              </p>

              <div className="space-y-4 sm:space-y-6">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="p-2 sm:p-3 luxury-gradient rounded-lg flex-shrink-0">
                    <MapPin className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm sm:text-base">Address</h3>
                    <p className="text-gray-600 text-xs sm:text-sm lg:text-base">New Road, Kathmandu, Nepal</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="p-2 sm:p-3 luxury-gradient rounded-lg flex-shrink-0">
                    <Phone className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm sm:text-base">Phone</h3>
                    <p className="text-gray-600 text-xs sm:text-sm lg:text-base">+977-1-4567890</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="p-2 sm:p-3 luxury-gradient rounded-lg flex-shrink-0">
                    <Mail className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm sm:text-base">Email</h3>
                    <p className="text-gray-600 text-xs sm:text-sm lg:text-base">info@shreehansrks.com</p>
                  </div>
                </div>
              </div>
            </div>

            <Card className="glass-card animate-fade-in-scale">
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="text-lg sm:text-xl">Send us a Message</CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  We'd love to hear from you. Send us a message and we'll respond as soon as possible.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4 p-4 sm:p-6 pt-0">
                {contactMessage && (
                  <div className={`p-3 rounded-lg text-sm ${contactMessage.includes('Thank you') || contactMessage.includes('success') ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
                    {contactMessage}
                  </div>
                )}
                
                <form onSubmit={handleSubmitContact} className="space-y-3 sm:space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <Input 
                      placeholder="Your Name *" 
                      value={contactForm.name}
                      onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                      className="glass-card border-orange-200/50 text-sm" 
                      required
                    />
                    <Input 
                      type="email"
                      placeholder="Your Email *" 
                      value={contactForm.email}
                      onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                      className="glass-card border-orange-200/50 text-sm" 
                      required
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <Input 
                      placeholder="Phone (Optional)" 
                      value={contactForm.phone}
                      onChange={(e) => setContactForm({...contactForm, phone: e.target.value})}
                      className="glass-card border-orange-200/50 text-sm" 
                    />
                    <Input 
                      placeholder="Subject (Optional)" 
                      value={contactForm.subject}
                      onChange={(e) => setContactForm({...contactForm, subject: e.target.value})}
                      className="glass-card border-orange-200/50 text-sm" 
                    />
                  </div>
                  <textarea
                    placeholder="Your Message *"
                    rows={4}
                    value={contactForm.message}
                    onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                    className="w-full px-3 py-2 glass-card border border-orange-200/50 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none text-sm"
                    required
                  />
                  <Button 
                    type="submit"
                    disabled={submittingContact}
                    className="w-full luxury-gradient hover:shadow-lg transition-all duration-300 text-sm sm:text-base py-2 sm:py-3"
                  >
                    <Mail className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                    {submittingContact ? 'Sending...' : 'Send Message'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <LandingFooter />

      {/* Floating Review Button */}
      <div className="fixed bottom-6 right-6 z-50 animate-fade-in-scale">
        <Button
          onClick={() => {
            if (!isAuthenticated || (user && user.role !== "customer")) {
              router.push("/auth/login")
            } else {
              setShowReviewModal(true)
            }
          }}
          size="lg"
          className="luxury-gradient hover:shadow-2xl transition-all duration-300 rounded-full p-4 sm:p-6 group animate-float shadow-xl"
        >
          <div className="flex items-center gap-2">
            <Star className="h-5 w-5 sm:h-6 sm:w-6 text-white group-hover:scale-110 transition-transform duration-300 fill-current" />
            <span className="hidden sm:inline font-semibold">Review</span>
          </div>
        </Button>
      </div>

      {/* Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <Card className="glass-card max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-slide-in-up">
            <CardHeader className="p-4 sm:p-6 border-b">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl sm:text-2xl flex items-center gap-2">
                    <Star className="h-6 w-6 text-orange-600 fill-current" />
                    Write a Review
                  </CardTitle>
                  <CardDescription className="text-sm mt-2">
                    Share your experience with Shree Hans RKS Jewellers
                  </CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowReviewModal(false)}
                  className="hover:bg-gray-100"
                >
                  ✕
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 sm:space-y-6 p-4 sm:p-6">
              {reviewMessage && (
                <div className={`p-3 rounded-lg text-sm ${reviewMessage.includes('Thank you') ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
                  {reviewMessage}
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium mb-2">Your Rating *</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      type="button"
                      onClick={() => setSelectedRating(rating)}
                      className="hover:scale-110 transition-transform duration-200"
                    >
                      <Star 
                        className={`h-8 w-8 stroke-2 cursor-pointer transition-colors duration-200 ${
                          rating <= selectedRating 
                            ? 'text-yellow-500 fill-current stroke-yellow-600' 
                            : 'text-gray-300 stroke-gray-400 hover:text-yellow-400 hover:stroke-yellow-500'
                        }`} 
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Your Name *</label>
                  <Input
                    placeholder="Enter your name"
                    value={reviewForm.name}
                    onChange={(e) => setReviewForm({...reviewForm, name: e.target.value})}
                    className="glass-card border-orange-200/50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Location *</label>
                  <Input
                    placeholder="City, Nepal"
                    value={reviewForm.location}
                    onChange={(e) => setReviewForm({...reviewForm, location: e.target.value})}
                    className="glass-card border-orange-200/50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Your Review *</label>
                <textarea
                  placeholder="Tell us about your experience..."
                  rows={6}
                  value={reviewForm.comment}
                  onChange={(e) => setReviewForm({...reviewForm, comment: e.target.value})}
                  className="w-full px-3 py-2 glass-card border border-orange-200/50 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none text-sm"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  onClick={() => {
                    setShowReviewModal(false)
                    setReviewForm({ name: '', location: '', comment: '' })
                    setSelectedRating(0)
                    setReviewMessage('')
                  }}
                  variant="outline"
                  className="flex-1"
                  disabled={submittingReview}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmitReview}
                  disabled={submittingReview}
                  className="flex-1 luxury-gradient hover:shadow-lg transition-all duration-300"
                >
                  <Star className="h-4 w-4 mr-2 fill-current" />
                  {submittingReview ? 'Submitting...' : 'Submit Review'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
