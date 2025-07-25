export const routes = {
  login: () => "auth/login",
  logout: () => "auth/logout",
  forgotPassword: () => `auth/reset`,
  resetPassword: () => "auth/reset-password",
  profile: () => "/api/user/info",
  dashboard: () => "admin/dashboard",
  customers: (data) => {
    const params = new URLSearchParams(data);
    return `admin/customers?${params}`;
  },
  getCustomerInfo: (id) => `admin/customers/${id}`,
  getCustomerOrderHistory: (id) => `admin/customers/${id}/orders`,
  orders: (data) => {
    const params = new URLSearchParams(data);
    return `admin/orders?${params}`;
  },
  ordersAnalytics: (data) => {
    const params = new URLSearchParams(data);
    return `admin/orders/sales?${params}`;
  },
  getOrderInfo: (id) => `admin/orders/${id}`,
  ordersSummary: () => "admin/orders/summary",
  products: (data) => {
    const params = new URLSearchParams(data);
    return `admin/products?${params}`;
  },
  deleteProducts: (id) => `admin/products/${id}`,
  manufacturers: (data) => {
    const params = new URLSearchParams(data);
    return `admin/manufacturers?${params}`;
  },
  getManufacturerInfo: (id) => `admin/manufacturers/${id}`,
  manufacturerProducts: ({ manufacturerId, data }) => {
    const params = new URLSearchParams(data);
    return `admin/manufacturers/${manufacturerId}/products?${params}`;
  },
  deleteManufacturerProduct: (id) => `admin/manufacturers/${id}`,
  updateManufacturerStatus: (manufacturerId) =>
    `admin/manufacturers/${manufacturerId}/status`,

  // Admin management routes
  admins: (data) => {
    const params = new URLSearchParams(data);
    return `admin/manage?${params}`;
  },
  getAdminInfo: (id) => `admin/manage/${id}`,
  adminRoles: () => "admin/manage/roles",
  adminPermissions: () => "admin/manage/permissions",
  inviteAdmin: () => "admin/manage/invite",
  updateAdminRoles: (adminId) => `admin/manage/${adminId}/roles`,
  checkAdminStatus: () => "admin/manage/status",
  deleteAdmin: (id) => `admin/manage/${id}`,
  removeAdmin: () => `admin/manage`,
  registerInvitedAdmin: () => "admin/manage/register",
  createAdmin: () => "admin/manage/create",

  delete: (id) => `admin/${id}`,

  // Financial Reports
  financialReport: (customerId) => `admin/reports/${customerId}`,
  deleteFinancialData: (customerId) => `admin/reports/${customerId}`,
  financialReports: () => '/admin/reports',
  dashboardReports: () => '/admin/dashboard',
  paymentManagement: () => 'admin/transactions',
  deleteManufacturer: (id) => `admin/manufacturers/${id}`,
  createManufacturer: () => 'admin/manufacturers',
  createAdminRole: () => 'admin/roles',
  updateManufacturer: (id) => `admin/manufacturers/${id}`,
  createProduct: () => 'admin/products',
  
  // FIXED Category routes
  categories: (data) => {
    if (data && Object.keys(data).length > 0) {
      // Filter out undefined/null values
      const cleanData = Object.fromEntries(
        Object.entries(data).filter(([_, value]) => value != null && value !== '')
      );
      if (Object.keys(cleanData).length > 0) {
        const params = new URLSearchParams(cleanData);
        return `admin/categories?${params}`;
      }
    }
    return 'admin/categories';
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

  salesData: (year) => {
    const base = "admin/orders/sales";
    return year ? `${base}?year=${year}` : base;
  },
  orderSummaryChart: (timeframe) => {
    const base = "admin/orders/summary/chart";
    return timeframe ? `${base}?timeframe=${timeframe}` : base;
  },
};