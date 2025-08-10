"use client";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { adminSidebarList } from "@/constant";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  DashboardIcon,
  NotificationIcon,
  SettingsIcon,
} from "../../../../public/icons";
import { ROUTES } from "@/constant/routes";
import LogoutButton from "./logout";
import { usePermissions } from "@/hooks/usePermissions";
import { checkSidebarAccess } from "@/utils/sidebarPermissionChecker";
import React from "react";

// Enhanced permission mapping for each route
const ROUTE_TO_PERMISSION_MAP: Record<string, string> = {
  [ROUTES.ADMIN.SIDEBAR.DASHBOARD]: 'DASHBOARD',
  [ROUTES.ADMIN.SIDEBAR.ADMINS]: 'ADMIN_MANAGEMENT',
  [ROUTES.ADMIN.SIDEBAR.ROLES]: 'ADMIN_MANAGEMENT',
  [ROUTES.ADMIN.SIDEBAR.PERMISSIONS]: 'ADMIN_MANAGEMENT',
  [ROUTES.ADMIN.SIDEBAR.CUSTOMERS]: 'CUSTOMERS',
  [ROUTES.ADMIN.SIDEBAR.INDIVIDUALS]: 'CUSTOMERS',
  [ROUTES.ADMIN.SIDEBAR.BUSINNES]: 'CUSTOMERS',
  [ROUTES.ADMIN.SIDEBAR.PRODUCTS]: 'PRODUCTS',
  [ROUTES.ADMIN.SIDEBAR.CATEGORIES]: 'PRODUCTS',
  [ROUTES.ADMIN.SIDEBAR.MANUFACTURERS]: 'MANUFACTURERS',
  [ROUTES.ADMIN.SIDEBAR.SUPPLYMANAGEMENTMANUFACTURERS]: 'MANUFACTURERS',
  [ROUTES.ADMIN.SIDEBAR.SUPPLYMANAGEMENTVENDORS]: 'MANUFACTURERS',
  [ROUTES.ADMIN.SIDEBAR.ORDERS]: 'ORDERS',
  [ROUTES.ADMIN.SIDEBAR.CUSTOMERSREPORTS]: 'REPORTS',
  [ROUTES.ADMIN.SIDEBAR.BUSINNESREPORTS]: 'REPORTS',
  [ROUTES.ADMIN.SIDEBAR.FINANCIALREPORTS]: 'FINANCIAL_REPORTS',
  [ROUTES.ADMIN.SIDEBAR.STOREMANAGEMENT]: 'PRODUCTS',
  [ROUTES.ADMIN.SIDEBAR.INVEMTORYMANAGEMENT]: 'INVENTORY',
  [ROUTES.ADMIN.SIDEBAR.TRANSACTIONMANAGEMENT]: 'ORDERS',
  [ROUTES.ADMIN.SIDEBAR.FEEDBACK]: 'SUPPORT_FEEDBACK',
  [ROUTES.ADMIN.SIDEBAR.SUPPORT]: 'SUPPORT_FEEDBACK',
  [ROUTES.ADMIN.SIDEBAR.NOTIFICATIONS]: 'DASHBOARD', // Notifications typically tied to dashboard access
  [ROUTES.ADMIN.SIDEBAR.SETTINGS]: 'DASHBOARD', // Settings typically available to all admins
};

// Helper function to safely extract role names
const getRoleNames = (roles: any[]): string[] => {
  if (!Array.isArray(roles)) return [];
  return roles.map(userRole => {
    return userRole.role?.name || userRole.name || 'Unknown Role';
  }).filter(Boolean);
};

