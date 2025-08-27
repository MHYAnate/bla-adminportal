// src/services/api-routes/index.js - Clean Fixed Version

export const routes = {
  // =================== AUTHENTICATION ROUTES ===================
  login: () => "auth/login",
  register: () => "auth/register",
  logout: () => "auth/logout",
  forgotPassword: () => "auth/reset",
  resetPassword: () => "auth/reset-password",
  changePassword: () => "auth/change-password",
  checkAuth: () => "auth/check",
  refreshToken: () => "auth/refresh",
  verifyEmail: () => "auth/verify-email",
  resendVerification: () => "auth/resend-verification",
  getCurrentUser: () => "auth/me",
  updateProfile: () => "auth/profile",

  // =================== ADMIN MANAGEMENT ROUTES ===================
  getInvitableRoles: () => "admin/manage/roles/invitable",
  inviteAdmin: () => "admin/manage/invite",
  getPendingInvitations: (params) => {
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : "";
    return `admin/manage/invitations${queryString}`;
  },
  resendAdminInvite: (invitationId) => `admin/manage/invitations/${invitationId}/resend`,
  cancelInvitation: (invitationId) => `admin/manage/invitations/${invitationId}`,
  registerInvitedAdmin: () => "admin/manage/register",
  admins: (params) => {
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : "";
    return `admin/manage${queryString}`;
  },
  getCurrentAdmin: () => "admin/manage/current",
  checkAdminStatus: () => "admin/manage/status",
  updateAdminRoles: (adminId) => `admin/manage/${adminId}/roles`,
  updateAdminPermissions: (adminId) => `admin/manage/${adminId}/permissions`,
  getSpecificAdminPermissions: (adminId) => `admin/manage/${adminId}/permissions`,
  deleteAdmin: (adminId) => `admin/manage/${adminId}`,
  getAdminProfile: (adminId) => `admin/manage/${adminId}/profile`,
  updateAdminStatus: (adminId) => `admin/manage/${adminId}/status`,
  removeAdmin: (adminId) => `admin/manage/remove/${adminId}`,

  // =================== ROLE MANAGEMENT ROUTES ===================
  adminRoles: (params) => {
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : "";
    return `admin/manage/roles${queryString}`;
  },
  createRole: () => "admin/manage/roles",
  updateRole: (roleId) => `admin/manage/roles/${roleId}`,
  deleteRole: (roleId) => `admin/manage/roles/${roleId}`,
  getRolePermissions: (roleId) => `admin/manage/roles/${roleId}/permissions`,
  updateRolePermissions: (roleId) => `admin/manage/roles/${roleId}/permissions`,
  toggleRolePermission: (roleId, permissionId) => `admin/manage/roles/${roleId}/permissions/${permissionId}/toggle`,
  assignRolesToAdmin: (adminId) => `admin/manage/${adminId}/assign-roles`,

  // =================== PERMISSION MANAGEMENT ROUTES ===================
  adminPermissions: () => "admin/manage/permissions",
  createPermission: () => "admin/manage/permissions",
  updatePermission: (permissionId) => `admin/manage/permissions/${permissionId}`,
  deletePermission: (permissionId) => `admin/manage/permissions/${permissionId}`,
  toggleAdminPermission: (adminId, permissionId) => `admin/manage/${adminId}/permissions/${permissionId}/toggle`,
  updateAdminRolesPermissions: (adminId) => `admin/manage/${adminId}/roles-permissions`,
  getMyPermissions: () => "admin/manage/my/permissions",

  // =================== SYSTEM VALIDATION ROUTES ===================
  validateSystemRoles: () => "admin/system/validate",
  checkSuperAdminExists: () => "admin/system/super-admin-check",

  // =================== ENHANCED DASHBOARD ROUTES ===================
  dashboard: () => "admin/dashboard",
  getCompleteDashboardMetrics: (params) => {
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : "";
    return `admin/reports/dashboard${queryString}`;
  },

  dashboardReports: (params) => {
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : "";
    return `admin/reports/dashboard${queryString}`;
  },
  
  financialReports: (params) => {
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : "";
    return `admin/reports/financial${queryString}`;
  },

  financialReport: (customerId, params) => {
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : "";
    return `admin/reports/financial/${customerId}${queryString}`;
  },
  
  deleteFinancialData: (customerId) => `admin/reports/financial/${customerId}`,
  
  getFinancialSummary: (params) => {
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : "";
    return `admin/reports/financial-summary${queryString}`;
  },
  getPeriodComparison: () => "admin/reports/period-comparison",
  getRealTimeMetrics: () => "admin/reports/real-time-metrics",

  // =================== USER MANAGEMENT ROUTES ===================
  users: (params) => {
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : "";
    return `admin/users${queryString}`;
  },
  getUserDetails: (userId) => `admin/users/${userId}`,
  updateUserStatus: (userId) => `admin/users/${userId}/status`,

  // =================== CUSTOMER MANAGEMENT ROUTES ===================
  customers: (params) => {
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : "";
    return `admin/customers${queryString}`;
  },
  getCustomerById: (customerId) => `admin/customers/${customerId}`,
  getCustomerOrderHistory: (customerId) => `admin/customers/${customerId}/orders`,
  updateCustomerStatus: (customerId) => `admin/customers/${customerId}/status`,
  bulkUpdateCustomerStatus: () => "admin/customers/bulk/status",
  getCustomerStatusHistory: (customerId) => `admin/customers/${customerId}/status`,
  addComplianceNote: (customerId) => `admin/customers/${customerId}/compliance/notes`,
  resolveComplianceNote: (noteId) => `admin/customers/compliance/notes/${noteId}/resolve`,

  // =================== CATEGORY ROUTES ===================
  categories: (params) => {
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : "";
    return `admin/categories${queryString}`;
  },
  categoriesSelection: (params) => {
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : "";
    return `admin/categories/selection${queryString}`;
  },
  categoryStats: (params) => {
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : "";
    return `admin/categories/stats${queryString}`;
  },
  createCategory: () => "admin/categories",
  updateCategory: (categoryId) => `admin/categories/${categoryId}`,
  deleteCategory: (categoryId) => `admin/categories/${categoryId}`,
  getCategoryDetails: (categoryId) => `admin/categories/${categoryId}`,

  // =================== PRODUCT ROUTES ===================
  products: (params) => {
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : "";
    return `admin/products${queryString}`;
  },
  createProduct: () => "admin/products",
  updateProduct: (productId) => `admin/products/${productId}`,
  deleteProduct: (productId) => `admin/products/${productId}`,
  getProductDetails: (productId) => `admin/products/${productId}`,
  toggleProductStatus: (productId) => `admin/products/${productId}/toggle-status`,
  bulkAssignManufacturer: () => "admin/products/bulk/assign-manufacturer",

  // =================== MANUFACTURER ROUTES ===================
  manufacturers: (params) => {
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : "";
    return `admin/manufacturers${queryString}`;
  },
  createManufacturer: () => "admin/manufacturers",
  updateManufacturer: (manufacturerId) => `admin/manufacturers/${manufacturerId}`,
  deleteManufacturer: (manufacturerId) => `admin/manufacturers/${manufacturerId}`,
  getSingleManufacturer: (manufacturerId) => `admin/manufacturers/${manufacturerId}`,
  // getProductsByManufacturer: (manufacturerId, queryParams = {}) => {
  //   let url = `admin/manufacturers/${manufacturerId}/products`;
  //   const params = new URLSearchParams();
    
  //   if (queryParams.page) params.append('page', queryParams.page.toString());
  //   if (queryParams.pageSize) params.append('pageSize', queryParams.pageSize.toString());
  //   if (queryParams.type && queryParams.type !== 'all') params.append('type', queryParams.type);
  //   if (queryParams.search && queryParams.search.trim()) params.append('search', queryParams.search.trim());
    
  //   const queryString = params.toString();
  //   if (queryString) {
  //     url += `?${queryString}`;
  //   }
  //   return url;
  // },

  getProductsByManufacturer: (manufacturerId, queryParams = {}) => {
    if (!manufacturerId || isNaN(parseInt(manufacturerId))) {
      throw new Error("Invalid manufacturer ID format");
    }
  
    let url = `admin/manufacturers/${encodeURIComponent(manufacturerId)}/products`;
    const params = new URLSearchParams();
  
    if (queryParams.page) params.append("page", queryParams.page.toString());
    if (queryParams.pageSize) params.append("pageSize", queryParams.pageSize.toString());
    if (queryParams.type && queryParams.type !== "all") params.append("type", queryParams.type);
    if (queryParams.search && queryParams.search.trim()) params.append("search", queryParams.search.trim());
    if (queryParams.categoryId) params.append("categoryId", queryParams.categoryId.toString());
  
    const queryString = params.toString();
    if (queryString) url += `?${queryString}`;
  
    return url;
  },

  updateManufacturerStatus: (manufacturerId) => `admin/manufacturers/${manufacturerId}/status`,

  // =================== ORDER ROUTES ===================
  orders: (params) => {
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : "";
    return `admin/orders${queryString}`;
  },
  getOrderDetails: (orderId) => `admin/orders/${orderId}`,
  updateOrderStatus: (orderId) => `admin/orders/${orderId}/status`,
  archiveOrder: (orderId) => `admin/orders/${orderId}/archive`,
  unarchiveOrder: (orderId) => `admin/orders/${orderId}/unarchive`,
  getOrderSummary: () => "admin/orders/summary",
  getOrderSummaryChart: (params) => {
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : "";
    return `admin/orders/summary/chart${queryString}`;
  },
  getSalesData: (params) => {
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : "";
    return `admin/orders/sales${queryString}`;
  },
  getOrderStatusAnalytics: () => "admin/orders/analytics/status",
  getArchivedOrders: (params) => {
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : "";
    return `admin/orders/archived${queryString}`;
  },
  getFulfillmentMetrics: () => "admin/orders/metrics/fulfillment",
  cancelOrder: (orderId) => `admin/orders/${orderId}/cancel`,
  shipOrder: (orderId) => `admin/orders/${orderId}/ship`,
  processRefund: (orderId) => `admin/orders/${orderId}/refund`,
  updateOrderItemStatus: (orderId, itemId) => `admin/orders/${orderId}/items/${itemId}/status`,
  addOrderNote: (orderId) => `admin/orders/${orderId}/notes`,
  getOrderNotes: (orderId) => `admin/orders/${orderId}/notes`,
  getOrderProgress: (orderId) => `admin/orders/${orderId}/progress`,
  logCustomerInteraction: (orderId) => `admin/orders/${orderId}/interactions`,
  bulkUpdateOrderStatus: () => "admin/orders/bulk/status",
  bulkArchiveCompletedOrders: () => "admin/orders/bulk-archive",
  checkOrdersForIssues: () => "admin/orders/check-issues",
  getOrderWithFinancials: (orderId) => `admin/orders/${orderId}/financial`,

  // =================== INVENTORY ROUTES ===================
  getInventoryDashboard: () => "admin/inventory/dashboard",
  getEnhancedInventoryDashboard: () => "admin/inventory/enhanced-dashboard",
  getManufacturerInventory: (manufacturerId, params) => {
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : "";
    return `admin/inventory/manufacturer/${manufacturerId}${queryString}`;
  },
  setStockLimits: (inventoryId) => `admin/inventory/limits/${inventoryId}`,
  getInventoryAlerts: (params) => {
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : "";
    return `admin/inventory/alerts${queryString}`;
  },
  resolveInventoryAlert: (alertId) => `admin/inventory/alerts/${alertId}/resolve`,
  setMonitoringThresholds: () => "admin/inventory/monitoring/thresholds",
  triggerStockCheck: () => "admin/inventory/stock-check",
  getInventoryTrends: (params) => {
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : "";
    return `admin/inventory/trends${queryString}`;
  },

  // =================== ALERTS ROUTES ===================
  getAlerts: (params) => {
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : "";
    return `admin/alerts${queryString}`;
  },
  getAlertStats: () => "admin/alerts/stats",
  resolveAlert: (alertId) => `admin/alerts/${alertId}/resolve`,
  checkOrderAlerts: (orderId) => `admin/alerts/check-order/${orderId}`,

  // =================== BULK PRICING ROUTES ===================
  getBulkPricingConfigurations: (params) => {
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : "";
    return `admin/bulk-pricing/configurations${queryString}`;
  },
  configureBulkPricing: (productId) => `admin/bulk-pricing/configure/${productId}`,
  getBulkPricingAnalytics: (params) => {
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : "";
    return `admin/bulk-pricing/analytics${queryString}`;
  },
  bulkUpdatePricing: () => "admin/bulk-pricing/bulk-update",

  // =================== FEEDBACK ROUTES ===================
  getAllFeedback: (params) => {
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : "";
    return `admin/feedback${queryString}`;
  },
  getFeedbackDetails: (feedbackId) => `admin/feedback/${feedbackId}`,
  updateFeedbackStatus: (feedbackId) => `admin/feedback/${feedbackId}/status`,
  getFeedbackAnalytics: (params) => {
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : "";
    return `admin/feedback/analytics${queryString}`;
  },

  // =================== SUPPORT ROUTES ===================
  getAllSupportRequests: (params) => {
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : "";
    return `admin/support${queryString}`;
  },
  getSupportRequestDetails: (supportId) => `admin/support/${supportId}`,
  updateSupportStatus: (supportId) => `admin/support/${supportId}/status`,
  updateSupportTracking: (supportId) => `admin/support/${supportId}/tracking`,
  getSupportRequestsByUser: (userId, params) => {
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : "";
    return `admin/support/user/${userId}${queryString}`;
  },
  getSupportAnalytics: (params) => {
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : "";
    return `admin/support/analytics${queryString}`;
  },
  
  // =================== CUSTOMER SERVICE DASHBOARD ROUTES ===================
  getCustomerServiceDashboard: (params) => {
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : "";
    return `admin/customer-service/dashboard${queryString}`;
  },
  getSupportTicketMetrics: (params) => {
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : "";
    return `admin/customer-service/metrics/tickets${queryString}`;
  },
  getFeedbackSentimentAnalysis: (params) => {
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : "";
    return `admin/customer-service/metrics/sentiment${queryString}`;
  },

  // =================== ENHANCED FINANCIAL REPORTS ===================
  getFinancialReports: (params) => {
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : "";
    return `admin/reports/financial${queryString}`;
  },
  getCustomerFinancialReport: (customerId, params) => {
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : "";
    return `admin/reports/financial/${customerId}${queryString}`;
  },
  getFinancialBreakdown: (params) => {
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : "";
    return `admin/reports/financial/breakdown${queryString}`;
  },
  deleteCustomerFinancialData: (customerId) => `admin/reports/financial/${customerId}`,
  getFinancialReport: (customerId, params) => {
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : "";
    return `admin/reports/financial/${customerId}${queryString}`;
  },
  deleteFinancialData: (customerId) => `admin/reports/financial/${customerId}`,
  getProductPerformanceReports: (params) => {
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : "";
    return `admin/reports/product-performance${queryString}`;
  },
  getInventoryTurnoverReports: (params) => {
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : "";
    return `admin/reports/inventory-turnover${queryString}`;
  },
  getManufacturerReports: (params) => {
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : "";
    return `admin/reports/manufacturers${queryString}`;
  },
  exportManufacturerReport: (manufacturerId, params) => {
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : "";
    return `admin/reports/manufacturers/${manufacturerId}/export${queryString}`;
  },
  getCustomerAnalytics: (params) => {
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : "";
    return `admin/reports/analytics/customers${queryString}`;
  },
  getOrderAnalytics: (params) => {
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : "";
    return `admin/reports/analytics/orders${queryString}`;
  },

  // =================== ENHANCED TRANSACTION REPORTS ===================
  getTransactionSummary: (params) => {
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : "";
    return `admin/reports/transactions/summary${queryString}`;
  },
  getPayoutReport: (params) => {
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : "";
    return `admin/reports/transactions/payout${queryString}`;
  },
  validateTransactionCalculations: () => "admin/reports/transactions/validate",

  // =================== VALIDATION AND MAINTENANCE ===================
  validateFinancialIntegrity: () => "admin/reports/validate-integrity",
  recalculateFinancials: () => "admin/reports/recalculate",
  updateFinancialSummaries: () => "admin/reports/update-summaries",

  // =================== EXPORT AND REPORTING ===================
  exportFinancialReports: (params) => {
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : "";
    return `admin/reports/export/financial${queryString}`;
  },
  exportDashboardData: (params) => {
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : "";
    return `admin/reports/export/dashboard${queryString}`;
  },
  exportTransactionReports: (params) => {
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : "";
    return `admin/reports/export/transactions${queryString}`;
  },

  // =================== TRANSACTION ROUTES ===================
  getAllTransactions: (params) => {
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : "";
    return `admin/transactions${queryString}`;
  },
  getTransactionDetails: (transactionId) => `admin/payments/transactions/${transactionId}`,
  retryTransaction: (transactionId) => `admin/payments/transactions/${transactionId}/retry`,
  updateTransactionStatus: (transactionId) => `admin/payments/transactions/${transactionId}/status`,
  bulkUpdateTransactions: () => "admin/payments/transactions/bulk-update",
  getTransactionAnalytics: (params) => {
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : "";
    return `admin/payments/analytics${queryString}`;
  },
  paymentManagement: (params) => {
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : "";
    return `admin/payments${queryString}`;
  },

  // =================== NOTIFICATION ROUTES ===================
  notifications: (params) => {
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : "";
    return `admin/notifications${queryString}`;
  },
  markNotificationRead: (notificationId) => `admin/notifications/${notificationId}/read`,
  markAllNotificationsRead: () => "admin/notifications/mark-all-read",

  // =================== SETTINGS ROUTES ===================
  getSettings: () => "admin/settings",
  updateSettings: () => "admin/settings",

  // =================== UPLOAD AND PROFILE ROUTES ===================
  upload: () => "upload",
  profile: () => "profile",
  updateProfileWithEmail: (email) => email ? `profile/${email}` : "profile",

  // =================== LEGACY ROUTES ===================
  createAdmin: () => "admin/create",
  createAdminRole: () => "admin/roles/create",
  getAdminInfo: (adminId) => `admin/${adminId}`,

  // =================== QUERY BUILDERS ===================
  buildFinancialQuery: (params) => {
    const query = new URLSearchParams();
    Object.entries(params || {}).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        query.append(key, value.toString());
      }
    });
    return query.toString();
  },
  buildDashboardQuery: (params) => {
    const query = new URLSearchParams();
    Object.entries(params || {}).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        query.append(key, value.toString());
      }
    });
    return query.toString();
  },
  buildTransactionQuery: (params) => {
    const query = new URLSearchParams();
    Object.entries(params || {}).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        query.append(key, value.toString());
      }
    });
    return query.toString();
  },
};

