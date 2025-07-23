"use client"

import { Suspense } from "react";
import LoadingSvg from "@/components/load";

export default function AdminsPage() {
  return (
    <Suspense fallback={<LoadingSvg/>}>
    <section>
    <> work in progress....<LoadingSvg/></>
    </section>
    </Suspense>
  );
  
}
