// utils/sidebarPermissionChecker.ts

type PermissionChecker = {
  userData: any;
  hasPermission: (permission: string, type?: 'read' | 'write') => boolean;
  hasRole: (role: string) => boolean;
  isSuperAdmin: () => boolean;
  isAdmin: () => boolean;
};

// Enhanced permission mapping based on your actual roles
const ROLE_PERMISSIONS = {
  'SUPER_ADMIN': ['USER', 'ROLE', 'PRODUCT', 'ORDER', 'ANALYTICS', 'INVENTORY', 'SUPPORT'],
  'PRODUCT_MANAGER': ['PRODUCT', 'ANALYTICS'], // ✅ Added ANALYTICS for dashboard access
  'ORDER_MANAGER': ['ORDER', 'ANALYTICS'], 
  'CUSTOMER_MANAGER': ['USER', 'ANALYTICS'],
  'INVENTORY_MANAGER': ['INVENTORY', 'PRODUCT', 'ANALYTICS'],
  'SUPPORT_AGENT': ['SUPPORT', 'USER', 'ANALYTICS'], // ✅ Added ANALYTICS
  'FINANCIAL_MANAGER': ['ANALYTICS', 'ORDER'],
  'ANALYST': ['ANALYTICS'],
  'ADMIN': ['USER', 'PRODUCT', 'ORDER', 'ANALYTICS'], // Generic admin permissions
  // ✅ Add any other roles you might have
  'MANAGER': ['ANALYTICS', 'PRODUCT', 'ORDER'] // Fallback for generic manager roles
};

// Helper function to get user's role names
const getUserRoles = (userData: any): string[] => {
  if (!userData) return [];
  
  const roles: string[] = [];
  
  // Check array roles first
  if (Array.isArray(userData.roles)) {
    userData.roles.forEach((userRole: any) => {
      const roleName = userRole.role?.name || userRole.name;
      if (roleName) roles.push(roleName);
    });
  }
  
  // Check single role
  if (userData.role) {
    const roleName = typeof userData.role === 'string' 
      ? userData.role 
      : userData.role.name;
    if (roleName && !roles.includes(roleName)) {
      roles.push(roleName);
    }
  }
  
  return roles;
};

// Helper function to get all permissions for a user
const getUserPermissions = (userData: any): string[] => {
  const userRoles = getUserRoles(userData);
  const allPermissions = new Set<string>();
  
  userRoles.forEach(role => {
    const rolePermissions = ROLE_PERMISSIONS[role as keyof typeof ROLE_PERMISSIONS] || [];
    rolePermissions.forEach(permission => allPermissions.add(permission));
  });
  
  return Array.from(allPermissions);
};

