// types/window.d.ts
import { UserData } from '@/context/auth';

declare global {
  interface Window {
    // ✅ Auth context debugging
    auth?: {
      userData: UserData | null;
      isAuthenticated: boolean;
      forceRefreshUserData: () => Promise<void>;
      refreshTrigger: number;
    };

    // ✅ Permission checker debugging
    permissionChecker?: {
      userData: UserData | null;
      permissions: any[];
      roles: string[];
      isAuthenticated: boolean;
      isAdmin: () => boolean;
      isSuperAdmin: () => boolean;
      hasPermission: (permissionName: string, type?: 'read' | 'write') => boolean;
      hasRole: (roleName: string) => boolean;
      debugPermissions: () => void;
      forceRefresh: () => Promise<void>;
      refreshTrigger: number;
    };

    // ✅ Enhanced admin service debugging
    enhancedAdminService?: {
      updateAdminRoles: (adminId: any, rolesData: any) => Promise<any>;
      updateAdminPermissions: (adminId: any, permissionIds: any) => Promise<any>;
      assignRolesToAdmin: (adminId: any, roleIds: any) => Promise<any>;
      removeAdminRole: (adminId: any, roleId: any) => Promise<any>;
      bulkUpdateAdminRoles: (updates: any[]) => Promise<any>;
      getAdmin: (adminId: any) => Promise<any>;
      getAllAdmins: (params?: any) => Promise<any>;
      getAvailableRoles: () => Promise<any>;
      getAvailablePermissions: () => Promise<any>;
      triggerRoleChange: (adminId: any, newRoles?: any[]) => void;
      triggerCurrentUserRoleChange: () => void;
      triggerBulkRoleChange: (adminIds: any[]) => void;
    };

    // ✅ Role change utilities
    roleChangeUtils?: {
      triggerRoleChange: (adminId: any, newRoles?: any[]) => void;
      triggerCurrentUserRoleChange: () => void;
      triggerBulkRoleChange: (adminIds: any[]) => void;
    };

    // ✅ Admin hooks utilities
    adminHooksUtils?: {
      triggerRoleChangeEvent: (adminId: any, newRoles?: any[]) => void;
      emitRoleChangeEvent: (adminId: any, newRoles?: any[]) => void;
      testRoleUpdate: (adminId: any, newRoles: any[]) => Promise<void>;
      forceRefreshAllData: () => Promise<void>;
    };

    // ✅ File system API (if you're using it)
    fs?: {
      readFile: (filepath: string, options?: { encoding?: string }) => Promise<any>;
    };
  }
}

export {};