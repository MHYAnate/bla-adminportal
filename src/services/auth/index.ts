"use client";

import { routes } from "../api-routes";
import httpService from "../httpService";
import { ErrorHandler } from "../errorHandler";
import useMutateItem from "../useMutateItem";
import { showErrorAlert, showSuccessAlert } from "@/lib/utils";
import { getAuthToken, clearAuthTokens } from "@/lib/auth";

interface HandleSuccess {
  (resData: any): void;
}

interface ErrorResponse {
  response?: {
    data?: {
      errorMessages?: string[];
    };
  };
  message?: string;
}

interface UseLoginResponse {
  loginData: any;
  loginDataError: string;
  loginIsLoading: boolean;
  loginPayload: (requestPayload: any) => Promise<void>;
}

interface UseForgotPasswordResponse {
  forgotPasswordData: any;
  forgotPasswordDataError: string;
  forgotPasswordIsLoading: boolean;
  forgotPasswordPayload: (requestPayload: any) => Promise<void>;
}

interface UseResetPasswordResponse {
  resetPasswordData: any;
  resetPasswordDataError: string;
  resetPasswordIsLoading: boolean;
  resetPasswordPayload: (requestPayload: any) => Promise<void>;
}

export const useLogin = (handleSuccess: HandleSuccess): UseLoginResponse => {
  const { data, error, isPending, mutateAsync } = useMutateItem({
    mutationFn: (payload: any) =>
      httpService.postDataWithoutToken(payload, routes.login()),
    queryKeys: ["login"],
    onSuccess: (requestParams: any) => {
      console.log('Login success response:', requestParams);
      const resData = requestParams?.data || requestParams || {};
      handleSuccess(resData);
      showSuccessAlert(resData?.message || "Login successful!");
    },
    onError: (error: any) => {
      console.error('Login error:', error);
      showErrorAlert(error?.response?.data?.error || "Something went wrong!");
    },
  });

  return {
    loginData: data,
    loginDataError: ErrorHandler(error) || "An error occurred",
    loginIsLoading: isPending,
    loginPayload: async (requestPayload: any): Promise<void> => {
      console.log('Login payload:', requestPayload);
      await mutateAsync(requestPayload);
    },
  };
};

export const useForgotPassword = (
  handleSuccess: HandleSuccess
): UseForgotPasswordResponse => {
  const { data, error, isPending, mutateAsync } = useMutateItem({
    mutationFn: (payload: any) =>
      httpService.postDataWithoutToken(payload, routes.forgotPassword()),
    queryKeys: ["forgot"],
    onSuccess: (requestParams: any) => {
      const resData = requestParams?.data || {};
      handleSuccess(resData);
      showSuccessAlert(resData?.message);
    },
    onError: (error: any) => {
      showErrorAlert(error?.response?.data?.error || "Something went wrong!");
    },
  });

  return {
    forgotPasswordData: data,
    forgotPasswordDataError: ErrorHandler(error) || "An error occurred!",
    forgotPasswordIsLoading: isPending,
    forgotPasswordPayload: async (requestPayload: any): Promise<void> => {
      await mutateAsync(requestPayload);
    },
  };
};

export const useResetPassword = (
  handleSuccess: HandleSuccess
): UseResetPasswordResponse => {
  const { data, error, isPending, mutateAsync } = useMutateItem({
    mutationFn: (payload: any) =>
      httpService.postDataWithoutToken(payload, routes.resetPassword()),
    queryKeys: ["reset"],
    onSuccess: (requestParams: any) => {
      const resData = requestParams?.data?.result || {};
      handleSuccess(resData);
    },
    onError: (error: any) => {
      showErrorAlert(error?.response?.data?.error || "Something went wrong!");
    },
  });

  return {
    resetPasswordData: data,
    resetPasswordDataError: ErrorHandler(error) || "An error occurred!",
    resetPasswordIsLoading: isPending,
    resetPasswordPayload: async (requestPayload: any): Promise<void> => {
      await mutateAsync(requestPayload);
    },
  };
};

// Updated checkAuth function using the correct auth utilities
export const checkAuth = (): boolean => {
  const token = getAuthToken(); // Use the centralized token getter
  
  if (!token) {
    console.log('No token found during auth check');
    return false;
  }

  try {
    // Simple JWT expiration check (client-side only)
    const payload = JSON.parse(atob(token.split('.')[1]));
    const isExpired = payload.exp < Date.now() / 1000;
    
    if (isExpired) {
      console.log('Token expired, clearing tokens');
      clearAuthTokens();
      return false;
    }
    
    console.log('Token valid');
    return true;
  } catch (error) {
    console.error('Token validation error:', error);
    clearAuthTokens(); // Clear invalid tokens
    return false;
  }
};

// Add token validation hook for server-side validation
export const useValidateToken = () => {
  const { data, error, isPending, mutateAsync } = useMutateItem({
    mutationFn: () => httpService.getData(routes.checkAuth()),
    queryKeys: ["validate-token"],
    onSuccess: (response: any) => {
      console.log('Token validation successful:', response);
    },
    onError: (error: any) => {
      console.error('Token validation failed:', error);
      clearAuthTokens();
      // Redirect to login will be handled by the auth context
    },
  });

  return {
    validateData: data,
    validateError: error,
    validateIsLoading: isPending,
    validateToken: mutateAsync,
  };
};