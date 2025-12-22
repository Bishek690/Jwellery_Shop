"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, User, Mail, Phone, UserCheck, Calculator, AlertCircle, CheckCircle, Crown } from "lucide-react"
import Link from "next/link"

interface CreateUserForm {
  name: string
  email: string
  phone: string
  role: 'staff' | 'accountant' | ''
}

export default function CreateUserPage() {
  const router = useRouter()
  const [formData, setFormData] = useState<CreateUserForm>({
    name: "",
    email: "",
    phone: "",
    role: ""
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [createdUser, setCreatedUser] = useState<any>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear error when user starts typing
    if (error) setError("")
  }

  const handleRoleChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      role: value as 'staff' | 'accountant'
    }))
    if (error) setError("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess("")

    try {
      // Validate form
      if (!formData.name.trim()) {
        throw new Error("Name is required")
      }
      if (!formData.email.trim()) {
        throw new Error("Email is required")
      }
      if (!formData.phone.trim()) {
        throw new Error("Phone is required")
      }
      if (!formData.role) {
        throw new Error("Please select a role")
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(formData.email)) {
        throw new Error("Please enter a valid email address")
      }

      // Phone validation (basic)
      const phoneRegex = /^[\+]?[\d\s\-\(\)]+$/
      if (!phoneRegex.test(formData.phone)) {
        throw new Error("Please enter a valid phone number")
      }

      const response = await fetch('/api/users/create-by-admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          role: formData.role
        })
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Failed to create user account')
      }

      setCreatedUser(result)
      setSuccess(`${formData.role.charAt(0).toUpperCase() + formData.role.slice(1)} account created successfully!`)
      setFormData({ name: "", email: "", phone: "", role: "" })

    } catch (error: any) {
      console.error('Create user error:', error)
      setError(error.message || 'Failed to create user account')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateAnother = () => {
    setCreatedUser(null)
    setSuccess("")
    setError("")
  }

  // Get role-specific styling and info
  const getRoleInfo = (role: string) => {
    switch (role) {
      case 'staff':
        return {
          icon: UserCheck,
          gradient: "from-orange-500 to-amber-600",
          bgColor: "from-orange-50 to-amber-50",
          color: "text-orange-800",
          permissions: [
            "Access to inventory management",
            "POS system operations",
            "Customer management",
            "Order processing and tracking"
          ]
        }
      case 'accountant':
        return {
          icon: Calculator,
          gradient: "from-green-500 to-emerald-600",
          bgColor: "from-emerald-50 to-green-50",
          color: "text-emerald-800",
          permissions: [
            "View analytics and reports",
            "Access financial data",
            "Customer transaction history",
            "Revenue and sales reports"
          ]
        }
      default:
        return {
          icon: User,
          gradient: "from-gray-500 to-slate-600",
          bgColor: "from-gray-50 to-slate-50",
          color: "text-gray-800",
          permissions: []
        }
    }
  }

  const roleInfo = getRoleInfo(formData.role)
  const RoleIcon = roleInfo.icon

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button asChild variant="ghost" size="sm" className="hover:bg-orange-50">
            <Link href="/admin">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>
          <div className="flex items-center gap-3">
            <div className={`p-2 bg-gradient-to-br ${roleInfo.gradient} rounded-xl shadow-lg`}>
              <RoleIcon className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Create User Account</h1>
              <p className="text-sm text-gray-600">Add a new staff member or accountant to the system</p>
            </div>
          </div>
        </div>

        {/* Success Message with User Details */}
        {createdUser && (
          <Card className="bg-green-50 border-green-200">
            <CardHeader>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <CardTitle className="text-green-800">User Account Created Successfully!</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <Label className="text-green-700 font-medium">Name</Label>
                  <p className="text-green-600">{createdUser.name}</p>
                </div>
                <div>
                  <Label className="text-green-700 font-medium">Email</Label>
                  <p className="text-green-600">{createdUser.email}</p>
                </div>
                <div>
                  <Label className="text-green-700 font-medium">Phone</Label>
                  <p className="text-green-600">{createdUser.phone}</p>
                </div>
                <div>
                  <Label className="text-green-700 font-medium">Role</Label>
                  <div className="flex items-center gap-2">
                    {createdUser.role === 'staff' ? (
                      <UserCheck className="h-4 w-4 text-orange-600" />
                    ) : (
                      <Calculator className="h-4 w-4 text-green-600" />
                    )}
                    <p className="text-green-600 capitalize">{createdUser.role}</p>
                  </div>
                </div>
              </div>
              
              {createdUser.temporaryPassword && (
                <div className="p-3 bg-amber-100 border border-amber-300 rounded-lg">
                  <Label className="text-amber-800 font-medium">Temporary Password</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <code className="px-2 py-1 bg-amber-200 rounded text-amber-800 font-mono text-sm">
                      {createdUser.temporaryPassword}
                    </code>
                    <button
                      type="button"
                      onClick={() => navigator.clipboard.writeText(createdUser.temporaryPassword)}
                      className="text-xs px-2 py-1 border border-amber-300 rounded hover:bg-amber-200 transition-colors"
                    >
                      Copy
                    </button>
                  </div>
                  <p className="text-xs text-amber-700 mt-1">
                    Please share this password with the user. They will be required to change it on first login.
                  </p>
                </div>
              )}

              <div className="flex gap-2">
                <Button onClick={handleCreateAnother} variant="outline" size="sm">
                  Create Another User
                </Button>
                <Button asChild size="sm">
                  <Link href="/admin/users">
                    Manage Users
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Create User Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              User Information
            </CardTitle>
            <CardDescription>
              Enter the user's details and select their role. A temporary password will be generated automatically.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Error Alert */}
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Success Alert */}
              {success && !createdUser && (
                <Alert className="bg-green-50 border-green-200">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">{success}</AlertDescription>
                </Alert>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name */}
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Enter user's full name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="focus:border-orange-400 focus:ring-orange-400/20"
                    required
                  />
                </div>

                {/* Role */}
                <div className="space-y-2">
                  <Label htmlFor="role">Role *</Label>
                  <Select value={formData.role} onValueChange={handleRoleChange}>
                    <SelectTrigger className="focus:border-orange-400 focus:ring-orange-400/20">
                      <SelectValue placeholder="Select user role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="staff">
                        <div className="flex items-center gap-2">
                          <UserCheck className="h-4 w-4 text-orange-600" />
                          <span>Staff</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="accountant">
                        <div className="flex items-center gap-2">
                          <Calculator className="h-4 w-4 text-green-600" />
                          <span>Accountant</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Enter email address"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="pl-10 focus:border-orange-400 focus:ring-orange-400/20"
                      required
                    />
                  </div>
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="Enter phone number"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="pl-10 focus:border-orange-400 focus:ring-orange-400/20"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Role-specific Information */}
              {formData.role && (
                <div className={`p-4 bg-gradient-to-r ${roleInfo.bgColor} border border-opacity-30 rounded-lg`}>
                  <h4 className={`font-medium ${roleInfo.color} mb-2 flex items-center gap-2`}>
                    <RoleIcon className="h-4 w-4" />
                    {formData.role.charAt(0).toUpperCase() + formData.role.slice(1)} Permissions & Access
                  </h4>
                  <ul className={`text-sm ${roleInfo.color} space-y-1`}>
                    <li>• A temporary password will be automatically generated</li>
                    <li>• Login credentials will be sent to the provided email address</li>
                    <li>• User will be required to change password on first login</li>
                    {roleInfo.permissions.map((permission, index) => (
                      <li key={index}>• {permission}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Submit Button */}
              <div className="flex gap-4">
                <Button 
                  type="submit" 
                  disabled={loading}
                  className={`bg-gradient-to-r ${roleInfo.gradient} hover:opacity-90 text-white px-8`}
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Creating Account...
                    </>
                  ) : (
                    <>
                      <RoleIcon className="h-4 w-4 mr-2" />
                      Create {formData.role ? formData.role.charAt(0).toUpperCase() + formData.role.slice(1) : 'User'} Account
                    </>
                  )}
                </Button>
                
                <Button type="button" variant="outline" onClick={() => router.back()}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
