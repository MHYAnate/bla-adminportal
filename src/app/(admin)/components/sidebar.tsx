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
import { usePathname} from "next/navigation";
import {
  DashboardIcon,
  NotificationIcon,
  SettingsIcon,
} from "../../../../public/icons";
import { ROUTES } from "@/constant/routes";
import LogoutButton from "./logout";

const AdminSidebar: React.FC = () => {
  const path = usePathname();
  



  return (
    (path === "/admin/register"?<></>: <Sidebar className="w-[280px]">
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
                className={`${
                  path.startsWith(ROUTES.ADMIN.SIDEBAR.DASHBOARD)
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
                      className={`${
                        path.startsWith(ROUTES.ADMIN.SIDEBAR.DASHBOARD)
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
            {adminSidebarList.map((item) =>
              item.child ? (
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
                                className={`flex w-full items-center gap-2 rounded-lg py-[16px] px-[14px] text-base font-semibold ${
                                  path.startsWith(subItem.href)
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
              ) : (
                <SidebarMenu key={item.id}>
                  <SidebarMenuItem
                    className={`mb-0 ${
                      path.startsWith(item.href)
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
                          className={`${
                            path.startsWith(item?.href)
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
              )
            )}
            <SidebarMenu className="mt-10">
              <SidebarMenuItem
                className={`${
                  path.startsWith(ROUTES.ADMIN.SIDEBAR.NOTIFICATIONS)
                    ? "rounded-lg bg-warning text-[#FFEDEC]"
                    : "text-[#111827]"
                }`}
              >
                <SidebarMenuButton asChild className="p-0">
                  <Link
                    href={""}
                    className="flex w-full items-center gap-2 py-[17px]"
                  >
                    <span
                      className={`${
                        path.startsWith(ROUTES.ADMIN.SIDEBAR.NOTIFICATIONS)
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
                className={`${
                  path.startsWith(ROUTES.ADMIN.SIDEBAR.SETTINGS)
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
                      className={`${
                        path.startsWith(ROUTES.ADMIN.SIDEBAR.SETTINGS)
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
            {/* <div className="flex items-center gap-2 py-2 pr-2 rounded cursor-pointer hover:bg-gray-100 transition"> <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 -0.5 25 25" fill="none">
<path d="M7.04401 9.53165C7.33763 9.23949 7.33881 8.76462 7.04665 8.47099C6.75449 8.17737 6.27962 8.17619 5.98599 8.46835L7.04401 9.53165ZM2.97099 11.4683C2.67737 11.7605 2.67619 12.2354 2.96835 12.529C3.26051 12.8226 3.73538 12.8238 4.02901 12.5317L2.97099 11.4683ZM4.02901 11.4683C3.73538 11.1762 3.26051 11.1774 2.96835 11.471C2.67619 11.7646 2.67737 12.2395 2.97099 12.5317L4.02901 11.4683ZM5.98599 15.5317C6.27962 15.8238 6.75449 15.8226 7.04665 15.529C7.33881 15.2354 7.33763 14.7605 7.04401 14.4683L5.98599 15.5317ZM3.5 11.25C3.08579 11.25 2.75 11.5858 2.75 12C2.75 12.4142 3.08579 12.75 3.5 12.75V11.25ZM17.5 12.75C17.9142 12.75 18.25 12.4142 18.25 12C18.25 11.5858 17.9142 11.25 17.5 11.25V12.75ZM5.98599 8.46835L2.97099 11.4683L4.02901 12.5317L7.04401 9.53165L5.98599 8.46835ZM2.97099 12.5317L5.98599 15.5317L7.04401 14.4683L4.02901 11.4683L2.97099 12.5317ZM3.5 12.75L17.5 12.75V11.25L3.5 11.25V12.75Z" fill="silver"/>
<path d="M9.5 15C9.5 17.2091 11.2909 19 13.5 19H17.5C19.7091 19 21.5 17.2091 21.5 15V9C21.5 6.79086 19.7091 5 17.5 5H13.5C11.2909 5 9.5 6.79086 9.5 9" stroke="silver" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg><p className="font-bold text-black">log out</p></div> */}
<LogoutButton/>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>)
   
  );
};
export default AdminSidebar;
