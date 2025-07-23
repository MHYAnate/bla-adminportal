"use client";

import Header from "@/app/(admin)/components/header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import {
  CallIcon,
  LocationIcon,
  MailIcon,
} from "../../../../../../../public/icons";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import General from "./general";
import Documents from "./documents";
import OrderHistory from "./order-history";
import { useSearchParams } from "next/navigation";
import { useHandlePush } from "@/hooks/use-handle-push";
import { ROUTES } from "@/constant/routes";
import { useGetCustomerInfo } from "@/services/customers";
import { useEffect, useState } from "react";
import { capitalizeFirstLetter, formatDate } from "@/lib/utils";


export default function CustomerDetail({ customerId }: { customerId: string }) {
  const [status, setStatus] = useState("")
  const param = useSearchParams();
  const tabber = param.get("tab");
  const { handlePush } = useHandlePush();
  const {
    getCustomerInfoData: data,
    setCustomerInfoFilter,
    getCustomerInfoIsLoading,
    refetchCustomerInfo,
  } = useGetCustomerInfo();
  const customer = "Individuals";
  // const status = "Active";
  console.log("customerDetail", data)
  const list = [
    {
      value: "general",
      text: "General",
    },
    // {
    //   value: "documents",
    //   text: "Documents",
    // },
    {
      value: "order-history",
      text: "Order History",
    },
  ];

  useEffect(() => {
    setCustomerInfoFilter(customerId);
   
  }, [customerId]);

  useEffect(() => {
    
    setStatus(data?.customerStatus);
    
  }, [data?.customerStatus]);

  const address = data?.addresses?.find((addr: { isDefault: any; }) => addr.isDefault) || data?.addresses?.[0];

  return (
    <div>
      <Header title="Customer information" showBack={true} />
      <div className="flex gap-6 mt-5">
        <Card className="w-[300px]">
          <CardContent className="p-6">
            <div>
              <div className="mb-6 pb-6 border-b border-[#F1F2F4] ">
                <div className="flex items-center justify-center mt-6">
                  <Image
                    height={100}
                    width={100}
                    alt="Customer avatar"
                    src="/images/user-avatar.jpg"
                    className="w-[100px] h-[100px] rounded-full object-cover"
                  />
                </div>
                <h6 className="text-center text-[#111827] text-xl mb-2.5">{data?.personalInfo?.fullName}</h6>
                <p className="text-[#687588] text-sm mb-2.5 text-center">
                {capitalizeFirstLetter(data?.customerType)}
                </p>
                {/* <p className="text-[#687588] text-sm mb-6 text-center">
                {data?.customerStatus}
                </p> */}
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
                    {status?.toUpperCase()}
                  </Badge>
                </div>
              </div>
              <div className="mb-6 pb-6 border-b border-[#F1F2F4]">
                <div className="flex gap-3 items-center mb-4">
                  <MailIcon />
                  <p className="font-semibold text-sm text-[#111827]">
                    {data?.email || "----"}
                  </p>
                </div>
                <div className="flex gap-3 items-center mb-4">
                  <CallIcon />
                  <p className="font-semibold text-sm text-[#111827]">
                    {data?.personalInfo?.phone}
                  </p>
                </div>
                <div className="flex gap-3 items-center mb-4">
                  <LocationIcon />
                  <p className="font-semibold text-sm text-[#111827]">
                    {`${address?.city}, ${address?.country}`}
                  </p>
                </div>
              </div>
              <div>
              <div>
                <p className="text-xs text-[#687588] mb-1">Referral Code</p>
                <p className="font-semibold text-sm text-[#111827] mb-4">
                  {data?.referralInfo?.referralCode}
                </p>
              </div>
              <div>
                <p className="text-xs text-[#687588] mb-1">Number of Referrals</p>
                <p className="font-semibold text-sm text-[#111827] mb-4">
                {data?.referralInfo?.totalReferrals}
                </p>
              </div>
              <div>
                <p className="text-xs text-[#687588] mb-1">Date Joined</p>
                <p className="font-semibold text-sm text-[#111827] mb-4">
                  {formatDate(data?.createdAt)}
                </p>
              </div>
              </div>
             
              {/* <div>
                <p className="text-xs text-[#687588] mb-1">Referral Code</p>
                <p className="font-semibold text-sm text-[#111827] mb-4">
                  W5FFO
                </p>
              </div>
              <div>
                <p className="text-xs text-[#687588] mb-1">
                  Number of Referrals
                </p>
                <p className="font-semibold text-sm text-[#111827] mb-4">45</p>
              </div> */}
              {/* <div>
                <p className="text-xs text-[#687588] mb-1">Language Selected</p>
                <p className="font-semibold text-sm text-[#111827] mb-4">
                  English
                </p>
              </div> */}
            </div>
          </CardContent>
        </Card>
        <Card className="flex-1">
          <CardContent className="p-6">
            <Tabs defaultValue={tabber || "general"}>
              <TabsList className="justify-start border-b w-full mb-6">
                {list.map((tab, index) => (
                  <TabsTrigger
                    value={tab.value}
                    key={index}
                    className={`w-2/12 flex-col pb-0 ${
                      customer.toLowerCase() === "individual" &&
                      tab.value === "documents"
                        ? "hidden"
                        : ""
                    }`}
                    onClick={() =>
                      handlePush(
                        `${ROUTES.ADMIN.SIDEBAR.CUSTOMERS}/${customerId}?tab=${tab.value}`
                      )
                    }
                  >
                    <p
                      className={`w-full text-center pb-[9px] ${
                        tabber === tab.value
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

              {/* <TabsContent value="documents">
                <Documents />
              </TabsContent> */}
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
