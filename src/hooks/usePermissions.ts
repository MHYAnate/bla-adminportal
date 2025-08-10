"use client";

import { useAuth } from '@/context/auth';
import { useMemo } from 'react';

type Permission = {
  id: number;
  name: string;
  type?: 'read' | 'write';
  description?: string;
};

type Role = {
  id: number;
  name: string;
  type?: string;
  permissions?: Permission[];
};

type UserRole = {
  id: number;
  role: Role;
};

export const usePermissions = () => {
  const { userData, isAuthenticated } = useAuth();

  // Extract all permissions from user roles
  const permissions = useMemo(() => {
    if (!userData) return [];
    
    // Check if userData has the roles array (new structure)
    if (userData.roles && Array.isArray(userData.roles)) {
      const allPermissions: Permission[] = [];
      userData.roles.forEach((userRole: UserRole) => {
        if (userRole.role?.permissions && Array.isArray(userRole.role.permissions)) {
          allPermissions.push(...userRole.role.permissions);
        }
      });
      
      // Remove duplicates based on permission name
      const uniquePermissions = allPermissions.filter((permission, index, self) => 
        index === self.findIndex(p => p.name === permission.name)
      );
      
      return uniquePermissions;
    }
    
    return [];
  }, [userData]);

  // Extract all role names
  const roles = useMemo(() => {
    if (!userData) return [];
    
    // Check if userData has the roles array (new structure)
    if (userData.roles && Array.isArray(userData.roles)) {
      return userData.roles.map((userRole: UserRole) => userRole.role?.name || '').filter(Boolean);
    }
    
    // Check if userData has a single role field (your current structure)
    if (userData.role && typeof userData.role === 'string') {
      return [userData.role];
    }
    
    return [];
  }, [userData]);

  // Check if user has a specific permission
  const hasPermission = (permissionName: string, type: 'read' | 'write' = 'read') => {
    if (!isAuthenticated || !permissions.length) {
      // For testing: If user has admin roles, grant basic permissions
      if (isAdmin()) {
        return true;
      }
      return false;
    }
    
    const normalizedPermissionName = permissionName.toUpperCase();
    
    return permissions.some(permission => {
      const normalizedName = permission.name.toUpperCase();
      const permissionType = permission.type || 'read';
      
      // Check for exact match
      if (normalizedName === normalizedPermissionName) {
        if (type === 'read') {
          return permissionType === 'read' || permissionType === 'write';
        }
        if (type === 'write') {
          return permissionType === 'write';
        }
      }
      
      // Check for pattern matches (e.g., PRODUCT_READ, PRODUCT_WRITE)
      if (normalizedName === `${normalizedPermissionName}_${type.toUpperCase()}`) {
        return true;
      }
      
      // For backward compatibility, check if permission contains the base name
      return normalizedName.includes(normalizedPermissionName);
    });
  };

  // Check if user has a specific role
  const hasRole = (roleName: string) => {
    if (!isAuthenticated || !roles.length) return false;
    return roles.some(role => 
      role.toUpperCase() === roleName.toUpperCase()
    );
  };

  // Check if user is super admin
  const isSuperAdmin = () => {
    if (!isAuthenticated || !userData) return false;
    
    // Check various ways super admin might be indicated
    return userData.isSuperAdmin === true || 
           hasRole('SUPER_ADMIN') || 
           hasRole('SUPERADMIN') ||
           userData.role === 'SUPER_ADMIN';
  };

  // Check if user is any type of admin
  const isAdmin = () => {
    if (!isAuthenticated || !userData) return false;
    
    // Check if user has adminProfile (your structure)
    if (userData.adminProfile) return true;
    
    // Check if user has admin roles
    if (userData.isAdmin === true) return true;
    
    // Check if user has super admin status
    if (isSuperAdmin()) return true;
    
    // Check if any role contains 'ADMIN' or is an admin role
    const adminRoles = ['SUPER_ADMIN', 'ADMIN', 'PRODUCT_MANAGER', 'ORDER_MANAGER', 'CUSTOMER_MANAGER', 'INVENTORY_MANAGER', 'SUPPORT_AGENT'];
    return roles.some(role => 
      adminRoles.includes(role.toUpperCase()) || 
      role.toUpperCase().includes('ADMIN') ||
      role.toUpperCase().includes('MANAGER')
    );
  };

  // Check if user has any of the specified permissions
  const hasAnyPermission = (permissionNames: string[], type: 'read' | 'write' = 'read') => {
    return permissionNames.some(permissionName => hasPermission(permissionName, type));
  };

  // Check if user has all of the specified permissions
  const hasAllPermissions = (permissionNames: string[], type: 'read' | 'write' = 'read') => {
    return permissionNames.every(permissionName => hasPermission(permissionName, type));
  };

  // Check if user has any of the specified roles
  const hasAnyRole = (roleNames: string[]) => {
    return roleNames.some(roleName => hasRole(roleName));
  };

  // Get permission level for a specific permission (read/write/none)
  const getPermissionLevel = (permissionName: string): 'none' | 'read' | 'write' => {
    if (!isAuthenticated) return 'none';
    
    if (hasPermission(permissionName, 'write')) return 'write';
    if (hasPermission(permissionName, 'read')) return 'read';
    return 'none';
  };

  // Debug function to log current permissions (useful for development)
  const debugPermissions = () => {
    console.group('🔐 User Permissions Debug');
    console.log('Is Authenticated:', isAuthenticated);
    console.log('Is Admin:', isAdmin());
    console.log('Is Super Admin:', isSuperAdmin());
    console.log('Roles:', roles);
    console.log('Permissions:', permissions.map(p => `${p.name} (${p.type || 'read'})`));
    console.log('User Data:', userData);
    console.log('User Role (single):', userData?.role);
    console.log('User Roles (array):', userData?.roles);
    console.log('Admin Profile:', userData?.adminProfile);
    console.groupEnd();
  };

  return {
    // Data
    permissions,
    roles,
    userData,
    isAuthenticated,
    
    // Permission checking functions
    hasPermission,
    hasRole,
    isSuperAdmin,
    isAdmin,
    hasAnyPermission,
    hasAllPermissions,
    hasAnyRole,
    getPermissionLevel,
    
    // Utility
    debugPermissions
  };
};
