"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { CustomerNavbar } from "@/components/customer-navbar"
import { LandingFooter } from "@/components/landing-footer"
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

export default function CustomerPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()
  const { user, isAuthenticated } = useAuth()

  // Handle shop navigation - since this is customer page, user should be authenticated
  const handleShopNavigation = () => {
    router.push("/shop")
  }

  const featuredProducts = [
    {
      id: 1,
      name: "Diamond Necklace Set",
      price: "NPR 2,85,000",
      originalPrice: "NPR 3,20,000",
      image: "/sparkling-diamond-necklace.png",
      rating: 4.9,
      reviews: 127,
      category: "Necklaces",
    },
    {
      id: 2,
      name: "Gold Bangles (Pair)",
      price: "NPR 1,45,000",
      originalPrice: "NPR 1,65,000",
      image: "/gold-bangles.jpg",
      rating: 4.8,
      reviews: 89,
      category: "Bangles",
    },
    {
      id: 3,
      name: "Ruby Ring Collection",
      price: "NPR 95,000",
      originalPrice: "NPR 1,10,000",
      image: "/ruby-rings.jpg",
      rating: 4.9,
      reviews: 156,
      category: "Rings",
    },
    {
      id: 4,
      name: "Pearl Earrings",
      price: "NPR 65,000",
      originalPrice: "NPR 75,000",
      image: "/elegant-pearl-earrings.jpg",
      rating: 4.7,
      reviews: 94,
      category: "Earrings",
    },
    {
      id: 5,
      name: "Emerald Pendant",
      price: "NPR 1,25,000",
      originalPrice: "NPR 1,45,000",
      image: "/emerald-pendant-necklace.png",
      rating: 4.8,
      reviews: 73,
      category: "Pendants",
    },
    {
      id: 6,
      name: "Silver Chain",
      price: "NPR 35,000",
      originalPrice: "NPR 42,000",
      image: "/silver-chain-necklace.png",
      rating: 4.6,
      reviews: 112,
      category: "Chains",
    },
  ]

  const testimonials = [
    {
      name: "Priya Sharma",
      location: "Kathmandu",
      rating: 5,
      comment: "Absolutely stunning jewelry! The craftsmanship is exceptional and the service was outstanding.",
      image: "/placeholder-lcmqy.png",
    },
    {
      name: "Rajesh Thapa",
      location: "Pokhara",
      rating: 5,
      comment: "Bought my wife's wedding jewelry here. The quality and design exceeded our expectations.",
      image: "/placeholder-8hgp0.png",
    },
    {
      name: "Sunita Rai",
      location: "Lalitpur",
      rating: 5,
      comment: "Best jewelry store in Nepal! Authentic gold, beautiful designs, and honest pricing.",
      image: "/placeholder-6fcow.png",
    },
  ]

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
      {/* Customer Navigation */}
      <CustomerNavbar />

      {/* Welcome Section for Logged-in Customer */}
      <section className="py-6 sm:py-8 bg-gradient-to-r from-orange-100/50 to-amber-100/50">
        <div className="container mx-auto px-3 sm:px-4 lg:px-6">
          <div className="text-center animate-slide-in-up">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold font-serif text-gray-900 mb-2">
              Welcome back, {user?.name || 'Valued Customer'}! 👑
            </h2>
            <p className="text-sm sm:text-base text-gray-600 mb-4">
              Discover exclusive collections curated just for you
            </p>
            <Button
              onClick={handleShopNavigation}
              size="lg"
              className="luxury-gradient hover:shadow-xl transition-all duration-300 text-sm sm:text-base px-4 sm:px-6 py-2 sm:py-3"
            >
              <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
              Shop Now
            </Button>
          </div>
        </div>
      </section>

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
            {featuredProducts.map((product, index) => (
              <Card
                key={product.id}
                className="glass-card group cursor-pointer hover:shadow-xl transition-all duration-300 animate-fade-in-scale"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="relative overflow-hidden rounded-t-lg">
                  <img
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    className="w-full h-48 sm:h-56 lg:h-64 object-cover group-hover:scale-105 transition-transform duration-300 gold-shimmer"
                  />
                  <Button size="sm" variant="ghost" className="absolute top-2 sm:top-4 right-2 sm:right-4 glass-card hover:bg-white/80 p-1 sm:p-2">
                    <Heart className="h-3 w-3 sm:h-4 sm:w-4" />
                  </Button>
                  <Badge className="absolute top-2 sm:top-4 left-2 sm:left-4 luxury-gradient text-white text-xs">{product.category}</Badge>
                </div>
                <CardContent className="p-3 sm:p-4 lg:p-6">
                  <div className="flex items-center gap-1 sm:gap-2 mb-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3 w-3 sm:h-4 sm:w-4 ${i < Math.floor(product.rating) ? "text-yellow-500 fill-current" : "text-gray-300"}`}
                        />
                      ))}
                    </div>
                    <span className="text-xs sm:text-sm text-gray-600">({product.reviews})</span>
                  </div>
                  <h3 className="font-semibold text-sm sm:text-base lg:text-lg mb-2 group-hover:text-orange-600 transition-colors line-clamp-2">
                    {product.name}
                  </h3>
                  <div className="flex items-center gap-1 sm:gap-2 mb-3 sm:mb-4">
                    <span className="text-lg sm:text-xl lg:text-2xl font-bold text-orange-600">{product.price}</span>
                    <span className="text-xs sm:text-sm text-gray-500 line-through">{product.originalPrice}</span>
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
            ))}
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
      <section id="testimonials" className="py-12 sm:py-16 lg:py-20 bg-white/50">
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {testimonials.map((testimonial, index) => (
              <Card
                key={index}
                className="glass-card hover:shadow-lg transition-all duration-300 animate-fade-in-scale"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-4 sm:p-5 lg:p-6">
                  <div className="flex items-center mb-3 sm:mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5 text-yellow-500 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-3 sm:mb-4 italic text-xs sm:text-sm lg:text-base">"{testimonial.comment}"</p>
                  <div className="flex items-center gap-2 sm:gap-3">
                    <img
                      src={testimonial.image || "/placeholder.svg"}
                      alt={testimonial.name}
                      className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-full object-cover"
                    />
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
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <Input placeholder="Your Name" className="glass-card border-orange-200/50 text-sm" />
                  <Input placeholder="Your Email" className="glass-card border-orange-200/50 text-sm" />
                </div>
                <Input placeholder="Subject" className="glass-card border-orange-200/50 text-sm" />
                <textarea
                  placeholder="Your Message"
                  rows={4}
                  className="w-full px-3 py-2 glass-card border border-orange-200/50 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none text-sm"
                />
                <Button className="w-full luxury-gradient hover:shadow-lg transition-all duration-300 text-sm sm:text-base py-2 sm:py-3">
                  <Mail className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  Send Message
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <LandingFooter />
    </div>
  )
}
