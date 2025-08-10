// constants/sidebarPermissions.ts
export const SIDEBAR_PERMISSIONS = {
  DASHBOARD: {
    permissions: ['ANALYTICS'],
    allowedRoles: ['SUPER_ADMIN', 'ADMIN'],
    requiresAny: true
  },
  ADMIN_MANAGEMENT: {
    permissions: ['USER', 'ROLE'],
    allowedRoles: ['SUPER_ADMIN'],
    requiresAny: true
  },
  CUSTOMERS: {
    permissions: ['USER'],
    allowedRoles: ['SUPER_ADMIN', 'CUSTOMER_MANAGER'],
    requiresAny: true
  },
  PRODUCTS: {
    permissions: ['PRODUCT'],
    allowedRoles: ['SUPER_ADMIN', 'PRODUCT_MANAGER'],
    requiresAny: true
  },
  CATEGORIES: {
    permissions: ['PRODUCT'],
    allowedRoles: ['SUPER_ADMIN', 'PRODUCT_MANAGER'],
    requiresAny: true
  },
  MANUFACTURERS: {
    permissions: ['PRODUCT'],
    allowedRoles: ['SUPER_ADMIN', 'PRODUCT_MANAGER'],
    requiresAny: true
  },
  ORDERS: {
    permissions: ['ORDER'],
    allowedRoles: ['SUPER_ADMIN', 'ORDER_MANAGER'],
    requiresAny: true
  },
  REPORTS: {
    permissions: ['ANALYTICS'],
    allowedRoles: ['SUPER_ADMIN', 'ANALYST'],
    requiresAny: true
  },
  INVENTORY: {
    permissions: ['INVENTORY'],
    allowedRoles: ['SUPER_ADMIN', 'INVENTORY_MANAGER'],
    requiresAny: true
  },
  FINANCIAL_REPORTS: {
    permissions: ['ANALYTICS', 'ORDER'],
    allowedRoles: ['SUPER_ADMIN', 'FINANCIAL_MANAGER'],
    requiresAny: true
  },
  SUPPORT_FEEDBACK: {
    permissions: ['SUPPORT'],
    allowedRoles: ['SUPER_ADMIN', 'SUPPORT_AGENT'],
    requiresAny: true
  }
};

