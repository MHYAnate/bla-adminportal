// services/auth/index.ts - COMPLETE FIXED VERSION
"use client";

import { routes } from "../api-routes";
import httpService from "../httpService";
import { ErrorHandler } from "../errorHandler";
import useMutateItem from "../useMutateItem";
import { showErrorAlert, showSuccessAlert } from "@/lib/utils";
import { getAuthToken, clearAuthTokens, setAuthToken, isTokenValid } from "@/lib/auth";
import { useMutation } from "@tanstack/react-query";

// =================== TYPES ===================
interface HandleSuccess {
  (resData: any): void;
}

interface HandleError {
  (error: ErrorResponse): void;
}

interface ErrorResponse {
  response?: {
    data?: {
      error?: string;
      errorMessages?: string[];
      message?: string;
    };
    status?: number;
  };
  message?: string;
}

interface LoginPayload {
  email: string;
  password: string;
  remember?: boolean;
}

interface RegisterPayload {
  email: string;
  password: string;
  confirmPassword: string;
  type: 'individual' | 'business';
  fullName?: string;
  businessName?: string;
}

interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface ForgotPasswordPayload {
  email: string;
}

interface ResetPasswordPayload {
  token: string;
  password: string;
  confirmPassword: string;
}

interface VerifyEmailPayload {
  token: string;
  email: string;
}

interface UpdateProfilePayload {
  fullName?: string;
  phone?: string;
  businessName?: string;
  businessType?: string;
  [key: string]: any;
}

interface AdminStatusResponse {
  isAdmin: boolean;
  isSuperAdmin: boolean;
  roles: string[];
  permissions: string[];
}

// Fixed mutation function type from useMutateItem
interface MutateItemResponse<T> {
  data: any;
  error: any;
  isPending: boolean;
  mutateAsync: (payload: T) => Promise<any>;
}

// Fixed mutation result types
interface MutationResult {
  mutate: () => void;
  mutateAsync: () => Promise<any>;
  isPending: boolean;
  error: any;
  isSuccess: boolean;
}

// Response interfaces
interface UseLoginResponse {
  loginData: any;
  loginDataError: string;
  loginIsLoading: boolean;
  loginPayload: (requestPayload: LoginPayload) => Promise<void>;
}

interface UseRegisterResponse {
  registerData: any;
  registerDataError: string;
  registerIsLoading: boolean;
  registerPayload: (requestPayload: RegisterPayload) => Promise<void>;
}

interface UseChangePasswordResponse {
  changePasswordData: any;
  changePasswordDataError: string;
  changePasswordIsLoading: boolean;
  changePasswordPayload: (requestPayload: ChangePasswordPayload) => Promise<void>;
}

interface UseForgotPasswordResponse {
  forgotPasswordData: any;
  forgotPasswordDataError: string;
  forgotPasswordIsLoading: boolean;
  forgotPasswordPayload: (requestPayload: ForgotPasswordPayload) => Promise<void>;
}

interface UseResetPasswordResponse {
  resetPasswordData: any;
  resetPasswordDataError: string;
  resetPasswordIsLoading: boolean;
  resetPasswordPayload: (requestPayload: ResetPasswordPayload) => Promise<void>;
}

interface UseVerifyEmailResponse {
  verifyEmailData: any;
  verifyEmailDataError: string;
  verifyEmailIsLoading: boolean;
  verifyEmailPayload: (requestPayload: VerifyEmailPayload) => Promise<void>;
}

interface UseResendVerificationResponse {
  resendVerificationData: any;
  resendVerificationDataError: string;
  resendVerificationIsLoading: boolean;
  resendVerificationPayload: (requestPayload: { email: string }) => Promise<void>;
}

interface UseValidateTokenResponse {
  validateData: any;
  validateError: any;
  validateIsLoading: boolean;
  validateToken: () => Promise<any>;
}

interface UseGetCurrentUserResponse {
  currentUserData: any;
  currentUserError: string;
  currentUserIsLoading: boolean;
  getCurrentUser: () => Promise<any>;
}

