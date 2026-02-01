"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { apiClient } from "@/lib/api";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff, Gem, Mail, KeyRound, Check } from "lucide-react";

enum Step {
  EMAIL = 1,
  OTP = 2,
  RESET = 3,
  SUCCESS = 4,
}

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<Step>(Step.EMAIL);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleRequestOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await apiClient.request("/users/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email }),
      });

      setCurrentStep(Step.OTP);
    } catch (err: any) {
      setError(err.message || "Failed to send OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await apiClient.request("/users/verify-otp", {
        method: "POST",
        body: JSON.stringify({ email, otp }),
      });

      setCurrentStep(Step.RESET);
    } catch (err: any) {
      setError(err.message || "Invalid OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    setIsLoading(true);

    try {
      await apiClient.request("/users/reset-password", {
        method: "POST",
        body: JSON.stringify({ email, otp, newPassword }),
      });

      setCurrentStep(Step.SUCCESS);
    } catch (err: any) {
      setError(err.message || "Failed to reset password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setError("");
    setIsLoading(true);

    try {
      await apiClient.request("/users/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email }),
      });
    } catch (err: any) {
      setError(err.message || "Failed to resend OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const renderStepIndicator = () => (
    <div className="flex justify-center mb-6">
      <div className="flex items-center space-x-2">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
          currentStep >= Step.EMAIL ? "bg-amber-600 text-white" : "bg-gray-300 text-gray-600"
        }`}>
          {currentStep > Step.EMAIL ? <Check className="h-5 w-5" /> : "1"}
        </div>
        <div className={`w-12 h-1 ${currentStep > Step.EMAIL ? "bg-amber-600" : "bg-gray-300"}`} />
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
          currentStep >= Step.OTP ? "bg-amber-600 text-white" : "bg-gray-300 text-gray-600"
        }`}>
          {currentStep > Step.OTP ? <Check className="h-5 w-5" /> : "2"}
        </div>
        <div className={`w-12 h-1 ${currentStep > Step.OTP ? "bg-amber-600" : "bg-gray-300"}`} />
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
          currentStep >= Step.RESET ? "bg-amber-600 text-white" : "bg-gray-300 text-gray-600"
        }`}>
          {currentStep > Step.RESET ? <Check className="h-5 w-5" /> : "3"}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader className="space-y-1 text-center">
          <div className="flex items-center justify-center mb-4">
            <Gem className="h-8 w-8 text-amber-600 mr-2" />
            <h1 className="text-2xl font-bold text-amber-800">Jewellary Shop</h1>
          </div>
          <CardTitle className="text-2xl font-bold text-gray-800">
            {currentStep === Step.SUCCESS ? "Success!" : "Reset Password"}
          </CardTitle>
          <CardDescription className="text-gray-600">
            {currentStep === Step.EMAIL && "Enter your email to receive a reset code"}
            {currentStep === Step.OTP && "Enter the 6-digit code sent to your email"}
            {currentStep === Step.RESET && "Create a new password for your account"}
            {currentStep === Step.SUCCESS && "Your password has been reset successfully"}
          </CardDescription>
        </CardHeader>

        {currentStep !== Step.SUCCESS && renderStepIndicator()}

        {/* Step 1: Email Input */}
        {currentStep === Step.EMAIL && (
          <form onSubmit={handleRequestOTP}>
            <CardContent className="space-y-4">
              {error && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertDescription className="text-red-700">{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="pl-10 border-gray-300 focus:border-amber-500 focus:ring-amber-500"
                  />
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col space-y-4">
              <Button 
                type="submit" 
                className="w-full mt-4 bg-amber-600 hover:bg-amber-700 text-white"
                disabled={isLoading}
              >
                {isLoading ? "Sending..." : "Send Reset Code"}
              </Button>

              <div className="text-center text-sm text-gray-600">
                Remember your password?{" "}
                <Link 
                  href="/auth/login" 
                  className="text-amber-600 hover:text-amber-800 font-medium hover:underline"
                >
                  Sign in
                </Link>
              </div>
            </CardFooter>
          </form>
        )}

        {/* Step 2: OTP Verification */}
        {currentStep === Step.OTP && (
          <form onSubmit={handleVerifyOTP}>
            <CardContent className="space-y-4">
              {error && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertDescription className="text-red-700">{error}</AlertDescription>
                </Alert>
              )}

              <Alert className="border-amber-200 bg-amber-50">
                <Mail className="h-4 w-4 text-amber-600" />
                <AlertDescription className="text-amber-800">
                  We've sent a 6-digit code to <strong>{email}</strong>. Please check your email.
                </AlertDescription>
              </Alert>

              <div className="space-y-2">
                <Label htmlFor="otp" className="text-gray-700">Enter OTP</Label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="otp"
                    type="text"
                    placeholder="Enter 6-digit code"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    required
                    maxLength={6}
                    className="pl-10 border-gray-300 focus:border-amber-500 focus:ring-amber-500 text-center text-2xl tracking-widest font-mono"
                  />
                </div>
              </div>

              <div className="text-center">
                <button
                  type="button"
                  onClick={handleResendOTP}
                  disabled={isLoading}
                  className="text-sm text-amber-600 hover:text-amber-800 hover:underline disabled:opacity-50"
                >
                  Didn't receive the code? Resend
                </button>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col space-y-4">
              <Button 
                type="submit" 
                className="w-full mt-2 bg-amber-600 hover:bg-amber-700 text-white"
                disabled={isLoading || otp.length !== 6}
              >
                {isLoading ? "Verifying..." : "Verify Code"}
              </Button>

              <Button 
                type="button"
                variant="outline"
                onClick={() => setCurrentStep(Step.EMAIL)}
                className="w-full"
              >
                Back
              </Button>
            </CardFooter>
          </form>
        )}

        {/* Step 3: New Password */}
        {currentStep === Step.RESET && (
          <form onSubmit={handleResetPassword}>
            <CardContent className="space-y-4">
              {error && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertDescription className="text-red-700">{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="newPassword" className="text-gray-700">New Password</Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    minLength={6}
                    className="border-gray-300 focus:border-amber-500 focus:ring-amber-500 pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-gray-700">Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength={6}
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

              <Alert className="border-blue-200 bg-blue-50">
                <AlertDescription className="text-blue-700 text-sm">
                  Password must be at least 6 characters long
                </AlertDescription>
              </Alert>
            </CardContent>

            <CardFooter className="flex flex-col space-y-4">
              <Button 
                type="submit" 
                className="w-full bg-amber-600 hover:bg-amber-700 text-white"
                disabled={isLoading}
              >
                {isLoading ? "Resetting..." : "Reset Password"}
              </Button>
            </CardFooter>
          </form>
        )}

        {/* Step 4: Success */}
        {currentStep === Step.SUCCESS && (
          <CardContent className="space-y-4">
            <div className="flex flex-col items-center justify-center py-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <Check className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Password Reset Successfully!</h3>
              <p className="text-gray-600 text-center mb-6">
                Your password has been reset. You can now login with your new password.
              </p>
              <Button 
                onClick={() => router.push("/auth/login")}
                className="w-full bg-amber-600 hover:bg-amber-700 text-white"
              >
                Go to Login
              </Button>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
}
