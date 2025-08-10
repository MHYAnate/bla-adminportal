// services/adminService.js
import httpService from './httpService';
import { routes } from './api-routes';
import { emitRoleChangeEvent } from '@/context/auth';
import { toast } from 'sonner';

// ✅ Enhanced admin service with automatic role change event emission
export const adminService = {
  // ✅ Enhanced role update with automatic event emission - supports both roleIds and roleNames
  updateAdminRoles: async (adminId, rolesData) => {
    try {
      console.log(`🔄 Updating roles for admin ${adminId}:`, rolesData);
      
      // Handle both roleIds (numbers) and roleNames (strings)
      let payload;
      if (Array.isArray(rolesData) && rolesData.length > 0) {
        if (typeof rolesData[0] === 'string') {
          // roleNames format
          payload = { roleNames: rolesData };
        } else {
          // roleIds format  
          payload = { roleIds: rolesData };
        }
      } else {
        payload = { roleIds: rolesData || [] };
      }
      
      const response = await httpService.putData(payload, routes.updateAdminRoles(adminId));

      if (response.success || response.data) {
        console.log("✅ Admin roles updated successfully");
        
        // ✅ Emit role change event
        emitRoleChangeEvent(adminId, response.data?.roles || response.roles || []);
        
        return response;
      } else {
        throw new Error(response.message || 'Failed to update roles');
      }
    } catch (error) {
      console.error("❌ Failed to update admin roles:", error);
      throw error;
    }
  },

  // ✅ Enhanced permission update with automatic event emission
  updateAdminPermissions: async (adminId, permissionIds) => {
    try {
      console.log(`🔄 Updating permissions for admin ${adminId}:`, permissionIds);
      
      const response = await httpService.putData({ permissionIds }, routes.updateAdminPermissions(adminId));

      if (response.success || response.data) {
        console.log("✅ Admin permissions updated successfully");
        
        // ✅ Emit role change event (permissions affect roles)
        emitRoleChangeEvent(adminId, []);
        
        return response;
      } else {
        throw new Error(response.message || 'Failed to update permissions');
      }
    } catch (error) {
      console.error("❌ Failed to update admin permissions:", error);
      throw error;
    }
  },

  // ✅ Enhanced role assignment with automatic event emission
  assignRolesToAdmin: async (adminId, roleIds) => {
    try {
      console.log(`🔄 Assigning roles to admin ${adminId}:`, roleIds);
      
      const response = await httpService.putData({ roles: roleIds }, routes.assignRolesToAdmin(adminId));

      if (response.success || response.data) {
        console.log("✅ Roles assigned successfully");
        
        // ✅ Emit role change event
        emitRoleChangeEvent(adminId, response.data?.roles || response.roles || []);
        
        return response;
      } else {
        throw new Error(response.message || 'Failed to assign roles');
      }
    } catch (error) {
      console.error("❌ Failed to assign roles:", error);
      throw error;
    }
  },

  // ✅ Enhanced role removal with automatic event emission
  removeAdminRole: async (adminId, roleId) => {
    try {
      console.log(`🔄 Removing role ${roleId} from admin ${adminId}`);
      
      // First get current roles
      const currentAdmin = await httpService.getData(routes.getSpecificAdmin(adminId));
      const currentRoleIds = currentAdmin.data?.roles?.map(r => r.role?.id || r.id) || [];
      
      // Remove the specified role
      const newRoleIds = currentRoleIds.filter(id => id !== roleId);
      
      const response = await httpService.putData({ roleIds: newRoleIds }, routes.updateAdminRoles(adminId));

      if (response.success || response.data) {
        console.log("✅ Role removed successfully");
        
        // ✅ Emit role change event
        emitRoleChangeEvent(adminId, response.data?.roles || response.roles || []);
        
        return response;
      } else {
        throw new Error(response.message || 'Failed to remove role');
      }
    } catch (error) {
      console.error("❌ Failed to remove role:", error);
      throw error;
    }
  },

  // ✅ Enhanced bulk role update with automatic event emission
  bulkUpdateAdminRoles: async (updates) => {
    try {
      console.log(`🔄 Bulk updating roles for ${updates.length} admins`);
      
      const results = [];
      
      for (const { adminId, roleIds } of updates) {
        try {
          const response = await httpService.putData({ roleIds }, routes.updateAdminRoles(adminId));
          
          if (response.success || response.data) {
            // ✅ Emit role change event for each admin
            emitRoleChangeEvent(adminId, response.data?.roles || response.roles || []);
            results.push({ adminId, success: true, response });
          } else {
            results.push({ adminId, success: false, error: response.message });
          }
        } catch (error) {
          console.error(`❌ Failed to update roles for admin ${adminId}:`, error);
          results.push({ adminId, success: false, error: error.message });
        }
      }
      
      const successCount = results.filter(r => r.success).length;
      console.log(`✅ Bulk update completed: ${successCount}/${updates.length} successful`);
      
      return results;
    } catch (error) {
      console.error("❌ Bulk role update failed:", error);
      throw error;
    }
  },

  // ✅ Toggle admin permission with automatic event emission
  toggleAdminPermission: async (adminId, permissionId) => {
    try {
      console.log(`🔄 Toggling permission ${permissionId} for admin ${adminId}`);
      
      const response = await httpService.putData({ permissionId }, routes.toggleAdminPermission(adminId, permissionId));

      if (response.success || response.data) {
        console.log("✅ Permission toggled successfully");
        
        // ✅ Emit role change event
        emitRoleChangeEvent(adminId, []);
        
        return response;
      } else {
        throw new Error(response.message || 'Failed to toggle permission');
      }
    } catch (error) {
      console.error("❌ Failed to toggle permission:", error);
      throw error;
    }
  },

  // ✅ Update admin role permissions with automatic event emission
  updateAdminRolePermissions: async (adminId, roleId, permissionIds) => {
    try {
      console.log(`🔄 Updating permissions for role ${roleId} of admin ${adminId}:`, permissionIds);
      
      const response = await httpService.putData({ permissionIds }, routes.updateRolePermissions(roleId));

      if (response.success || response.data) {
        console.log("✅ Role permissions updated successfully");
        
        // ✅ Emit role change event for the admin
        emitRoleChangeEvent(adminId, []);
        
        return response;
      } else {
        throw new Error(response.message || 'Failed to update role permissions');
      }
    } catch (error) {
      console.error("❌ Failed to update role permissions:", error);
      throw error;
    }
  },

  // ✅ Delete admin with cleanup
  deleteAdmin: async (adminId) => {
    try {
      console.log(`🔄 Deleting admin ${adminId}`);
      
      const response = await httpService.deleteData(routes.deleteAdmin(adminId));

      if (response.success || response.data) {
        console.log("✅ Admin deleted successfully");
        
        // ✅ Emit role change event to cleanup any cached data
        emitRoleChangeEvent(adminId, []);
        
        return response;
      } else {
        throw new Error(response.message || 'Failed to delete admin');
      }
    } catch (error) {
      console.error("❌ Failed to delete admin:", error);
      throw error;
    }
  },

  // ✅ Get admin details
  getAdmin: async (adminId) => {
    try {
      console.log(`📡 Fetching admin details for ${adminId}`);
      
      const response = await httpService.getData(routes.getSpecificAdmin(adminId));
      return response;
    } catch (error) {
      console.error("❌ Failed to fetch admin details:", error);
      throw error;
    }
  },

  // ✅ Get all admins
  getAllAdmins: async (params = {}) => {
    try {
      console.log(`📡 Fetching all admins with params:`, params);
      
      const response = await httpService.getData(routes.admins(params));
      return response;
    } catch (error) {
      console.error("❌ Failed to fetch admins:", error);
      throw error;
    }
  },

  // ✅ Get available roles
  getAvailableRoles: async () => {
    try {
      console.log(`📡 Fetching available roles`);
      
      const response = await httpService.getData(routes.adminRoles());
      return response;
    } catch (error) {
      console.error("❌ Failed to fetch roles:", error);
      throw error;
    }
  },

  // ✅ Get available permissions
  getAvailablePermissions: async () => {
    try {
      console.log(`📡 Fetching available permissions`);
      
      const response = await httpService.getData(routes.adminPermissions());
      return response;
    } catch (error) {
      console.error("❌ Failed to fetch permissions:", error);
      throw error;
    }
  }
};

