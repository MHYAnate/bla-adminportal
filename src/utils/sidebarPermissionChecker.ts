// utils/sidebarPermissionChecker.ts

/**
 * Enhanced Sidebar Permission Checker
 * 
 * This utility provides permission-based access control for sidebar items
 * based on the actual backend permission structure rather than hardcoded roles.
 */

// ✅ Backend permission mapping - matches your API routes
export const BACKEND_PERMISSIONS = {
  // Core admin permissions (from backend)
  USER: 'USER',           // USER read/write for customer/admin management
  ROLE: 'ROLE',           // ROLE read/write for role management  
  PERMISSION: 'PERMISSION', // PERMISSION read/write for permission management
  PRODUCT: 'PRODUCT',     // PRODUCT read/write for product/category/inventory
  ORDER: 'ORDER',         // ORDER read/write for order/transaction management
  INVENTORY: 'INVENTORY', // INVENTORY read/write for inventory management
  ANALYTICS: 'ANALYTICS', // ANALYTICS read for reports/dashboard
  SUPPORT: 'SUPPORT',     // SUPPORT read/write for support/feedback
  COMPLIANCE: 'COMPLIANCE' // COMPLIANCE read/write for compliance operations
} as const;

// ✅ Permission level types
export type PermissionType = 'read' | 'write';
export type PermissionKey = keyof typeof BACKEND_PERMISSIONS;

/**
 * Enhanced function to check sidebar access based on backend permissions
 * 
 * @param permissionKey - The permission key to check (e.g., 'USER', 'PRODUCT')
 * @param permissionChecker - The permission checker from usePermissions hook
 * @param type - Permission type ('read' or 'write'), defaults to 'read'
 * @returns boolean - Whether the user has access
 */
export const checkSidebarAccess = (
  permissionKey: string,
  permissionChecker: any,
  type: PermissionType = 'read'
): boolean => {
  console.log(`🔍 Checking sidebar access for: ${permissionKey} (${type})`);

  // ✅ Must be authenticated
  if (!permissionChecker.isAuthenticated || !permissionChecker.userData) {
    console.log(`❌ Not authenticated - denying access to ${permissionKey}`);
    return false;
  }

  // ✅ Super admin bypass
  if (permissionChecker.isSuperAdmin()) {
    console.log(`✅ Super admin - granting access to ${permissionKey}`);
    return true;
  }

  // ✅ Must have admin access
  if (!permissionChecker.isAdmin()) {
    console.log(`❌ Not admin - denying access to ${permissionKey}`);
    return false;
  }

  // ✅ Check specific permission
  const hasPermission = permissionChecker.hasPermission(permissionKey, type);
  
  console.log(`${hasPermission ? '✅' : '❌'} Permission check result for ${permissionKey} (${type}): ${hasPermission}`);
  
  // ✅ Log current user's permissions for debugging
  if (process.env.NODE_ENV === 'development' && !hasPermission) {
    console.log('🔍 Available permissions:', 
      permissionChecker.permissions?.map((p: any) => `${p.name} (${p.type || 'read'})`) || []
    );
    console.log('🔍 Available roles:', permissionChecker.roles || []);
  }
  
  return hasPermission;
};

/**
 * Enhanced function to check if user has any of the specified permissions
 * 
 * @param permissionKeys - Array of permission keys to check
 * @param permissionChecker - The permission checker from usePermissions hook
 * @param type - Permission type ('read' or 'write'), defaults to 'read'
 * @returns boolean - Whether the user has any of the permissions
 */
export const checkAnyPermission = (
  permissionKeys: string[],
  permissionChecker: any,
  type: PermissionType = 'read'
): boolean => {
  return permissionKeys.some(key => checkSidebarAccess(key, permissionChecker, type));
};

/**
 * Enhanced function to check if user has all of the specified permissions
 * 
 * @param permissionKeys - Array of permission keys to check
 * @param permissionChecker - The permission checker from usePermissions hook
 * @param type - Permission type ('read' or 'write'), defaults to 'read'
 * @returns boolean - Whether the user has all of the permissions
 */
