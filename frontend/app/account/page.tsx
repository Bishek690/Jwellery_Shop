"use client"

import { useState } from "react"
import { CustomerNavbar } from "@/components/customer-navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  User,
  Package,
  Heart,
  Settings,
  Calendar,
  Star,
  Eye,
  Crown,
  Gift,
  MapPin,
  Truck,
  CheckCircle,
  Clock,
  Award,
} from "lucide-react"
import Image from "next/image"

const orderHistory = [
  {
    id: "ORD-2024-001",
    date: "2024-01-15",
    status: "Delivered",
    total: 125000,
    items: [{ name: "Diamond Solitaire Ring", price: 125000, image: "/sparkling-diamond-necklace.png" }],
    trackingSteps: [
      { label: "Order Placed", completed: true, date: "Jan 15" },
      { label: "Processing", completed: true, date: "Jan 16" },
      { label: "Shipped", completed: true, date: "Jan 18" },
      { label: "Delivered", completed: true, date: "Jan 20" },
    ],
  },
  {
    id: "ORD-2024-002",
    date: "2024-01-10",
    status: "Processing",
    total: 85000,
    items: [{ name: "Gold Bangles Set", price: 85000, image: "/gold-bangles.jpg" }],
    trackingSteps: [
      { label: "Order Placed", completed: true, date: "Jan 10" },
      { label: "Processing", completed: true, date: "Jan 11" },
      { label: "Shipped", completed: false, date: "Pending" },
      { label: "Delivered", completed: false, date: "Pending" },
    ],
  },
]