interface UseUpdateProfileResponse {
  updateProfileData: any;
  updateProfileError: string;
  updateProfileIsLoading: boolean;
  updateProfilePayload: (requestPayload: UpdateProfilePayload) => Promise<void>;
}

interface UseCheckAdminStatusResponse {
  adminStatusData: AdminStatusResponse | null;
  adminStatusError: string;
  adminStatusIsLoading: boolean;
  checkAdminStatus: () => Promise<any>;
}

// =================== LOGIN ===================
export const useLogin = (
  handleSuccess: HandleSuccess, 
  handleError?: HandleError
): UseLoginResponse => {
  const { data, error, isPending, mutateAsync } =
    useMutateItem({
      mutationFn: (payload: LoginPayload) =>
        httpService.postDataWithoutToken(payload, routes.login()),
      queryKeys: ["login"],
      onSuccess: (requestParams: any) => {
        console.log('🎯 Login success response:', requestParams);
        const resData = requestParams?.data || requestParams || {};
        
        // Don't store token here - let the success handler manage it
        handleSuccess(resData);
        
        // Only show success message if no custom handler is provided
        if (!handleSuccess.toString().includes('auth.login')) {
          showSuccessAlert(resData?.message || "Login successful!");
        }
      },
      onError: (error: ErrorResponse) => {
        console.error('❌ Login error:', error);
        
        if (handleError) {
          handleError(error);
        } else {
          const errorMsg = error?.response?.data?.error || 
                          error?.response?.data?.message || 
                          error?.message || 
                          "Login failed. Please check your credentials.";
          showErrorAlert(errorMsg);
        }
      },
    }) as unknown as MutateItemResponse<LoginPayload>;

  return {
    loginData: data,
    loginDataError: ErrorHandler(error) || "An error occurred",
    loginIsLoading: isPending,
    loginPayload: async (requestPayload: LoginPayload): Promise<void> => {
      console.log('📝 Login payload submitted:', {
        email: requestPayload.email,
        remember: requestPayload.remember
      });
      await mutateAsync(requestPayload as any);
    },
  };
};

// =================== REGISTER ===================
export const useRegister = (handleSuccess: HandleSuccess): UseRegisterResponse => {
  const { data, error, isPending, mutateAsync } =
    useMutateItem({
      mutationFn: (payload: RegisterPayload) =>
        httpService.postDataWithoutToken(payload, routes.register()),
      queryKeys: ["register"],
      onSuccess: (requestParams: any) => {
        const resData = requestParams?.data || {};
        handleSuccess(resData);
        showSuccessAlert(resData?.message || "Registration successful!");
      },
      onError: (error: ErrorResponse) => {
        const errorMsg = error?.response?.data?.error || 
                        error?.response?.data?.message || 
                        "Registration failed!";
        showErrorAlert(errorMsg);
      },
    }) as unknown as MutateItemResponse<RegisterPayload>;

  return {
    registerData: data,
    registerDataError: ErrorHandler(error) || "An error occurred!",
    registerIsLoading: isPending,
    registerPayload: async (requestPayload: RegisterPayload): Promise<void> => {
      await mutateAsync(requestPayload as any);
    },
  };
};

// =================== FORGOT PASSWORD ===================
export const useForgotPassword = (handleSuccess: HandleSuccess): UseForgotPasswordResponse => {
  const { data, error, isPending, mutateAsync } =
    useMutateItem({
      mutationFn: (payload: ForgotPasswordPayload) =>
        httpService.postDataWithoutToken(payload, routes.forgotPassword()),
      queryKeys: ["forgot"],
      onSuccess: (requestParams: any) => {
        const resData = requestParams?.data || {};
        handleSuccess(resData);
        showSuccessAlert(resData?.message || "Password reset email sent!");
      },
      onError: (error: ErrorResponse) => {
        const errorMsg = error?.response?.data?.error || 
                        error?.response?.data?.message || 
                        "Failed to send reset email!";
        showErrorAlert(errorMsg);
      },
    }) as unknown as MutateItemResponse<ForgotPasswordPayload>;

  return {
    forgotPasswordData: data,
    forgotPasswordDataError: ErrorHandler(error) || "An error occurred!",
    forgotPasswordIsLoading: isPending,
    forgotPasswordPayload: async (requestPayload: ForgotPasswordPayload): Promise<void> => {
      await mutateAsync(requestPayload as any);
    },
  };
};

