"use client"
import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Eye, EyeOff, User, Lock, Phone, Mail, Loader2,Check } from "lucide-react"
import { toast } from "sonner"
import { useRegisterAdmin } from "@/services/admin"
import Image from "next/image"
import { useRouter } from "next/navigation"

type FormErrors = {
  firstName?: string
  lastName?: string
  username?: string
  phone?: string
  gender?: string
  password?: string
  confirmPassword?: string
}

export default function AdminRegistration() {
  // Extract signed invitation parameters from URL
  const searchParams = useSearchParams()
  const email = searchParams.get("email")
  const userId = searchParams.get("userId")
  const expires = searchParams.get("expires")
  const signature = searchParams.get("signature")

  const router = useRouter()

  // Check if invitation link is valid
  const [expired, setExpired] = useState(false)
  const [validatingLink, setValidatingLink] = useState(true)
  const [registrationComplete, setRegistrationComplete] = useState(false)

  useEffect(() => {
    if (expires) {
      // Parse expiration as timestamp (ms or seconds)
      let expireTime = Number(expires)
      if (isNaN(expireTime)) {
        expireTime = new Date(expires).getTime()
      }
      if (!isNaN(expireTime) && Date.now() > expireTime) {
        setExpired(true)
      }
    }
    setValidatingLink(false)
  }, [expires])

  // Form state
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [username, setUsername] = useState("")
  const [phone, setPhone] = useState("")
  const [gender, setGender] = useState("")
  const [role] = useState("admin") // fixed
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})

  // Hook for registering admin
  const { registerAdminPayload, loading } = useRegisterAdmin({
    onSuccess: () => {
      toast.success("Admin registered successfully!")
      setRegistrationComplete(true)
    },
  })
  

  // Validate and submit form
  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault()
    const newErrors: FormErrors = {}
    if (!firstName.trim()) newErrors.firstName = "First name is required"
    if (!lastName.trim()) newErrors.lastName = "Last name is required"
    if (!username.trim()) newErrors.username = "Username is required"
    if (!phone.trim()) newErrors.phone = "Phone number is required"
    if (!gender) newErrors.gender = "Gender is required"
    if (!password) newErrors.password = "Password is required"
    if (password && password.length < 6) newErrors.password = "Password must be at least 6 characters"
    if (password !== confirmPassword) newErrors.confirmPassword = "Passwords must match"
    setErrors(newErrors)
    if (Object.keys(newErrors).length > 0) return

    // Call hook with form data + invitation params
    try {
      await registerAdminPayload({
        email,
        userId,
        expires,
        signature,
        firstName,
        lastName,
        username,
        phone,
        gender,
        role,
        password,
      })
      setRegistrationComplete(true)
      toast.success("Admin registered successfully!")
    } catch (error) {
      toast.error("Registration failed. Please try again.")
    }
  }

  if (validatingLink) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-[#0F3D30] mx-auto" />
          <p className="mt-4 text-lg">Verifying your invitation...</p>
        </div>
      </div>
    )
  }

  // If link invalid or expired, show error
  if (!email || !userId || !expires || !signature) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="max-w-md mx-auto p-8 bg-white rounded-lg shadow-md text-center">
          <h2 className="text-xl font-semibold text-red-600">Registration Error</h2>
          <p className="text-gray-600 mt-2">Invalid invitation link.</p>
          <p className="text-gray-600">Please contact your administrator for a new invitation or support.</p>
        </div>
      </div>
    )
  }

  if (expired) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="max-w-md mx-auto p-8 bg-white rounded-lg shadow-md text-center">
          <h2 className="text-xl font-semibold text-red-600">Registration Error</h2>
          <p className="text-gray-600 mt-2">Invitation link has expired.</p>
          <p className="text-gray-600">Please contact your administrator for a new invitation or support.</p>
        </div>
      </div>
    )
  }

  if (registrationComplete) {
    return (
           <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="max-w-md w-full mx-auto p-8 bg-white rounded-lg shadow-md text-center">
          <div className="rounded-full bg-green-100 p-3 w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <Check className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Registration Complete!</h1>
          <p className="text-gray-600 mb-6">
            Your admin account has been successfully set up. You can now log in to access your dashboard.
          </p>
          <button
            onClick={() => router.push('/login')}
            className="w-full bg-[#0F3D30] text-white py-3 px-4 rounded-md hover:bg-[#1b5d49] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0F3D30]"
          >
            Proceed to Login
          </button>
        </div>
      </div>
    )
  }
  // if (registrationComplete && role === "admin") {
  //   return (
  //     <div className="flex items-center justify-center h-screen bg-gray-50">
  //       <div className="max-w-md w-full mx-auto p-8 bg-white rounded-lg shadow-md text-center">
  //         <div className="rounded-full bg-green-100 p-3 w-16 h-16 flex items-center justify-center mx-auto mb-4">
  //           <svg
  //             xmlns="http://www.w3.org/2000/svg"
  //             className="h-8 w-8 text-green-600"
  //             fill="none"
  //             viewBox="0 0 24 24"
  //             stroke="currentColor"
  //           >
  //             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  //           </svg>
  //         </div>
  //         <h1 className="text-2xl font-bold text-gray-800 mb-2">Registration Complete!</h1>
  //         <p className="text-gray-600 mb-6">
  //           Your admin account has been successfully set up. You can now log in to access your dashboard.
  //         </p>
  //         <button
  //           onClick={() => (window.location.href = "/login")}
  //           className="w-full bg-[#0F3D30] text-white py-3 px-4 rounded-md hover:bg-[#1b5d49] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0F3D30]"
  //         >
  //           Proceed to Login
  //         </button>
  //       </div>
  //     </div>
  //   )
  // }

  return (
    <div className="flex flex-col md:flex-row w-full min-h-screen">
      {/* Left Column */}
      <div className="w-full md:w-1/2 flex flex-col justify-end bg-[#0F3D30]">
        <div className="flex-1 flex items-center justify-center">
          <Image
            alt="Admin registration"
            src="/images/photo.png"
            className="object-cover w-full h-full"
            width={500}
            height={500}
          />
        </div>
        <div className="flex flex-col gap-6 p-12 border-t-[5px] border-[#EC9F01]">
          <div className="w-1/2">
            <Image alt="Logo" src="/images/logo.png" className="object-cover h-30 w-30" width={200} height={200} />
          </div>
          <h1 className="text-3xl font-bold text-white">Welcome Aboard! Complete Your Registration</h1>
          <p className="text-base text-white">
            Fill in your details to set up your account and access your assigned admin role.
          </p>
        </div>
      </div>

      {/* Right Column */}
      <div className="w-full md:w-1/2 bg-white p-9 overflow-y-auto">
        <form onSubmit={handleSubmit} className="max-w-[648px] mx-auto flex flex-col gap-6">
          <div className="mb-4">
            <h2 className="text-3xl font-bold text-black">Setup your account as an Admin</h2>
            {email && <p className="text-gray-500 mt-2">Welcome, {email}</p>}
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
                  className={`w-full pl-10 pr-3 py-2 border ${
                    errors.firstName ? "border-red-500" : "border-gray-200"
                  } rounded-lg focus:ring-[#0F3D30] focus:border-[#0F3D30]`}
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
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
                  className={`w-full pl-10 pr-3 py-2 border ${
                    errors.lastName ? "border-red-500" : "border-gray-200"
                  } rounded-lg focus:ring-[#0F3D30] focus:border-[#0F3D30]`}
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
              {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
            </div>
          </div>

          {/* Username and Gender */}
          <div className="flex flex-col md:flex-row gap-6">
            <div className="w-full">
              <label htmlFor="username" className="text-sm font-medium text-gray-900 mb-2 block">
                Username <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="username"
                  name="username"
                  placeholder="Choose a username"
                  className={`w-full pl-10 pr-3 py-2 border ${
                    errors.username ? "border-red-500" : "border-gray-200"
                  } rounded-lg focus:ring-[#0F3D30] focus:border-[#0F3D30]`}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username}</p>}
            </div>

            <div className="w-full md:w-1/2">
              <label htmlFor="gender" className="text-sm font-medium text-gray-900 mb-2 block">
                Gender <span className="text-red-500">*</span>
              </label>
              <select
                id="gender"
                name="gender"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className={`w-full p-2 border ${
                  errors.gender ? "border-red-500" : "border-gray-200"
                } rounded-lg focus:ring-[#0F3D30] focus:border-[#0F3D30]`}
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
                <option value="prefer_not_to_say">Prefer not to say</option>
              </select>
              {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender}</p>}
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
                  placeholder="Enter your email address"
                  className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg bg-gray-50"
                  value={email || ""}
                  disabled
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">Your email is provided by the invitation</p>
            </div>

            <div className="w-full md:w-1/2">
              <label htmlFor="phone" className="text-sm font-medium text-gray-900 mb-2 block">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="phone"
                  name="phone"
                  placeholder="Enter your phone number"
                  className={`w-full pl-10 pr-3 py-2 border ${
                    errors.phone ? "border-red-500" : "border-gray-200"
                  } rounded-lg focus:ring-[#0F3D30] focus:border-[#0F3D30]`}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
            </div>
          </div>

          {/* Role (fixed to admin) */}
          <div>
            <label htmlFor="role" className="text-sm font-medium text-gray-900 mb-2 block">
              Role
            </label>
            <input
              id="role"
              type="text"
              value="admin"
              disabled
              className="w-full pl-3 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-700"
            />
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
                  placeholder="Enter your password"
                  className={`w-full pl-10 pr-10 py-2 border ${
                    errors.password ? "border-red-500" : "border-gray-200"
                  } rounded-lg focus:ring-[#0F3D30] focus:border-[#0F3D30]`}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
                  className={`w-full pl-10 pr-10 py-2 border ${
                    errors.confirmPassword ? "border-red-500" : "border-gray-200"
                  } rounded-lg focus:ring-[#0F3D30] focus:border-[#0F3D30]`}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
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
              className="bg-[#EC9F01] hover:bg-[#d89001] text-white font-bold py-4 px-8 rounded-lg flex items-center"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin mr-2" />
                  Submitting...
                </>
              ) : (
                "Complete Registration"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

