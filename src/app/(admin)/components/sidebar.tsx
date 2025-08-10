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
import { usePathname } from "next/navigation";
import {
  DashboardIcon,
  NotificationIcon,
  SettingsIcon,
} from "../../../../public/icons";
import { ROUTES } from "@/constant/routes";
import LogoutButton from "./logout";
import { usePermissions } from "@/hooks/usePermissions";
import React from "react";

const PERMISSION_MAP: Record<string, string> = {
  // Admin Management
  [ROUTES.ADMIN.SIDEBAR.ADMINS]: 'view_users',
  [ROUTES.ADMIN.SIDEBAR.CUSTOMERS]: 'view_users',
  [ROUTES.ADMIN.SIDEBAR.INDIVIDUALS]: 'view_users',
  [ROUTES.ADMIN.SIDEBAR.BUSINNES]: 'view_users',

  // Product Management
  [ROUTES.ADMIN.SIDEBAR.PRODUCTS]: 'view_products',
  [ROUTES.ADMIN.SIDEBAR.CATEGORIES]: 'view_categories',
  [ROUTES.ADMIN.SIDEBAR.STOREMANAGEMENT]: 'view_products',
  [ROUTES.ADMIN.SIDEBAR.MANUFACTURERS]: 'view_manufacturers',
  [ROUTES.ADMIN.SIDEBAR.SUPPLYMANAGEMENTMANUFACTURERS]: 'view_manufacturers',
  [ROUTES.ADMIN.SIDEBAR.SUPPLYMANAGEMENTVENDORS]: 'view_manufacturers',

  // Order Management
  [ROUTES.ADMIN.SIDEBAR.ORDERS]: 'view_orders',
  [ROUTES.ADMIN.SIDEBAR.TRANSACTIONMANAGEMENT]: 'view_transactions',

  // Inventory
  [ROUTES.ADMIN.SIDEBAR.INVEMTORYMANAGEMENT]: 'inventory_read',

  // Reports & Analytics
  [ROUTES.ADMIN.SIDEBAR.CUSTOMERSREPORTS]: 'reports_read',
  [ROUTES.ADMIN.SIDEBAR.BUSINNESREPORTS]: 'reports_read',
  [ROUTES.ADMIN.SIDEBAR.FINANCIALREPORTS]: 'reports_read',

  // Support
  [ROUTES.ADMIN.SIDEBAR.FEEDBACK]: 'view_feedback',
  [ROUTES.ADMIN.SIDEBAR.SUPPORT]: 'support_read',

  // System
  [ROUTES.ADMIN.SIDEBAR.DASHBOARD]: 'analytics_read',
  [ROUTES.ADMIN.SIDEBAR.NOTIFICATIONS]: 'view_notifications',
  [ROUTES.ADMIN.SIDEBAR.SETTINGS]: 'analytics_read',
};

// ✅ Simple permission check function
const hasRouteAccess = (route: string, permissionChecker: any): boolean => {
  // Super admin has access to everything
  if (permissionChecker.isSuperAdmin()) {
    return true;
  }

  // Must be admin
  if (!permissionChecker.isAdmin()) {
    return false;
  }

  const requiredPermission = PERMISSION_MAP[route];
  if (!requiredPermission) {
    console.warn(`⚠️ No permission mapping found for route: ${route}`);
    return false;
  }

  // Check if user has the exact permission
  const hasAccess = permissionChecker.permissions?.some((p: any) =>
    p.name === requiredPermission
  ) || false;

  console.log(`${hasAccess ? '✅' : '❌'} Route access check: ${route} (${requiredPermission})`);
  return hasAccess;
};

// ✅ Filter sidebar items based on permissions
const getFilteredSidebarItems = (sidebarItems: any[], permissionChecker: any) => {
  if (!permissionChecker.isAuthenticated || !permissionChecker.isAdmin()) {
    return [];
  }

  if (permissionChecker.isSuperAdmin()) {
    return sidebarItems; // Super admin sees everything
  }

  return sidebarItems.filter(item => {
    // For items with children
    if (item.child && Array.isArray(item.child)) {
      const accessibleChildren = item.child.filter((child: any) =>
        hasRouteAccess(child.href, permissionChecker)
      );

      if (accessibleChildren.length > 0) {
        // Modify the item to only show accessible children
        item.child = accessibleChildren;
        return true;
      }
      return false;
    }

    // For single items
    if (item.href) {
      return hasRouteAccess(item.href, permissionChecker);
    }

    return false;
  });
};