// =================== RESET PASSWORD ===================
export const useResetPassword = (handleSuccess: HandleSuccess): UseResetPasswordResponse => {
  const { data, error, isPending, mutateAsync } =
    useMutateItem({
      mutationFn: (payload: ResetPasswordPayload) =>
        httpService.postDataWithoutToken(payload, routes.resetPassword()),
      queryKeys: ["reset"],
      onSuccess: (requestParams: any) => {
        const resData = requestParams?.data || {};
        handleSuccess(resData);
        showSuccessAlert(resData?.message || "Password reset successful!");
      },
      onError: (error: ErrorResponse) => {
        const errorMsg = error?.response?.data?.error || 
                        error?.response?.data?.message || 
                        "Password reset failed!";
        showErrorAlert(errorMsg);
      },
    }) as unknown as MutateItemResponse<ResetPasswordPayload>;

  return {
    resetPasswordData: data,
    resetPasswordDataError: ErrorHandler(error) || "An error occurred!",
    resetPasswordIsLoading: isPending,
    resetPasswordPayload: async (requestPayload: ResetPasswordPayload): Promise<void> => {
      await mutateAsync(requestPayload as any);
    },
  };
};

// =================== CHANGE PASSWORD ===================
export const useChangePassword = (handleSuccess: HandleSuccess): UseChangePasswordResponse => {
  const { data, error, isPending, mutateAsync } =
    useMutateItem({
      mutationFn: (payload: ChangePasswordPayload) =>
        httpService.postData(payload, routes.changePassword()),
      queryKeys: ["change-password"],
      onSuccess: (requestParams: any) => {
        const resData = requestParams?.data || {};
        handleSuccess(resData);
        showSuccessAlert(resData?.message || "Password changed successfully!");
      },
      onError: (error: ErrorResponse) => {
        const errorMsg = error?.response?.data?.error || 
                        error?.response?.data?.message || 
                        "Password change failed!";
        showErrorAlert(errorMsg);
      },
    }) as unknown as MutateItemResponse<ChangePasswordPayload>;

  return {
    changePasswordData: data,
    changePasswordDataError: ErrorHandler(error) || "An error occurred!",
    changePasswordIsLoading: isPending,
    changePasswordPayload: async (requestPayload: ChangePasswordPayload): Promise<void> => {
      await mutateAsync(requestPayload as any);
    },
  };
};

// =================== LOGOUT ===================
export const useLogout = (): MutationResult => {
  const mutation = useMutation({
    mutationFn: async (): Promise<any> => {
      try {
        console.log('🚪 Initiating logout...');
        
        // Try to call logout endpoint
        await httpService.postData({}, routes.logout());
        console.log('✅ Logout API call successful');
      } catch (error) {
        // Even if the API call fails, we should clear local tokens
        console.warn('⚠️ Logout API call failed, but clearing tokens locally:', error);
      } finally {
        // Always clear tokens locally
        clearAuthTokens();
        console.log('🧹 Local tokens cleared');
      }
      return Promise.resolve();
    },
    onSuccess: () => {
      console.log('✅ Logout completed successfully');
      showSuccessAlert("Logged out successfully");
      
      // Redirect to login page
      if (typeof window !== 'undefined') {
        // Use admin login for admin users
        const currentPath = window.location.pathname;
        const redirectPath = currentPath.includes('/admin') ? '/login' : '/login';
        window.location.href = redirectPath;
      }
    },
    onError: (error: ErrorResponse) => {
      // Even on error, we've cleared tokens, so just show a message
      console.error('❌ Logout error:', error);
      showErrorAlert("Logged out locally");
      
      // Still redirect to login
      if (typeof window !== 'undefined') {
        const currentPath = window.location.pathname;
        const redirectPath = currentPath.includes('/admin') ? '/login' : '/login';
        window.location.href = redirectPath;
      }
    },
  });

  return {
    mutate: mutation.mutate,
    mutateAsync: mutation.mutateAsync,
    isPending: mutation.isPending,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
  };
};