// ===== ENHANCED ROUTE HELPER FUNCTIONS =====
export const routeHelpers = {
  getFinancialReportsWithFilters: (filters) => {
    const queryString = routes.buildFinancialQuery(filters);
    return `${routes.getFinancialReports()}${queryString ? `?${queryString}` : ''}`;
  },
  getDashboardWithPeriod: (period, includeComparisons = true) => {
    const queryString = routes.buildDashboardQuery({ 
      period, 
      includeComparisons 
    });
    return `${routes.getCompleteDashboardMetrics()}${queryString ? `?${queryString}` : ''}`;
  },
  getTransactionSummaryWithFilters: (filters) => {
    const queryString = routes.buildTransactionQuery(filters);
    return `${routes.getTransactionSummary()}${queryString ? `?${queryString}` : ''}`;
  },
  getPayoutReportWithDateRange: (startDate, endDate, groupBy = 'daily') => {
    const queryString = routes.buildTransactionQuery({ 
      startDate, 
      endDate, 
      groupBy 
    });
    return `${routes.getPayoutReport()}${queryString ? `?${queryString}` : ''}`;
  },
  getFinancialBreakdownBy: (groupBy, filters = {}) => {
    const params = { groupBy, ...filters };
    const queryString = routes.buildFinancialQuery(params);
    return `${routes.getFinancialBreakdown()}${queryString ? `?${queryString}` : ''}`;
  },
};

