"use client";

import Header from "@/app/(admin)/components/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import DataTable from "./data-table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import CreateAdmin from "./add-products";
import { useState } from "react";
import { ChevronLeft } from "lucide-react";
import { ExportIcon } from "../../../../../../public/icons";

export default function Products() {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <section>
      <Card className="bg-white mb-8">
        <CardContent className="p-4 flex justify-between items-center">
          <Header title="Products" subtext="Manage Products." />

          <div className="flex gap-5">
            <Button
              variant={"outline"}
              className="font-bold text-base w-auto py-4 px-5 flex gap-2 items-center"
              size={"xl"}
            >
              <ExportIcon /> Download
            </Button>
            <Button
              variant={"warning"}
              className="font-bold text-base w-auto py-4 px-6"
              size={"xl"}
              onClick={() => setIsOpen(true)}
            >
              + Add New Product
            </Button>
          </div>
        </CardContent>
      </Card>
      <DataTable />
      <Dialog open={isOpen} onOpenChange={() => setIsOpen(!open)}>
        <DialogContent className="right-0 p-8 max-w-[47.56rem] h-screen overflow-scroll">
          <DialogHeader>
            <DialogTitle className="mb-6 text-2xl font-bold text-[#111827] flex gap-4.5 items-center">
              <div onClick={() => setIsOpen(false)} className="cursor-pointer">
                <ChevronLeft size={24} />
              </div>
              Create new admin
            </DialogTitle>
          </DialogHeader>
          <CreateAdmin setClose={() => setIsOpen(false)} />
        </DialogContent>
      </Dialog>
    </section>
  );
}
