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
};
