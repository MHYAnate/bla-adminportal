import React, { useState, useEffect } from "react";
import { routes } from "../api-routes";
import httpService from "../httpService";
import { toast } from "sonner";
import { useMutation, useQueryClient } from '@tanstack/react-query';



export const useToggleAdminPermission = (adminId: string | number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (permissionId: number) => {
      try {
        console.log('Toggling admin permission:', { adminId, permissionId });
        
        // Use the specific toggle route for admin permissions
        const response = await httpService.putData(
          {},
          routes.toggleAdminPermission(adminId, permissionId)
        );
        
        return response;
      } catch (error) {
        console.error('Toggle admin permission error:', error);
        throw error;
      }
    },
    
    onSuccess: (response: any) => {
      // Invalidate relevant queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['admin-permissions'] });
      queryClient.invalidateQueries({ queryKey: ['admin-specific-permissions', adminId] });
      queryClient.invalidateQueries({ queryKey: ['admin-info', adminId] });
      queryClient.invalidateQueries({ queryKey: ['admins'] });
      
      // Extract message with fallbacks
      let message = "Permission updated successfully";
      if (response?.data?.success && response?.data?.message) {
        message = response.data.message;
      } else if (response?.data?.message) {
        message = response.data.message;
      } else if (response?.message) {
        message = response.message;
      }
      
      toast.success(message);
    },
    
    onError: (error: any) => {
      console.error('Toggle admin permission failed:', error);
      const errorMessage = error?.response?.data?.error || error?.response?.data?.message || error?.message || 'Failed to update permission';
      toast.error(errorMessage);
    }
  });
};