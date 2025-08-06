// services/upload/index.js
"use client";

import { useMutation } from "@tanstack/react-query";
import httpService from "../httpService";
import { ErrorHandler } from "../errorHandler";
import { toast } from "sonner";
import { apiClient } from "@/services/api/client";
import { routes } from "../api-routes";

export const useUploadImage = () => {
  const {
    mutateAsync,
    isPending: isUploading,
    error,
  } = useMutation({
    mutationFn: async ({ file, folder }) => {
      console.log("🔍 Upload Debug - File:", file);
      console.log("🔍 Upload Debug - Folder:", folder);

      const formData = new FormData();
      formData.append("images", file);
      formData.append("folder", folder);

      // ✅ Don't pass any headers - let httpService handle it
      const response = await httpService.postData(formData, "upload");
      
      console.log("✅ Upload successful:", response);
      return response;
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.message ||
                          error.response?.data?.error ||
                          "Image upload failed";
      toast.error(errorMessage);
    },
  });

  return {
    uploadImage: mutateAsync,
    isUploading,
    uploadError: ErrorHandler(error),
  };
};