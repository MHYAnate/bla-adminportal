"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useHandlePush } from "@/hooks/use-handle-push";
import { ROUTES } from "@/constant/routes";
import { useGetCustomerInfo } from "@/services/customers";
import { capitalizeFirstLetter, formatDate } from "@/lib/utils";

// Import your UI components
import Header from "@/app/(admin)/components/header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { CallIcon, LocationIcon, MailIcon } from "../../../../../../../public/icons";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import General from "./general";
import Documents from "./documents";
import OrderHistory from "./order-history";

interface CustomerDetailProps {
  customerId: string;
}

export default function CustomerDetail({ customerId }: CustomerDetailProps) {
  // ✅ ALL HOOKS MUST BE AT THE TOP - NO CONDITIONAL HOOKS
  const [status, setStatus] = useState("");
  const param = useSearchParams();
  const { handlePush } = useHandlePush();

  const {
    getCustomerInfoData: data,
    setCustomerInfoFilter,
    getCustomerInfoIsLoading,
    getCustomerInfoError,
    refetchCustomerInfo,
  } = useGetCustomerInfo();

  // ✅ ALWAYS call useEffect hooks in the same order
  useEffect(() => {
    console.log("🎬 CustomerDetail mounted with customerId:", customerId);
    if (customerId) {
      setCustomerInfoFilter(customerId);
    }
  }, [customerId, setCustomerInfoFilter]);

  useEffect(() => {
    if (data?.customerStatus) {
      setStatus(data.customerStatus);
    }
  }, [data?.customerStatus]);

  // ✅ Process tab value safely
  const tabber = param.get("tab") || "general";

  console.log("🔍 CustomerDetail Debug:", {
    customerId,
    data,
    loading: getCustomerInfoIsLoading,
    error: getCustomerInfoError
  });

  // ✅ Early returns AFTER all hooks are declared
  if (getCustomerInfoIsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4">Loading customer information...</p>
        </div>
      </div>
    );
  }

  if (getCustomerInfoError) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center text-red-600">
          <p className="text-lg font-semibold">Error loading customer</p>
          <p className="text-sm">{getCustomerInfoError}</p>
          <button
            onClick={() => refetchCustomerInfo()}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!data && !getCustomerInfoIsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-lg font-semibold text-gray-600">Customer not found</p>
          <p className="text-sm text-gray-500">Customer ID: {customerId}</p>
          <button
            onClick={() => refetchCustomerInfo()}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // ✅ Safe data processing
  const address = data?.addresses?.find((addr: any) => addr.isDefault) || data?.addresses?.[0];

  const list = [
    {
      value: "general",
      text: "General",
    },
    {
      value: "order-history",
      text: "Order History",
    },
  ];

  return (
    <div>
      <Header title="Customer information" showBack={true} />
      <div className="flex gap-6 mt-5">
        <Card className="w-[300px]">
          <CardContent className="p-6">
            <div>
              <div className="mb-6 pb-6 border-b border-[#F1F2F4]">
                <div className="flex items-center justify-center mt-6">
                  <Image
                    height={100}
                    width={100}
                    alt="Customer avatar"
                    src="/images/user-avatar.jpg"
                    className="w-[100px] h-[100px] rounded-full object-cover"
                  />
                </div>
                <h6 className="text-center text-[#111827] text-xl mb-2.5">
                  {data?.personalInfo?.fullName || "Unknown Customer"}
                </h6>
                <p className="text-[#687588] text-sm mb-2.5 text-center">
                  {capitalizeFirstLetter(data?.customerType || "")}
                </p>
                <div className="flex justify-center">
                  <Badge
                    variant={
                      status?.toLowerCase() === "active"
                        ? "success"
                        : status?.toLowerCase() === "pending"
                          ? "tertiary"
                          : "warning"
                    }
                    className="py-1 px-[26px] font-medium"
                  >
                    {status?.toUpperCase() || "UNKNOWN"}
                  </Badge>
                </div>
              </div>

              <div className="mb-6 pb-6 border-b border-[#F1F2F4] px-auto">
                <div className="flex gap-3 items-start mb-4">
                  <div className="flex-shrink-0 mt-0.5">
                    <MailIcon />
                  </div>
                  <p className="font-semibold text-sm text-[#111827] break-words flex-1 min-w-0">
                    {data?.email || "----"}
                  </p>
                </div>
                <div className="flex gap-3 items-center mb-4">
                  <div className="flex-shrink-0">
                    <CallIcon />
                  </div>
                  <p className="font-semibold text-sm text-[#111827] break-words flex-1 min-w-0">
                    {data?.personalInfo?.phone || "----"}
                  </p>
                </div>
                <div className="flex gap-3 items-center mb-4">
                  <div className="flex-shrink-0">
                    <LocationIcon />
                  </div>
                  <p className="font-semibold text-sm text-[#111827] break-words flex-1 min-w-0">
                    {address ? `${address.city}, ${address.country}` : "----"}
                  </p>
                </div>
              </div>

              <div>
                <div>
                  <p className="text-xs text-[#687588] mb-1">Referral Code</p>
                  <p className="font-semibold text-sm text-[#111827] mb-4">
                    {data?.referralInfo?.referralCode || "----"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-[#687588] mb-1">Number of Referrals</p>
                  <p className="font-semibold text-sm text-[#111827] mb-4">
                    {data?.referralInfo?.totalReferrals || 0}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-[#687588] mb-1">Date Joined</p>
                  <p className="font-semibold text-sm text-[#111827] mb-4">
                    {data?.createdAt ? formatDate(data.createdAt) : "----"}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="flex-1">
          <CardContent className="p-6">
            <Tabs defaultValue={tabber}>
              <TabsList className="justify-start border-b w-full mb-6">
                {list.map((tab, index) => (
                  <TabsTrigger
                    value={tab.value}
                    key={index}
                    className="w-2/12 flex-col pb-0"
                    onClick={() =>
                      handlePush(
                        `${ROUTES.ADMIN.SIDEBAR.CUSTOMERS}/${customerId}?tab=${tab.value}`
                      )
                    }
                  >
                    <p
                      className={`w-full text-center pb-[9px] ${tabber === tab.value
                          ? "border-b-2 border-[#EC9F01] text-[#030C0A]"
                          : "border-b-2 border-transparent text-[#111827]"
                        }`}
                    >
                      {tab.text}
                    </p>
                  </TabsTrigger>
                ))}
              </TabsList>

              <TabsContent value="general">
                <General data={data} />
              </TabsContent>

              <TabsContent value="order-history">
                <OrderHistory customerId={customerId} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}