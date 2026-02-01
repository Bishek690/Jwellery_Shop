"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff, Gem, CheckCircle } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

export default function ChangePasswordPage() {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: ""
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const { user, changePassword, redirectToDashboard, isAuthenticated, checkAuth } = useAuth();

  // Check auth on mount
  useEffect(() => {
    if (!isAuthenticated && !user) {
      checkAuth();
    }
  }, [isAuthenticated, user, checkAuth]);

  // Redirect to login if not authenticated after auth check
  useEffect(() => {
    if (!isAuthenticated && !user) {
      const timer = setTimeout(() => {
        window.location.href = "/auth/login";
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, user]);

  // Show loading while checking authentication
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardContent className="p-8 text-center">
            <p className="text-gray-600">Loading...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.currentPassword.trim()) {
      setError("Current password is required");
      return false;
    }
    if (formData.newPassword.length < 6) {
      setError("New password must be at least 6 characters long");
      return false;
    }
    if (formData.newPassword !== formData.confirmNewPassword) {
      setError("New passwords do not match");
      return false;
    }
    if (formData.currentPassword === formData.newPassword) {
      setError("New password must be different from current password");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const result = await changePassword({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword
      });
      
      if (result.message === "Password changed successfully") {
        setSuccess("Password changed successfully! Redirecting...");
        
        // Clear form
        setFormData({
          currentPassword: "",
          newPassword: "",
          confirmNewPassword: ""
        });

        // Redirect based on user role after 2 seconds
        setTimeout(() => {
          if (user) {
            redirectToDashboard(user);
          }
        }, 2000);
      }
    } catch (err: any) {
      setError(err.message || "Failed to change password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    // Only allow skipping if it's not mandatory
    if (!user?.mustChangePassword && user) {
      redirectToDashboard(user);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader className="space-y-1 text-center">
          <div className="flex items-center justify-center mb-4">
            <Gem className="h-8 w-8 text-amber-600 mr-2" />
            <h1 className="text-2xl font-bold text-amber-800">Jewelry Shop</h1>
          </div>
          <CardTitle className="text-2xl font-bold text-gray-800">
            {user?.mustChangePassword ? "Change Password Required" : "Change Password"}
          </CardTitle>
          <CardDescription className="text-gray-600">
            {user?.mustChangePassword 
              ? "You must change your password before continuing"
              : "Update your password to keep your account secure"
            }
          </CardDescription>
        </CardHeader>
        
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <Alert className="border-red-200 bg-red-50">
                <AlertDescription className="text-red-700">{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-700">{success}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="currentPassword" className="text-gray-700">Current Password</Label>
              <div className="relative">
                <Input
                  id="currentPassword"
                  name="currentPassword"
                  type={showCurrentPassword ? "text" : "password"}
                  placeholder="Enter your current password"
                  value={formData.currentPassword}
                  onChange={handleInputChange}
                  required
                  className="border-gray-300 focus:border-amber-500 focus:ring-amber-500 pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                >
                  {showCurrentPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="newPassword" className="text-gray-700">New Password</Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  name="newPassword"
                  type={showNewPassword ? "text" : "password"}
                  placeholder="Enter your new password"
                  value={formData.newPassword}
                  onChange={handleInputChange}
                  required
                  className="border-gray-300 focus:border-amber-500 focus:ring-amber-500 pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </Button>
              </div>
              <p className="text-xs text-gray-500">
                Password must be at least 6 characters long
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmNewPassword" className="text-gray-700">Confirm New Password</Label>
              <div className="relative">
                <Input
                  id="confirmNewPassword"
                  name="confirmNewPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your new password"
                  value={formData.confirmNewPassword}
                  onChange={handleInputChange}
                  required
                  className="border-gray-300 focus:border-amber-500 focus:ring-amber-500 pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </Button>
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-3">
            <Button 
              type="submit" 
              className="w-full mt-4 bg-amber-600 hover:bg-amber-700 text-white"
              disabled={loading}
            >
              {loading ? "Changing Password..." : "Change Password"}
            </Button>

            {!user?.mustChangePassword && (
              <Button 
                type="button"
                variant="outline"
                className="w-full border-gray-300 text-gray-700 hover:bg-gray-50"
                onClick={handleSkip}
                disabled={loading}
              >
                Skip for Now
              </Button>
            )}
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
