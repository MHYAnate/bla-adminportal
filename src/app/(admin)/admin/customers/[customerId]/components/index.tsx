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

const CustomerDetail: React.FC = () => {
  const param = useSearchParams();
  const tabber = param.get("tab");
  const { handlePush } = useHandlePush();
  const status = "Active";
  const list = [
    {
      value: "general",
      text: "General",
    },
    {
      value: "documents",
      text: "Documents",
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
              <div className="mb-6 pb-6 border-b border-[#F1F2F4] ">
                <div className="flex items-center justify-center mt-6">
                  <Image
                    height={100}
                    width={100}
                    alt="Customer avatar"
                    src="/images/bladmin-login.jpg"
                    className="w-[100px] h-[100px] rounded-full object-cover"
                  />
                </div>
                <h6 className="text-center text-[#111827] text-xl mb-2.5"></h6>
                <p className="text-[#687588] text-sm mb-2.5 text-center">
                  Business Owner
                </p>
                <p className="text-[#687588] text-sm mb-6 text-center">
                  @mirable_store
                </p>
                <div className="flex justify-center">
                  <Badge
                    variant={
                      status.toLowerCase() === "active"
                        ? "success"
                        : status.toLowerCase() === "pending"
                        ? "tertiary"
                        : "warning"
                    }
                    className="py-1 px-[26px] font-medium"
                  >
                    {status.toUpperCase()}
                  </Badge>
                </div>
              </div>
              <div className="mb-6 pb-6 border-b border-[#F1F2F4]">
                <div className="flex gap-3 items-center mb-4">
                  <MailIcon />
                  <p className="font-semibold text-sm text-[#111827]">
                    mirablestore@gmail.com
                  </p>
                </div>
                <div className="flex gap-3 items-center mb-4">
                  <CallIcon />
                  <p className="font-semibold text-sm text-[#111827]">
                    09012345678
                  </p>
                </div>
                <div className="flex gap-3 items-center mb-4">
                  <LocationIcon />
                  <p className="font-semibold text-sm text-[#111827]">
                    Lagos, Nigeria.
                  </p>
                </div>
              </div>
              <div>
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
              </div>
              <div>
                <p className="text-xs text-[#687588] mb-1">Language Selected</p>
                <p className="font-semibold text-sm text-[#111827] mb-4">
                  English
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="flex-1">
          <CardContent className="p-6">
            <Tabs defaultValue={tabber || "general"}>
              <TabsList className="justify-start rounded-[0.5rem] border-b w-full mb-6">
                {list.map((tab, index) => (
                  <TabsTrigger
                    value={tab.value}
                    key={index}
                    className="w-2/12 flex-col pb-0"
                    onClick={() =>
                      handlePush(
                        `${ROUTES.ADMIN.SIDEBAR.CUSTOMERS}/1?tab=${tab.value}`
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
                <General />
              </TabsContent>
              <TabsContent value="documents">
                <Documents />
              </TabsContent>
              <TabsContent value="order-history">
                <OrderHistory />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CustomerDetail;
