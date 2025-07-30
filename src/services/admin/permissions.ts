// services/admin/permissions.ts
import { toast } from 'sonner';
import { routes } from '../api-routes';
import httpService from '../httpService';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useToggleAdminPermission = (adminId: string | number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (permissionId: number) => {
      try {
        // Use the correct route for admin permissions, not role permissions
        const response = await httpService.putData(
          { permissionId },
          routes.updateAdminPermissions(adminId)
        );
        return response.data;
      } catch (error) {
        console.error('Toggle permission error:', error);
        throw error;
      }
    },
    onSuccess: (data) => {
      toast.success('Permission updated successfully');
      // Invalidate relevant queries
      queryClient.invalidateQueries({
        queryKey: ['admin-permissions']
      });
      queryClient.invalidateQueries({
        queryKey: ['admin-info', adminId]
      });
      queryClient.invalidateQueries({
        queryKey: ['admins']
      });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to update permission');
    }
  });
};