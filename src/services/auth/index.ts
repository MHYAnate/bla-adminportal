"use client";

import { routes } from "../api-routes";
import httpService from "../httpService";
import { ErrorHandler } from "../errorHandler";
import useMutateItem from "../useMutateItem";
import { showErrorAlert, showSuccessAlert } from "@/lib/utils";

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
      const resData = requestParams?.data || {};
      handleSuccess(resData);
      showSuccessAlert(resData?.message);
    },
    onError: (error: any) => {
      showErrorAlert(error?.response?.data?.error || "Something went wrong!");
    },
  });

  return {
    loginData: data,
    loginDataError: ErrorHandler(error) || "An error occured",
    loginIsLoading: isPending,
    loginPayload: async (requestPayload: any): Promise<void> => {
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
    forgotPasswordDataError: ErrorHandler(error) || "An error occcured!",
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
    resetPasswordDataError: ErrorHandler(error) || "An error occured!",
    resetPasswordIsLoading: isPending,
    resetPasswordPayload: async (requestPayload: any): Promise<void> => {
      await mutateAsync(requestPayload);
    },
  };
};

