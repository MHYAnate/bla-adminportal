"use client";

import { routes } from "../api-routes";
import httpService from "../httpService";
import { ErrorHandler } from "../errorHandler";
import useMutateItem from "../useMutateItem";
import { showErrorAlert, showSuccessAlert } from "@/lib/utils";

export const useCreateAdminRole = (handleSuccess) => {
  const { data, error, isPending, mutateAsync } = useMutateItem({
    mutationFn: (payload) =>
      httpService.postData(payload, routes.createAdminRole()),

    queryKeys: ["create-admin-role"],

    onSuccess: (response) => {
      const resData = response?.data || {};
      if (handleSuccess) handleSuccess(resData);
      showSuccessAlert(resData?.message || "Role created successfully");
    },

    onError: (err) => {
      const errorMessage = err?.response?.data?.error || "Failed to create role";
      showErrorAlert(errorMessage);
    },
  });

  return {
    createRoleData: data,
    createRoleError: ErrorHandler(error) || "An error occurred",
    createRoleIsLoading: isPending,
    createRolePayload: async (payload) => {
      await mutateAsync(payload);
    },
  };
};