export const checkAllPermissions = (
  permissionKeys: string[],
  permissionChecker: any,
  type: PermissionType = 'read'
): boolean => {
  return permissionKeys.every(key => checkSidebarAccess(key, permissionChecker, type));
};

/**
 * Enhanced function to get user's permission level for a specific resource
 * 
 * @param permissionKey - The permission key to check
 * @param permissionChecker - The permission checker from usePermissions hook
 * @returns 'none' | 'read' | 'write' - The highest permission level the user has
 */
export const getPermissionLevel = (
  permissionKey: string,
  permissionChecker: any
): 'none' | 'read' | 'write' => {
  if (!permissionChecker.isAuthenticated || !permissionChecker.isAdmin()) {
    return 'none';
  }

  if (permissionChecker.isSuperAdmin()) {
    return 'write'; // Super admin has full access
  }

  if (checkSidebarAccess(permissionKey, permissionChecker, 'write')) {
    return 'write';
  }

  if (checkSidebarAccess(permissionKey, permissionChecker, 'read')) {
    return 'read';
  }

  return 'none';
};

/**
 * Enhanced function to check role-based access (for legacy compatibility)
 * Note: This should be phased out in favor of permission-based checks
 * 
 * @param allowedRoles - Array of role names that are allowed
 * @param permissionChecker - The permission checker from usePermissions hook
 * @returns boolean - Whether the user has any of the allowed roles
 */
export const checkRoleBasedAccess = (
  allowedRoles: string[],
  permissionChecker: any
): boolean => {
  console.log(`🔍 Legacy role-based access check for: ${allowedRoles.join(', ')}`);
  
  if (!permissionChecker.isAuthenticated || !permissionChecker.userData) {
    return false;
  }

  if (permissionChecker.isSuperAdmin()) {
    return true;
  }

  const userRoles = permissionChecker.roles || [];
  const hasRole = userRoles.some((userRole: string) => 
    allowedRoles.some(allowedRole => 
      userRole.toUpperCase() === allowedRole.toUpperCase()
    )
  );

  console.log(`${hasRole ? '✅' : '❌'} Role-based access check result:`, {
    userRoles,
    allowedRoles,
    hasAccess: hasRole
  });

  return hasRole;
};

/**
 * Enhanced function to validate sidebar item configuration
 * 
 * @param item - Sidebar item configuration
 * @returns boolean - Whether the item configuration is valid
 */
export const validateSidebarItem = (item: any): boolean => {
  if (!item) {
    console.error('❌ Invalid sidebar item: null or undefined');
    return false;
  }

  if (!item.sidebar) {
    console.error('❌ Invalid sidebar item: missing sidebar property', item);
    return false;
  }

  if (!item.href && !item.child) {
    console.error('❌ Invalid sidebar item: missing both href and child properties', item);
    return false;
  }

  if (item.child && !Array.isArray(item.child)) {
    console.error('❌ Invalid sidebar item: child property is not an array', item);
    return false;
  }

  return true;
};

/**
 * Enhanced function to get filtered sidebar items based on permissions
 * 
 * @param sidebarItems - Array of sidebar items
 * @param permissionChecker - The permission checker from usePermissions hook
 * @param routePermissionMap - Map of routes to required permissions
 * @returns Array of filtered sidebar items
 */
