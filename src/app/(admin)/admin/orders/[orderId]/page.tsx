"use client";

import { useEffect } from "react";
import OrderDetails from "./components";
import { useGetOrderInfo } from "@/services/orders";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function OrderDetailsPage({
  params,
}: {
  params: { orderId: string };
}) {
  const router = useRouter();

  return (
    <section>
      <OrderDetails
        orderId={params.orderId}
        isModal={false} // Explicitly set to false for page context
      />
    </section>
  );
}