// =================== TOKEN VALIDATION ===================
export const useValidateToken = (): UseValidateTokenResponse => {
  const { data, error, isPending, mutateAsync } =
    useMutateItem({
      mutationFn: () => httpService.getData(routes.checkAuth()),
      queryKeys: ["validate-token"],
      onSuccess: (response: any) => {
        console.log('✅ Token validation successful:', response);
      },
      onError: (error: ErrorResponse) => {
        console.error('❌ Token validation failed:', error);
        clearAuthTokens();
      },
    }) as unknown as MutateItemResponse<any>;

  return {
    validateData: data,
    validateError: error,
    validateIsLoading: isPending,
    validateToken: async (): Promise<any> => {
      return await mutateAsync(data as any);
    },
  };
};

// =================== CHECK AUTH STATUS ===================
export const checkAuth = (): boolean => {
  const token = getAuthToken();
  
  if (!token) {
    console.log('🚫 No token found during auth check');
    return false;
  }

  try {
    // Use the enhanced token validation
    const isValid = isTokenValid(token);
    
    if (!isValid) {
      console.log('❌ Token validation failed, clearing tokens');
      clearAuthTokens();
      return false;
    }
    
    console.log('✅ Token validation successful');
    return true;
  } catch (error) {
    console.error('❌ Token validation error:', error);
    clearAuthTokens();
    return false;
  }
};

// =================== REFRESH TOKEN ===================
export const useRefreshToken = (): MutationResult => {
  const mutation = useMutation({
    mutationFn: async (): Promise<any> => {
      const response = await httpService.postDataWithoutToken({}, routes.refreshToken());
      return response;
    },
    onSuccess: (response: any) => {
      const newToken = response?.accessToken || response?.token;
      if (newToken) {
        setAuthToken(newToken);
        console.log('✅ Token refreshed successfully');
      }
    },
    onError: (error: ErrorResponse) => {
      console.error('❌ Token refresh failed:', error);
      clearAuthTokens();
      
      // Redirect to login
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    },
  });

  return {
    mutate: mutation.mutate,
    mutateAsync: mutation.mutateAsync,
    isPending: mutation.isPending,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
  };
};

// =================== VERIFY EMAIL ===================
export const useVerifyEmail = (handleSuccess: HandleSuccess): UseVerifyEmailResponse => {
  const { data, error, isPending, mutateAsync } =
    useMutateItem({
      mutationFn: (payload: VerifyEmailPayload) =>
        httpService.postDataWithoutToken(payload, routes.verifyEmail()),
      queryKeys: ["verify-email"],
      onSuccess: (requestParams: any) => {
        const resData = requestParams?.data || {};
        handleSuccess(resData);
        showSuccessAlert(resData?.message || "Email verified successfully!");
      },
      onError: (error: ErrorResponse) => {
        const errorMsg = error?.response?.data?.error || 
                        error?.response?.data?.message || 
                        "Email verification failed!";
        showErrorAlert(errorMsg);
      },
    }) as unknown as MutateItemResponse<VerifyEmailPayload>;

  return {
    verifyEmailData: data,
    verifyEmailDataError: ErrorHandler(error) || "An error occurred!",
    verifyEmailIsLoading: isPending,
    verifyEmailPayload: async (requestPayload: VerifyEmailPayload): Promise<void> => {
      await mutateAsync(requestPayload as any);
    },
  };
};

