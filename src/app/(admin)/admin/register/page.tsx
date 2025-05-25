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