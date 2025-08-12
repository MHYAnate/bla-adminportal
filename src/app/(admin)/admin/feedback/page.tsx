"use client";

import React, { Suspense } from "react";
import LoadingSvg from "@/components/load";
import FeedbackPage from "./components";

export default function FeedbackManagementPage() {
  return (
    <Suspense fallback={<LoadingSvg />}>
      <section>
        <FeedbackPage />
      </section>
    </Suspense>
  );
}
