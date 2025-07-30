// utils/api-debug.js
import { routes } from "@/services/api-routes";

export const debugAPI = () => {
  console.log('=== API DEBUG INFO ===');
  console.log('Environment:', process.env.NODE_ENV);
  console.log('API Base URL:', process.env.NEXT_PUBLIC_API_URL);
  console.log('Login route:', routes.login());
  console.log('Full login URL would be:', `${process.env.NEXT_PUBLIC_API_URL}/${routes.login()}`);
  console.log('=====================');
};

// Call this in your login component to debug
export default debugAPI;