const SimplePermissionSidebar: React.FC = () => {
  const path = usePathname();
  const permissionChecker = usePermissions();
  const [openItems, setOpenItems] = React.useState<Record<string, boolean>>({});
  const [refreshKey, setRefreshKey] = React.useState(0);

  // Listen for role changes
  React.useEffect(() => {
    const handleRoleChange = (event: Event) => {
      const customEvent = event as CustomEvent<{ adminId: string }>;
      const { adminId } = customEvent.detail;

      if (permissionChecker.userData && String(permissionChecker.userData.id) === String(adminId)) {
        console.log("🔄 Role changed - refreshing sidebar");
        setRefreshKey(prev => prev + 1);
      }
    };

    window.addEventListener('admin-role-changed', handleRoleChange as EventListener);
    return () => window.removeEventListener('admin-role-changed', handleRoleChange as EventListener);
  }, [permissionChecker.userData?.id]);

  // Calculate filtered sidebar items
  const filteredSidebarItems = React.useMemo(() => {
    console.log('🔄 Filtering sidebar items...');
    console.log('User permissions:', permissionChecker.permissions?.map((p: any) => p.name) || []);

    const filtered = getFilteredSidebarItems(adminSidebarList, permissionChecker);

    console.log(`✅ Filtered ${filtered.length}/${adminSidebarList.length} sidebar items`);
    return filtered;
  }, [
    permissionChecker.isAuthenticated,
    permissionChecker.userData,
    permissionChecker.permissions,
    permissionChecker.isAdmin(),
    permissionChecker.isSuperAdmin(),
    permissionChecker.refreshTrigger,
    refreshKey
  ]);

  // Don't show sidebar on register page
  if (path === "/admin/register") {
    return <></>;
  }

  // Loading state
  if (!permissionChecker.userData) {
    return (
      <Sidebar className="w-[280px]">
        <SidebarContent className={cn("bg-[#fff] py-6 px-8")}>
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-600"></div>
            <span className="ml-2 text-sm">Loading...</span>
          </div>
        </SidebarContent>
      </Sidebar>
    );
  }

  // Access restricted state
  if (!permissionChecker.isAdmin() && !permissionChecker.isSuperAdmin()) {
    return (
      <Sidebar className="w-[280px]">
        <SidebarContent className={cn("bg-[#fff] py-6 px-8")}>
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="text-sm text-gray-600">Access Restricted</div>
              <div className="text-xs text-gray-400 mt-1">Admin privileges required</div>
            </div>
          </div>
        </SidebarContent>
      </Sidebar>
    );
  }

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


            {/* Dashboard Menu Item */}
            {hasRouteAccess(ROUTES.ADMIN.SIDEBAR.DASHBOARD, permissionChecker) && (
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

            {/* Filtered Menu Items */}
            {filteredSidebarItems.map((item) =>
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
                          {item.child.map((subItem: any, subIndex: number) => (
                            <SidebarMenuSubItem key={subIndex}>
                              <Link
                                href={subItem.href}
                                className={`flex w-full items-center gap-2 rounded-lg py-[16px] px-5 text-base font-semibold ${path.startsWith(subItem.href)
                                  ? "bg-warning text-[#FFEDEC]"
                                  : "text-[#111827] hover:bg-gray-50"
                                  }`}
                                prefetch={false}
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

            {/* Show message if no items are available */}
            {filteredSidebarItems.length === 0 && (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded">
                <div className="text-yellow-800 font-bold mb-2">No Menu Items Available</div>
                <div className="text-xs text-yellow-700">
                  <div>Your current permissions don't allow access to any menu items.</div>
                  {process.env.NODE_ENV === 'development' && (
                    <div className="mt-2">
                      <div>Available permissions:</div>
                      <div className="bg-yellow-100 p-1 rounded text-xs max-h-20 overflow-y-auto">
                        {permissionChecker.permissions?.map((p: any, i: number) => (
                          <div key={i}>{p.name} ({p.type})</div>
                        )) || 'None'}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Notifications */}
            {hasRouteAccess(ROUTES.ADMIN.SIDEBAR.NOTIFICATIONS || '', permissionChecker) && (
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
            )}

            {/* Settings */}
            {hasRouteAccess(ROUTES.ADMIN.SIDEBAR.SETTINGS, permissionChecker) && (
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
            )}

            <LogoutButton />
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default SimplePermissionSidebar;