// Helper function to safely extract user role for display - IMPROVED
const getUserRoleDisplay = (userData: any): string => {
  if (!userData) return 'None';

  console.log('🔍 getUserRoleDisplay - Raw userData:', userData);

  // Check if role is a string (direct property)
  if (typeof userData.role === 'string') {
    console.log('✅ Found role as string:', userData.role);
    return userData.role;
  }

  // Check if role is an object with name property
  if (userData.role && typeof userData.role === 'object' && userData.role.name) {
    console.log('✅ Found role as object.name:', userData.role.name);
    return userData.role.name;
  }

  // Check if we have roles array and get the first role name
  if (Array.isArray(userData.roles) && userData.roles.length > 0) {
    const firstRole = userData.roles[0];
    const roleName = firstRole.role?.name || firstRole.name || 'Unknown';
    console.log('✅ Found role in roles array:', roleName);
    return roleName;
  }

  // ✅ NEW: Check if there's a type field (sometimes API returns role in 'type')
  if (typeof userData.type === 'string' && userData.type !== 'ADMIN') {
    console.log('✅ Found role in type field:', userData.type);
    return userData.type;
  }

  // ✅ NEW: Check adminProfile for role information
  if (userData.adminProfile?.role) {
    const adminRole = typeof userData.adminProfile.role === 'string'
      ? userData.adminProfile.role
      : userData.adminProfile.role.name;
    console.log('✅ Found role in adminProfile:', adminRole);
    return adminRole;
  }

  // ✅ NEW: Fallback - if user has adminProfile but no explicit role, assume ADMIN
  if (userData.adminProfile && userData.type === 'ADMIN') {
    console.log('✅ Fallback: User has adminProfile, assuming ADMIN role');
    return 'ADMIN';
  }

  console.log('❌ No role found, defaulting to None');
  return 'None';
};

// Enhanced function to check if user can access a specific sidebar item
const canAccessSidebarItem = (item: any, permissionChecker: any): boolean => {
  console.log(`🔍 Checking item access for: ${item.sidebar}`, {
    isSuperAdmin: permissionChecker.isSuperAdmin(),
    isAdmin: permissionChecker.isAdmin(),
    userData: permissionChecker.userData
  });

  // Super admin always has access - with extra debugging
  if (permissionChecker.isSuperAdmin()) {
    console.log(`✅ Super admin has access to: ${item.sidebar}`);
    return true;
  }

  // If item has children, check if user has access to any child
  if (item.child && Array.isArray(item.child)) {
    const hasChildAccess = item.child.some((child: any) => {
      const permissionKey = ROUTE_TO_PERMISSION_MAP[child.href];
      if (!permissionKey) {
        console.log(`⚠️ No permission key found for child route: ${child.href}`);
        return false;
      }
      const access = checkSidebarAccess(permissionKey, permissionChecker);
      console.log(`Child ${child.sidebar} (${permissionKey}): ${access ? '✅' : '❌'}`);
      return access;
    });
    console.log(`Parent ${item.sidebar} has child access: ${hasChildAccess}`);
    return hasChildAccess;
  }

  // For single items, check direct permission
  if (item.href) {
    const permissionKey = ROUTE_TO_PERMISSION_MAP[item.href];
    if (!permissionKey) {
      console.log(`⚠️ No permission key found for route: ${item.href}`);
      return false;
    }
    const access = checkSidebarAccess(permissionKey, permissionChecker);
    console.log(`Single item ${item.sidebar} (${permissionKey}): ${access ? '✅' : '❌'}`);
    return access;
  }

  console.log(`❌ No access rule found for item: ${item.sidebar}`);
  return false;
};

// Enhanced function to filter children based on permissions
const getFilteredChildren = (children: any[], permissionChecker: any): any[] => {
  if (!Array.isArray(children)) return [];

  return children.filter(child => {
    const permissionKey = ROUTE_TO_PERMISSION_MAP[child.href];
    return permissionKey ? checkSidebarAccess(permissionKey, permissionChecker) : false;
  });
};

