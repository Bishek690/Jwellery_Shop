"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Crown,
  Star,
  Sparkles,
  Phone,
  Mail,
  MapPin,
  Clock,
  Award,
  Shield,
  Heart,
  Gift,
  ChevronRight,
  Instagram,
  Facebook,
  Twitter,
} from "lucide-react"

export function MarketingWebsite() {
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")

  const collections = [
    {
      name: "Bridal Collection",
      description: "Exquisite pieces for your special day",
      image: "/sparkling-diamond-necklace.png",
      price: "Starting from NPR 50,000",
    },
    {
      name: "Gold Jewelry",
      description: "Traditional and contemporary gold designs",
      image: "/gold-bangles.jpg",
      price: "Starting from NPR 25,000",
    },
    {
      name: "Diamond Collection",
      description: "Brilliant diamonds for timeless elegance",
      image: "/ruby-rings.jpg",
      price: "Starting from NPR 75,000",
    },
    {
      name: "Silver Jewelry",
      description: "Modern silver pieces for everyday wear",
      image: "/silver-chain-necklace.png",
      price: "Starting from NPR 5,000",
    },
  ]

  const testimonials = [
    {
      name: "Priya Sharma",
      location: "Mumbai",
      rating: 5,
      text: "Absolutely stunning jewelry! The craftsmanship is exceptional and the service is outstanding.",
    },
    {
      name: "Rajesh Kumar",
      location: "Delhi",
      rating: 5,
      text: "Found the perfect engagement ring here. The staff was incredibly helpful and knowledgeable.",
    },
    {
      name: "Anita Patel",
      location: "Ahmedabad",
      rating: 5,
      text: "Beautiful traditional designs with modern touches. Highly recommend for special occasions.",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-600/20 to-orange-600/20" />
        <div className="container mx-auto px-6 py-20 relative">
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex items-center justify-center gap-3 mb-6 animate-slide-in-up">
              <div className="p-3 luxury-gradient rounded-xl animate-glow">
                <Crown className="h-12 w-12 text-white" />
              </div>
              <div className="text-left">
                <h1 className="text-5xl font-bold font-serif text-gray-900 mb-2">Shree Hans RKS Jewellers</h1>
                <p className="text-xl text-amber-700">Where Tradition Meets Elegance</p>
              </div>
            </div>

            <p className="text-xl text-gray-700 mb-8 leading-relaxed animate-fade-in-scale">
              Discover our exquisite collection of handcrafted jewelry, featuring traditional designs with contemporary
              elegance. Each piece tells a story of timeless beauty and exceptional craftsmanship.
            </p>

            <div
              className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-scale"
              style={{ animationDelay: "0.3s" }}
            >
              <Button
                size="lg"
                className="luxury-gradient hover:shadow-xl transition-all duration-300 text-lg px-8 py-4"
              >
                <Sparkles className="h-5 w-5 mr-2" />
                Explore Collections
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-amber-300 hover:bg-amber-50 text-lg px-8 py-4 bg-transparent"
              >
                <Phone className="h-5 w-5 mr-2" />
                Contact Us
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white/50 backdrop-blur-sm">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold font-serif text-gray-900 mb-4">Why Choose Us</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Experience the finest in jewelry craftsmanship with our commitment to quality and service
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Award, title: "Premium Quality", description: "Only the finest materials and craftsmanship" },
              {
                icon: Shield,
                title: "Certified Authentic",
                description: "All jewelry comes with authenticity certificates",
              },
              { icon: Heart, title: "Custom Designs", description: "Personalized pieces crafted just for you" },
              { icon: Gift, title: "Lifetime Service", description: "Complimentary cleaning and maintenance" },
            ].map((feature, index) => (
              <Card
                key={feature.title}
                className="glass-card hover:shadow-xl transition-all duration-300 animate-slide-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardHeader className="text-center">
                  <div className="w-16 h-16 luxury-gradient rounded-full flex items-center justify-center mx-auto mb-4 animate-float">
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-xl font-semibold text-gray-900">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-center">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Collections Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold font-serif text-gray-900 mb-4">Our Collections</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover our carefully curated collections, each piece designed to celebrate life's precious moments
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {collections.map((collection, index) => (
              <Card
                key={collection.name}
                className="glass-card hover:shadow-xl transition-all duration-300 group animate-fade-in-scale"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="relative overflow-hidden rounded-t-lg aspect-square gold-shimmer">
                  <img
                    src={collection.image || "/placeholder.svg"}
                    alt={collection.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-gray-900 group-hover:text-amber-600 transition-colors">
                    {collection.name}
                  </CardTitle>
                  <CardDescription>{collection.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-amber-600">{collection.price}</span>
                    <Button size="sm" variant="ghost" className="group-hover:bg-amber-50 group-hover:text-amber-700">
                      View More <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white/50 backdrop-blur-sm">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold font-serif text-gray-900 mb-4">What Our Customers Say</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Read testimonials from our satisfied customers who trust us with their precious moments
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card
                key={testimonial.name}
                className="glass-card hover:shadow-xl transition-all duration-300 animate-slide-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardHeader>
                  <div className="flex items-center gap-1 mb-2">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-amber-500 fill-current" />
                    ))}
                  </div>
                  <CardTitle className="text-lg font-semibold text-gray-900">{testimonial.name}</CardTitle>
                  <CardDescription className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {testimonial.location}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 italic">"{testimonial.text}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-4xl font-bold font-serif text-gray-900 mb-6">Get in Touch</h2>
              <p className="text-xl text-gray-600 mb-8">
                Visit our showroom or contact us to discuss your jewelry needs. We're here to help you find the perfect
                piece.
              </p>

              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 luxury-gradient rounded-full flex items-center justify-center">
                    <MapPin className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Visit Our Showroom</h3>
                    <p className="text-gray-600">123 Jewelry Street, Mumbai, Maharashtra 400001</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 luxury-gradient rounded-full flex items-center justify-center">
                    <Phone className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Call Us</h3>
                    <p className="text-gray-600">+91 98765 43210</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 luxury-gradient rounded-full flex items-center justify-center">
                    <Clock className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Opening Hours</h3>
                    <p className="text-gray-600">Mon-Sat: 10:00 AM - 8:00 PM</p>
                  </div>
                </div>
              </div>
            </div>

            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-2xl font-semibold text-gray-900">Send us a Message</CardTitle>
                <CardDescription>We'll get back to you within 24 hours</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Input
                    placeholder="Your Name"
                    className="border-amber-200 focus:border-amber-400 focus:ring-amber-400/20"
                  />
                </div>
                <div>
                  <Input
                    type="email"
                    placeholder="Your Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border-amber-200 focus:border-amber-400 focus:ring-amber-400/20"
                  />
                </div>
                <div>
                  <Textarea
                    placeholder="Your Message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="border-amber-200 focus:border-amber-400 focus:ring-amber-400/20 min-h-[120px]"
                  />
                </div>
                <Button className="w-full luxury-gradient hover:shadow-lg transition-all duration-300">
                  <Mail className="h-4 w-4 mr-2" />
                  Send Message
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 luxury-gradient rounded-xl">
                  <Crown className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold font-serif">Shree Hans RKS</h3>
                  <p className="text-sm text-gray-400">Jewellers</p>
                </div>
              </div>
              <p className="text-gray-400 mb-4">
                Creating timeless jewelry pieces that celebrate life's precious moments.
              </p>
              <div className="flex gap-4">
                <Button size="sm" variant="ghost" className="p-2 hover:bg-amber-600">
                  <Instagram className="h-5 w-5" />
                </Button>
                <Button size="sm" variant="ghost" className="p-2 hover:bg-amber-600">
                  <Facebook className="h-5 w-5" />
                </Button>
                <Button size="sm" variant="ghost" className="p-2 hover:bg-amber-600">
                  <Twitter className="h-5 w-5" />
                </Button>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Collections</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-amber-400 transition-colors">
                    Bridal Jewelry
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-amber-400 transition-colors">
                    Gold Jewelry
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-amber-400 transition-colors">
                    Diamond Collection
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-amber-400 transition-colors">
                    Silver Jewelry
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-amber-400 transition-colors">
                    Custom Design
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-amber-400 transition-colors">
                    Jewelry Repair
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-amber-400 transition-colors">
                    Appraisal
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-amber-400 transition-colors">
                    Cleaning Service
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Contact Info</h4>
              <ul className="space-y-2 text-gray-400">
                <li className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Mumbai, Maharashtra
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  +91 98765 43210
                </li>
                <li className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  info@shreehansrks.com
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Shree Hans RKS Jewellers. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
