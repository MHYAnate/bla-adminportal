"use client";

import React, { Suspense } from "react";
import LoadingSvg from "@/components/load";
import Feedbacks from "./components";

export default function FeedbackManagementPage() {
  return (
    <Suspense fallback={<LoadingSvg />}>
      <section>
        <Feedbacks />
      </section>
    </Suspense>
  );
}