// Main filtering function with enhanced permission checking
const getFilteredSidebarList = (permissionChecker: any) => {
  const userRole = getUserRoleDisplay(permissionChecker.userData);

  console.log('🔍 BULLETPROOF sidebar filtering:', {
    hasUserData: !!permissionChecker.userData,
    userId: permissionChecker.userData?.id,
    userRole: userRole,
    userType: permissionChecker.userData?.type,
    isAdmin: permissionChecker.isAdmin(),
    isSuperAdmin: permissionChecker.isSuperAdmin(),
    hasAdminProfile: !!permissionChecker.userData?.adminProfile
  });

  // Must have user data
  if (!permissionChecker.userData) {
    console.log('❌ No user data - showing no items');
    return [];
  }

  // ✅ SUPER ADMIN BYPASS
  if (permissionChecker.isSuperAdmin() || userRole === 'SUPER_ADMIN') {
    console.log('✅ SUPER ADMIN DETECTED - Showing all sidebar items');
    return adminSidebarList;
  }

  // ✅ ADMIN ACCESS CHECK - More permissive
  const hasAdminAccess = permissionChecker.isAdmin() ||
    permissionChecker.userData?.adminProfile ||
    permissionChecker.userData?.type === 'ADMIN' ||
    ['ADMIN', 'PRODUCT_MANAGER', 'ORDER_MANAGER', 'CUSTOMER_MANAGER', 'INVENTORY_MANAGER', 'SUPPORT_AGENT'].includes(userRole);

  if (!hasAdminAccess) {
    console.log('❌ No admin access - showing no items');
    return [];
  }

  // ✅ ROLE-BASED FILTERING - Show everything for now, can restrict later
  console.log(`✅ User ${userRole} has admin access - showing relevant items`);

  // For development/deadline - show all items to admin users, filter later
  if (userRole === 'None' && permissionChecker.userData?.adminProfile) {
    console.log('✅ Admin profile detected, showing all items');
    return adminSidebarList;
  }

  // Simple role-based filtering
  const filteredList = adminSidebarList.filter(item => {
    const itemName = item.sidebar?.toLowerCase() || '';

    switch (userRole) {
      case 'PRODUCT_MANAGER':
        return itemName.includes('product') || itemName.includes('manufacturer') ||
          itemName.includes('report') || itemName.includes('order') ||
          itemName.includes('inventor'); // Show inventory management
      case 'ORDER_MANAGER':
        return itemName.includes('order') || itemName.includes('report') ||
          itemName.includes('customer') || itemName.includes('transaction');
      case 'CUSTOMER_MANAGER':
        return itemName.includes('customer') || itemName.includes('report') ||
          itemName.includes('support');
      case 'INVENTORY_MANAGER':
        return itemName.includes('inventory') || itemName.includes('product') ||
          itemName.includes('report') || itemName.includes('manufacturer');
      case 'SUPPORT_AGENT':
        return itemName.includes('support') || itemName.includes('feedback') ||
          itemName.includes('customer');
      case 'ADMIN':
      case 'None': // Fallback for admin users without clear role
      default:
        return true; // Show everything for admin/unknown roles
    }
  });

  console.log(`✅ Role ${userRole} gets ${filteredList.length} sidebar items:`, filteredList.map(item => item.sidebar));
  return filteredList;
};

