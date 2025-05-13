"use client"
import Admins from "./components";
import { Suspense } from "react";
import LoadingSvg from "@/components/load";

export default function AdminsPage() {
  return (
  	<Suspense fallback={<LoadingSvg/>}>
    <section>
      <Admins />
    </section>
    </Suspense>
  );
  
}