const wishlistItems = [
  { id: "1", name: "Pearl Drop Earrings", price: 45000, image: "/elegant-pearl-earrings.jpg", inStock: true },
  { id: "2", name: "Emerald Pendant", price: 75000, image: "/emerald-pendant-necklace.png", inStock: false },
  { id: "3", name: "Silver Chain Necklace", price: 25000, image: "/silver-chain-necklace.png", inStock: true },
]

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState("overview")

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Delivered":
        return "bg-green-100 text-green-800 border-green-200"
      case "Processing":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "Shipped":
        return "bg-blue-100 text-blue-800 border-blue-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      <CustomerNavbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 animate-slide-in-up">
          <div className="glass-card rounded-2xl p-8 hover-lift">
            <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
              <div className="relative">
                <Avatar className="w-24 h-24 border-4 border-primary/20 shadow-lg">
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-bold">PS</AvatarFallback>
                </Avatar>
                <div className="absolute -top-2 -right-2 bg-primary rounded-full p-2 animate-pulse-ring">
                  <Crown className="w-4 h-4 text-primary-foreground" />
                </div>
              </div>
              <div className="text-center md:text-left flex-1">
                <h1 className="text-3xl font-bold text-foreground mb-2">Welcome back, Priya!</h1>
                <p className="text-muted-foreground mb-4">VIP Customer since 2020</p>
                <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                  <Badge className="bg-gradient-to-r from-primary to-accent text-primary-foreground border-0 px-4 py-1">
                    <Crown className="w-3 h-3 mr-1" />
                    Platinum Member
                  </Badge>
                  <Badge variant="outline" className="border-primary/30 text-primary">
                    <Award className="w-3 h-3 mr-1" />
                    Loyalty Points: 2,450
                  </Badge>
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">₹3.2L</div>
                <p className="text-sm text-muted-foreground">Total Purchases</p>
              </div>
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 h-auto p-1 bg-card/50 backdrop-blur-sm">
            <TabsTrigger
              value="overview"
              className="flex items-center space-x-2 py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger
              value="orders"
              className="flex items-center space-x-2 py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Package className="w-4 h-4" />
              <span className="hidden sm:inline">Orders</span>
            </TabsTrigger>
            <TabsTrigger
              value="wishlist"
              className="flex items-center space-x-2 py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Heart className="w-4 h-4" />
              <span className="hidden sm:inline">Wishlist</span>
            </TabsTrigger>
            <TabsTrigger
              value="profile"
              className="flex items-center space-x-2 py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Profile</span>
            </TabsTrigger>
            <TabsTrigger
              value="rewards"
              className="flex items-center space-x-2 py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Gift className="w-4 h-4" />
              <span className="hidden sm:inline">Rewards</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6 animate-fade-in-scale">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="hover-lift hover-glow">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-primary/10 rounded-full">
                      <Package className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">12</p>
                      <p className="text-sm text-muted-foreground">Total Orders</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="hover-lift hover-glow">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-green-100 rounded-full">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">10</p>
                      <p className="text-sm text-muted-foreground">Completed</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="hover-lift hover-glow">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-red-100 rounded-full">
                      <Heart className="w-6 h-6 text-red-500" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">8</p>
                      <p className="text-sm text-muted-foreground">Wishlist Items</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="hover-lift hover-glow">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-yellow-100 rounded-full">
                      <Award className="w-6 h-6 text-yellow-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">2,450</p>
                      <p className="text-sm text-muted-foreground">Reward Points</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="hover-lift">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Clock className="w-5 h-5 text-primary" />
                    <span>Recent Activity</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <div>
                      <p className="font-medium">Order delivered</p>
                      <p className="text-sm text-muted-foreground">Diamond Solitaire Ring - 2 days ago</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                    <Heart className="w-5 h-5 text-red-500" />
                    <div>
                      <p className="font-medium">Added to wishlist</p>
                      <p className="text-sm text-muted-foreground">Pearl Drop Earrings - 5 days ago</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover-lift">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Gift className="w-5 h-5 text-primary" />
                    <span>Membership Benefits</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Next Tier Progress</span>
                      <span>75%</span>
                    </div>
                    <Progress value={75} className="h-2" />
                    <p className="text-xs text-muted-foreground">₹50,000 more to reach Diamond tier</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm">Free shipping on all orders</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm">Priority customer support</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm">Exclusive member discounts</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Orders Section */}
          <TabsContent value="orders" className="animate-fade-in-scale">
            <div className="space-y-6">
              {orderHistory.map((order) => (
                <Card key={order.id} className="hover-lift">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="font-semibold text-lg">{order.id}</h4>
                        <p className="text-sm text-muted-foreground flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {new Date(order.date).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                        <p className="font-bold text-lg mt-1">{formatPrice(order.total)}</p>
                      </div>
                    </div>

                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-2">
                        {order.trackingSteps.map((step, index) => (
                          <div key={index} className="flex flex-col items-center flex-1">
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                step.completed ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                              }`}
                            >
                              {step.completed ? <CheckCircle className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                            </div>
                            <p className="text-xs mt-1 text-center">{step.label}</p>
                            <p className="text-xs text-muted-foreground">{step.date}</p>
                          </div>
                        ))}
                      </div>
                      <div className="flex items-center">
                        {order.trackingSteps.map((step, index) => (
                          <div key={index} className="flex-1 flex items-center">
                            {index < order.trackingSteps.length - 1 && (
                              <div
                                className={`h-1 flex-1 ${
                                  step.completed && order.trackingSteps[index + 1]?.completed
                                    ? "bg-primary"
                                    : "bg-muted"
                                }`}
                              />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex items-center space-x-4 p-3 bg-muted/30 rounded-lg">
                          <Image
                            src={item.image || "/placeholder.svg"}
                            alt={item.name}
                            width={60}
                            height={60}
                            className="rounded-md object-cover"
                          />
                          <div className="flex-1">
                            <p className="font-medium">{item.name}</p>
                            <p className="text-sm text-muted-foreground">{formatPrice(item.price)}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex space-x-2 mt-4">
                      <Button variant="outline" size="sm" className="hover-glow bg-transparent">
                        <Eye className="w-4 h-4 mr-1" />
                        View Details
                      </Button>
                      <Button variant="outline" size="sm" className="hover-glow bg-transparent">
                        <Truck className="w-4 h-4 mr-1" />
                        Track Order
                      </Button>
                      {order.status === "Delivered" && (
                        <Button variant="outline" size="sm" className="hover-glow bg-transparent">
                          <Star className="w-4 h-4 mr-1" />
                          Review
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Wishlist Section */}
          <TabsContent value="wishlist" className="animate-fade-in-scale">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Heart className="w-5 h-5 text-red-500" />
                  <span>My Wishlist</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {wishlistItems.map((item) => (
                    <Card key={item.id} className="hover-lift hover-glow">
                      <div className="relative">
                        <Image
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          width={300}
                          height={200}
                          className="w-full h-48 object-cover rounded-t-lg"
                        />
                        {!item.inStock && (
                          <Badge className="absolute top-2 left-2 bg-red-500 text-white">Out of Stock</Badge>
                        )}
                      </div>
                      <CardContent className="p-4">
                        <h4 className="font-medium mb-2">{item.name}</h4>
                        <p className="font-bold text-primary text-lg mb-3">{formatPrice(item.price)}</p>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            className="flex-1 luxury-gradient hover:opacity-90"
                            disabled={!item.inStock}
                          >
                            {item.inStock ? "Add to Cart" : "Notify Me"}
                          </Button>
                          <Button variant="outline" size="sm" className="hover-glow bg-transparent">
                            <Heart className="w-4 h-4 fill-red-500 text-red-500" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Profile Section */}
          <TabsContent value="profile" className="animate-fade-in-scale">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="hover-lift">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <User className="w-5 h-5 text-primary" />
                    <span>Personal Information</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        defaultValue="Priya"
                        className="hover-glow focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        defaultValue="Sharma"
                        className="hover-glow focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      defaultValue="priya.sharma@email.com"
                      className="hover-glow focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      defaultValue="+91 98765 43210"
                      className="hover-glow focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <Button className="w-full luxury-gradient hover:opacity-90">Update Profile</Button>
                </CardContent>
              </Card>

              <Card className="hover-lift">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <MapPin className="w-5 h-5 text-primary" />
                    <span>Address Information</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="address">Street Address</Label>
                    <Input
                      id="address"
                      defaultValue="123 MG Road"
                      className="hover-glow focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        defaultValue="Bangalore"
                        className="hover-glow focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">State</Label>
                      <Input
                        id="state"
                        defaultValue="Karnataka"
                        className="hover-glow focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pincode">PIN Code</Label>
                    <Input id="pincode" defaultValue="560001" className="hover-glow focus:ring-2 focus:ring-primary" />
                  </div>
                  <Button className="w-full luxury-gradient hover:opacity-90">Update Address</Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* New Rewards Section */}
          <TabsContent value="rewards" className="animate-fade-in-scale">
            <div className="space-y-6">
              <Card className="hover-lift luxury-gradient text-primary-foreground">
                <CardContent className="p-8">
                  <div className="text-center">
                    <Crown className="w-16 h-16 mx-auto mb-4 animate-float" />
                    <h2 className="text-3xl font-bold mb-2">Platinum Member</h2>
                    <p className="text-primary-foreground/80 mb-4">You're in the top 5% of our customers!</p>
                    <div className="text-4xl font-bold">2,450 Points</div>
                    <p className="text-primary-foreground/80">Available to redeem</p>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="hover-lift">
                  <CardHeader>
                    <CardTitle>Redeem Points</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-3 border rounded-lg hover-glow cursor-pointer">
                      <div>
                        <p className="font-medium">₹500 Discount</p>
                        <p className="text-sm text-muted-foreground">500 points</p>
                      </div>
                      <Button size="sm" variant="outline">
                        Redeem
                      </Button>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg hover-glow cursor-pointer">
                      <div>
                        <p className="font-medium">₹1,000 Discount</p>
                        <p className="text-sm text-muted-foreground">1,000 points</p>
                      </div>
                      <Button size="sm" variant="outline">
                        Redeem
                      </Button>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg hover-glow cursor-pointer">
                      <div>
                        <p className="font-medium">Free Cleaning Service</p>
                        <p className="text-sm text-muted-foreground">750 points</p>
                      </div>
                      <Button size="sm" variant="outline">
                        Redeem
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="hover-lift">
                  <CardHeader>
                    <CardTitle>Earn More Points</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                      <div className="p-2 bg-primary/10 rounded-full">
                        <Package className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">Make a Purchase</p>
                        <p className="text-sm text-muted-foreground">Earn 1 point per ₹100 spent</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                      <div className="p-2 bg-primary/10 rounded-full">
                        <Star className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">Write a Review</p>
                        <p className="text-sm text-muted-foreground">Earn 50 points per review</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                      <div className="p-2 bg-primary/10 rounded-full">
                        <Gift className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">Refer a Friend</p>
                        <p className="text-sm text-muted-foreground">Earn 200 points per referral</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