// ===== UTILITY FUNCTIONS =====
export const utils = {
  formatCurrency: (amount, currency = 'NGN') => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount || 0);
  },
  formatPercentage: (value, decimals = 1) => {
    return `${value >= 0 ? '+' : ''}${(value || 0).toFixed(decimals)}%`;
  },
  formatNumber: (number) => {
    return (number || 0).toLocaleString('en-NG');
  },
  calculatePercentageChange: (current, previous) => {
    if (!previous || previous === 0) {
      return current > 0 ? 100 : 0;
    }
    return ((current - previous) / previous) * 100;
  },
  calculateProfitMargin: (profit, revenue) => {
    if (!revenue || revenue === 0) return 0;
    return (profit / revenue) * 100;
  },
  validateDateRange: (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const now = new Date();

    if (start > end) {
      return { valid: false, error: 'Start date must be before end date' };
    }
    if (end > now) {
      return { valid: false, error: 'End date cannot be in the future' };
    }
    return { valid: true };
  },
  safeNumber: (value) => {
    const num = Number(value);
    return isNaN(num) ? 0 : num;
  },
};

// ===== CONSTANTS =====
export const FINANCIAL_CONSTANTS = {
  DEFAULT_PROFIT_MARGIN: 0.25, // FALLBACK ONLY - Use actual stockPrice for calculations
  PAYMENT_PROCESSING_RATE: 0.025, // 2.5%
  REFUND_PROCESSING_RATE: 0.01, // 1%
  HIGH_REFUND_RATE_THRESHOLD: 0.15, // 15%
  LOW_PROFIT_MARGIN_THRESHOLD: 0.10, // 10%
  CURRENCY: 'NGN',
  LOCALE: 'en-NG',
};

