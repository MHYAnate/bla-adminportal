"use client";

import { useAuth } from '@/context/auth';
import { useMemo, useEffect, useState, useCallback } from 'react';

// ✅ Fixed Permission type - make type required with default
type Permission = {
  id: number;
  name: string;
  type: 'read' | 'write'; // ✅ Made required instead of optional
  description?: string;
  category?: string;
};

// ✅ Raw permission type from API (type might be optional)
type RawPermission = {
  id: number;
  name: string;
  type?: 'read' | 'write' | string; // ✅ Optional for API data
  description?: string;
  category?: string;
};

type Role = {
  id: number;
  name: string;
  type?: string;
  permissions?: RawPermission[]; // ✅ Use RawPermission for API data
  description?: string;
};

type UserRole = {
  id: number;
  roleId?: number;
  role: Role;
  // Flat structure for compatibility
  name?: string;
  description?: string;
  permissions?: RawPermission[]; // ✅ Use RawPermission for API data
  type?: string;
};

// ✅ Enhanced UserData type to match the auth context
type UserData = {
  id: number;
  email: string;
  type?: string;
  roles?: UserRole[];
  role?: string | Role;
  isAdmin?: boolean;
  isSuperAdmin?: boolean;
  adminProfile?: {
    username?: string;
    fullName?: string;
    phone?: string;
    gender?: string;
  };
  permissions?: RawPermission[]; // ✅ Use RawPermission for API data
  [key: string]: any;
};

// ✅ Utility function to normalize permission type
const normalizePermissionType = (type: string | undefined): 'read' | 'write' => {
  if (!type) return 'read'; // Default to 'read' if type is undefined
  const normalizedType = type.toLowerCase();
  return normalizedType === 'write' ? 'write' : 'read';
};

// ✅ Utility function to convert RawPermission to Permission
const normalizePermission = (rawPermission: RawPermission): Permission => {
  return {
    id: rawPermission.id || 0,
    name: rawPermission.name,
    type: normalizePermissionType(rawPermission.type),
    description: rawPermission.description,
    category: rawPermission.category
  };
};