// ✅ Utility functions for role change events
export const roleChangeUtils = {
  // Manual trigger for testing
  triggerRoleChange: (adminId, newRoles = []) => {
    console.log(`🧪 Manually triggering role change for admin ${adminId}`);
    emitRoleChangeEvent(adminId, newRoles);
  },

  // Trigger for current user (useful for self-updates)
  triggerCurrentUserRoleChange: () => {
    console.log(`🧪 Triggering role change for current user`);
    emitRoleChangeEvent('current', []);
  },

  // Batch trigger for multiple admins
  triggerBulkRoleChange: (adminIds) => {
    console.log(`🧪 Triggering bulk role changes for admins:`, adminIds);
    adminIds.forEach(adminId => {
      emitRoleChangeEvent(adminId, []);
    });
  }
};

// ✅ Enhanced error handling wrapper
const withRoleChangeEvents = (apiCall) => {
  return async (...args) => {
    try {
      const result = await apiCall(...args);
      
      // If the result contains admin ID, emit role change event
      if (result.data?.adminId || result.adminId) {
        const adminId = result.data?.adminId || result.adminId;
        emitRoleChangeEvent(adminId, result.data?.roles || result.roles || []);
      }
      
      return result;
    } catch (error) {
      console.error('API call failed:', error);
      throw error;
    }
  };
};

// ✅ Wrapped admin service functions with automatic event emission
export const enhancedAdminService = {
  updateAdminRoles: withRoleChangeEvents(adminService.updateAdminRoles),
  updateAdminPermissions: withRoleChangeEvents(adminService.updateAdminPermissions),
  assignRolesToAdmin: withRoleChangeEvents(adminService.assignRolesToAdmin),
  removeAdminRole: withRoleChangeEvents(adminService.removeAdminRole),
  toggleAdminPermission: withRoleChangeEvents(adminService.toggleAdminPermission),
  updateAdminRolePermissions: withRoleChangeEvents(adminService.updateAdminRolePermissions),
  deleteAdmin: withRoleChangeEvents(adminService.deleteAdmin),
  
  // Non-mutating operations don't need event emission
  getAdmin: adminService.getAdmin,
  getAllAdmins: adminService.getAllAdmins,
  getAvailableRoles: adminService.getAvailableRoles,
  getAvailablePermissions: adminService.getAvailablePermissions,
  
  // Utility functions
  ...roleChangeUtils
};

// ✅ Make testing utilities available in development
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  window.enhancedAdminService = enhancedAdminService;
  window.roleChangeUtils = roleChangeUtils;
  
  console.log('🧪 Enhanced Admin Service available:');
  console.log('- window.enhancedAdminService.updateAdminRoles(adminId, roles)');
  console.log('- window.roleChangeUtils.triggerRoleChange(adminId, roles)');
  console.log('- window.roleChangeUtils.triggerCurrentUserRoleChange()');
}

export default enhancedAdminService;