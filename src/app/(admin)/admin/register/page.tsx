"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Loader2, AlertCircle, CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import SubAdminRegistrationForm from "./SubAdminRegistratuinForm";

// ✅ FIXED: Proper TypeScript interfaces
interface InviteParams {
  email: string;
  userId: number;
  token: string;
  signature: string;
  timestamp: number;
  expires?: number;
  noExpiry: boolean;
  isValid: boolean;
}

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
}

// Enhanced invitation parameters hook with secure validation
const useSecureAdminInviteParams = () => {
  const [params, setParams] = useState<InviteParamsState>({
    email: null,
    userId: null,
    expires: null,
    signature: null,
    token: null,
    timestamp: null,
    noExpiry: false,
    isLoading: true,
    error: null,
    isValid: false
  });

  useEffect(() => {
    try {
      const searchParams = new URLSearchParams(window.location.search);
      const email = searchParams.get('email');
      const userId = searchParams.get('userId');
      const expires = searchParams.get('expires');
      const signature = searchParams.get('signature');
      const token = searchParams.get('token');
      const timestamp = searchParams.get('timestamp');
      const noExpiry = searchParams.get('noExpiry') === 'true';

      console.log('🔍 Parsing secure invite params:', {
        email,
        userId,
        expires,
        signature,
        token: token ? '[PRESENT]' : '[MISSING]',
        timestamp,
        noExpiry
      });

      let error: string | null = null;
      let isValid = false;

      // ✅ Check all required parameters for secure invitation
      if (!email || !userId || !signature || !token || !timestamp) {
        const missing = [];
        if (!email) missing.push('email');
        if (!userId) missing.push('userId');
        if (!signature) missing.push('signature');
        if (!token) missing.push('token');
        if (!timestamp) missing.push('timestamp');

        error = `Invalid invitation link. Missing required security parameters: ${missing.join(', ')}.`;
      } else {
        // ✅ Validate timestamp is not too old (7 days max)
        const timestampInt = parseInt(timestamp);
        const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 days

        if (isNaN(timestampInt)) {
          error = 'Invalid invitation link. Invalid timestamp format.';
        } else if (Date.now() - timestampInt > maxAge) {
          error = 'This invitation link is too old (expired after 7 days). Please request a new one.';
        } else if (!noExpiry && expires) {
          // ✅ Check expiry if not a no-expiry invitation
          const expiryTime = parseInt(expires);
          if (isNaN(expiryTime)) {
            error = 'Invalid invitation link. Invalid expiry format.';
          } else if (Date.now() > expiryTime) {
            const expiredDate = new Date(expiryTime).toLocaleString();
            error = `This invitation link expired on ${expiredDate}. Please request a new one.`;
          } else {
            isValid = true;
          }
        } else {
          isValid = true;
        }
      }

      setParams({
        email,
        userId: userId ? parseInt(userId) : null,
        expires: expires ? parseInt(expires) : null,
        signature,
        token,
        timestamp: timestamp ? parseInt(timestamp) : null,
        noExpiry,
        isLoading: false,
        error,
        isValid
      });
    } catch (err) {
      console.error('Error parsing secure invite params:', err);
      setParams(prev => ({
        ...prev,
        isLoading: false,
        error: 'Invalid invitation link format.',
        isValid: false
      }));
    }
  }, []);

  return params;
};

export default function AdminRegistrationPage() {
  const router = useRouter();
  const inviteParamsState = useSecureAdminInviteParams();

  // ✅ Show loading state while validating invitation
  if (inviteParamsState.isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-[#0F3D30]" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Verifying Invitation</h2>
          <p className="text-gray-600">Please wait while we validate your invitation link...</p>
        </div>
      </div>
    );
  }

  // ✅ Show error state for invalid invitations
  if (!inviteParamsState.isValid || inviteParamsState.error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="max-w-md w-full mx-auto p-8 bg-white rounded-lg shadow-md text-center">
          <div className="rounded-full bg-red-100 p-3 w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="h-8 w-8 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Invalid Invitation</h1>
          <p className="text-red-600 mb-6">{inviteParamsState.error}</p>
          <div className="space-y-3">
            <button
              onClick={() => router.push('/login')}
              className="w-full bg-[#0F3D30] text-white py-3 px-4 rounded-md hover:bg-[#1b5d49] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0F3D30]"
            >
              Go to Login
            </button>
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-gray-200 text-gray-800 py-3 px-4 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ✅ FIXED: Type-safe conversion from state to props
  // Only pass props if we have valid data
  if (!inviteParamsState.email || !inviteParamsState.userId || !inviteParamsState.token || !inviteParamsState.signature || !inviteParamsState.timestamp) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="max-w-md w-full mx-auto p-8 bg-white rounded-lg shadow-md text-center">
          <div className="rounded-full bg-red-100 p-3 w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="h-8 w-8 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Invalid Invitation Data</h1>
          <p className="text-red-600 mb-6">Invitation parameters are incomplete.</p>
        </div>
      </div>
    );
  }

  // ✅ Create properly typed invite params
  const inviteParams: InviteParams = {
    email: inviteParamsState.email,
    userId: inviteParamsState.userId,
    token: inviteParamsState.token,
    signature: inviteParamsState.signature,
    timestamp: inviteParamsState.timestamp,
    expires: inviteParamsState.expires || undefined,
    noExpiry: inviteParamsState.noExpiry,
    isValid: inviteParamsState.isValid
  };

  // ✅ Show invitation details for valid invitations
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with invitation info */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="rounded-full bg-green-100 p-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">Valid Admin Invitation</h1>
              <p className="text-sm text-gray-600">
                Welcome, <span className="font-medium">{inviteParams.email}</span>
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">
              {inviteParams.noExpiry ? (
                <span className="text-green-600 font-medium">No Expiry</span>
              ) : inviteParams.expires ? (
                <span>
                  Expires: {new Date(inviteParams.expires).toLocaleDateString()}
                </span>
              ) : (
                'Valid'
              )}
            </p>
            <p className="text-xs text-gray-400">
              Invitation ID: {inviteParams.userId}
            </p>
          </div>
        </div>
      </div>

      {/* Registration Form */}
      <SubAdminRegistrationForm inviteParams={inviteParams} />
    </div>
  );
}