export const getFilteredSidebarItems = (
  sidebarItems: any[],
  permissionChecker: any,
  routePermissionMap: Record<string, string>
): any[] => {
  console.log('🔍 Filtering sidebar items based on permissions');

  if (!Array.isArray(sidebarItems)) {
    console.error('❌ Invalid sidebar items: not an array');
    return [];
  }

  if (!permissionChecker.isAuthenticated || !permissionChecker.isAdmin()) {
    console.log('❌ User not authenticated or not admin');
    return [];
  }

  if (permissionChecker.isSuperAdmin()) {
    console.log('✅ Super admin - returning all items');
    return sidebarItems.filter(validateSidebarItem);
  }

  const filteredItems = sidebarItems.filter(item => {
    if (!validateSidebarItem(item)) {
      return false;
    }

    // For items with children, check if user has access to any child
    if (item.child && Array.isArray(item.child)) {
      const accessibleChildren = item.child.filter((child: any) => {
        const permissionKey = routePermissionMap[child.href];
        return permissionKey && checkSidebarAccess(permissionKey, permissionChecker);
      });

      // Only include parent if there are accessible children
      if (accessibleChildren.length > 0) {
        // Update the item to only include accessible children
        item.child = accessibleChildren;
        return true;
      }
      return false;
    }

    // For single items, check direct permission
    if (item.href) {
      const permissionKey = routePermissionMap[item.href];
      return permissionKey && checkSidebarAccess(permissionKey, permissionChecker);
    }

    return false;
  });

  console.log(`✅ Filtered ${filteredItems.length} items from ${sidebarItems.length} total`);
  return filteredItems;
};

/**
 * Enhanced debugging function for permission troubleshooting
 * 
 * @param permissionChecker - The permission checker from usePermissions hook
 * @param item - Optional specific item to debug
 */
export const debugSidebarPermissions = (
  permissionChecker: any,
  item?: any
): void => {
  if (process.env.NODE_ENV !== 'development') {
    return;
  }

  console.group('🔐 Sidebar Permissions Debug');
  
  console.log('User Authentication Status:', {
    isAuthenticated: permissionChecker.isAuthenticated,
    isAdmin: permissionChecker.isAdmin(),
    isSuperAdmin: permissionChecker.isSuperAdmin(),
    userId: permissionChecker.userData?.id,
    userEmail: permissionChecker.userData?.email
  });

  console.log('User Roles:', permissionChecker.roles || []);
  
  console.log('User Permissions:', 
    permissionChecker.permissions?.map((p: any) => ({
      name: p.name,
      type: p.type || 'read',
      description: p.description
    })) || []
  );

  if (item) {
    console.log('Item Debug:', {
      sidebar: item.sidebar,
      href: item.href,
      hasChildren: !!item.child,
      childrenCount: item.child?.length || 0
    });

    if (item.href) {
      // This would need the route permission map to be passed in
      console.log('Item Permission Check: (requires route permission map)');
    }
  }

  console.groupEnd();
};

/**
 * Enhanced function to create permission-aware navigation guards
 * 
 * @param requiredPermission - The permission required to access the route
 * @param permissionType - The type of permission required ('read' or 'write')
 * @returns Function that checks if navigation is allowed
 */
export const createPermissionGuard = (
  requiredPermission: string,
  permissionType: PermissionType = 'read'
) => {
  return (permissionChecker: any): boolean => {
    return checkSidebarAccess(requiredPermission, permissionChecker, permissionType);
  };
};

/**
 * Enhanced function to get user's accessible routes
 * 
 * @param routePermissionMap - Map of routes to required permissions
 * @param permissionChecker - The permission checker from usePermissions hook
 * @returns Array of routes the user can access
 */
export const getAccessibleRoutes = (
  routePermissionMap: Record<string, string>,
  permissionChecker: any
): string[] => {
  if (!permissionChecker.isAuthenticated || !permissionChecker.isAdmin()) {
    return [];
  }

  if (permissionChecker.isSuperAdmin()) {
    return Object.keys(routePermissionMap);
  }

  return Object.entries(routePermissionMap)
    .filter(([route, permission]) => 
      checkSidebarAccess(permission, permissionChecker)
    )
    .map(([route]) => route);
};

// Export default object with all utilities
export default {
  checkSidebarAccess,
  checkAnyPermission,
  checkAllPermissions,
  getPermissionLevel,
  checkRoleBasedAccess,
  validateSidebarItem,
  getFilteredSidebarItems,
  debugSidebarPermissions,
  createPermissionGuard,
  getAccessibleRoutes,
  BACKEND_PERMISSIONS
};