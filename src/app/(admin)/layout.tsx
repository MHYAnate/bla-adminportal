"use client";

import { SidebarProvider } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import AdminSidebar from "./components/sidebar";
import Navbar from "./components/navbar";
import SimplifiedAdminGuard from "@/components/auth/EnhancedAdminGuard";
import { usePathname } from "next/navigation";

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // ✅ TEMP FIX: Skip guard for registration page
  if (pathname === '/admin/register') {
    return (
      <div className="min-h-screen">
        {children}
      </div>
    );
  }

  return (
    <SidebarProvider>
      <SimplifiedAdminGuard>
        <section className={cn("flex w-full")}>
          <AdminSidebar />
          <section className="flex-1">
            <Navbar />
            <section className="p-8 bg-[#F8F8F8]">{children}</section>
          </section>
        </section>
      </SimplifiedAdminGuard>
    </SidebarProvider>
  );
}