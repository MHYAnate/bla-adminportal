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
};