const AdminSidebar: React.FC = () => {
  // ✅ ALL HOOKS MUST BE AT THE TOP - BEFORE ANY EARLY RETURNS OR CONDITIONAL LOGIC
  const path = usePathname();
  const router = useRouter();
  const permissionChecker = usePermissions();
  const [openItems, setOpenItems] = React.useState<Record<string, boolean>>({});

  // ✅ ALL useMemo hooks at the top
  const filteredSidebarList = React.useMemo(() => {
    return getFilteredSidebarList(permissionChecker);
  }, [
    permissionChecker.isAuthenticated,
    permissionChecker.userData,
    permissionChecker.isAdmin(),
    permissionChecker.isSuperAdmin()
  ]);

  const hasDashboardAccess = React.useMemo(() =>
    checkSidebarAccess('DASHBOARD', permissionChecker),
    [permissionChecker.isAuthenticated, permissionChecker.userData]
  );

  const hasNotificationAccess = React.useMemo(() =>
    checkSidebarAccess('DASHBOARD', permissionChecker),
    [permissionChecker.isAuthenticated, permissionChecker.userData]
  );

  const hasSettingsAccess = React.useMemo(() =>
    checkSidebarAccess('DASHBOARD', permissionChecker),
    [permissionChecker.isAuthenticated, permissionChecker.userData]
  );

  // ✅ ALL useEffect hooks at the top
  React.useEffect(() => {
    permissionChecker.debugPermissions();
  }, [permissionChecker]);

  React.useEffect(() => {
    console.log('🔄 Auth state changed, sidebar will re-render:', {
      isAuthenticated: permissionChecker.isAuthenticated,
      userData: !!permissionChecker.userData,
      userRole: getUserRoleDisplay(permissionChecker.userData)
    });
  }, [
    permissionChecker.isAuthenticated,
    permissionChecker.userData
  ]);

  // ✅ NOW safe to have early returns after all hooks are declared

  // Don't show sidebar on register page
  if (path === "/admin/register") {
    return <></>;
  }

  // Show loading state while user data is being determined
  if (!permissionChecker.userData) {
    console.log('🔄 No userData, showing loading...');
    return (
      <Sidebar className="w-[280px]">
        <SidebarContent className={cn("bg-[#fff] py-6 px-8")}>
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-600"></div>
          </div>
        </SidebarContent>
      </Sidebar>
    );
  }

  // ✅ BETTER: Wait for role data to be properly loaded
  const userRole = getUserRoleDisplay(permissionChecker.userData);
  if (userRole === 'None' && permissionChecker.userData.type !== 'ADMIN') {
    console.log('⚠️ User data exists but role not properly loaded, showing loading...');
    return (
      <Sidebar className="w-[280px]">
        <SidebarContent className={cn("bg-[#fff] py-6 px-8")}>
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-600"></div>
            <span className="ml-2 text-sm">Loading permissions...</span>
          </div>
        </SidebarContent>
      </Sidebar>
    );
  }

  console.log('🔍 Final Enhanced Filtered Sidebar List:', filteredSidebarList.length, 'items');

  const toggleItem = (itemId: string | number) => {
    const key = String(itemId);
    setOpenItems(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const isParentActive = (item: any) => {
    if (!item.child) return false;
    return item.child.some((child: any) => path.startsWith(child.href));
  };

  const getItemKey = (itemId: string | number): string => String(itemId);

  return (
    <Sidebar className="w-[280px]">
      <SidebarContent className={cn("bg-[#fff] py-6 px-8")}>
        <SidebarGroup>
          <SidebarGroupLabel className="mb-6">
            <div className="mb-6">
              <Image
                alt="Company logo"
                src="/images/logo.png"
                width={76}
                height={48}
              />
            </div>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            {/* Dashboard Menu Item - Show for all admin users */}
            {permissionChecker.userData && (
              hasDashboardAccess ||
              permissionChecker.isAdmin() ||
              permissionChecker.isSuperAdmin() ||
              permissionChecker.userData?.adminProfile ||
              permissionChecker.userData?.type === 'ADMIN'
            ) && (
                <SidebarMenu className="mb-6">
                  <SidebarMenuItem
                    className={`${path.startsWith(ROUTES.ADMIN.SIDEBAR.DASHBOARD)
                      ? "rounded-lg bg-warning text-[#FFEDEC]"
                      : "text-[#111827]"
                      }`}
                  >
                    <SidebarMenuButton asChild className="p-0">
                      <Link
                        href={ROUTES.ADMIN.SIDEBAR.DASHBOARD}
                        className="flex w-full items-center justify-between gap-2 py-[17px] px-5"
                        prefetch={false}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          try {
                            router.push(ROUTES.ADMIN.SIDEBAR.DASHBOARD);
                          } catch (error) {
                            console.error('Router push failed:', error);
                            window.location.href = ROUTES.ADMIN.SIDEBAR.DASHBOARD;
                          }
                        }}
                      >
                        <h5 className="text-sm font-bold">Dashboard</h5>
                        <span
                          className={`${path.startsWith(ROUTES.ADMIN.SIDEBAR.DASHBOARD)
                            ? "text-[#FFEDEC]"
                            : "text-[#D0D0D0]"
                            }`}
                        >
                          <DashboardIcon />
                        </span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              )}

            {/* Enhanced Filtered Menu Items */}
            {filteredSidebarList.map((item) =>
              item.child ? (
                // Menu items with children (collapsible)
                <SidebarMenu key={item.id} className="flex flex-col mb-1">
                  <Collapsible
                    open={openItems[getItemKey(item.id)] || isParentActive(item)}
                    onOpenChange={() => toggleItem(item.id)}
                    className="group/collapsible"
                  >
                    <SidebarMenuItem>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton
                          className={cn(
                            "flex w-full items-center gap-2 py-[17px] px-5 justify-between rounded-lg",
                            isParentActive(item)
                              ? "bg-warning text-[#FFEDEC]"
                              : "text-[#111827] hover:bg-gray-50"
                          )}
                        >
                          <div className="flex items-center gap-2">
                            <span
                              className={isParentActive(item) ? "text-[#FFEDEC]" : "text-[#D0D0D0]"}
                            >
                              {item.icon}
                            </span>
                            <h5 className="text-sm font-bold">
                              {item.sidebar}
                            </h5>
                          </div>
                          <ChevronRight
                            className={cn(
                              "h-4 w-4 transition-transform duration-200",
                              isParentActive(item) ? "text-[#FFEDEC]" : "text-[#B4C8CB]",
                              (openItems[getItemKey(item.id)] || isParentActive(item)) && "rotate-90"
                            )}
                          />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub className="pl-0 mt-1">
                          {item.child.map((subItem, subIndex) => (
                            <SidebarMenuSubItem key={subIndex}>
                              <Link
                                href={subItem.href}
                                className={`flex w-full items-center gap-2 rounded-lg py-[16px] px-5 text-base font-semibold ${path.startsWith(subItem.href)
                                  ? "bg-warning text-[#FFEDEC]"
                                  : "text-[#111827] hover:bg-gray-50"
                                  }`}
                                prefetch={false}
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  try {
                                    router.push(subItem.href);
                                  } catch (error) {
                                    console.error('Router push failed:', error);
                                    window.location.href = subItem.href;
                                  }
                                }}
                              >
                                <span className={cn(
                                  "w-1.5 h-1.5 rounded-full",
                                  path.startsWith(subItem.href)
                                    ? "bg-[#FFEDEC]"
                                    : "bg-[#D0D0D0]"
                                )} />
                                {subItem.sidebar}
                              </Link>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </SidebarMenuItem>
                  </Collapsible>
                </SidebarMenu>
              ) : (
                // Single menu items
                <SidebarMenu key={item.id} className="mb-1">
                  <SidebarMenuItem
                    className={`${path.startsWith(item.href || '')
                      ? "rounded-lg bg-warning text-[#FFEDEC]"
                      : "text-[#111827]"
                      }`}
                  >
                    <SidebarMenuButton asChild className="p-0">
                      <Link
                        href={item.href || '#'}
                        className="flex w-full items-center gap-2 py-[17px] px-5 hover:bg-gray-50 rounded-lg"
                        prefetch={false}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          if (item.href) {
                            try {
                              router.push(item.href);
                            } catch (error) {
                              console.error('Router push failed:', error);
                              window.location.href = item.href;
                            }
                          }
                        }}
                      >
                        <span
                          className={`${path.startsWith(item.href || '')
                            ? "text-[#FFEDEC]"
                            : "text-[#D0D0D0]"
                            }`}
                        >
                          {item.icon}
                        </span>
                        <h5 className="text-sm font-bold">{item.sidebar}</h5>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              )
            )}

            {/* Notifications and Settings - Show for all admin users */}
            {permissionChecker.userData && (
              hasNotificationAccess ||
              permissionChecker.isAdmin() ||
              permissionChecker.isSuperAdmin() ||
              permissionChecker.userData?.adminProfile ||
              permissionChecker.userData?.type === 'ADMIN'
            ) && (
                <>
                  <SidebarMenu className="mt-10">
                    <SidebarMenuItem
                      className={`${path.startsWith(ROUTES.ADMIN.SIDEBAR.NOTIFICATIONS || '')
                        ? "rounded-lg bg-warning text-[#FFEDEC]"
                        : "text-[#111827]"
                        }`}
                    >
                      <SidebarMenuButton asChild className="p-0">
                        <Link
                          href={ROUTES.ADMIN.SIDEBAR.NOTIFICATIONS || "#"}
                          className="flex w-full items-center gap-2 py-[17px] px-5 hover:bg-gray-50 rounded-lg"
                          prefetch={false}
                        >
                          <span className={`${path.startsWith(ROUTES.ADMIN.SIDEBAR.NOTIFICATIONS || '')
                            ? "text-[#FFEDEC]"
                            : "text-[#D0D0D0]"
                            }`}>
                            <NotificationIcon />
                          </span>
                          <h5 className="text-sm font-bold">Notification</h5>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </SidebarMenu>

                  <SidebarMenu>
                    <SidebarMenuItem
                      className={`${path.startsWith(ROUTES.ADMIN.SIDEBAR.SETTINGS)
                        ? "rounded-lg bg-warning text-[#FFEDEC]"
                        : "text-[#111827]"
                        }`}
                    >
                      <SidebarMenuButton asChild className="p-0">
                        <Link
                          href={`${ROUTES.ADMIN.SIDEBAR.SETTINGS}?tab=general`}
                          className="flex w-full items-center gap-2 py-[17px] px-5 hover:bg-gray-50 rounded-lg"
                          prefetch={false}
                        >
                          <span className={`${path.startsWith(ROUTES.ADMIN.SIDEBAR.SETTINGS)
                            ? "text-[#FFEDEC]"
                            : "text-[#D0D0D0]"
                            }`}>
                            <SettingsIcon />
                          </span>
                          <h5 className="text-sm font-bold">Setting</h5>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </SidebarMenu>
                </>
              )}

            <LogoutButton />
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default AdminSidebar;