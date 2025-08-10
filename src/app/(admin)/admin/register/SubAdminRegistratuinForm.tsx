"use client";

import { useEffect, useState } from "react";
import { Eye, EyeOff, User, Lock, Phone, Mail, Loader2, Check, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAdminRegistration } from "@/services/admin";

type FormErrors = {
  firstName?: string;
  lastName?: string;
  username?: string;
  phone?: string;
  gender?: string;
  password?: string;
  confirmPassword?: string;
};


interface InviteParams {
  email: string;
  userId: number;
  token: string;
  signature: string;
  timestamp: number;
  expires?: number;
  noExpiry: boolean;
  isValid: boolean;
  // ✅ Add the missing optional properties
  roleId?: number;
  invitationId?: string;
}

// Also update the state interface to match
interface InviteParamsState {
  email: string | null;
  userId: number | null;
  expires: number | null;
  signature: string | null;
  token: string | null;
  timestamp: number | null;
  noExpiry: boolean;
  isLoading: boolean;
  error: string | null;
  isValid: boolean;
  // ✅ Add the missing optional properties
  roleId?: number | null;
  invitationId?: string | null;
}
interface Props {
  inviteParams: InviteParams;
}

export default function SubAdminRegistrationForm({ inviteParams }: Props) {
  const router = useRouter();
  const { registerAdmin, isLoading: isRegistering } = useAdminRegistration();

  // Form state
  const [registrationComplete, setRegistrationComplete] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);

  // ✅ SECURE REGISTRATION: Proper validation and secure submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log('🔐 Starting secure admin registration');

    // ✅ Enhanced validation
    const newErrors: FormErrors = {};

    if (!firstName.trim()) {
      newErrors.firstName = "First name is required";
    } else if (firstName.trim().length < 2) {
      newErrors.firstName = "First name must be at least 2 characters";
    }

    if (!lastName.trim()) {
      newErrors.lastName = "Last name is required";
    } else if (lastName.trim().length < 2) {
      newErrors.lastName = "Last name must be at least 2 characters";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    // Username validation (optional but if provided, must be valid)
    if (username && username.trim()) {
      if (username.trim().length < 3) {
        newErrors.username = "Username must be at least 3 characters";
      } else if (!/^[a-zA-Z0-9_]+$/.test(username.trim())) {
        newErrors.username = "Username can only contain letters, numbers, and underscores";
      }
    }

    // Phone validation (optional but if provided, must be valid)
    if (phone && phone.trim()) {
      if (!/^\d{10,15}$/.test(phone.replace(/\D/g, ''))) {
        newErrors.phone = "Please enter a valid phone number";
      }
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      toast.error("Please fix the form errors before submitting");
      return;
    }

    // ✅ Validate invitation parameters before submission
    if (!inviteParams.email || !inviteParams.userId || !inviteParams.token || !inviteParams.signature || !inviteParams.timestamp) {
      toast.error("Invalid invitation parameters. Please use a valid invitation link.");
      return;
    }

    setLoading(true);

    try {
      // ✅ FIXED: Prepare complete registration payload
      const registrationData = {
        // Form data
        fullName: `${firstName.trim()} ${lastName.trim()}`,
        username: username.trim() || undefined,
        phone: phone.trim() || undefined,
        gender: gender || undefined,
        password: password,

        // ✅ ALL required invitation verification data
        email: inviteParams.email,
        userId: inviteParams.userId,
        token: inviteParams.token,
        signature: inviteParams.signature,
        timestamp: inviteParams.timestamp,

        // ✅ Optional invitation data - include ALL available parameters
        ...(inviteParams.expires && { expires: inviteParams.expires }),
        noExpiry: inviteParams.noExpiry || false,
        ...(inviteParams.roleId && { roleId: inviteParams.roleId }),
        ...(inviteParams.invitationId && { invitationId: inviteParams.invitationId })
      };

      console.log('🔐 Complete registration payload:', {
        ...registrationData,
        password: '[HIDDEN]',
        token: '[HIDDEN]',
        signature: '[HIDDEN]'
      });

      console.log('🔐 Invitation params being sent:', {
        email: inviteParams.email,
        userId: inviteParams.userId,
        hasToken: !!inviteParams.token,
        hasSignature: !!inviteParams.signature,
        timestamp: inviteParams.timestamp,
        expires: inviteParams.expires,
        noExpiry: inviteParams.noExpiry,
        roleId: inviteParams.roleId,
        invitationId: inviteParams.invitationId
      });

      // ✅ The registration hook will handle URL parameter verification
      const result = await registerAdmin(registrationData);

      console.log('✅ Secure registration successful:', result);

      toast.success("Admin account created successfully!");
      setRegistrationComplete(true);

    } catch (error: any) {
      console.error('❌ Secure registration failed:', error);

      let errorMessage = "Registration failed. Please try again.";

      // ✅ Handle specific secure registration errors
      if (error?.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error?.message) {
        errorMessage = error.message;
      }

      // ✅ Provide specific error messages for common issues
      if (errorMessage.includes('Invalid invitation')) {
        toast.error("Your invitation link is invalid or has been tampered with. Please request a new invitation.");
      } else if (errorMessage.includes('expired')) {
        toast.error("Your invitation has expired. Please request a new invitation.");
      } else if (errorMessage.includes('already used')) {
        toast.error("This invitation has already been used. Please request a new invitation if needed.");
      } else if (errorMessage.includes('Username already exists')) {
        setErrors({ username: "This username is already taken" });
        toast.error("Username is already taken. Please choose a different one.");
      } else if (errorMessage.includes('Email mismatch')) {
        toast.error("There's a mismatch with your invitation. Please use the correct invitation link.");
      } else if (errorMessage.includes('All fields are required')) {
        toast.error("Missing required registration information. Please check your invitation link.");
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  // In your registration form component
  useEffect(() => {
    console.log('Current inviteParams:', {
      email: inviteParams.email,
      userId: inviteParams.userId,
      hasToken: !!inviteParams.token,
      hasSignature: !!inviteParams.signature,
      hasTimestamp: !!inviteParams.timestamp
    });
  }, [inviteParams]);

  // ✅ Registration success state
  if (registrationComplete) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="max-w-md w-full mx-auto p-8 bg-white rounded-lg shadow-md text-center">
          <div className="rounded-full bg-green-100 p-3 w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <Check className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Registration Complete!</h1>
          <p className="text-gray-600 mb-6">
            Your admin account has been successfully created and activated. You can now log in to access your dashboard.
          </p>
          <button
            onClick={() => router.push('/login')}
            className="w-full bg-[#0F3D30] text-white py-3 px-4 rounded-md hover:bg-[#1b5d49] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0F3D30] transition-colors"
          >
            Proceed to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row w-full min-h-screen">
      {/* Left Column */}
      <div className="w-full md:w-1/2 flex flex-col justify-end bg-[#0F3D30]">
        <div className="flex-1 flex items-center justify-center">
          <Image
            alt="Admin registration"
            src="/images/Photo.png"
            className="object-cover w-full h-full"
            width={500}
            height={500}
          />
        </div>
        <div className="flex flex-col gap-6 p-12 border-t-[5px] border-[#EC9F01]">
          <div className="w-1/2">
            <Image
              alt="Logo"
              src="/images/logo.png"
              className="object-cover h-30 w-30"
              width={200}
              height={200}
            />
          </div>
          <h1 className="text-3xl font-bold text-white">
            Complete Your Secure Registration
          </h1>
          <p className="text-base text-white">
            Fill in your details to complete your admin account setup. Your invitation has been verified and is ready to use.
          </p>

          {/* Security indicators */}
          <div className="flex items-center space-x-2 text-green-300">
            <Check className="h-4 w-4" />
            <span className="text-sm">Secure invitation verified</span>
          </div>
        </div>
      </div>

      {/* Right Column */}
      <div className="w-full md:w-1/2 bg-white p-9 overflow-y-auto">
        <form onSubmit={handleSubmit} className="max-w-[648px] mx-auto flex flex-col gap-6">
          <div className="mb-4">
            <h2 className="text-3xl font-bold text-black">Setup Your Admin Account</h2>
            <p className="text-gray-500 mt-2">
              Welcome, <span className="font-medium">{inviteParams.email}</span>
            </p>
            <div className="flex items-center space-x-2 mt-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-xs text-green-600 font-medium">Secure invitation verified</span>
            </div>
          </div>

          {/* Form Fields */}
          <div className="flex flex-col md:flex-row gap-6">
            <div className="w-full md:w-1/2">
              <label htmlFor="firstName" className="text-sm font-medium text-gray-900 mb-2 block">
                First Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="firstName"
                  name="firstName"
                  placeholder="Enter your first name"
                  className={`w-full pl-10 pr-3 py-2 border ${errors.firstName ? "border-red-500" : "border-gray-200"
                    } rounded-lg focus:ring-[#0F3D30] focus:border-[#0F3D30]`}
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  disabled={loading || isRegistering}
                />
              </div>
              {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
            </div>

            <div className="w-full md:w-1/2">
              <label htmlFor="lastName" className="text-sm font-medium text-gray-900 mb-2 block">
                Last Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="lastName"
                  name="lastName"
                  placeholder="Enter your last name"
                  className={`w-full pl-10 pr-3 py-2 border ${errors.lastName ? "border-red-500" : "border-gray-200"
                    } rounded-lg focus:ring-[#0F3D30] focus:border-[#0F3D30]`}
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  disabled={loading || isRegistering}
                />
              </div>
              {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
            </div>
          </div>

          {/* Username and Gender */}
          <div className="flex flex-col md:flex-row gap-6">
            <div className="w-full">
              <label htmlFor="username" className="text-sm font-medium text-gray-900 mb-2 block">
                Username <span className="text-gray-500">(optional)</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="username"
                  name="username"
                  placeholder="Choose a username (optional)"
                  className={`w-full pl-10 pr-4 py-2 border ${errors.username ? "border-red-500" : "border-gray-200"
                    } rounded-lg focus:ring-[#0F3D30] focus:border-[#0F3D30]`}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={loading || isRegistering}
                />
              </div>
              {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username}</p>}
              <p className="text-xs text-gray-500 mt-1">Leave empty for auto-generated username</p>
            </div>

            <div className="w-full md:w-1/2">
              <label htmlFor="gender" className="text-sm font-medium text-gray-900 mb-2 block">
                Gender <span className="text-gray-500">(optional)</span>
              </label>
              <select
                id="gender"
                name="gender"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                disabled={loading || isRegistering}
                className="w-full p-2 border border-gray-200 rounded-lg focus:ring-[#0F3D30] focus:border-[#0F3D30]"
              >
                <option value="">Select gender (optional)</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
                <option value="prefer_not_to_say">Prefer not to say</option>
              </select>
            </div>
          </div>

          {/* Email and Phone */}
          <div className="flex flex-col md:flex-row gap-6">
            <div className="w-full md:w-1/2">
              <label htmlFor="email" className="text-sm font-medium text-gray-900 mb-2 block">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  placeholder="Email address"
                  className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg bg-gray-50"
                  value={inviteParams.email || ""}
                  disabled
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">Verified from your invitation</p>
            </div>

            <div className="w-full md:w-1/2">
              <label htmlFor="phone" className="text-sm font-medium text-gray-900 mb-2 block">
                Phone Number <span className="text-gray-500">(optional)</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="phone"
                  name="phone"
                  placeholder="Enter your phone number"
                  className={`w-full pl-10 pr-3 py-2 border ${errors.phone ? "border-red-500" : "border-gray-200"
                    } rounded-lg focus:ring-[#0F3D30] focus:border-[#0F3D30]`}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  disabled={loading || isRegistering}
                />
              </div>
              {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
            </div>
          </div>

          {/* Password Fields */}
          <div className="flex flex-col md:flex-row gap-6">
            <div className="w-full md:w-1/2">
              <label htmlFor="password" className="text-sm font-medium text-gray-900 mb-2 block">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create your password"
                  autoComplete="new-password"
                  className={`w-full pl-10 pr-10 py-2 border ${errors.password ? "border-red-500" : "border-gray-200"
                    } rounded-lg focus:ring-[#0F3D30] focus:border-[#0F3D30]`}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading || isRegistering}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
            </div>

            <div className="w-full md:w-1/2">
              <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-900 mb-2 block">
                Confirm Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirm ? "text" : "password"}
                  placeholder="Confirm your password"
                  autoComplete="new-password"
                  className={`w-full pl-10 pr-10 py-2 border ${errors.confirmPassword ? "border-red-500" : "border-gray-200"
                    } rounded-lg focus:ring-[#0F3D30] focus:border-[#0F3D30]`}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={loading || isRegistering}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm"
                  onClick={() => setShowConfirm(!showConfirm)}
                >
                  {showConfirm ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-start mt-6">
            <button
              type="submit"
              className="bg-[#EC9F01] hover:bg-[#d89001] text-white font-bold py-4 px-8 rounded-lg flex items-center disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              disabled={loading || isRegistering}
            >
              {loading || isRegistering ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin mr-2" />
                  Creating Admin Account...
                </>
              ) : (
                <>
                  <Check className="h-5 w-5 mr-2" />
                  Complete Registration
                </>
              )}
            </button>
          </div>

          {/* Security notice */}
          <div className="flex items-start space-x-2 p-3 bg-green-50 border border-green-200 rounded-lg mt-4">
            <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
            <div className="text-xs text-green-700">
              <p className="font-medium">Secure Registration</p>
              <p>Your invitation has been cryptographically verified. All data is transmitted securely.</p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}