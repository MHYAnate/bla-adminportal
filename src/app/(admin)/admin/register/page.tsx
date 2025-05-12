// // "use client"
// // import { ChevronDown, Upload } from "lucide-react";
// // import { Button } from "@/components/ui/button";
// // import { Input } from "@/components/ui/input";
// // import { Label } from "@/components/ui/label";
// // import Image from "next/image";
// // import FileUpload from "./fileUpLoad";
// // import { useState } from "react";

// // export default function SubAdminRegistrationForm() {

// //   	const [selectedFile, setSelectedFile] = useState<File | null>(null);

// // 	return (
// // 		<div className="flex flex-col md:flex-row w-full min-h-screen">
// // 			{/* Left Column - Onboarding */}
// // 			<div className="w-full md:w-1/2 flex flex-col justify-end bg-[#0F3D30]">
// // 				<Image
// // 					height={138.47}
// // 					width={218}
// // 					alt="Auth login image"
// // 					src="/images/photo.png"
// // 					quality={100}
// // 					priority
// // 					className="object-cover w-full h-auto"
// // 				/>

// // 				{/* Content */}
// // 				<div className="flex flex-col gap-6 p-12 border-t-[5px] border-[#EC9F01]">
// // 					{/* Logo */}
// // 					<Image
// // 						height={138.47}
// // 						width={218}
// // 						alt="Auth login image"
// // 						src="/images/logo.png"
// // 						quality={100}
// // 						priority
// // 						className="object-cover w-1/2 h-1/2"
// // 					/>

// // 					<h1 className="text-3xl font-bold text-white">
// // 						Welcome Aboard! Complete Your Registration.
// // 					</h1>

// // 					<p className="text-base text-white">
// // 						Fill in your details to set up your account and access your assigned
// // 						admin role.
// // 					</p>
// // 				</div>
// // 			</div>

// // 			{/* Right Column - Form */}
// // 			<div className="w-full md:w-1/2 bg-white p-9">
// // 				<div className="max-w-[648px] mx-auto flex flex-col gap-6">
// // 					{/* Title */}
// // 					<h2 className="text-3xl font-bold text-black">
// // 						Setup your account as an Admin
// // 					</h2>

// // 					{/* Form Fields - Row 1 */}
// // 					<div className="flex flex-col md:flex-row gap-6">
// // 						<div className="w-full md:w-1/2">
// // 							<Label
// // 								htmlFor="firstName"
// // 								className="text-sm font-medium text-gray-900 mb-2 block"
// // 							>
// // 								First Name
// // 							</Label>
// // 							<Input
// // 								id="firstName"
// // 								placeholder="Enter your first name"
// // 								className="w-full p-4 border border-gray-200 rounded-lg"
// // 							/>
// // 						</div>
// // 						<div className="w-full md:w-1/2">
// // 							<Label
// // 								htmlFor="lastName"
// // 								className="text-sm font-medium text-gray-900 mb-2 block"
// // 							>
// // 								Last Name
// // 							</Label>
// // 							<Input
// // 								id="lastName"
// // 								placeholder="Enter your last name"
// // 								className="w-full p-4 border border-gray-200 rounded-lg"
// // 								defaultValue="Doe"
// // 							/>
// // 						</div>
// // 					</div>

// // 					{/* Form Fields - Row 2 */}
// // 					<div className="flex flex-col md:flex-row gap-6">
// // 						<div className="w-full md:w-1/2">
// // 							<Label
// // 								htmlFor="email"
// // 								className="text-sm font-medium text-gray-900 mb-2 block"
// // 							>
// // 								Email Address
// // 							</Label>
// // 							<Input
// // 								id="email"
// // 								type="email"
// // 								placeholder="Enter your email address"
// // 								className="w-full p-4 border border-gray-200 rounded-lg"
// // 							/>
// // 						</div>
// // 						<div className="w-full md:w-1/2">
// // 							<Label
// // 								htmlFor="phone"
// // 								className="text-sm font-medium text-gray-900 mb-2 block"
// // 							>
// // 								Phone Number
// // 							</Label>
// // 							<Input
// // 								id="phone"
// // 								placeholder="Enter your phone number"
// // 								className="w-full p-4 border border-gray-200 rounded-lg"
// // 							/>
// // 						</div>
// // 					</div>

