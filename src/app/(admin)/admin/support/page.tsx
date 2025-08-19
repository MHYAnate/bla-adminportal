"use client";

import React, { Suspense } from "react";
import LoadingSvg from "@/components/load";
import SupportPage from "./components";


export default function SupportManagementPage() {
  return (
    <Suspense fallback={<LoadingSvg />}>
      
      <section>
        <SupportPage />
      </section>
    </Suspense>
  );
}