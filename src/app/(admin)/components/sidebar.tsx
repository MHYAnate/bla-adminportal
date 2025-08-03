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
import { ChevronUp } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  DashboardIcon,
  NotificationIcon,
  SettingsIcon,
  OrderIcon,
} from "../../../../public/icons";
import { ROUTES } from "@/constant/routes";
import LogoutButton from "./logout";

const AdminSidebar: React.FC = () => {
  const path = usePathname();
  const router = useRouter();

  // Handle double click on Orders to navigate to main orders page
  const handleOrdersDoubleClick = () => {
    router.push(ROUTES.ADMIN.SIDEBAR.ORDERS);
  };

  // Check if current path is any orders-related page
  const isOrdersActive = path.startsWith(ROUTES.ADMIN.SIDEBAR.ORDERS);

  return (
    (path === "/admin/register" ? <></> :
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

              // Replace the existing mapping logic with this:
              {adminSidebarList.map((item) => {
                // Handle Orders with special collapsible behavior
                if (item.isCollapsible && item.subItems) {
                  return (
                    <SidebarMenu key={item.id} className="mb-6">
                      <Collapsible
                        defaultOpen={isOrdersActive}
                        className="group/collapsible"
                      >
                        <SidebarMenuItem>
                          <div className="flex items-center">
                            {/* Clickable main Orders item */}
                            <Link
                              href={item.href}
                              className={`flex-1 flex items-center gap-2 py-[17px] px-2 rounded-lg ${path === item.href
                                  ? "bg-warning text-[#FFEDEC]"
                                  : isOrdersActive
                                    ? "bg-warning text-[#FFEDEC]"
                                    : "text-[#111827]"
                                }`}
                            >
                              <span className={`${isOrdersActive ? "text-[#FFEDEC]" : "text-[#D0D0D0]"
                                }`}>
                                {item.icon}
                              </span>
                              <h5 className="text-sm font-bold">{item.sidebar}</h5>
                            </Link>

                            {/* Separate toggle button */}
                            <CollapsibleTrigger asChild>
                              <button className="p-2 hover:bg-gray-100 rounded ml-2">
                                <ChevronUp className="text-[#B4C8CB] w-4 h-4" />
                              </button>
                            </CollapsibleTrigger>
                          </div>

                          <CollapsibleContent>
                            <SidebarMenuSub className="pl-1">
                              {item.subItems.map((subItem) => (
                                <SidebarMenuSubItem key={subItem.id}>
                                  <Link
                                    href={subItem.href}
                                    className={`flex w-full items-center gap-2 rounded-lg py-[16px] px-[14px] text-base font-semibold ${path.startsWith(ROUTES.ADMIN.SIDEBAR.ORDERS) &&
                                        (typeof window !== 'undefined' &&
                                          new URLSearchParams(window.location.search).get('status') === subItem.href.split('status=')[1])
                                        ? "bg-warning text-[#FFEDEC]"
                                        : "text-[#111827]"
                                      }`}
                                  >
                                    {subItem.sidebar}
                                  </Link>
                                </SidebarMenuSubItem>
                              ))}
                            </SidebarMenuSub>
                          </CollapsibleContent>
                        </SidebarMenuItem>
                      </Collapsible>
                    </SidebarMenu>
                  );
                }

                // Handle items with regular child structure
                else if (item.child) {
                  return (
                    <SidebarMenu key={item.id} className="flex flex-col">
                      <Collapsible
                        defaultOpen={false}
                        className="group/collapsible"
                      >
                        <SidebarMenuItem>
                          <CollapsibleTrigger asChild>
                            <SidebarMenuButton className="flex w-full items-center gap-2 py-[17px]">
                              <span className="text-[#D0D0D0]">{item.icon}</span>
                              <h5 className="text-sm font-bold text-[#111827]">
                                {item.sidebar}
                              </h5>
                              <ChevronUp className="ml-auto text-[#B4C8CB]" />
                            </SidebarMenuButton>
                          </CollapsibleTrigger>
                          <CollapsibleContent>
                            <SidebarMenuSub className="pl-1">
                              {item.child.map((subItem, subIndex) => (
                                <SidebarMenuSubItem key={subIndex}>
                                  <Link
                                    href={subItem.href}
                                    className={`flex w-full items-center gap-2 rounded-lg py-[16px] px-[14px] text-base font-semibold ${path.startsWith(subItem.href)
                                        ? "bg-warning text-[#FFEDEC]"
                                        : "text-[#111827]"
                                      }`}
                                  >
                                    {subItem.sidebar}
                                  </Link>
                                </SidebarMenuSubItem>
                              ))}
                            </SidebarMenuSub>
                          </CollapsibleContent>
                        </SidebarMenuItem>
                      </Collapsible>
                    </SidebarMenu>
                  );
                }

                // Handle regular items (no children)
                else {
                  return (
                    <SidebarMenu key={item.id}>
                      <SidebarMenuItem
                        className={`mb-0 ${path.startsWith(item.href)
                            ? "rounded-lg bg-warning text-[#FFEDEC]"
                            : "text-[#111827]"
                          }`}
                      >
                        <SidebarMenuButton asChild className="p-0">
                          <Link
                            href={item.href}
                            className="flex w-full items-center gap-2 py-[17px]"
                          >
                            <span
                              className={`${path.startsWith(item?.href)
                                  ? "text-[#FFEDEC] ps-2"
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
                  );
                }
              })}

              <SidebarMenu className="mt-10">
                <SidebarMenuItem
                  className={`${path.startsWith(ROUTES.ADMIN.SIDEBAR.NOTIFICATIONS)
                    ? "rounded-lg bg-warning text-[#FFEDEC]"
                    : "text-[#111827]"
                    }`}
                >
                  <SidebarMenuButton asChild className="p-0">
                    <Link
                      href=""
                      className="flex w-full items-center gap-2 py-[17px]"
                    >
                      <span
                        className={`${path.startsWith(ROUTES.ADMIN.SIDEBAR.NOTIFICATIONS)
                          ? "text-[#FFEDEC]"
                          : "text-[#D0D0D0]"
                          }`}
                      >
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
                      className="flex w-full items-center gap-2 py-[17px]"
                    >
                      <span
                        className={`${path.startsWith(ROUTES.ADMIN.SIDEBAR.SETTINGS)
                          ? "text-[#FFEDEC]"
                          : "text-[#D0D0D0]"
                          }`}
                      >
                        <SettingsIcon />
                      </span>
                      <h5 className="text-sm font-bold">Setting</h5>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>

              <LogoutButton />
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>)
  );
};

export default AdminSidebar;