// =================== RESEND VERIFICATION ===================
export const useResendVerification = (handleSuccess: HandleSuccess): UseResendVerificationResponse => {
  const { data, error, isPending, mutateAsync } =
    useMutateItem({
      mutationFn: (payload: { email: string }) =>
        httpService.postDataWithoutToken(payload, routes.resendVerification()),
      queryKeys: ["resend-verification"],
      onSuccess: (requestParams: any) => {
        const resData = requestParams?.data || {};
        handleSuccess(resData);
        showSuccessAlert(resData?.message || "Verification email sent!");
      },
      onError: (error: ErrorResponse) => {
        const errorMsg = error?.response?.data?.error || 
                        error?.response?.data?.message || 
                        "Failed to send verification email!";
        showErrorAlert(errorMsg);
      },
    }) as unknown as MutateItemResponse<{ email: string }>;

  return {
    resendVerificationData: data,
    resendVerificationDataError: ErrorHandler(error) || "An error occurred!",
    resendVerificationIsLoading: isPending,
    resendVerificationPayload: async (requestPayload: { email: string }): Promise<void> => {
      await mutateAsync(requestPayload as any);
    },
  };
};

// =================== GET CURRENT USER ===================
export const useGetCurrentUser = (): UseGetCurrentUserResponse => {
  const { data, error, isPending, mutateAsync } =
    useMutateItem({
      mutationFn: () => httpService.getData(routes.getCurrentUser()),
      queryKeys: ["current-user"],
      onSuccess: (response: any) => {
        console.log('✅ Current user fetched:', response);
      },
      onError: (error: ErrorResponse) => {
        console.error('❌ Failed to fetch current user:', error);
        if (error?.response?.status === 401) {
          clearAuthTokens();
        }
      },
    }) as unknown as MutateItemResponse<any>;

  return {
    currentUserData: data,
    currentUserError: ErrorHandler(error) || "Failed to fetch user data",
    currentUserIsLoading: isPending,
    getCurrentUser: async (): Promise<any> => {
      return await mutateAsync(null as any);
    },
  };
};

// =================== UPDATE PROFILE ===================
export const useUpdateProfile = (handleSuccess: HandleSuccess): UseUpdateProfileResponse => {
  const { data, error, isPending, mutateAsync } =
    useMutateItem({
      mutationFn: (payload: UpdateProfilePayload) =>
        httpService.putData(payload, routes.updateProfile()),
      queryKeys: ["update-profile"],
      onSuccess: (requestParams: any) => {
        const resData = requestParams?.data || {};
        handleSuccess(resData);
        showSuccessAlert(resData?.message || "Profile updated successfully!");
      },
      onError: (error: ErrorResponse) => {
        const errorMsg = error?.response?.data?.error || 
                        error?.response?.data?.message || 
                        "Profile update failed!";
        showErrorAlert(errorMsg);
      },
    }) as unknown as MutateItemResponse<UpdateProfilePayload>;

  return {
    updateProfileData: data,
    updateProfileError: ErrorHandler(error) || "An error occurred!",
    updateProfileIsLoading: isPending,
    updateProfilePayload: async (requestPayload: UpdateProfilePayload): Promise<void> => {
      await mutateAsync(requestPayload as any);
    },
  };
};

// =================== CHECK ADMIN STATUS ===================
export const useCheckAdminStatus = (): UseCheckAdminStatusResponse => {
  const { data, error, isPending, mutateAsync } =
    useMutateItem({
      mutationFn: () => httpService.getData(routes.checkAdminStatus()),
      queryKeys: ["admin-status"],
      onSuccess: (response: any) => {
        console.log('✅ Admin status checked:', response);
      },
      onError: (error: ErrorResponse) => {
        console.error('❌ Failed to check admin status:', error);
        if (error?.response?.status === 401) {
          clearAuthTokens();
        }
      },
    }) as unknown as MutateItemResponse<any>;

  return {
    adminStatusData: data?.data || data,
    adminStatusError: ErrorHandler(error) || "Failed to check admin status",
    adminStatusIsLoading: isPending,
    checkAdminStatus: async (): Promise<any> => {
      return await mutateAsync(null as any);
    },
  };
};