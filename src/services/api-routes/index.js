// services/api-routes/index.js
export const routes = {
  login: () => "auth/login",
  logout: () => "auth/logout",
  forgotPassword: () => `auth/reset`,
  resetPassword: () => "auth/reset-password",
  changePassword: () => "auth/change-password",
  profile: () => "/api/user/info",
  dashboard: () => "admin/dashboard",
  checkAuth: () => `auth/check`,

  // Customer routes with improved query handling
  customers: (data) => {
    if (!data || typeof data !== 'object') {
      return 'admin/customers';
    }

    // Filter out undefined, null, and empty string values
    const cleanData = Object.fromEntries(
      Object.entries(data).filter(([key, value]) => {
        // Keep the value if it's not null, undefined, or empty string
        return value !== null && value !== undefined && value !== '';
      })
    );

    // If no valid parameters, return base route
    if (Object.keys(cleanData).length === 0) {
      return 'admin/customers';
    }

    const params = new URLSearchParams();
    
    // Handle each parameter appropriately
    Object.entries(cleanData).forEach(([key, value]) => {
      if (typeof value === 'boolean') {
        params.append(key, value.toString());
      } else if (typeof value === 'number') {
        params.append(key, value.toString());
      } else if (typeof value === 'string' && value.trim() !== '') {
        params.append(key, value.trim());
      }
    });

    const queryString = params.toString();
    return queryString ? `admin/customers?${queryString}` : 'admin/customers';
  },

  getCustomerInfo: (id) => `admin/customers/${id}`,
  getCustomerOrderHistory: (id) => `admin/customers/${id}/orders`,
  deleteCustomer: (id) => `admin/customers/${id}`,
  customerStats: () => 'admin/customers/stats',
  updateCustomerStatus: (id) => `admin/customers/${id}/status`,

  // User management routes
  suspendUser: (email) => `admin/users/suspend/${email}`,
  unSuspendUser: (email) => `admin/users/unsuspend/${email}`,
  deleteUser: (email) => `admin/users/${email}`,

  // Order routes with improved query handling
  orders: (data) => {
    if (!data || typeof data !== 'object' || Object.keys(data).length === 0) {
      return 'admin/orders';
    }
    
    const cleanData = Object.fromEntries(
      Object.entries(data).filter(([_, value]) => value != null && value !== '')
    );
    
    if (Object.keys(cleanData).length === 0) {
      return 'admin/orders';
    }
    
    const params = new URLSearchParams(cleanData);
    return `admin/orders?${params}`;
  },

  ordersAnalytics: (data) => {
    if (!data || typeof data !== 'object' || Object.keys(data).length === 0) {
      return 'admin/orders/sales';
    }
    
    const cleanData = Object.fromEntries(
      Object.entries(data).filter(([_, value]) => value != null && value !== '')
    );
    
    if (Object.keys(cleanData).length === 0) {
      return 'admin/orders/sales';
    }
    
    const params = new URLSearchParams(cleanData);
    return `admin/orders/sales?${params}`;
  },

  getOrderInfo: (id) => `admin/orders/${id}`,
  ordersSummary: () => "admin/orders/summary",

  // Product routes with improved query handling
  products: (data) => {
    if (!data || typeof data !== 'object' || Object.keys(data).length === 0) {
      return 'admin/products';
    }
    
    const cleanData = Object.fromEntries(
      Object.entries(data).filter(([_, value]) => value != null && value !== '')
    );
    
    if (Object.keys(cleanData).length === 0) {
      return 'admin/products';
    }
    
    const params = new URLSearchParams(cleanData);
    return `admin/products?${params}`;
  },

  createProduct: () => 'admin/products',
  getProductInfo: (id) => `admin/products/${id}`,
  updateProduct: (id) => `admin/products/${id}`,
  deleteProducts: (id) => `admin/products/${id}`, // Keep for backward compatibility
  deleteProduct: (id) => `admin/products/${id}`,

  // Manufacturer routes with improved query handling
  manufacturers: (data) => {
    if (!data || typeof data !== 'object' || Object.keys(data).length === 0) {
      return 'admin/manufacturers';
    }
    
    const cleanData = Object.fromEntries(
      Object.entries(data).filter(([_, value]) => value != null && value !== '')
    );
    
    if (Object.keys(cleanData).length === 0) {
      return 'admin/manufacturers';
    }
    
    const params = new URLSearchParams(cleanData);
    return `admin/manufacturers?${params}`;
  },

  createManufacturer: () => 'admin/manufacturers',
  getManufacturerInfo: (id) => `admin/manufacturers/${id}`,
  updateManufacturer: (id) => `admin/manufacturers/${id}`,
  deleteManufacturer: (id) => `admin/manufacturers/${id}`,
  updateManufacturerStatus: (manufacturerId) =>
    `admin/manufacturers/${manufacturerId}/status`,

  manufacturerProducts: ({ manufacturerId, data }) => {
    const baseUrl = `admin/manufacturers/${manufacturerId}/products`;
    
    if (!data || typeof data !== 'object' || Object.keys(data).length === 0) {
      return baseUrl;
    }
    
    const cleanData = Object.fromEntries(
      Object.entries(data).filter(([_, value]) => value != null && value !== '')
    );
    
    if (Object.keys(cleanData).length === 0) {
      return baseUrl;
    }
    
    const params = new URLSearchParams(cleanData);
    return `${baseUrl}?${params}`;
  },

  deleteManufacturerProduct: (id) => `admin/manufacturers/products/${id}`,

  // Category routes with improved query handling
  categories: (data) => {
    if (!data || typeof data !== 'object') {
      return 'admin/categories';
    }

    // Filter out undefined/null values
    const cleanData = Object.fromEntries(
      Object.entries(data).filter(([_, value]) => value != null && value !== '')
    );
    
    if (Object.keys(cleanData).length === 0) {
      return 'admin/categories';
    }
    
    const params = new URLSearchParams(cleanData);
    return `admin/categories?${params}`;
  },

  categoriesSelection: () => 'admin/categories/selection',
  getCategory: (id, includeProducts = false) => {
    const params = includeProducts ? '?includeProducts=true' : '';
    return `admin/categories/${id}${params}`;
  },
  categoryStats: () => 'admin/categories/stats',
  createCategory: () => 'admin/categories',
  updateCategory: (id) => `admin/categories/${id}`,
  deleteCategory: (id) => `admin/categories/${id}`,

  // Admin management routes with improved query handling
  admins: (data) => {
    if (!data || typeof data !== 'object' || Object.keys(data).length === 0) {
      return 'admin/manage';
    }
    
    const cleanData = Object.fromEntries(
      Object.entries(data).filter(([_, value]) => value != null && value !== '')
    );
    
    if (Object.keys(cleanData).length === 0) {
      return 'admin/manage';
    }
    
    const params = new URLSearchParams(cleanData);
    return `admin/manage?${params}`;
  },

  getAdminInfo: (id) => `admin/manage/${id}`,
  adminRoles: () => "admin/manage/roles",
  adminPermissions: () => "admin/manage/permissions",
  inviteAdmin: () => "admin/manage/invite",
  getCurrentAdmin: () => "admin/manage/current",
  updateAdminRoles: (adminId) => `admin/manage/${adminId}/roles`,
  checkAdminStatus: () => "admin/manage/status",
  deleteAdmin: (id) => `admin/manage/${id}`,
  removeAdmin: () => `admin/manage`,
  registerInvitedAdmin: () => "admin/manage/register",
  createAdmin: () => "admin/manage/create",
  
  // Enhanced permissions management routes
  updateAdminRolesPermissions: (adminId) => `admin/manage/${adminId}/roles-permissions`,
  updateAdminPermissions: (adminId) => `admin/manage/${adminId}/permissions`,
  getSpecificAdminPermissions: (adminId) => `admin/manage/${adminId}/permissions`,

   updateAdminPermissions: (adminId) => `admin/manage/${adminId}/permissions`,
  toggleAdminPermission: (adminId, permissionId) => `admin/manage/${adminId}/permissions/${permissionId}/toggle`,
  getAdminPermissions: (adminId) => `admin/manage/${adminId}/permissions`,
  
  // Role management routes
  createRole: () => 'admin/manage/roles',
  updateRole: (roleId) => `admin/manage/roles/${roleId}`,
  deleteRole: (roleId) => `admin/manage/roles/${roleId}`,
  getRolePermissions: (roleId) => `admin/manage/roles/${roleId}/permissions`,
  updateRolePermissions: (roleId) => `admin/manage/roles/${roleId}/permissions`,
  toggleRolePermission: (roleId, permissionId) => `admin/manage/roles/${roleId}/permissions/${permissionId}/toggle`,
  
  // Permission management routes
  getAllPermissions: () => 'admin/manage/permissions',
  createPermission: () => 'admin/manage/permissions',
  updatePermission: (permissionId) => `admin/manage/permissions/${permissionId}`,
  deletePermission: (permissionId) => `admin/manage/permissions/${permissionId}`,
  
  // Role assignment routes
  assignRolesToAdmin: (adminId) => `admin/manage/${adminId}/assign-roles`,
  
  // Admin status management
  updateAdminStatus: (adminId) => `admin/manage/${adminId}/status`,
  getAdminProfile: (adminId) => `admin/manage/${adminId}/profile`,
  
  // Legacy routes (keep for backward compatibility)
  createAdminRole: () => 'admin/manage/roles',
  
  // Financial Reports
  financialReport: (customerId) => `admin/reports/${customerId}`,
  deleteFinancialData: (customerId) => `admin/reports/${customerId}`,
  financialReports: () => '/admin/reports',
  dashboardReports: () => '/admin/dashboard',
  paymentManagement: () => 'admin/transactions',

  // Sales data
  salesData: (year) => {
    const base = "admin/orders/sales";
    return year ? `${base}?year=${year}` : base;
  },
  orderSummaryChart: (timeframe) => {
    const base = "admin/orders/summary/chart";
    return timeframe ? `${base}?timeframe=${timeframe}` : base;
  },



  // Order Status Management
  updateOrderStatus: (id) => `admin/orders/${id}/status`,
  bulkUpdateOrderStatus: () => `admin/orders/bulk/status`,
  
  // Order Actions
  cancelOrder: (id) => `admin/orders/${id}/cancel`,
  shipOrder: (id) => `admin/orders/${id}/ship`,
  processRefund: (id) => `admin/orders/${id}/refund`,
  
  // Order Items
  updateOrderItemStatus: (orderId, itemId) => `admin/orders/${orderId}/items/${itemId}/status`,
  
  // Order Notes
  addOrderNote: (orderId) => `admin/orders/${orderId}/notes`,
  getOrderNotes: (orderId) => `admin/orders/${orderId}/notes`,
  
  // Order Progress & Analytics
  getOrderProgress: (orderId) => `admin/orders/${orderId}/progress`,
  getOrderStatusAnalytics: (params) => {
    const base = `admin/orders/analytics/status`;
    if (!params || Object.keys(params).length === 0) return base;
    const query = new URLSearchParams(params);
    return `${base}?${query}`;
  },
  
  // Order Archive Management
  archiveOrder: (orderId) => `admin/orders/${orderId}/archive`,
  unarchiveOrder: (orderId) => `admin/orders/${orderId}/unarchive`,
  getArchivedOrders: (params) => {
    const base = `admin/orders/archived`;
    if (!params || Object.keys(params).length === 0) return base;
    const query = new URLSearchParams(params);
    return `${base}?${query}`;
  },
  bulkArchiveOrders: () => `admin/orders/bulk-archive`,
  
  // Customer Interactions & Fulfillment
  logCustomerInteraction: (orderId) => `admin/orders/${orderId}/interactions`,
  getFulfillmentMetrics: (params) => {
    const base = `admin/orders/metrics/fulfillment`;
    if (!params || Object.keys(params).length === 0) return base;
    const query = new URLSearchParams(params);
    return `${base}?${query}`;
  },
  
  // Issues & Diagnostics
  checkAllOrdersForIssues: (params) => {
    const base = `admin/orders/check-issues`;
    if (!params || Object.keys(params).length === 0) return base;
    const query = new URLSearchParams(params);
    return `${base}?${query}`;
  },


  // File upload
  upload: () => "upload"
};