export const checkSidebarAccess = (
  sectionKey: string,
  permissionChecker: PermissionChecker
): boolean => {
  console.log(`🔍 Checking access for section: ${sectionKey}`);
  
  // Super admin always has access - FIRST CHECK
  if (permissionChecker.isSuperAdmin()) {
    console.log('✅ Super admin - access granted for:', sectionKey);
    return true;
  }

  // Check if user data exists (authenticated check)
  if (!permissionChecker.userData) {
    console.log('❌ No user data available for:', sectionKey);
    return false;
  }

  // Must have admin access
  if (!permissionChecker.isAdmin() && !permissionChecker.userData?.adminProfile) {
    console.log('❌ No admin access for:', sectionKey);
    return false;
  }

  // Get user permissions
  const userPermissions = getUserPermissions(permissionChecker.userData);
  const userRoles = getUserRoles(permissionChecker.userData);
  
  console.log(`Checking ${sectionKey} - User roles: ${userRoles.join(', ')}, Permissions: ${userPermissions.join(', ')}`);

  // Check specific section permissions
  switch (sectionKey) {
    case 'DASHBOARD':
      // Dashboard access for most admin roles - more permissive
      const dashboardAccess = userPermissions.includes('ANALYTICS') || 
             userPermissions.includes('PRODUCT') ||
             userPermissions.includes('ORDER') ||
             userPermissions.includes('USER') ||
             userRoles.includes('SUPER_ADMIN') || 
             userRoles.includes('ADMIN') ||
             userRoles.includes('PRODUCT_MANAGER') ||
             userRoles.includes('ORDER_MANAGER') ||
             userRoles.includes('CUSTOMER_MANAGER') ||
             userRoles.includes('INVENTORY_MANAGER') ||
             userRoles.includes('SUPPORT_AGENT');
      console.log(`Dashboard access: ${dashboardAccess} - Permissions: ${userPermissions.join(', ')} - Roles: ${userRoles.join(', ')}`);
      return dashboardAccess;
             
    case 'ADMIN_MANAGEMENT':
      // Only super admin and specific roles can manage admins/roles
      const adminAccess = (userPermissions.includes('USER') && userPermissions.includes('ROLE')) ||
             userRoles.includes('SUPER_ADMIN');
      console.log(`Admin management access: ${adminAccess}`);
      return adminAccess;
             
    case 'CUSTOMERS':
      // Customer management
      const customerAccess = userPermissions.includes('USER') ||
             userRoles.includes('CUSTOMER_MANAGER') ||
             userRoles.includes('SUPER_ADMIN');
      console.log(`Customer access: ${customerAccess}`);
      return customerAccess;
             
    case 'PRODUCTS':
      // Product management
      const productAccess = userPermissions.includes('PRODUCT') ||
             userRoles.includes('PRODUCT_MANAGER') ||
             userRoles.includes('SUPER_ADMIN');
      console.log(`Product access: ${productAccess}`);
      return productAccess;
             
    case 'MANUFACTURERS':
      // Manufacturer management (subset of product management)
      const manufacturerAccess = userPermissions.includes('PRODUCT') ||
             userRoles.includes('PRODUCT_MANAGER') ||
             userRoles.includes('SUPER_ADMIN');
      console.log(`Manufacturer access: ${manufacturerAccess}`);
      return manufacturerAccess;
             
    case 'ORDERS':
      // Order management
      const orderAccess = userPermissions.includes('ORDER') ||
             userRoles.includes('ORDER_MANAGER') ||
             userRoles.includes('SUPER_ADMIN');
      console.log(`Order access: ${orderAccess}`);
      return orderAccess;
             
    case 'REPORTS':
    case 'FINANCIAL_REPORTS':
      // Analytics and reporting
      const reportAccess = userPermissions.includes('ANALYTICS') ||
             userRoles.includes('ANALYST') ||
             userRoles.includes('FINANCIAL_MANAGER') ||
             userRoles.includes('SUPER_ADMIN');
      console.log(`Report access: ${reportAccess}`);
      return reportAccess;
             
    case 'INVENTORY':
      // Inventory management
      const inventoryAccess = userPermissions.includes('INVENTORY') ||
             userRoles.includes('INVENTORY_MANAGER') ||
             userRoles.includes('SUPER_ADMIN');
      console.log(`Inventory access: ${inventoryAccess}`);
      return inventoryAccess;
             
    case 'SUPPORT_FEEDBACK':
      // Support and feedback
      const supportAccess = userPermissions.includes('SUPPORT') ||
             userRoles.includes('SUPPORT_AGENT') ||
             userRoles.includes('SUPER_ADMIN');
      console.log(`Support access: ${supportAccess}`);
      return supportAccess;
             
    default:
      // For undefined sections, only allow super admin
      console.log(`⚠️ Unknown section: ${sectionKey}, defaulting to super admin only`);
      return userRoles.includes('SUPER_ADMIN');
  }
};

// Additional helper function to check specific route access
export const checkRouteAccess = (
  route: string,
  permissionChecker: PermissionChecker
): boolean => {
  // Define route to permission mapping
  const routePermissionMap: Record<string, string> = {
    '/admin': 'DASHBOARD',
    '/admin/admin-management': 'ADMIN_MANAGEMENT',
    '/admin/create-role': 'ADMIN_MANAGEMENT',
    '/admin/permissions': 'ADMIN_MANAGEMENT',
    '/admin/customers': 'CUSTOMERS',
    '/admin/business': 'CUSTOMERS',
    '/admin/products': 'PRODUCTS',
    '/admin/categories': 'PRODUCTS',
    '/admin/manufacturers': 'MANUFACTURERS',
    '/admin/orders': 'ORDERS',
    '/admin/reports': 'REPORTS',
    '/admin/financial-reports': 'FINANCIAL_REPORTS',
    '/admin/inventory': 'INVENTORY',
    '/admin/transaction-management': 'ORDERS',
    '/admin/store-management': 'PRODUCTS',
    '/admin/supply-management/manufacturers': 'MANUFACTURERS',
    '/admin/supply-management/vendors': 'MANUFACTURERS',
    '/admin/feedback': 'SUPPORT_FEEDBACK',
    '/admin/support': 'SUPPORT_FEEDBACK',
    '/admin/notifications': 'DASHBOARD',
    '/admin/settings': 'DASHBOARD',
  };
  
  const permissionKey = routePermissionMap[route];
  return permissionKey ? checkSidebarAccess(permissionKey, permissionChecker) : false;
};

// Debug function to log user permissions
export const debugUserPermissions = (userData: any): void => {
  if (process.env.NODE_ENV === 'development') {
    console.log('🐛 User Permission Debug:', {
      userData,
      roles: getUserRoles(userData),
      permissions: getUserPermissions(userData),
    });
  }
};