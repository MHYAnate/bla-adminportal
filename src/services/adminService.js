// services/comprehensiveAdminService.js
import httpService from './httpService';
import { routes } from './api-routes';
import { emitRoleChangeEvent } from '@/context/auth';
import { toast } from 'sonner';

// ✅ Enhanced error handler
const handleApiError = (error, context) => {
  console.error(`❌ ${context} failed:`, error);
  
  if (error?.response?.data) {
    const errorData = error.response.data;
    return errorData.error || errorData.message || `${context} failed`;
  }
  
  if (error?.message) {
    return error.message;
  }
  
  return `${context} failed - please try again`;
};

// ✅ Enhanced response data extractor
const extractResponseData = (response) => {
  try {
    // Handle different response structures
    if (response?.data?.success && response?.data?.data) {
      return response.data.data;
    }
    
    if (response?.data && typeof response.data === 'object') {
      if (response.data.success !== undefined) {
        return response.data.data || response.data;
      }
      return response.data;
    }
    
    if (response?.success !== undefined) {
      return response.data || response;
    }
    
    return response;
  } catch (error) {
    console.error('Error extracting response data:', error);
    return response;
  }
};

// ✅ Enhanced message extractor
const extractMessage = (response, defaultMessage = '') => {
  if (response?.data?.message) return response.data.message;
  if (response?.message) return response.message;
  return defaultMessage;
};

// ✅ Enhanced role change event emitter with retry logic
const emitRoleChangeWithRetry = (adminId, newRoles = [], maxRetries = 3) => {
  const emit = (attempt) => {
    try {
      console.log(`🔄 Emitting role change event (attempt ${attempt}/${maxRetries}) for admin ${adminId}:`, {
        adminId: String(adminId),
        rolesCount: Array.isArray(newRoles) ? newRoles.length : 0,
        timestamp: Date.now(),
        attempt
      });
      
      emitRoleChangeEvent(adminId, newRoles);
      
      // Verify event was emitted by checking if listeners exist
      const hasListeners = window.document?.addEventListener !== undefined;
      if (!hasListeners && attempt < maxRetries) {
        console.warn(`⚠️ Event system might not be ready, retrying in ${attempt * 100}ms...`);
        setTimeout(() => emit(attempt + 1), attempt * 100);
      }
      
    } catch (error) {
      console.error(`❌ Failed to emit role change event (attempt ${attempt}):`, error);
      if (attempt < maxRetries) {
        setTimeout(() => emit(attempt + 1), attempt * 100);
      }
    }
  };
  
  // Initial attempt with small delay to ensure context is ready
  setTimeout(() => emit(1), 50);
};

