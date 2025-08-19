"use client";
import CreateRoleForm from "./role";
import { Suspense } from "react";
import LoadingSvg from "@/components/load";

export default function CreateRolePage() {
  return (
    <Suspense fallback={<LoadingSvg />}>
      <section className="p-6">
        <CreateRoleForm />
      </section>
    </Suspense>
  );
}