export const ORDER_STATUSES = {
  PENDING: 'PENDING',
  PROCESSING: 'PROCESSING',
  SHIPPED: 'SHIPPED',
  DELIVERED: 'DELIVERED',
  CANCELLED: 'CANCELLED',
  REFUNDED: 'REFUNDED',
};

export const PAYMENT_STATUSES = {
  PENDING: 'PENDING',
  PAID: 'PAID',
  FAILED: 'FAILED',
  REFUNDED: 'REFUNDED',
};

export const TRANSACTION_STATUSES = {
  SUCCESS: 'success',
  FAILED: 'failed',
  PENDING: 'pending',
  REFUNDED: 'refunded',
};

// ===== QUICK ACCESS FUNCTIONS =====
export const dashboardRoutes = {
  getMetrics: (period) => routeHelpers.getDashboardWithPeriod(period),
  getComparison: (currentPeriod, previousPeriod) => ({
    url: routes.getPeriodComparison(),
    data: { currentPeriod, previousPeriod }
  }),
  getRealTime: () => routes.getRealTimeMetrics(),
};

export const financialRoutes = {
  getReports: (filters) => routeHelpers.getFinancialReportsWithFilters(filters),
  getCustomerReport: (customerId) => routes.getCustomerFinancialReport(customerId),
  getBreakdown: (groupBy, filters) => routeHelpers.getFinancialBreakdownBy(groupBy, filters),
  validate: () => routes.validateFinancialIntegrity(),
};