// ✅ Comprehensive Admin Service
export const comprehensiveAdminService = {
  
  // =================== ADMIN ROLE MANAGEMENT ===================
  
  /**
   * Update admin roles - supports both roleIds and roleNames
   * @param {string|number} adminId - The admin ID
   * @param {number[]|string[]} rolesData - Array of role IDs or role names
   * @returns {Promise<any>} - The response data
   */
  updateAdminRoles: async (adminId, rolesData) => {
    try {
      console.log(`🔄 Comprehensive: Updating roles for admin ${adminId}:`, rolesData);
      
      // ✅ Enhanced payload handling
      let payload;
      
      if (Array.isArray(rolesData)) {
        if (rolesData.length === 0) {
          payload = { roleIds: [] };
        } else if (typeof rolesData[0] === 'string') {
          payload = { roleNames: rolesData };
        } else if (typeof rolesData[0] === 'number') {
          payload = { roleIds: rolesData };
        } else {
          throw new Error('Invalid roles data format');
        }
      } else {
        payload = { roleIds: [] };
      }
      
      console.log('🔄 Comprehensive: Sending payload to backend:', payload);
      
      const response = await httpService.putData(payload, routes.updateAdminRoles(adminId));
      const extractedData = extractResponseData(response);
      const message = extractMessage(response, 'Roles updated successfully');
      
      if (response.success !== false && extractedData) {
        console.log("✅ Comprehensive: Admin roles updated successfully:", extractedData);
        
        // ✅ Enhanced: Extract roles from response with multiple fallback strategies
        const responseData = extractedData || response.data || response;
        let newRoles = [];
        
        // Try different response structures
        if (responseData?.roles) {
          newRoles = responseData.roles;
        } else if (responseData?.data?.roles) {
          newRoles = responseData.data.roles;
        } else if (responseData?.user?.roles) {
          newRoles = responseData.user.roles;
        } else {
          // Fallback: use the original roles data
          newRoles = Array.isArray(rolesData) ? rolesData.map(role => ({ name: role })) : [];
        }
        
        console.log(`🔄 Comprehensive: Emitting role change event for admin ${adminId}:`, {
          adminId,
          newRoles,
          rolesCount: Array.isArray(newRoles) ? newRoles.length : 0
        });
        
        // ✅ Enhanced: Emit with retry logic and staggered timing
        emitRoleChangeWithRetry(adminId, newRoles);
        
        // ✅ Additional delayed emission for sidebar updates
        setTimeout(() => {
          console.log(`🔄 Comprehensive: Secondary role change emission for admin ${adminId}`);
          emitRoleChangeWithRetry(adminId, newRoles, 1);
        }, 200);
        
        toast.success(message);
        return extractedData;
      } else {
        throw new Error(response.message || extractedData?.error || 'Failed to update roles');
      }
    } catch (error) {
      const errorMessage = handleApiError(error, 'Role update');
      toast.error(errorMessage);
      throw error;
    }
  },

  /**
   * Update admin permissions
   * @param {string|number} adminId - The admin ID
   * @param {number[]} permissionIds - Array of permission IDs
   * @returns {Promise<any>} - The response data
   */
  updateAdminPermissions: async (adminId, permissionIds) => {
    try {
      console.log(`🔄 Comprehensive: Updating permissions for admin ${adminId}:`, permissionIds);
      
      const response = await httpService.putData({ permissionIds }, routes.updateAdminPermissions(adminId));
      const extractedData = extractResponseData(response);
      const message = extractMessage(response, 'Permissions updated successfully');
      
      if (response.success !== false && extractedData) {
        console.log("✅ Comprehensive: Admin permissions updated successfully");
        
        // ✅ Emit role change event (permissions affect access)
        emitRoleChangeWithRetry(adminId, []);
        
        toast.success(message);
        return extractedData;
      } else {
        throw new Error(response.message || extractedData?.error || 'Failed to update permissions');
      }
    } catch (error) {
      const errorMessage = handleApiError(error, 'Permission update');
      toast.error(errorMessage);
      throw error;
    }
  },

  /**
   * Assign roles to admin
   * @param {string|number} adminId - The admin ID
   * @param {number[]} roleIds - Array of role IDs
   * @returns {Promise<any>} - The response data
   */
  assignRolesToAdmin: async (adminId, roleIds) => {
    try {
      console.log(`🔄 Comprehensive: Assigning roles to admin ${adminId}:`, roleIds);
      
      const response = await httpService.putData({ roles: roleIds }, routes.assignRolesToAdmin(adminId));
      const extractedData = extractResponseData(response);
      const message = extractMessage(response, 'Roles assigned successfully');
      
      if (response.success !== false && extractedData) {
        console.log("✅ Comprehensive: Roles assigned successfully");
        
        // ✅ Emit role change event
        const newRoles = extractedData?.roles || extractedData?.data?.roles || [];
        emitRoleChangeWithRetry(adminId, newRoles);
        
        toast.success(message);
        return extractedData;
      } else {
        throw new Error(response.message || extractedData?.error || 'Failed to assign roles');
      }
    } catch (error) {
      const errorMessage = handleApiError(error, 'Role assignment');
      toast.error(errorMessage);
      throw error;
    }
  },

  /**
   * Remove admin role
   * @param {string|number} adminId - The admin ID
   * @param {number} roleId - The role ID to remove
   * @returns {Promise<any>} - The response data
   */
  removeAdminRole: async (adminId, roleId) => {
    try {
      console.log(`🔄 Comprehensive: Removing role ${roleId} from admin ${adminId}`);
      
      // First get current roles
      const currentAdmin = await httpService.getData(routes.getSpecificAdmin ? routes.getSpecificAdmin(adminId) : `admin/manage/${adminId}`);
      const currentData = extractResponseData(currentAdmin);
      
      if (!currentData) {
        throw new Error('Could not fetch current admin data');
      }
      
      const currentRoleIds = currentData.roles?.map((r) => r.role?.id || r.id) || [];
      
      // Remove the specified role
      const newRoleIds = currentRoleIds.filter(id => id !== roleId);
      
      const response = await httpService.putData({ roleIds: newRoleIds }, routes.updateAdminRoles(adminId));
      const extractedData = extractResponseData(response);
      const message = extractMessage(response, 'Role removed successfully');

      if (response.success !== false && extractedData) {
        console.log("✅ Comprehensive: Role removed successfully");
        
        // ✅ Emit role change event
        const newRoles = extractedData?.roles || extractedData?.data?.roles || [];
        emitRoleChangeWithRetry(adminId, newRoles);
        
        toast.success(message);
        return extractedData;
      } else {
        throw new Error(response.message || extractedData?.error || 'Failed to remove role');
      }
    } catch (error) {
      const errorMessage = handleApiError(error, 'Role removal');
      toast.error(errorMessage);
      throw error;
    }
  },

  /**
   * Bulk update admin roles
   * @param {Array<{adminId: string|number, roleIds: number[]}>} updates - Array of admin role updates
   * @returns {Promise<any[]>} - Array of results
   */
  bulkUpdateAdminRoles: async (updates) => {
    try {
      console.log(`🔄 Comprehensive: Bulk updating roles for ${updates.length} admins`);
      
      const results = [];
      
      // Process updates with delay to prevent overwhelming the backend
      for (let i = 0; i < updates.length; i++) {
        const { adminId, roleIds } = updates[i];
        
        try {
          console.log(`🔄 Comprehensive: Processing admin ${i + 1}/${updates.length}: ${adminId}`);
          
          const response = await httpService.putData({ roleIds }, routes.updateAdminRoles(adminId));
          const extractedData = extractResponseData(response);
          
          if (response.success !== false && extractedData) {
            // ✅ Emit role change event for each admin (staggered)
            setTimeout(() => {
              const newRoles = extractedData?.roles || extractedData?.data?.roles || [];
              emitRoleChangeWithRetry(adminId, newRoles);
            }, i * 100); // Stagger emissions
            
            results.push({ adminId, success: true, data: extractedData });
          } else {
            results.push({ adminId, success: false, error: response.message || 'Update failed' });
          }
        } catch (error) {
          console.error(`❌ Comprehensive: Failed to update roles for admin ${adminId}:`, error);
          results.push({ adminId, success: false, error: error.message || 'Update failed' });
        }
        
        // Add delay between requests to prevent rate limiting
        if (i < updates.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      }
      
      const successCount = results.filter(r => r.success).length;
      console.log(`✅ Comprehensive: Bulk update completed: ${successCount}/${updates.length} successful`);
      
      const message = `Bulk update completed: ${successCount}/${updates.length} successful`;
      if (successCount === updates.length) {
        toast.success(message);
      } else if (successCount > 0) {
        toast.warning(message);
      } else {
        toast.error('Bulk update failed for all admins');
      }
      
      return results;
    } catch (error) {
      const errorMessage = handleApiError(error, 'Bulk role update');
      toast.error(errorMessage);
      throw error;
    }
  },

  // =================== ADMIN DATA FETCHING ===================
  
  /**
   * Get admin details
   * @param {string|number} adminId - The admin ID
   * @returns {Promise<Object|null>} - The admin data
   */
  getAdmin: async (adminId) => {
    try {
      console.log(`📡 Comprehensive: Fetching admin details for ${adminId}`);
      
      const response = await httpService.getData(routes.getSpecificAdmin ? routes.getSpecificAdmin(adminId) : `admin/manage/${adminId}`);
      const extractedData = extractResponseData(response);
      
      if (extractedData) {
        console.log(`✅ Comprehensive: Admin details fetched successfully for ${adminId}`);
        return extractedData;
      } else {
        throw new Error('No admin data received');
      }
    } catch (error) {
      console.error(`❌ Comprehensive: Failed to fetch admin details for ${adminId}:`, error);
      throw error;
    }
  },

  /**
   * Get all admins
   * @param {Object} params - Query parameters
   * @returns {Promise<any>} - The admins data
   */
  getAllAdmins: async (params = {}) => {
    try {
      console.log(`📡 Comprehensive: Fetching all admins with params:`, params);
      
      const response = await httpService.getData(routes.admins(params));
      const extractedData = extractResponseData(response);
      
      if (extractedData) {
        console.log(`✅ Comprehensive: Admins fetched successfully`);
        return extractedData;
      } else {
        throw new Error('No admins data received');
      }
    } catch (error) {
      console.error(`❌ Comprehensive: Failed to fetch admins:`, error);
      throw error;
    }
  },

  /**
   * Get current admin details
   * @returns {Promise<Object|null>} - The current admin data
   */
  getCurrentAdmin: async () => {
    try {
      console.log(`📡 Comprehensive: Fetching current admin details`);
      
      const response = await httpService.getData(routes.getCurrentAdmin());
      const extractedData = extractResponseData(response);
      
      if (extractedData) {
        console.log(`✅ Comprehensive: Current admin details fetched successfully`);
        return extractedData;
      } else {
        throw new Error('No current admin data received');
      }
    } catch (error) {
      console.error(`❌ Comprehensive: Failed to fetch current admin:`, error);
      throw error;
    }
  },

  // =================== ROLE & PERMISSION FETCHING ===================
  
  /**
   * Get available roles
   * @returns {Promise<Array>} - Array of roles
   */
  getAvailableRoles: async () => {
    try {
      console.log(`📡 Comprehensive: Fetching available roles`);
      
      const response = await httpService.getData(routes.adminRoles());
      const extractedData = extractResponseData(response);
      
      if (extractedData) {
        console.log(`✅ Comprehensive: Roles fetched successfully`);
        return Array.isArray(extractedData) ? extractedData : [];
      } else {
        return [];
      }
    } catch (error) {
      console.error(`❌ Comprehensive: Failed to fetch roles:`, error);
      return [];
    }
  },

  /**
   * Get available permissions
   * @returns {Promise<Array>} - Array of permissions
   */
  getAvailablePermissions: async () => {
    try {
      console.log(`📡 Comprehensive: Fetching available permissions`);
      
      const response = await httpService.getData(routes.adminPermissions());
      const extractedData = extractResponseData(response);
      
      if (extractedData) {
        console.log(`✅ Comprehensive: Permissions fetched successfully`);
        return Array.isArray(extractedData) ? extractedData : [];
      } else {
        return [];
      }
    } catch (error) {
      console.error(`❌ Comprehensive: Failed to fetch permissions:`, error);
      return [];
    }
  },

  // =================== TESTING & DEBUGGING UTILITIES ===================
  
  /**
   * Manual role change trigger for testing
   * @param {string|number} adminId - The admin ID
   * @param {Array} newRoles - Array of new roles
   */
  triggerRoleChange: (adminId, newRoles = []) => {
    console.log(`🧪 Comprehensive: Manually triggering role change for admin ${adminId}`);
    emitRoleChangeWithRetry(adminId, newRoles);
  },

  /**
   * Trigger role change for current user
   */
  triggerCurrentUserRoleChange: () => {
    console.log(`🧪 Comprehensive: Triggering role change for current user`);
    emitRoleChangeWithRetry('current', []);
  },

  /**
   * Batch trigger for multiple admins
   * @param {Array<string|number>} adminIds - Array of admin IDs
   */
  triggerBulkRoleChange: (adminIds) => {
    console.log(`🧪 Comprehensive: Triggering bulk role changes for admins:`, adminIds);
    adminIds.forEach((adminId, index) => {
      setTimeout(() => {
        emitRoleChangeWithRetry(adminId, []);
      }, index * 50);
    });
  },

  /**
   * Test role update flow
   * @param {string|number} adminId - The admin ID
   * @param {string[]} newRoles - Array of new role names
   * @returns {Promise<void>}
   */
  testRoleUpdateFlow: async (adminId, newRoles) => {
    console.group('🧪 Comprehensive: Testing Role Update Flow');
    try {
      console.log('1. Current window.auth state:', window.auth?.userData);
      console.log('2. Starting role update for admin:', adminId, 'with roles:', newRoles);
      
      // Perform the actual update
      const result = await comprehensiveAdminService.updateAdminRoles(adminId, newRoles);
      
      console.log('3. Update result:', result);
      console.log('4. Waiting for effects...');
      
      // Wait and check if contexts respond
      setTimeout(() => {
        console.log('5. Auth context after update:', window.auth?.userData);
        console.log('6. Permission checker after update:', window.permissionChecker?.userData);
        console.log('7. Test completed');
      }, 1000);
      
    } catch (error) {
      console.error('❌ Comprehensive: Test failed:', error);
    } finally {
      console.groupEnd();
    }
  }
};

// ✅ Enhanced error handling wrapper
const withErrorHandling = (fn, context) => {
  return (...args) => {
    try {
      const result = fn(...args);
      if (result instanceof Promise) {
        return result.catch((error) => {
          const errorMessage = handleApiError(error, context);
          throw new Error(errorMessage);
        });
      }
      return result;
    } catch (error) {
      const errorMessage = handleApiError(error, context);
      throw new Error(errorMessage);
    }
  };
};

// ✅ Wrapped service with enhanced error handling
export const safeAdminService = {
  updateAdminRoles: withErrorHandling(comprehensiveAdminService.updateAdminRoles, 'Update Admin Roles'),
  updateAdminPermissions: withErrorHandling(comprehensiveAdminService.updateAdminPermissions, 'Update Admin Permissions'),
  assignRolesToAdmin: withErrorHandling(comprehensiveAdminService.assignRolesToAdmin, 'Assign Roles to Admin'),
  removeAdminRole: withErrorHandling(comprehensiveAdminService.removeAdminRole, 'Remove Admin Role'),
  bulkUpdateAdminRoles: withErrorHandling(comprehensiveAdminService.bulkUpdateAdminRoles, 'Bulk Update Admin Roles'),
  getAdmin: withErrorHandling(comprehensiveAdminService.getAdmin, 'Get Admin'),
  getAllAdmins: withErrorHandling(comprehensiveAdminService.getAllAdmins, 'Get All Admins'),
  getCurrentAdmin: withErrorHandling(comprehensiveAdminService.getCurrentAdmin, 'Get Current Admin'),
  getAvailableRoles: withErrorHandling(comprehensiveAdminService.getAvailableRoles, 'Get Available Roles'),
  getAvailablePermissions: withErrorHandling(comprehensiveAdminService.getAvailablePermissions, 'Get Available Permissions'),
  
  // Testing utilities (no error wrapping needed)
  triggerRoleChange: comprehensiveAdminService.triggerRoleChange,
  triggerCurrentUserRoleChange: comprehensiveAdminService.triggerCurrentUserRoleChange,
  triggerBulkRoleChange: comprehensiveAdminService.triggerBulkRoleChange,
  testRoleUpdateFlow: comprehensiveAdminService.testRoleUpdateFlow
};

// ✅ Make services available in development for testing
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  window.comprehensiveAdminService = comprehensiveAdminService;
  window.safeAdminService = safeAdminService;
  
  console.log('🧪 Comprehensive Admin Service available in development:');
  console.log('- window.comprehensiveAdminService.updateAdminRoles(adminId, roles)');
  console.log('- window.comprehensiveAdminService.testRoleUpdateFlow(adminId, roles)');
  console.log('- window.safeAdminService.* (error-wrapped versions)');
}

export default comprehensiveAdminService;