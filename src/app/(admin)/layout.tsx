import type { Metadata } from "next";
import { SidebarProvider } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import AdminSidebar from "./components/sidebar";
import Navbar from "./components/navbar";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default function SidebarLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      <section className={cn("flex w-full")}>
        <AdminSidebar />
        <section className="flex-1">
          <Navbar />
          <section className="p-8">{children}</section>
        </section>
      </section>
    </SidebarProvider>
  );
}
