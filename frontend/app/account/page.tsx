"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { CustomerNavbar } from "@/components/customer-navbar"
import { LandingFooter } from "@/components/landing-footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  User,
  Key,
  Save,
  CheckCircle,
} from "lucide-react"
import { useAuth } from "@/hooks/use-auth"

export default function AccountPage() {
  const router = useRouter()
  const { user, isAuthenticated, isLoading, checkAuth } = useAuth()
  const [totalPurchases, setTotalPurchases] = useState(0)
  const [orderCount, setOrderCount] = useState(0)
  const [loadingStats, setLoadingStats] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  })

  // Initialize form data when user is loaded
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
      })
    }
  }, [user])

  // Check if user is authenticated and is a customer
  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push("/auth/login")
        return
      }
      
      if (user && user.role !== "customer") {
        // Redirect non-customers to their appropriate dashboard
        switch (user.role) {
          case "admin":
            router.push("/admin")
            break
          case "staff":
            router.push("/admin/dashboard")
            break
          case "accountant":
            router.push("/analytics")
            break
          default:
            router.push("/auth/login")
            break
        }
      }
    }
  }, [isAuthenticated, user, isLoading, router])

  // Fetch order statistics
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/my-orders`, {
          credentials: "include",
        })

        if (response.ok) {
          const orders = await response.json()
          const total = orders.reduce((sum: number, order: any) => {
            // Only count delivered orders
            if (order.status === 'delivered') {
              return sum + order.totalAmount
            }
            return sum
          }, 0)
          setTotalPurchases(total)
          setOrderCount(orders.length)
        }
      } catch (error) {
        console.error("Error fetching stats:", error)
      } finally {
        setLoadingStats(false)
      }
    }

    if (isAuthenticated && user?.role === "customer") {
      fetchStats()
    }
  }, [isAuthenticated, user])

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // Show nothing while redirecting
  if (!isAuthenticated || (user && user.role !== "customer")) {
    return null
  }

  const getUserInitials = () => {
    if (!user) return "U"
    return user.name.charAt(0).toUpperCase()
  }

  const getMemberSince = () => {
    if (!user) return "2024"
    const date = new Date(user.createdAt)
    return date.getFullYear().toString()
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-NP", {
      style: "currency",
      currency: "NPR",
      maximumFractionDigits: 0,
    }).format(price)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSave = async () => {
    setError("")
    setSuccess("")
    setIsSaving(true)

    try {
      const response = await fetch("/api/auth/update-profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to update profile")
      }

      setSuccess("Profile updated successfully!")
      setIsEditing(false)
      
      // Refresh user data
      await checkAuth()
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(""), 3000)
    } catch (err: any) {
      setError(err.message || "Failed to update profile")
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    // Reset form to original user data
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
      })
    }
    setIsEditing(false)
    setError("")
    setSuccess("")
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
                  <AvatarFallback className="bg-primary text-primary-foreground text-4xl font-bold">
                    {getUserInitials()}
                  </AvatarFallback>
                </Avatar>
              </div>
              <div className="text-center md:text-left flex-1">
                <h1 className="text-3xl font-bold text-foreground mb-2">Welcome back, {user?.name}</h1>
                <p className="text-muted-foreground mb-4">Customer since {getMemberSince()}</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {loadingStats ? "..." : formatPrice(totalPurchases)}
                </div>
                <p className="text-sm text-muted-foreground">Total Purchases</p>
                <p className="text-xs text-muted-foreground mt-1">{orderCount} orders</p>
              </div>
            </div>
          </div>
        </div>

        <div className="animate-fade-in-scale">
          <Card className="hover-lift max-w-4xl mx-auto bg-white shadow-lg">
            <CardHeader className="border-b">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <User className="w-5 h-5 text-primary" />
                  <span>Personal Information</span>
                </div>
                {!isEditing && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing(true)}
                    className="hover:bg-primary hover:text-white"
                  >
                    Edit Profile
                  </Button>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              {error && (
                <Alert className="border-red-200 bg-red-50 mb-4">
                  <AlertDescription className="text-red-700">{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert className="border-green-200 bg-green-50 mb-4">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-700">{success}</AlertDescription>
                </Alert>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="bg-gray-100 hover-glow focus:ring-2 focus:ring-primary"
                    readOnly={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="bg-gray-100 hover-glow focus:ring-2 focus:ring-primary"
                    readOnly={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="bg-gray-100 hover-glow focus:ring-2 focus:ring-primary"
                    readOnly={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Account Type</Label>
                  <Input
                    id="role"
                    value={user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : ""}
                    className="bg-gray-100 hover-glow focus:ring-2 focus:ring-primary"
                    readOnly
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="memberSince">Member Since</Label>
                  <Input
                    id="memberSince"
                    value={user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : ""}
                    className="bg-gray-100 hover-glow focus:ring-2 focus:ring-primary"
                    readOnly
                  />
                </div>
              </div>
              
              {isEditing ? (
                <div className="flex gap-3 pt-6 mt-6 border-t">
                  <Button 
                    className="flex-1 luxury-gradient hover:opacity-90"
                    onClick={handleSave}
                    disabled={isSaving}
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {isSaving ? "Saving..." : "Save Changes"}
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={handleCancel}
                    disabled={isSaving}
                  >
                    Cancel
                  </Button>
                </div>
              ) : (
                <div className="pt-6 mt-6 border-t">
                  <Link href="/auth/change-password" className="block">
                    <Button 
                      className="w-full luxury-gradient hover:opacity-90"
                      variant="default"
                    >
                      <Key className="w-4 h-4 mr-2" />
                      Change Password
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      <LandingFooter />
    </div>
  )
}
