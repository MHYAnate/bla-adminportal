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
import CreateAdmin from "./add-admin";
import { useState } from "react";
import { ChevronLeft } from "lucide-react";
import AdminUsersCard from "@/components/widgets/admin-user";

export default function Admins() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  return (
    <section>
      <Card className="bg-white mb-8">
        <CardContent className="p-4 flex justify-between items-center">
          <Header
            title="Total users with their roles"
            subtext="Find all administrator accounts and their associate roles."
          />
          <Button
            variant={"warning"}
            className="font-bold text-base w-auto py-4 px-6"
            size={"xl"}
            onClick={() => setIsOpen(true)}
          >
            + Add new admin
          </Button>
        </CardContent>
      </Card>
      <div className="flex gap-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <AdminUsersCard
            key={index}
            rolename="Inventory Manager"
            total={5}
            count={4}
          />
        ))}
      </div>

      <DataTable />
      <Dialog open={isOpen} onOpenChange={() => setIsOpen(!open)}>
        <DialogContent className="right-[30px] p-8 max-w-[35.56rem]">
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
