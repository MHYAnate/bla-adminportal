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
import { useState } from "react";
import { ChevronLeft } from "lucide-react";
import CreateCustomer from "./create-customer";
import { useGetCustomers } from "@/services/customers";

const Customers: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const {
    getCustomersData,
    refetchCustomers,
    getCustomersIsLoading,
    setCustomersFilter,
  } = useGetCustomers();

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
          <DataTable />
        </CardContent>
      </Card>
      <Dialog open={isOpen} onOpenChange={() => setIsOpen(!open)}>
        <DialogContent className="right-0 p-8 max-w-[47.56rem] h-screen overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="mb-6 text-2xl font-bold text-[#111827] flex gap-4.5 items-center">
              <div onClick={() => setIsOpen(false)} className="cursor-pointer">
                <ChevronLeft size={24} />
              </div>
              New Customer
            </DialogTitle>
          </DialogHeader>
          <CreateCustomer setClose={() => setIsOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Customers;
