"use client";

import { Button } from "@/components/ui/button";
import { ExportIcon } from "../../../../../../public/icons";
import Header from "@/app/(admin)/components/header";
import { Card, CardContent } from "@/components/ui/card";
import DataTable from "./data-table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { ChevronLeft } from "lucide-react";
import CreateCustomer from "./create-customer";
import { useGetCustomers } from "@/services/customers";
import { InputFilter } from "@/app/(admin)/components/input-filter";
import { SelectFilter } from "@/app/(admin)/components/select-filter";
import DeleteContent from "@/app/(admin)/components/delete-content";
import DatePickerWithRange from "@/components/ui/date-picker";

const Customers: React.FC = () => {
  const {
    getCustomersData: data,
    refetchCustomers,
    getCustomersIsLoading,
    setCustomersFilter,
  } = useGetCustomers();
  const [filter, setFilter] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [type, setType] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [pageSize, setPageSize] = useState<string>("10");
  const [currentPage, setCurrentPage] = useState(1);
  const [currentTab, setCurrentTab] = useState<string>("delete");
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);

  const onPageChange = (page: number) => {
    setCurrentPage(page);
  };
  const payload = {
    page: currentPage,
    pageSize,
    type,
    status,
    search: filter,
  };

  useEffect(() => {
    setCustomersFilter(payload);
  }, [filter, type, status, pageSize, currentPage]);

  const customerList = [
    {
      text: "Individual",
      value: "individual",
    },
    {
      text: "business",
      value: "business",
    },
  ];

  const kycList = [
    {
      text: "Verified",
      value: "verified",
    },
    {
      text: "Not Verified",
      value: "not verified",
    },
  ];

  return (
    <div>
      <Card className="bg-white">
        <CardContent className="p-6">
          <div className="flex justify-between mb-6">
            <Header
              title="Customers"
              subtext="Find all customers and their details."
            />
            <div className="flex gap-5">
              <Button
                variant={"outline"}
                className="font-bold text-base w-auto py-4 px-5 flex gap-2 items-center"
                size={"xl"}
              >
                <ExportIcon /> Download
              </Button>
            </div>
          </div>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-1/2 me-auto">
              <InputFilter setQuery={setFilter} />
            </div>
            <SelectFilter
              setFilter={setType}
              placeholder="Customer type"
              list={customerList}
            />
            <SelectFilter
              setFilter={setStatus}
              list={kycList}
              placeholder="Kyc status"
            />
            {/* <DatePickerWithRange
              setFromDate={setStartDate}
              setToDate={setEndDate}
            /> */}
          </div>
          <DataTable
            data={data?.data || []}
            currentPage={currentPage}
            onPageChange={onPageChange}
            pageSize={Number(pageSize)}
            totalPages={data?.pagination?.total || 0}
            setPageSize={setPageSize}
            handleDelete={() => {
              setIsOpen(true);
            }}
            isLoading={getCustomersIsLoading}
          />
        </CardContent>
      </Card>
      <Dialog open={isOpen} onOpenChange={() => setIsOpen(!open)}>
        <DialogContent
          className={`${
            currentTab === "delete"
              ? "max-w-[33.75rem] left-[50%] translate-x-[-50%]"
              : "right-0 p-8 max-w-[47.56rem] h-screen overflow-y-scroll"
          }`}
        >
          <DialogHeader>
            <DialogTitle className="mb-6 text-2xl font-bold text-[#111827] flex gap-4.5 items-center">
              Delete Customer
            </DialogTitle>
          </DialogHeader>
          {/* <CreateCustomer setClose={() => setIsOpen(false)} /> */}
          <DeleteContent
          isLoading={getCustomersIsLoading}
          handleClick={() => setIsOpen(false)}
            handleClose={() => setIsOpen(false)}
            title="Customer"
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Customers;
