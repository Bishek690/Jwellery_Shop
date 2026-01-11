"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  ArrowLeft, 
  Shield, 
  AlertCircle, 
  CheckCircle, 
  UserCheck, 
  Calculator, 
  RefreshCw,
  Eye,
  EyeOff 
} from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"

interface User {
  id: string
  name: string
  email: string
  phone: string
  role: 'admin' | 'staff' | 'accountant' | 'customer'
  createdAt: string
  updatedAt: string
  mustChangePassword?: boolean
}

export default function ResetPasswordPage() {
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([])
  const [selectedUserId, setSelectedUserId] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [fetchingUsers, setFetchingUsers] = useState(true)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setFetchingUsers(true)
      const response = await fetch('/api/users', {
        credentials: 'include',
      })

      if (!response.ok) {
        throw new Error('Failed to fetch users')
      }

      const data = await response.json()
      // Filter to only show staff and accountant users
      const staffAndAccountants = data.filter((user: User) => 
        user.role === 'staff' || user.role === 'accountant'
      )
      setUsers(staffAndAccountants)
    } catch (error: any) {
      console.error('Fetch users error:', error)
      setError(error.message || 'Failed to fetch users')
    } finally {
      setFetchingUsers(false)
    }
  }

  const generateRandomPassword = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*"
    let password = ""
    for (let i = 0; i < 10; i++) {
      password += chars[Math.floor(Math.random() * chars.length)]
    }
    setNewPassword(password)
    setConfirmPassword(password)
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    // Validation
    if (!selectedUserId) {
      setError("Please select a user")
      return
    }

    if (!newPassword) {
      setError("Please enter a new password")
      return
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters long")
      return
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    setLoading(true)

    try {
      const response = await fetch(`/api/users/${selectedUserId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          password: newPassword,
          mustChangePassword: true, // Force user to change password on next login
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to reset password')
      }

      const selectedUser = users.find(user => user.id === selectedUserId)
      setSuccess(`Password has been reset successfully for ${selectedUser?.name}. The user will be required to change it on next login.`)
      
      // Clear form
      setSelectedUserId("")
      setNewPassword("")
      setConfirmPassword("")
      
      // Refresh users list to show updated mustChangePassword status
      fetchUsers()

    } catch (error: any) {
      console.error('Reset password error:', error)
      setError(error.message || 'Failed to reset password')
    } finally {
      setLoading(false)
    }
  }

  const selectedUser = users.find(user => user.id === selectedUserId)

  const getRoleInfo = (role: string) => {
    switch (role) {
      case 'staff':
        return {
          icon: UserCheck,
          color: "text-orange-600",
          bgColor: "bg-orange-50",
          borderColor: "border-orange-200"
        }
      case 'accountant':
        return {
          icon: Calculator,
          color: "text-green-600",
          bgColor: "bg-green-50",
          borderColor: "border-green-200"
        }
      default:
        return {
          icon: UserCheck,
          color: "text-gray-600",
          bgColor: "bg-gray-50",
          borderColor: "border-gray-200"
        }
    }
  }

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
            <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl shadow-lg">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Reset User Password</h1>
              <p className="text-sm text-gray-600">Reset passwords for staff and accountant users</p>
            </div>
          </div>
        </div>

        {/* Alerts */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="bg-green-50 border-green-200">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">{success}</AlertDescription>
          </Alert>
        )}

        {/* Reset Password Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Password Reset
            </CardTitle>
            <CardDescription>
              Select a staff or accountant user and set a new password. The user will be required to change it on their next login.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleResetPassword} className="space-y-6">
              {/* User Selection */}
              <div className="space-y-2">
                <Label htmlFor="user-select">Select User *</Label>
                {fetchingUsers ? (
                  <div className="flex items-center justify-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500" />
                    <span className="ml-2 text-sm text-gray-600">Loading users...</span>
                  </div>
                ) : users.length === 0 ? (
                  <div className="text-center py-4 text-gray-500">
                    No staff or accountant users found
                  </div>
                ) : (
                  <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                    <SelectTrigger className="focus:border-orange-400 focus:ring-orange-400/20">
                      <SelectValue placeholder="Choose a user to reset password" />
                    </SelectTrigger>
                    <SelectContent>
                      {users.map((user) => {
                        const roleInfo = getRoleInfo(user.role)
                        const RoleIcon = roleInfo.icon

                        return (
                          <SelectItem key={user.id} value={user.id}>
                            <div className="flex items-center gap-2 w-full">
                              <RoleIcon className={cn("h-4 w-4", roleInfo.color)} />
                              <div className="flex flex-col">
                                <span className="font-medium">{user.name}</span>
                                <span className="text-sm text-gray-500">{user.email}</span>
                              </div>
                              {user.mustChangePassword && (
                                <span className="text-xs text-red-600 bg-red-50 px-1 py-0.5 rounded">
                                  Reset Required
                                </span>
                              )}
                            </div>
                          </SelectItem>
                        )
                      })}
                    </SelectContent>
                  </Select>
                )}
              </div>

              {/* Selected User Info */}
              {selectedUser && (
                <div className={cn(
                  "p-4 rounded-lg border",
                  getRoleInfo(selectedUser.role).bgColor,
                  getRoleInfo(selectedUser.role).borderColor
                )}>
                  <div className="flex items-center gap-3">
                    {(() => {
                      const roleInfo = getRoleInfo(selectedUser.role)
                      const RoleIcon = roleInfo.icon
                      return <RoleIcon className={cn("h-5 w-5", roleInfo.color)} />
                    })()}
                    <div>
                      <h3 className="font-medium text-gray-900">{selectedUser.name}</h3>
                      <p className="text-sm text-gray-600">{selectedUser.email} • {selectedUser.role}</p>
                      {selectedUser.mustChangePassword && (
                        <p className="text-sm text-red-600 mt-1">
                          This user currently has a password reset pending
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Password Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password">New Password *</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password"
                      className="pr-20 focus:border-orange-400 focus:ring-orange-400/20"
                    />
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowPassword(!showPassword)}
                        className="h-8 w-8 p-0"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm Password *</Label>
                  <Input
                    id="confirm-password"
                    type={showPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    className="focus:border-orange-400 focus:ring-orange-400/20"
                  />
                </div>
              </div>

              {/* Generate Random Password Button */}
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={generateRandomPassword}
                  className="flex items-center gap-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  Generate Random Password
                </Button>
                <span className="text-sm text-gray-500">
                  Creates a secure 10-character password
                </span>
              </div>

              {/* Submit Button */}
              <div className="flex gap-4 pt-4">
                <Button
                  type="submit"
                  disabled={loading || !selectedUserId || !newPassword}
                  className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Resetting Password...
                    </>
                  ) : (
                    <>
                      <Shield className="h-4 w-4 mr-2" />
                      Reset Password
                    </>
                  )}
                </Button>
                
                <Button type="button" variant="outline" onClick={() => router.back()}>
                  Cancel
                </Button>
              </div>

              {/* Security Notice */}
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <h4 className="font-medium text-amber-800 mb-2">Security Notice</h4>
                <ul className="text-sm text-amber-700 space-y-1">
                  <li>• The user will be required to change this password on their next login</li>
                  <li>• Make sure to communicate the new password securely to the user</li>
                  <li>• Consider using the "Generate Random Password" for better security</li>
                  <li>• This action will be logged for security auditing</li>
                </ul>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
