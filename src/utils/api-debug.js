// utils/api-debug.js
import { routes } from "@/services/api-routes";

export const debugAPI = () => {
  const loginRoute = routes.login();
  const baseURL = process.env.NEXT_PUBLIC_API_URL;
  
  console.log('=== API DEBUG INFO ===');
  console.log('Environment:', process.env.NODE_ENV);
  console.log('API Base URL:', baseURL);
  console.log('API Base URL type:', typeof baseURL);
  console.log('API Base URL ends with slash:', baseURL?.endsWith('/'));
  console.log('Login route:', loginRoute);
  console.log('Login route type:', typeof loginRoute);
  console.log('Login route starts with slash:', loginRoute?.startsWith('/'));
  console.log('Manual URL construction:', `${baseURL}/${loginRoute}`);
  console.log('=====================');
  
  // Also log all environment variables that start with NEXT_PUBLIC
  console.log('All NEXT_PUBLIC env vars:');
  Object.keys(process.env).forEach(key => {
    if (key.startsWith('NEXT_PUBLIC')) {
      console.log(`${key}:`, process.env[key]);
    }
  });
};

// Call this in your login component to debug
export default debugAPI;