export const routes = {
  // =================== AUTHENTICATION ROUTES ===================
  login: () => "auth/login",
  register: () => "auth/register",
  logout: () => "auth/logout",

  // Forgot password
  forgotPassword: () => "auth/forgot-password",
  
  // Reset password
  resetPassword: () => "auth/reset-password",
  
  // Change password (authenticated user)
  changePassword: () => "auth/change-password",
  
  // Check authentication status
  checkAuth: () => "auth/check",
  
  // Refresh token
  refreshToken: () => "auth/refresh",
  
  // Verify email
  verifyEmail: () => "auth/verify-email",
  
  // Resend verification email
  resendVerification: () => "auth/resend-verification",
  
  // Get current user profile
  getCurrentUser: () => "auth/me",
  
  // Update user profile
  updateProfile: () => "auth/profile",
  
  // =================== ROLE-BASED ADMIN INVITATION ROUTES ===================
  
  // Get roles available for invitation (excludes restricted roles) - Super Admin Only
  getInvitableRoles: () => "admin/manage/roles/invitable",
  
  // Send role-based admin invitation - Super Admin Only
  inviteAdmin: () => "admin/manage/invite",
  
  // Get pending invitations with role information - Super Admin Only
  getPendingInvitations: (params) => {
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : "";
    return `admin/manage/invitations${queryString}`;
  },
  
  // Resend admin invitation - Super Admin Only
  resendAdminInvite: (invitationId) => `admin/manage/invitations/${invitationId}/resend`,
  
  // Cancel admin invitation - Super Admin Only
  cancelInvitation: (invitationId) => `admin/manage/invitations/${invitationId}`,
  
  // Register invited admin (with secure URL validation) - Public with token
  registerInvitedAdmin: () => "admin/manage/register",
  
  // =================== ADMIN MANAGEMENT ROUTES ===================
  
  // Get all admins with enhanced role information - Requires USER read permission
  admins: (params) => {
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : "";
    return `admin/manage${queryString}`;
  },
  
  // Get current admin with role validation - Admin only
  getCurrentAdmin: () => "admin/manage/current",
  
  // Check admin access status - Authenticated users only
  checkAdminStatus: () => "admin/manage/status",
  
  // Update admin roles (role-based) - Super Admin Only
  updateAdminRoles: (adminId) => `admin/manage/${adminId}/roles`,
  
  // Update admin permissions (via roles) - Super Admin Only
  updateAdminPermissions: (adminId) => `admin/manage/${adminId}/permissions`,
  
  // Get specific admin permissions - Requires USER read permission
  getSpecificAdminPermissions: (adminId) => `admin/manage/${adminId}/permissions`,
  
  // Delete admin - Super Admin Only
  deleteAdmin: (adminId) => `admin/manage/${adminId}`,
  
  // Get admin profile/details - Requires USER read permission
  getAdminProfile: (adminId) => `admin/manage/${adminId}/profile`,
  
  // Update admin status - Requires USER write permission
  updateAdminStatus: (adminId) => `admin/manage/${adminId}/status`,
  
  // Remove admin privileges - Super Admin Only
  removeAdmin: (adminId) => `admin/manage/remove/${adminId}`,
  
  // =================== ROLE MANAGEMENT ROUTES ===================
  
  // Get all admin roles - Requires ROLE read permission
  adminRoles: (params) => {
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : "";
    return `admin/manage/roles${queryString}`;
  },
  
  // Create new role - Requires ROLE write permission
  createRole: () => "admin/manage/roles",
  
  // Update existing role - Requires ROLE write permission
  updateRole: (roleId) => `admin/manage/roles/${roleId}`,
  
  // Delete role - Requires ROLE write permission
  deleteRole: (roleId) => `admin/manage/roles/${roleId}`,
  
  // Get role permissions - Requires ROLE read permission
  getRolePermissions: (roleId) => `admin/manage/roles/${roleId}/permissions`,
  
  // Update role permissions (enable/disable) - Requires ROLE write permission
  updateRolePermissions: (roleId) => `admin/manage/roles/${roleId}/permissions`,
  
  // Toggle specific role permission - Requires ROLE write permission
  toggleRolePermission: (roleId, permissionId) => `admin/manage/roles/${roleId}/permissions/${permissionId}/toggle`,
  
  // Assign roles to admin - Super Admin Only
  assignRolesToAdmin: (adminId) => `admin/manage/${adminId}/assign-roles`,
  
  // =================== PERMISSION MANAGEMENT ROUTES ===================
  
  // Get all permissions - Requires PERMISSION read permission
  adminPermissions: () => "admin/manage/permissions",
  
  // Create new permission - Super Admin Only
  createPermission: () => "admin/manage/permissions",
  
  // Update permission - Super Admin Only
  updatePermission: (permissionId) => `admin/manage/permissions/${permissionId}`,
  
  // Delete permission - Super Admin Only
  deletePermission: (permissionId) => `admin/manage/permissions/${permissionId}`,
  
  // Toggle admin permission (via role assignment) - Super Admin Only
  toggleAdminPermission: (adminId, permissionId) => `admin/manage/${adminId}/permissions/${permissionId}/toggle`,
  
  // Update admin roles for permissions - Super Admin Only
  updateAdminRolesPermissions: (adminId) => `admin/manage/${adminId}/roles-permissions`,
  
  // Get current admin permissions - Admin only
  getMyPermissions: () => "admin/manage/my/permissions",
  
  // =================== SYSTEM VALIDATION ROUTES ===================
  
  // Validate system roles - Super Admin Only
  validateSystemRoles: () => "admin/system/validate",
  
  // Check super admin exists - Super Admin Only
  checkSuperAdminExists: () => "admin/system/super-admin-check",
  
  // =================== DASHBOARD ROUTES (ADMIN ROLE-BASED) ===================
  
  // Admin dashboard - Requires ANALYTICS read permission
  dashboard: () => "admin/dashboard",
  
  // =================== USER MANAGEMENT ROUTES (ADMIN ROLE-BASED) ===================
  
  // Get all users - Requires USER read permission
  users: (params) => {
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : "";
    return `admin/users${queryString}`;
  },
  
  // Get user details - Requires USER read permission
  getUserDetails: (userId) => `admin/users/${userId}`,
  
  // Update user status - Requires USER write permission
  updateUserStatus: (userId) => `admin/users/${userId}/status`,
  
  // =================== CUSTOMER MANAGEMENT ROUTES (ADMIN ROLE-BASED) ===================
  
  // List all customers - Requires USER read permission
  customers: (params) => {
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : "";
    return `admin/customers${queryString}`;
  },
  
  // Get customer by ID - Requires USER read permission
  getCustomerById: (customerId) => `admin/customers/${customerId}`,
  
  // Get customer order history - Requires USER read permission
  getCustomerOrderHistory: (customerId) => `admin/customers/${customerId}/orders`,
  
  // Update customer status - Requires USER write permission
  updateCustomerStatus: (customerId) => `admin/customers/${customerId}/status`,
  
  // Bulk update customer status - Requires USER write permission
  bulkUpdateCustomerStatus: () => "admin/customers/bulk/status",
  
  // Get customer status history - Requires USER read permission
  getCustomerStatusHistory: (customerId) => `admin/customers/${customerId}/status`,
  
  // Add compliance note - Requires COMPLIANCE write permission
  addComplianceNote: (customerId) => `admin/customers/${customerId}/compliance/notes`,
  
  // Resolve compliance note - Requires COMPLIANCE write permission
  resolveComplianceNote: (noteId) => `admin/customers/compliance/notes/${noteId}/resolve`,
  
  // =================== CATEGORY ROUTES (ADMIN ROLE-BASED) ===================
  
  // Get all categories - Requires PRODUCT read permission
  categories: (params) => {
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : "";
    return `admin/categories${queryString}`;
  },
  
  // Get categories for selection/dropdown - Requires PRODUCT read permission
  categoriesSelection: (params) => {
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : "";
    return `admin/categories/selection${queryString}`;
  },
  
  // Get category statistics - Requires ANALYTICS read permission
  categoryStats: (params) => {
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : "";
    return `admin/categories/stats${queryString}`;
  },
  
  // Create new category - Requires PRODUCT write permission
  createCategory: () => "admin/categories",
  
  // Update category - Requires PRODUCT write permission
  updateCategory: (categoryId) => `admin/categories/${categoryId}`,
  
  // Delete category - Requires PRODUCT write permission
  deleteCategory: (categoryId) => `admin/categories/${categoryId}`,
  
  // Get single category details - Requires PRODUCT read permission
  getCategoryDetails: (categoryId) => `admin/categories/${categoryId}`,
  
  // =================== PRODUCT ROUTES (ADMIN ROLE-BASED) ===================
  
  // Get all products - Requires PRODUCT read permission
  products: (params) => {
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : "";
    return `admin/products${queryString}`;
  },
  
  // Create product - Requires PRODUCT write permission
  createProduct: () => "admin/products",
  
  // Update product - Requires PRODUCT write permission
  updateProduct: (productId) => `admin/products/${productId}`,
  
  // Delete product - Requires PRODUCT write permission
  deleteProduct: (productId) => `admin/products/${productId}`,
  
  // Get product details - Requires PRODUCT read permission
  getProductDetails: (productId) => `admin/products/${productId}`,
  
  // Toggle product status - Requires PRODUCT write permission
  toggleProductStatus: (productId) => `admin/products/${productId}/toggle-status`,
  
  // Bulk assign manufacturer - Requires PRODUCT write permission
  bulkAssignManufacturer: () => "admin/products/bulk/assign-manufacturer",
  
  // =================== MANUFACTURER ROUTES (ADMIN ROLE-BASED) ===================
  
  // Get all manufacturers - Requires PRODUCT read permission
  manufacturers: (params) => {
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : "";
    return `admin/manufacturers${queryString}`;
  },
  
  // Create manufacturer - Requires PRODUCT write permission
  createManufacturer: () => "admin/manufacturers",
  
  // Update manufacturer - Requires PRODUCT write permission
  updateManufacturer: (manufacturerId) => `admin/manufacturers/${manufacturerId}`,
  
  // Delete manufacturer - Requires PRODUCT write permission
  deleteManufacturer: (manufacturerId) => `admin/manufacturers/${manufacturerId}`,
  
  // Get single manufacturer - Requires PRODUCT read permission
  getSingleManufacturer: (manufacturerId) => `admin/manufacturers/${manufacturerId}`,
  
  // Get products by manufacturer - Requires PRODUCT read permission
  getProductsByManufacturer: (manufacturerId, queryParams = {}) => {
    let url = `admin/manufacturers/${manufacturerId}/products`;
    
    // Build query parameters
    const params = new URLSearchParams();
    
    if (queryParams.page) params.append('page', queryParams.page.toString());
    if (queryParams.pageSize) params.append('pageSize', queryParams.pageSize.toString());
    if (queryParams.type && queryParams.type !== 'all') params.append('type', queryParams.type);
    if (queryParams.search && queryParams.search.trim()) params.append('search', queryParams.search.trim());
    
    const queryString = params.toString();
    if (queryString) {
      url += `?${queryString}`;
    }
    
    console.log('🔗 Built manufacturer products URL:', url);
    return url;
  },
  
  // Update manufacturer status - Requires PRODUCT write permission
  updateManufacturerStatus: (manufacturerId) => `admin/manufacturers/${manufacturerId}/status`,
  
  // =================== ORDER ROUTES (ADMIN ROLE-BASED) ===================
  
  // Get all orders - Requires ORDER read permission
  orders: (params) => {
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : "";
    return `admin/orders${queryString}`;
  },
  
  // Get order details - Requires ORDER read permission
  getOrderDetails: (orderId) => `admin/orders/${orderId}`,
  
  // Update order status - Requires ORDER write permission
  updateOrderStatus: (orderId) => `admin/orders/${orderId}/status`,
  
  // Archive order - Requires ORDER write permission
  archiveOrder: (orderId) => `admin/orders/${orderId}/archive`,
  
  // Unarchive order - Requires ORDER write permission
  unarchiveOrder: (orderId) => `admin/orders/${orderId}/unarchive`,
  
  // Get order summary - Requires ORDER read or ANALYTICS read permission
  getOrderSummary: () => "admin/orders/summary",
  
  // Get order summary chart - Requires ANALYTICS read permission
  getOrderSummaryChart: (params) => {
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : "";
    return `admin/orders/summary/chart${queryString}`;
  },
  
  // Get sales data - Requires ANALYTICS read permission
  getSalesData: (params) => {
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : "";
    return `admin/orders/sales${queryString}`;
  },
  
  // Get order status analytics - Requires ANALYTICS read permission
  getOrderStatusAnalytics: () => "admin/orders/analytics/status",
  
  // Get archived orders - Requires ORDER read permission
  getArchivedOrders: (params) => {
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : "";
    return `admin/orders/archived${queryString}`;
  },
  
  // Get fulfillment metrics - Requires ANALYTICS read permission
  getFulfillmentMetrics: () => "admin/orders/metrics/fulfillment",
  
  // Cancel order - Requires ORDER write permission
  cancelOrder: (orderId) => `admin/orders/${orderId}/cancel`,
  
  // Ship order - Requires ORDER write permission
  shipOrder: (orderId) => `admin/orders/${orderId}/ship`,
  
  // Process refund - Requires ORDER write permission
  processRefund: (orderId) => `admin/orders/${orderId}/refund`,
  
  // Update order item status - Requires ORDER write permission
  updateOrderItemStatus: (orderId, itemId) => `admin/orders/${orderId}/items/${itemId}/status`,
  
  // Add order note - Requires ORDER write permission
  addOrderNote: (orderId) => `admin/orders/${orderId}/notes`,
  
  // Get order notes - Requires ORDER read permission
  getOrderNotes: (orderId) => `admin/orders/${orderId}/notes`,
  
  // Get order progress - Requires ORDER read permission
  getOrderProgress: (orderId) => `admin/orders/${orderId}/progress`,
  
  // Log customer interaction - Requires SUPPORT write permission
  logCustomerInteraction: (orderId) => `admin/orders/${orderId}/interactions`,
  
  // Bulk update order status - Requires ORDER write permission
  bulkUpdateOrderStatus: () => "admin/orders/bulk/status",
  
  // Bulk archive completed orders - Requires ORDER write permission
  bulkArchiveCompletedOrders: () => "admin/orders/bulk-archive",
  
  // Check orders for issues - Requires ORDER write permission
  checkOrdersForIssues: () => "admin/orders/check-issues",
  
  // =================== INVENTORY ROUTES (ADMIN ROLE-BASED) ===================
  
  // Get inventory dashboard - Requires INVENTORY read permission
  getInventoryDashboard: () => "admin/inventory/dashboard",
  
  // Get enhanced inventory dashboard - Requires INVENTORY read or ANALYTICS read permission
  getEnhancedInventoryDashboard: () => "admin/inventory/enhanced-dashboard",
  
  // Get manufacturer inventory - Requires INVENTORY read permission
  getManufacturerInventory: (manufacturerId, params) => {
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : "";
    return `admin/inventory/manufacturer/${manufacturerId}${queryString}`;
  },
  
  // Set stock limits - Requires INVENTORY write permission
  setStockLimits: (inventoryId) => `admin/inventory/limits/${inventoryId}`,
  
  // Get inventory alerts - Requires INVENTORY read permission
  getInventoryAlerts: (params) => {
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : "";
    return `admin/inventory/alerts${queryString}`;
  },
  
  // Resolve inventory alert - Requires INVENTORY write permission
  resolveInventoryAlert: (alertId) => `admin/inventory/alerts/${alertId}/resolve`,
  
  // Set monitoring thresholds - Requires INVENTORY write permission
  setMonitoringThresholds: () => "admin/inventory/monitoring/thresholds",
  
  // Trigger stock check - Requires INVENTORY write permission
  triggerStockCheck: () => "admin/inventory/stock-check",
  
  // Get inventory trends - Requires INVENTORY read or ANALYTICS read permission
  getInventoryTrends: (params) => {
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : "";
    return `admin/inventory/trends${queryString}`;
  },
  
  // =================== ALERTS ROUTES (ADMIN ROLE-BASED) ===================
  
  // Get alerts - Requires ORDER read permission
  getAlerts: (params) => {
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : "";
    return `admin/alerts${queryString}`;
  },
  
  // Get alert stats - Requires ANALYTICS read permission
  getAlertStats: () => "admin/alerts/stats",
  
  // Resolve alert - Requires ORDER write permission
  resolveAlert: (alertId) => `admin/alerts/${alertId}/resolve`,
  
  // Check order alerts - Requires ORDER write permission
  checkOrderAlerts: (orderId) => `admin/alerts/check-order/${orderId}`,
  
  // =================== BULK PRICING ROUTES (ADMIN ROLE-BASED) ===================
  
  // Get bulk pricing configurations - Requires PRODUCT read permission
  getBulkPricingConfigurations: (params) => {
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : "";
    return `admin/bulk-pricing/configurations${queryString}`;
  },
  
  // Configure bulk pricing - Requires PRODUCT write permission
  configureBulkPricing: (productId) => `admin/bulk-pricing/configure/${productId}`,
  
  // Get bulk pricing analytics - Requires ANALYTICS read or PRODUCT read permission
  getBulkPricingAnalytics: (params) => {
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : "";
    return `admin/bulk-pricing/analytics${queryString}`;
  },
  
  // Bulk update pricing - Requires PRODUCT write permission
  bulkUpdatePricing: () => "admin/bulk-pricing/bulk-update",
  
  // =================== FEEDBACK ROUTES (ADMIN ROLE-BASED) ===================
  
  // Get all feedback - Requires SUPPORT read permission
  getAllFeedback: (params) => {
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : "";
    return `admin/feedback${queryString}`;
  },
  
  // Get feedback by user - Requires SUPPORT read permission
  getFeedbackByUser: (userId, params) => {
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : "";
    return `admin/feedback/user/${userId}${queryString}`;
  },
  
  // =================== REPORTS ROUTES (ADMIN ROLE-BASED) ===================
  
  // Get complete dashboard metrics - Requires ANALYTICS read permission
  getCompleteDashboardMetrics: (params) => {
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : "";
    return `admin/reports/dashboard${queryString}`;
  },
  
  // Get financial reports - Requires ANALYTICS read permission
  getFinancialReports: (params) => {
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : "";
    return `admin/reports/financial${queryString}`;
  },
  
  // Get financial report for customer - Requires ANALYTICS read permission
  getFinancialReport: (customerId, params) => {
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : "";
    return `admin/reports/financial/${customerId}${queryString}`;
  },
  
  // Delete financial data - Requires USER write permission
  deleteFinancialData: (customerId) => `admin/reports/financial/${customerId}`,
  
  // Get product performance reports - Requires ANALYTICS read or PRODUCT read permission
  getProductPerformanceReports: (params) => {
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : "";
    return `admin/reports/product-performance${queryString}`;
  },
  
  // Get inventory turnover reports - Requires ANALYTICS read or INVENTORY read permission
  getInventoryTurnoverReports: (params) => {
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : "";
    return `admin/reports/inventory-turnover${queryString}`;
  },
  
  // Get manufacturer reports - Requires ANALYTICS read permission
  getManufacturerReports: (params) => {
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : "";
    return `admin/reports/manufacturers${queryString}`;
  },
  
  // Export manufacturer report - Requires ANALYTICS read permission
  exportManufacturerReport: (manufacturerId, params) => {
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : "";
    return `admin/reports/manufacturers/${manufacturerId}/export${queryString}`;
  },
  
  // Get customer analytics - Requires ANALYTICS read or USER read permission
  getCustomerAnalytics: (params) => {
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : "";
    return `admin/reports/analytics/customers${queryString}`;
  },
  
  // Get order analytics - Requires ANALYTICS read or ORDER read permission
  getOrderAnalytics: (params) => {
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : "";
    return `admin/reports/analytics/orders${queryString}`;
  },
  
  // =================== TRANSACTION ROUTES (ADMIN ROLE-BASED) ===================
  
  // Get all transactions - Requires ORDER read permission
  getAllTransactions: (params) => {
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : "";
    return `admin/transactions${queryString}`;
  },
  
  // =================== NOTIFICATION ROUTES (ADMIN ROLE-BASED) ===================
  
  // Get notifications - Basic admin access
  notifications: (params) => {
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : "";
    return `admin/notifications${queryString}`;
  },
  
  // Mark notification as read - Basic admin access
  markNotificationRead: (notificationId) => `admin/notifications/${notificationId}/read`,
  
  // Mark all notifications as read - Basic admin access
  markAllNotificationsRead: () => "admin/notifications/mark-all-read",
  
  // =================== SETTINGS ROUTES (ADMIN ROLE-BASED) ===================
  
  // Get system settings - Requires SETTINGS read permission
  getSettings: () => "admin/settings",
  
  // Update system settings - Requires SETTINGS write permission
  updateSettings: () => "admin/settings",
  
  // =================== LEGACY/BACKUP ROUTES ===================
  
  // Legacy admin creation (if still needed)
  createAdmin: () => "admin/create",
  
  // Legacy role creation
  createAdminRole: () => "admin/roles/create",
  
  // Legacy admin info
  getAdminInfo: (adminId) => `admin/${adminId}`,


  // Get transaction details
  getTransactionDetails: (transactionId) => `admin/payments/transactions/${transactionId}`,
  
  // Retry failed transaction
  retryTransaction: (transactionId) => `admin/payments/transactions/${transactionId}/retry`,
  
  // Update transaction status
  updateTransactionStatus: (transactionId) => `admin/payments/transactions/${transactionId}/status`,
  
  // Bulk update transactions
  bulkUpdateTransactions: () => "admin/payments/transactions/bulk-update",
  
  // Get transaction analytics
  getTransactionAnalytics: (params) => {
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : "";
    return `admin/payments/analytics${queryString}`;
  },

  // =================== UPLOAD ROUTE (ADD IF MISSING) ===================
  
  // File upload
  upload: () => "upload",
  
  // =================== PROFILE ROUTES (ADD IF MISSING) ===================
  
  // Get user profile
  profile: () => "profile",
  
  // Update profile with email parameter
  updateProfile: (email) => email ? `profile/${email}` : "profile",
};

