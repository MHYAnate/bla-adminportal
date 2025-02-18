"use client";

import Header from "@/app/(admin)/components/header";
import { Card, CardContent } from "@/components/ui/card";
import DataTable from "./datatable";
import { Button } from "@/components/ui/button";
import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ChevronLeft } from "lucide-react";
import AddVendor from "./add-vendor";

const Vendors: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const item = {
    isActive: true,
    url: "/images/bladmin-login.jpg",
    total: "6,700",
    status: "Verified",
    name: "Mutiu",
    email: "mutiu@gmail.com",
    location: "Lagos, Nigeria",
    id: "1122-5",
    phonenumber: "+2349011223321",
  };
  return (
    <div>
      <Card>
        <CardContent className="p-4 ">
          <div className="flex justify-between items-center mb-6">
            <Header title="Vendors" subtext="Manage Vendors" />
            <Button
              variant={"outline"}
              className="font-bold text-base w-auto py-4 px-6"
              size={"xl"}
              onClick={() => setIsOpen(true)}
            >
              + Add New Vendor
            </Button>
          </div>
          <DataTable />
          <Dialog open={isOpen} onOpenChange={() => setIsOpen(!open)}>
            <DialogContent className="right-0 p-8 max-w-[47.56rem] h-screen overflow-scroll">
              <DialogHeader>
                <DialogTitle className="mb-6 text-2xl font-bold text-[#111827] flex gap-4.5 items-center">
                  <div
                    onClick={() => setIsOpen(false)}
                    className="cursor-pointer"
                  >
                    <ChevronLeft size={24} />
                  </div>
                  Add New Vendor
                </DialogTitle>
              </DialogHeader>
              <AddVendor setClose={() => setIsOpen(false)} />
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </div>
  );
};

export default Vendors;