export const transactionRoutes = {
  getSummary: (filters) => routeHelpers.getTransactionSummaryWithFilters(filters),
  getPayouts: (startDate, endDate, groupBy) => 
    routeHelpers.getPayoutReportWithDateRange(startDate, endDate, groupBy),
  validate: () => routes.validateTransactionCalculations(),
};

export const orderRoutes = {
  processRefund: (orderId) => routes.processRefund(orderId),
  getWithFinancials: (orderId) => routes.getOrderWithFinancials(orderId),
  updateStatus: (orderId) => routes.updateOrderStatus(orderId),
};

// ===== ERROR CONSTANTS =====
export const API_ERRORS = {
  NETWORK_ERROR: 'Network error occurred',
  TIMEOUT_ERROR: 'Request timed out',
  VALIDATION_ERROR: 'Validation failed',
  CALCULATION_ERROR: 'Financial calculation error',
  AUTHORIZATION_ERROR: 'Authorization required',
  NOT_FOUND_ERROR: 'Resource not found',
  SERVER_ERROR: 'Internal server error',
};

export const API_SUCCESS = {
  DATA_LOADED: 'Data loaded successfully',
  CALCULATION_COMPLETE: 'Financial calculations completed',
  EXPORT_READY: 'Report export ready',
  VALIDATION_PASSED: 'Data validation passed',
  UPDATE_SUCCESSFUL: 'Update completed successfully',
};

// Default export
export default routes;