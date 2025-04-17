"use client";

import Header from "@/app/(admin)/components/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DiscountIcon,
  EstimatedOrderIcon,
  QuantityIcon,
  RefundIcon,
  ShippingIcon,
  SubTotalIcon,
  TaxIcon,
  TrackLocationIcon,
} from "../../../../../../../public/icons";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import DataTable from "./data-table";
import { useGetOrderInfo } from "@/services/orders";
import { useEffect, useState } from "react";
import { capitalizeFirstLetter, formatDate, formatDateTime } from "@/lib/utils";

export default function OrderDetails({ orderId }: { orderId: string }) {
  const {
    getOrderInfoData: data,
    getOrderInfoError,
    getOrderInfoIsLoading,
    refetchOrderInfo,
    setOrderInfoFilter,
  } = useGetOrderInfo();
  const [pageSize, setPageSize] = useState<string>("10");
  const [currentPage, setCurrentPage] = useState(1);
  const onPageChange = (page: number) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    setOrderInfoFilter(orderId);
  }, [orderId]);

  const status = "Active";
  console.log(data);
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-6">
          <Header
            title="Order Details"
            subtext="Manage orders"
            showBack={true}
          />
        </div>
        <div className="flex gap-4">
          <div className="flex-1">
            <Card className="mb-6">
              <CardContent className="py-8 px-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h6 className="mb-2 font-dmsans font-semibold text-base text-[#0B0B0B]">
                      Order#: {data?.id || "--"}
                    </h6>
                    <p className="text-[#A0AEC0] text-[10px] font-normal">
                      {formatDateTime(data?.createdAt)}
                    </p>
                  </div>
                  <Button
                    variant={"outline"}
                    className="font-bold text-base w-auto py-3 px-5 flex gap-2 items-center"
                    size={"xl"}
                  >
                    <RefundIcon />
                    Refund
                  </Button>
                </div>
                <h6 className="mb-4 font-dmsans font-semibold text-base text-[#0B0B0B]">
                  Order Progress
                </h6>
                <div className="flex gap-6 mb-6">
                  <div className="w-full">
                    <div
                      className={`h-[11px] mb-2 bg-[#0CAF60] rounded-[50px]`}
                    ></div>
                    <p className="text-[#A0AEC0] text-xs font-normal font-dmsans">
                      Order Confirming
                    </p>
                  </div>
                  <div className="w-full">
                    <div
                      className={`h-[11px] mb-2 bg-[#0CAF60] rounded-[50px]`}
                    ></div>
                    <p className="text-[#A0AEC0] text-xs font-normal font-dmsans">
                      Payment Pending
                    </p>
                  </div>
                  <div className="w-full">
                    <div
                      className={`h-[11px] mb-2 bg-[#E6BB20] rounded-[50px]`}
                    ></div>
                    <p className="text-[#A0AEC0] text-xs font-normal font-dmsans">
                      Processing
                    </p>
                  </div>
                  <div className="w-full">
                    <div
                      className={`h-[11px] mb-2 bg-[#EEF2F7] rounded-[50px]`}
                    ></div>
                    <p className="text-[#A0AEC0] text-xs font-normal font-dmsans">
                      Shipping
                    </p>
                  </div>
                  <div className="w-full">
                    <div
                      className={`h-[11px] mb-2 bg-[#EEF2F7] rounded-[50px]`}
                    ></div>
                    <p className="text-[#A0AEC0] text-xs font-normal font-dmsans">
                      Delivered
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="bg-[#F9F7F7] flex gap-1  py-2 px-2.5 rounded-lg">
                    <EstimatedOrderIcon />
                    <p className="text-[10px] font-bold text-[#656464]">
                      Estimated shipping date: 7th Feb, 2025
                    </p>
                  </div>
                  <Button
                    variant={"warning"}
                    className="font-bold text-base w-auto text-[#030C0A] py-4 px-6"
                    size={"xl"}
                  >
                    Track order
                    <TrackLocationIcon />
                  </Button>
                </div>
              </CardContent>
            </Card>
            <Card className="mb-6">
              <CardContent className="py-2 px-6">
                <h6 className="mb-4 font-bold text-2xl mb-4 text-[#0B0B0B]">
                  Order Timeline
                </h6>
                <div className="flex gap-4 items-start">
                  <div className="flex flex-col items-center justify-center">
                    <div className="bg-[#EEF2F7] h-6 w-6 rounded-full"></div>
                    <div className="bg-[#EEF2F7] w-[2px] h-[46px]"></div>
                  </div>
                  <div className="flex-1 flex justify-between items-center">
                    <div>
                      <h6 className="font-semibold text-xs text-[#111827]">
                        The packing has been started
                      </h6>
                      <p className="text-[#A0AEC0] text-[10px] font-normal">
                        Confirmed by BuyLocal Admin
                      </p>
                    </div>
                    <h6 className="font-semibold font-dmsans text-sm text-[#111827]">
                      7th, February 2024, 09:40 pm
                    </h6>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="flex flex-col items-center justify-center">
                    <div className="bg-[#EEF2F7] h-6 w-6 rounded-full"></div>
                    <div className="bg-[#EEF2F7] w-[2px] h-[46px]"></div>
                  </div>{" "}
                  <div className="flex-1 flex justify-between items-center">
                    <div>
                      <h6 className="font-semibold text-xs text-[#111827]">
                        The Invoice has been sent to the customer
                      </h6>
                      <p className="text-[#A0AEC0] text-[10px] font-normal mb-1">
                        Invoice email was sent to mirabelokoh@gmail.com
                      </p>
                      <Button
                        variant={"outline"}
                        className="font-bold text-[10px] text-[#718179] w-auto bg-[#EEF2F7] border-0 py-2 px-2.5 flex gap-2 items-center"
                        size={"xl"}
                      >
                        Resend Invoice
                      </Button>
                    </div>
                    <h6 className="font-semibold font-dmsans text-sm text-[#111827]">
                      7th, February 2024, 09:40 pm
                    </h6>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="flex flex-col items-center justify-center">
                    <div className="bg-[#EEF2F7] h-6 w-6 rounded-full"></div>
                    <div className="bg-[#EEF2F7] w-[2px] h-[46px]"></div>
                  </div>
                  <div className="flex-1 flex justify-between items-center">
                    <div>
                      <h6 className="font-semibold text-xs text-[#111827]">
                        The Invoice has been sent to the customer
                      </h6>
                      <p className="text-[#A0AEC0] text-[10px] font-normal mb-1">
                        Invoice email was sent to mirabelokoh@gmail.com
                      </p>
                      <Button
                        variant={"warning"}
                        className="font-bold text-[10px] text-[#333333] w-auto border-0 py-2 px-2.5 flex gap-2 items-center"
                        size={"xl"}
                      >
                        Download Invoice
                      </Button>
                    </div>
                    <h6 className="font-semibold font-dmsans text-sm text-[#111827]">
                      7th, February 2024, 09:40 pm
                    </h6>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="bg-[#EEF2F7] h-6 w-6 rounded-full"></div>
                  <div className="flex-1 flex justify-between items-center">
                    <div>
                      <h6 className="font-semibold text-xs text-[#111827]">
                        Order Payment Method
                      </h6>
                      <p className="text-[#A0AEC0] text-[10px] font-normal mb-1">
                        Master Card
                      </p>
                    </div>
                    <h6 className="font-semibold font-dmsans text-sm text-[#111827]">
                      7th, February 2024, 09:40 pm
                    </h6>
                  </div>
                </div>
              </CardContent>
            </Card>
            <DataTable
              data={data?.items}
              currentPage={currentPage}
              onPageChange={onPageChange}
              pageSize={Number(pageSize)}
              totalPages={40}
              setPageSize={setPageSize}
              loading={getOrderInfoIsLoading}
            />
          </div>
          <div className="w-[22.5rem]">
            <Card className="mb-4">
              <CardContent className="p-4">
                <div className="p-4 bg-[#FAFAFA]">
                  <p className="font-medium text-base text-[#687588]">
                    Order Summary
                  </p>
                </div>
                <div className="px-4 py-5 flex gap-3.5 border-b border-[#EEF2F7] items-center">
                  <QuantityIcon />
                  <p className="font-medium text-sm text-[#111827] me-auto">
                    Quantity:
                  </p>
                  <p className="font-medium text-sm text-[#111827]">1</p>
                </div>
                <div className="px-4 py-5 flex gap-3.5 border-b border-[#EEF2F7] items-center">
                  <SubTotalIcon />
                  <p className="font-medium text-sm text-[#111827] me-auto">
                    Sub Total:
                  </p>
                  <p className="font-medium text-sm text-[#111827]">₦77,000</p>
                </div>
                <div className="px-4 py-5 flex gap-3.5 border-b border-[#EEF2F7] items-center">
                  <TaxIcon />
                  <p className="font-medium text-sm text-[#111827] me-auto">
                    Tax:
                  </p>
                  <p className="font-medium text-sm text-[#111827]">5%</p>
                </div>
                <div className="px-4 py-5 flex gap-3.5 border-b border-[#EEF2F7] items-center">
                  <ShippingIcon />
                  <p className="font-medium text-sm text-[#111827] me-auto">
                    Shipping Fee:
                  </p>
                  <p className="font-medium text-sm text-[#111827]">
                    ₦{data?.totalPrice || 0}
                  </p>
                </div>
                <div className="px-4 py-5 flex gap-3.5 border-b border-[#EEF2F7] items-center">
                  <DiscountIcon />
                  <p className="font-medium text-sm text-[#111827] me-auto">
                    Discount:
                  </p>
                  <p className="font-medium text-sm text-[#111827]">-₦77,000</p>
                </div>
                <div className="px-4 py-5 flex gap-3.5 border-b border-[#EEF2F7] items-center">
                  <p className="font-medium text-sm text-[#111827] me-auto">
                    Total Amount:
                  </p>
                  <p className="font-medium text-sm text-[#111827]">
                    ₦83,620.00{" "}
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
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
                      Customer type:{" "}
                      {capitalizeFirstLetter(data?.user?.type || "---")}
                    </p>
                    <p className="text-[#687588] text-sm mb-6 text-center">
                      Customer Id: {data?.user?.id}
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
                    <div className="flex gap-10 justify-between items-center mb-4">
                      <p className="text-[#687588] font-normal text-base">
                        Email
                      </p>
                      <p className="font-semibold text-sm text-[#111827]">
                        {data?.user?.email || "----"}
                      </p>
                    </div>
                    <div className="flex gap-10 justify-between items-center mb-4">
                      <p className="text-[#687588] font-normal text-base">
                        Shopping address
                      </p>
                      <p className="font-semibold text-sm text-[#111827]">
                        09012345678
                      </p>
                    </div>
                    <div className="flex gap-10 justify-between items-center mb-4">
                      <p className="text-[#687588] font-normal text-base">
                        Phone number
                      </p>
                      <p className="font-semibold text-sm text-[#111827]">
                        {data?.user?.phoneNumber || "----"}
                      </p>
                    </div>
                    <div className="flex gap-10 justify-between items-center mb-4">
                      <p className="text-[#687588] font-normal text-base">
                        City
                      </p>
                      <p className="font-semibold text-sm text-[#111827]">
                        Lagos, Nigeria.
                      </p>
                    </div>
                    <div className="flex gap-10 justify-between items-center mb-4">
                      <p className="text-[#687588] font-normal text-base">
                        State/Province
                      </p>
                      <p className="font-semibold text-sm text-[#111827]">
                        Lagos, Nigeria.
                      </p>
                    </div>
                    <div className="flex justify-between gap-10 items-center mb-4">
                      <p className="text-[#687588] font-normal text-base">
                        Date joined
                      </p>
                      <p className="font-semibold text-sm text-[#111827]">
                        {formatDate(data?.user?.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