// // 					<div className="flex flex-col md:flex-row gap-6">
// // 						<div className="w-full md:w-1/2">
// // 							<Label
// // 								htmlFor="password"
// // 								className="text-sm font-medium text-gray-900 mb-2 block"
// // 							>
// // 								Password
// // 							</Label>
// // 							<Input
// // 								id="password"
// // 								type="password"
// // 								placeholder="Enter your password"
// // 								className="w-full p-4 border border-gray-200 rounded-lg"
// // 							/>
// // 						</div>
// // 						<div className="w-full md:w-1/2">
// // 							<Label
// // 								htmlFor="confirmPassword"
// // 								className="text-sm font-medium text-gray-900 mb-2 block"
// // 							>
// // 								Confirm Password
// // 							</Label>
// // 							<Input
// // 								id="confirmPassword"
// // 								type="password"
// // 								placeholder="Confirm your password"
// // 								className="w-full p-4 border border-gray-200 rounded-lg"
// // 							/>
// // 						</div>
// // 					</div>

// // 					{/* Address Field */}
// // 					<div className="w-full">
// // 						<Label
// // 							htmlFor="address"
// // 							className="text-sm font-medium text-gray-900 mb-2 block"
// // 						>
// // 							Address (Optional)
// // 						</Label>
// // 						<Input
// // 							id="address"
// // 							placeholder="Enter your address"
// // 							className="w-full p-4 border border-gray-200 rounded-lg"
// // 						/>
// // 					</div>

// // 					{/* Photo Upload */}
			
// //           <FileUpload setSelectedFile={setSelectedFile} selectedFile={selectedFile}/>

// // 					{/* Submit Button */}
// // 					<div className="flex justify-start mt-4">
// // 						<Button className="bg-[#EC9F01] hover:bg-[#d89001] text-white font-bold py-4 px-6 rounded-lg">
// // 							Submit
// // 						</Button>
// // 					</div>
// // 				</div>
// // 			</div>
// // 		</div>
// // 	);
// // }

// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Label } from "@/components/ui/label";
// import { toast } from "sonner";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Card, CardContent } from "@/components/ui/card";
// import { useRegisterAdmin } from "@/services/admin";

// interface RegisterAdminTabProps {
//   token: string;
//   email?: string;
//   userId?: string;
//   roles?: Array<{
//     id: number;
//     name: string;
//     description: string;
//   }>;
// }

// export default function RegisterAdminTab({ token, email, userId, roles = [] }: RegisterAdminTabProps) {
//   const router = useRouter();
//   const [fullName, setFullName] = useState("");
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [gender, setGender] = useState("");
//   const [phone, setPhone] = useState("");
//   const [role, setRole] = useState("");
//   const [errors, setErrors] = useState<Record<string, string>>({});

//   const { registerAdminPayload, registerAdminIsLoading } = useRegisterAdmin((data:any) => {
//     toast.success(data.message || "Admin registered successfully");
//     router.push("/admin");
//   });

//   const validateForm = () => {
//     const newErrors: Record<string, string> = {};
    
//     // Validate required fields
//     if (!fullName) newErrors.fullName = "Full name is required";
//     if (!username) newErrors.username = "Username is required";
//     if (!password) newErrors.password = "Password is required";
//     if (!phone) newErrors.phone = "Phone number is required";
//     // if (!role) newErrors.role = "Role is required";
    
