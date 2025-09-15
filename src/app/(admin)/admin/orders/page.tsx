"use client";

import { Suspense, useEffect } from "react";
import Orders from "./components";
import { Card, CardContent } from "@/components/ui/card";
// import { OrdersErrorBoundary } from "@/components/error-boundary"; // Adjust path as needed



export default function OrdersPage() {
  return (
    // <>
    //   <Orders />
    // </>

    <section className="p-5">
     <Orders />
  </section>
  );
}
