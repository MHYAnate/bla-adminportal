export const routes = {
  login: () => "auth/login",
  signup: () => "/api/user/register",
  forgotPassword: () => `auth/reset`,
  resetPassword: () => "auth/reset-password",
  confirmEmail: () => "/api/user/confirm-email",
  profile: () => "/api/user/info",
};