//     // Validate password strength
//     if (password && password.length < 8) {
//       newErrors.password = "Password must be at least 8 characters";
//     }
    
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async () => {
//     if (!validateForm()) {
//       toast.error("Please fix the errors in the form");
//       return;
//     }

//     try {
//       await registerAdminPayload({
//         password,
//         fullName,
//         username,
//         gender,
//         phone,
//         // role,
//         token
//       });
//     } catch (err: any) {
//       toast.error(err.message || "Something went wrong");
//     }
//   };

//   return (
//     <Card className="w-full max-w-md mx-auto">
//       <CardContent className="space-y-6 p-6">
//         <div className="text-center mb-2">
//           <h2 className="text-2xl font-semibold">Complete Your Registration</h2>
//           {email && (
//             <p className="text-muted-foreground mt-1">
//               Welcome, {email}
//             </p>
//           )}
//         </div>

//         <div className="space-y-4">
//           <div className="space-y-2">
//             <Label htmlFor="fullName">
//               Full Name <span className="text-destructive">*</span>
//             </Label>
//             <Input
//               id="fullName"
//               placeholder="John Doe"
//               value={fullName}
//               onChange={(e) => setFullName(e.target.value)}
//               className={errors.fullName ? "border-destructive" : ""}
//             />
//             {errors.fullName && (
//               <p className="text-destructive text-sm">{errors.fullName}</p>
//             )}
//           </div>

//           <div className="space-y-2">
//             <Label htmlFor="username">
//               Username <span className="text-destructive">*</span>
//             </Label>
//             <Input
//               id="username"
//               placeholder="johndoe"
//               value={username}
//               onChange={(e) => setUsername(e.target.value)}
//               className={errors.username ? "border-destructive" : ""}
//             />
//             {errors.username && (
//               <p className="text-destructive text-sm">{errors.username}</p>
//             )}
//           </div>

//           <div className="space-y-2">
//             <Label htmlFor="password">
//               Password <span className="text-destructive">*</span>
//             </Label>
//             <Input
//               id="password"
//               type="password"
//               placeholder="********"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               className={errors.password ? "border-destructive" : ""}
//             />
//             {errors.password && (
//               <p className="text-destructive text-sm">{errors.password}</p>
//             )}
//             {password && password.length > 0 && password.length < 8 && (
//               <p className="text-amber-500 text-sm">Password should be at least 8 characters</p>
//             )}
//           </div>

//           <div className="grid grid-cols-2 gap-4">
//             <div className="space-y-2">
//               <Label htmlFor="gender">Gender</Label>
//               <Select value={gender} onValueChange={setGender}>
//                 <SelectTrigger>
//                   <SelectValue placeholder="Select gender" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="male">Male</SelectItem>
//                   <SelectItem value="female">Female</SelectItem>
//                   <SelectItem value="other">Other</SelectItem>
//                   <SelectItem value="prefer_not_to_say">Prefer not to say</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="phone">
//                 Phone Number <span className="text-destructive">*</span>
//               </Label>
//               <Input
//                 id="phone"
//                 placeholder="+1234567890"
//                 value={phone}
//                 onChange={(e) => setPhone(e.target.value)}
//                 className={errors.phone ? "border-destructive" : ""}
//               />
//               {errors.phone && (
//                 <p className="text-destructive text-sm">{errors.phone}</p>
//               )}
//             </div>
//           </div>

//           {/* <div className="space-y-2">
//             <Label htmlFor="role">
//               Role <span className="text-destructive">*</span>
//             </Label>
//             <Select value={role} onValueChange={setRole}>
//               <SelectTrigger className={errors.role ? "border-destructive" : ""}>
//                 <SelectValue placeholder="Select role" />
//               </SelectTrigger>
//               <SelectContent>
//                 {roles.map((role) => (
//                   <SelectItem key={role.id} value={role.name}>
//                     {role.name.replace(/_/g, " ")}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//             {errors.role && (
//               <p className="text-destructive text-sm">{errors.role}</p>
//             )}
//           </div> */}

//           <Button 
//             onClick={handleSubmit} 
//             disabled={registerAdminIsLoading} 
//             className="w-full"
//           >
//             {registerAdminIsLoading ? "Completing Registration..." : "Complete Registration"}
//           </Button>
//         </div>
//       </CardContent>
//     </Card>
//   );
// }

"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import SubAdminRegistrationForm from "./SubAdminRegistratuinForm";
import { Loader2 } from "lucide-react";
import httpService from "@/services/httpService";

export default function AdminRegistrationPage() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const userId = searchParams.get("userId");
  const expires = searchParams.get("expires");
  const signature = searchParams.get("signature");
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simple validation of required parameters
    if (!email || !userId || !expires || !signature) {
      setError("Invalid invitation link");
    } else {
      // Check if invitation has expired
      const expiryTime = parseInt(expires);
      if (isNaN(expiryTime) || Date.now() > expiryTime) {
        setError("This invitation link has expired");
      }
    }
    setLoading(false);
  }, [email, userId, expires, signature]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
          <p className="mt-4 text-lg">Verifying your invitation...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="max-w-md mx-auto p-8 bg-white rounded-lg shadow-md text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Registration Error</h1>
          <p className="text-gray-700 mb-6">{error}</p>
          <p className="text-gray-600">
            Please contact your administrator for a new invitation or support.
          </p>
        </div>
      </div>
    );
  }


  return (
    <SubAdminRegistrationForm />
  );
}