export const usePermissions = () => {
  const { userData, isAuthenticated, forceRefreshUserData, refreshTrigger } = useAuth();
  const [localRefreshTrigger, setLocalRefreshTrigger] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Type assertion to ensure userData has the correct type
  const typedUserData = userData as UserData | null;

  // ✅ Enhanced: Listen for role changes with debouncing
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const handleRoleChange = (event: Event) => {
      const customEvent = event as CustomEvent<{
        adminId: string;
        newRoles: any[];
        timestamp: number;
        source?: string;
      }>;
      
      const { adminId, newRoles, timestamp, source } = customEvent.detail;
      
      console.log("🔄 Enhanced Permissions hook detected role change:", {
        adminId,
        currentUserId: typedUserData?.id,
        rolesCount: Array.isArray(newRoles) ? newRoles.length : 0,
        timestamp,
        source: source || 'unknown'
      });
      
      // Only refresh if it's the current user's role that changed
      if (typedUserData && String(typedUserData.id) === String(adminId)) {
        console.log("🔄 Enhanced Permissions hook forcing refresh for current user...");
        
        // Clear any existing timeout
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
        
        // Debounce multiple rapid role changes
        timeoutId = setTimeout(() => {
          setLocalRefreshTrigger(prev => {
            console.log(`🔄 Local refresh trigger updated: ${prev} -> ${prev + 1}`);
            return prev + 1;
          });
        }, 100); // 100ms debounce
      }
    };

    window.addEventListener('admin-role-changed', handleRoleChange as EventListener);
    
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      window.removeEventListener('admin-role-changed', handleRoleChange as EventListener);
    };
  }, [typedUserData?.id]);

  // ✅ Enhanced: Force refresh function with loading state
  const forceRefresh = useCallback(async () => {
    if (isRefreshing) {
      console.log('🔄 Refresh already in progress, skipping...');
      return;
    }

    console.log('🔄 Force refreshing permissions...');
    setIsRefreshing(true);
    
    try {
      await forceRefreshUserData();
      setLocalRefreshTrigger(prev => prev + 1);
      console.log('✅ Permissions force refresh completed');
    } catch (error) {
      console.error('❌ Failed to force refresh permissions:', error);
    } finally {
      setIsRefreshing(false);
    }
  }, [forceRefreshUserData, isRefreshing]);

  // ✅ Enhanced: Permissions calculation with proper type handling
  const permissions = useMemo((): Permission[] => {
    console.log(`🔄 Recalculating permissions (auth: ${refreshTrigger}, local: ${localRefreshTrigger})`);
    
    if (!typedUserData) {
      console.log("❌ No userData for permissions calculation");
      return [];
    }
    
    try {
      // ✅ Enhanced: Handle different user data structures
      let userRoles: UserRole[] = [];
      
      // Check if userData has the roles array (primary structure)
      if (typedUserData.roles && Array.isArray(typedUserData.roles)) {
        userRoles = typedUserData.roles;
      }
      // Fallback: Check if userData has a single role
      else if (typedUserData.role) {
        if (typeof typedUserData.role === 'object' && typedUserData.role.name) {
          // Role is an object
          userRoles = [{
            id: typedUserData.role.id || 0,
            role: typedUserData.role,
            name: typedUserData.role.name,
            permissions: typedUserData.role.permissions || []
          }];
        } else if (typeof typedUserData.role === 'string') {
          // Role is a string - create a basic role object
          userRoles = [{
            id: 0,
            role: {
              id: 0,
              name: typedUserData.role,
              permissions: []
            },
            name: typedUserData.role,
            permissions: []
          }];
        }
      }
      
      console.log(`🔍 Processing ${userRoles.length} user roles:`, 
        userRoles.map(ur => ur.role?.name || ur.name || 'Unknown'));
      
      // ✅ Enhanced: Collect all permissions from all roles
      const rawPermissions: RawPermission[] = [];
      
      userRoles.forEach((userRole: UserRole, index) => {
        const role = userRole.role;
        if (!role) {
          console.warn(`⚠️ Role ${index} has no role object:`, userRole);
          return;
        }
        
        console.log(`🔍 Processing role: ${role.name}`, {
          roleId: role.id,
          roleType: role.type,
          permissionsCount: role.permissions?.length || 0
        });
        
        if (role.permissions && Array.isArray(role.permissions)) {
          role.permissions.forEach(permission => {
            // Ensure permission has required properties
            if (permission && permission.name) {
              rawPermissions.push({
                id: permission.id || 0,
                name: permission.name,
                type: permission.type, // Keep as optional here
                description: permission.description,
                category: permission.category
              });
            } else {
              console.warn('⚠️ Invalid permission object:', permission);
            }
          });
        }
      });
      
      // ✅ Enhanced: Normalize and remove duplicates with preference for write permissions
      const normalizedPermissions: Permission[] = [];
      const permissionMap = new Map<string, Permission>();
      
      rawPermissions.forEach(rawPermission => {
        const normalizedPermission = normalizePermission(rawPermission);
        const existing = permissionMap.get(normalizedPermission.name);
        
        if (!existing) {
          // New permission
          permissionMap.set(normalizedPermission.name, normalizedPermission);
        } else {
          // Duplicate found - keep the one with higher privilege
          if (normalizedPermission.type === 'write' && existing.type === 'read') {
            permissionMap.set(normalizedPermission.name, normalizedPermission);
          }
        }
      });
      
      normalizedPermissions.push(...permissionMap.values());
      
      console.log(`✅ Calculated ${normalizedPermissions.length} unique permissions from ${userRoles.length} roles:`,
        normalizedPermissions.map(p => `${p.name} (${p.type})`));
      
      return normalizedPermissions;
      
    } catch (error) {
      console.error('❌ Error calculating permissions:', error);
      return [];
    }
  }, [typedUserData, refreshTrigger, localRefreshTrigger]);

  // ✅ Enhanced: Roles calculation with better handling
  const roles = useMemo((): string[] => {
    if (!typedUserData) return [];
    
    try {
      let roleNames: string[] = [];
      
      // Check if userData has the roles array (primary structure)
      if (typedUserData.roles && Array.isArray(typedUserData.roles)) {
        roleNames = typedUserData.roles
          .map((userRole: UserRole) => userRole.role?.name || userRole.name || '')
          .filter(Boolean);
      }
      // Fallback: Check if userData has a single role field
      else if (typedUserData.role) {
        if (typeof typedUserData.role === 'string') {
          roleNames = [typedUserData.role];
        } else if (typedUserData.role.name) {
          roleNames = [typedUserData.role.name];
        }
      }
      
      console.log(`✅ Calculated roles:`, roleNames);
      return roleNames;
      
    } catch (error) {
      console.error('❌ Error calculating roles:', error);
      return [];
    }
  }, [typedUserData, refreshTrigger, localRefreshTrigger]);

  // ✅ Enhanced: Permission checking with better logging and exact matching
  const hasPermission = useCallback((permissionName: string, type: 'read' | 'write' = 'read'): boolean => {
    if (!isAuthenticated || !permissions.length) {
      console.log(`❌ No permission: ${permissionName} (${type}) - not authenticated or no permissions`);
      return false;
    }
    
    // ✅ Exact name matching (case-insensitive)
    const normalizedPermissionName = permissionName.toUpperCase();
    
    const hasExactPermission = permissions.some(permission => {
      const normalizedName = permission.name.toUpperCase();
      
      // ✅ Exact match check
      if (normalizedName === normalizedPermissionName) {
        // For read access, both read and write permissions work
        if (type === 'read') {
          return permission.type === 'read' || permission.type === 'write';
        }
        // For write access, only write permission works
        if (type === 'write') {
          return permission.type === 'write';
        }
      }
      
      return false;
    });

    // ✅ Pattern matching for backend compatibility
    if (!hasExactPermission) {
      const hasPatternPermission = permissions.some(permission => {
        const normalizedName = permission.name.toUpperCase();
        
        // Pattern: PERMISSION_TYPE (e.g., USER_READ, PRODUCT_WRITE)
        if (normalizedName === `${normalizedPermissionName}_${type.toUpperCase()}`) {
          return true;
        }
        
        // Pattern: TYPE_PERMISSION (e.g., READ_USER, WRITE_PRODUCT)
        if (normalizedName === `${type.toUpperCase()}_${normalizedPermissionName}`) {
          return true;
        }
        
        // Pattern: view_permission, edit_permission, etc.
        const actionPrefix = type === 'read' ? 'VIEW' : 'EDIT';
        if (normalizedName === `${actionPrefix}_${normalizedPermissionName}` || 
            normalizedName === `${actionPrefix}_${normalizedPermissionName.replace(/S$/, '')}`) {
          return true;
        }
        
        return false;
      });
      
      console.log(`${hasPatternPermission ? '✅' : '❌'} Pattern permission check: ${permissionName} (${type})`);
      return hasPatternPermission;
    }

    console.log(`${hasExactPermission ? '✅' : '❌'} Exact permission check: ${permissionName} (${type})`);
    return hasExactPermission;
  }, [isAuthenticated, permissions]);

  // ✅ Enhanced: Role checking with better normalization
  const hasRole = useCallback((roleName: string): boolean => {
    if (!isAuthenticated || !roles.length) {
      console.log(`❌ No role: ${roleName} - not authenticated or no roles`);
      return false;
    }
    
    const normalizedRoleName = roleName.toUpperCase().replace(/[_\s-]/g, '');
    
    const hasRole = roles.some(role => {
      const normalizedUserRole = role.toUpperCase().replace(/[_\s-]/g, '');
      return normalizedUserRole === normalizedRoleName || 
             normalizedUserRole.includes(normalizedRoleName) ||
             normalizedRoleName.includes(normalizedUserRole);
    });
    
    console.log(`${hasRole ? '✅' : '❌'} Role check: ${roleName}`);
    return hasRole;
  }, [isAuthenticated, roles]);

  // ✅ Enhanced: Super admin check with multiple validation methods
  const isSuperAdmin = useCallback((): boolean => {
    if (!isAuthenticated || !typedUserData) {
      console.log("❌ Not super admin - not authenticated");
      return false;
    }
    
    // Method 1: Direct flag
    if (typedUserData.isSuperAdmin === true) {
      console.log("✅ Super admin check - direct flag");
      return true;
    }
    
    // Method 2: Role-based check
    if (hasRole('SUPER_ADMIN') || hasRole('SUPERADMIN')) {
      console.log("✅ Super admin check - role based");
      return true;
    }
    
    // Method 3: Legacy role property
    if (typedUserData.role === 'SUPER_ADMIN') {
      console.log("✅ Super admin check - legacy role property");
      return true;
    }
    
    // Method 4: Admin profile check
    if (typedUserData.adminProfile?.username?.toLowerCase() === 'superadmin') {
      console.log("✅ Super admin check - admin profile");
      return true;
    }
    
    console.log("❌ Super admin check - not super admin");
    return false;
  }, [isAuthenticated, typedUserData, hasRole]);

  // ✅ Enhanced: Admin check with multiple validation methods
  const isAdmin = useCallback((): boolean => {
    if (!isAuthenticated || !typedUserData) {
      console.log("❌ Not admin - not authenticated");
      return false;
    }
    
    // Method 1: Super admin is also admin
    if (isSuperAdmin()) {
      console.log("✅ Admin check - is super admin");
      return true;
    }
    
    // Method 2: Has adminProfile
    if (typedUserData.adminProfile) {
      console.log("✅ Admin check - has adminProfile");
      return true;
    }
    
    // Method 3: Has admin flag
    if (typedUserData.isAdmin === true) {
      console.log("✅ Admin check - has isAdmin flag");
      return true;
    }
    
    // Method 4: User type is ADMIN
    if (typedUserData.type === 'ADMIN') {
      console.log("✅ Admin check - user type is ADMIN");
      return true;
    }
    
    // Method 5: Has admin-related roles
    const adminRoles = [
      'SUPER_ADMIN', 'ADMIN', 'PRODUCT_MANAGER', 'ORDER_MANAGER', 
      'CUSTOMER_SERVICE', 'COMPLIANCE_OFFICER', 'ANALYST', 'INVENTORY_MANAGER'
    ];
    
    const hasAdminRole = roles.some(role => 
      adminRoles.some(adminRole => 
        role.toUpperCase().includes(adminRole.replace('_', '')) ||
        adminRole.replace('_', '').includes(role.toUpperCase())
      )
    );
    
    if (hasAdminRole) {
      console.log("✅ Admin check - has admin role");
      return true;
    }
    
    console.log("❌ Admin check - not admin");
    return false;
  }, [isAuthenticated, typedUserData, roles, isSuperAdmin]);

  // ✅ Enhanced: Multiple permission checks
  const hasAnyPermission = useCallback((permissionNames: string[], type: 'read' | 'write' = 'read'): boolean => {
    return permissionNames.some(permissionName => hasPermission(permissionName, type));
  }, [hasPermission]);

  const hasAllPermissions = useCallback((permissionNames: string[], type: 'read' | 'write' = 'read'): boolean => {
    return permissionNames.every(permissionName => hasPermission(permissionName, type));
  }, [hasPermission]);

  const hasAnyRole = useCallback((roleNames: string[]): boolean => {
    return roleNames.some(roleName => hasRole(roleName));
  }, [hasRole]);

  // ✅ Enhanced: Get permission level
  const getPermissionLevel = useCallback((permissionName: string): 'none' | 'read' | 'write' => {
    if (!isAuthenticated) return 'none';
    
    if (isSuperAdmin()) return 'write'; // Super admin has full access
    
    if (hasPermission(permissionName, 'write')) return 'write';
    if (hasPermission(permissionName, 'read')) return 'read';
    return 'none';
  }, [isAuthenticated, isSuperAdmin, hasPermission]);

  // ✅ Enhanced: Debug function with comprehensive information
  const debugPermissions = useCallback(() => {
    console.group('🔐 Enhanced User Permissions Debug');
    console.log('Authentication Status:', {
      isAuthenticated,
      isAdmin: isAdmin(),
      isSuperAdmin: isSuperAdmin(),
      isRefreshing
    });
    
    console.log('User Data:', {
      id: typedUserData?.id,
      email: typedUserData?.email,
      type: typedUserData?.type,
      hasAdminProfile: !!typedUserData?.adminProfile,
      isAdminFlag: typedUserData?.isAdmin,
      isSuperAdminFlag: typedUserData?.isSuperAdmin
    });
    
    console.log('Roles:', {
      count: roles.length,
      roles: roles,
      rawUserRoles: typedUserData?.roles?.map(ur => ({
        id: ur.id,
        roleId: ur.roleId,
        roleName: ur.role?.name || ur.name,
        roleType: ur.role?.type
      })) || []
    });
    
    console.log('Permissions:', {
      count: permissions.length,
      permissions: permissions.map(p => ({
        name: p.name,
        type: p.type,
        category: p.category,
        description: p.description
      }))
    });
    
    console.log('Refresh Status:', {
      authRefreshTrigger: refreshTrigger,
      localRefreshTrigger: localRefreshTrigger,
      totalRefreshCount: refreshTrigger + localRefreshTrigger,
      isRefreshing
    });
    
    // Test some common permissions
    const commonPermissions = ['USER', 'PRODUCT', 'ORDER', 'ANALYTICS', 'ROLE'];
    console.log('Common Permission Tests:', 
      Object.fromEntries(
        commonPermissions.map(perm => [
          perm, 
          {
            read: hasPermission(perm, 'read'),
            write: hasPermission(perm, 'write'),
            level: getPermissionLevel(perm)
          }
        ])
      )
    );
    
    console.groupEnd();
  }, [
    isAuthenticated, userData, roles, permissions, refreshTrigger, 
    localRefreshTrigger, isRefreshing, isAdmin, isSuperAdmin, 
    hasPermission, getPermissionLevel
  ]);

  // ✅ Enhanced: Make permissions checker available for debugging
  useEffect(() => {
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
      (window as any).permissionChecker = {
        userData,
        permissions,
        roles,
        isAuthenticated,
        isAdmin,
        isSuperAdmin,
        hasPermission,
        hasRole,
        hasAnyPermission,
        hasAllPermissions,
        hasAnyRole,
        getPermissionLevel,
        debugPermissions,
        forceRefresh,
        refreshTrigger: refreshTrigger + localRefreshTrigger,
        isRefreshing
      };
    }
  }, [
    userData, permissions, roles, isAuthenticated, refreshTrigger, 
    localRefreshTrigger, isRefreshing, isAdmin, isSuperAdmin, 
    hasPermission, hasRole, hasAnyPermission, hasAllPermissions, 
    hasAnyRole, getPermissionLevel, debugPermissions, forceRefresh
  ]);

  return {
    // Data
    permissions,
    roles,
    userData,
    isAuthenticated,
    isRefreshing,
    
    // Permission checking functions
    hasPermission,
    hasRole,
    isSuperAdmin,
    isAdmin,
    hasAnyPermission,
    hasAllPermissions,
    hasAnyRole,
    getPermissionLevel,
    
    // Utility functions
    debugPermissions,
    forceRefresh,
    refreshTrigger: refreshTrigger + localRefreshTrigger
  };
};