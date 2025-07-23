"use client"
import CreateRoleForm from "./role";
import { Suspense } from "react";
import LoadingSvg from "@/components/load";

export default function AdminsPage() {
  return (
    <Suspense fallback={<LoadingSvg/>}>
    <section>
      <CreateRoleForm />
    </section>
    </Suspense>
  );
  
}
