export const routes = {

  login: () => "auth/login",
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
  // registerInvitedAdmin: (data) =>{  const params = new URLSearchParams(data);
  //   return `admin/manage?${params}`;}, 

  // registerInvitedAdmin: ({ email, userId, expires, signature }) => {
  //   const params = new URLSearchParams({ email, userId, expires, signature });
  //   return `admin/manage?${params.toString()}`;  
  // },


  registerInvitedAdmin: () => "admin/manage/register",
  createAdmin: () => "admin/manage/create",
 
};