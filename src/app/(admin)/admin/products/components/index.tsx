"use client";

import Header from "@/app/(admin)/components/header";
import { Button } from "@/components/ui/button";
import DataTable from "./data-table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import EditProduct from "./edit-products";
import { useState } from "react";
import { ChevronLeft } from "lucide-react";
import { EmptyProductIcon, ExportIcon } from "../../../../../../public/icons";
import EmptyState from "@/app/(admin)/components/empty";
import Link from "next/link";
import ViewProduct from "./view-product";
import DeleteContent from "@/app/(admin)/components/delete-content";

export default function Products() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [currentTab, setCurrentTab] = useState<string>("view");

  return (
    <section>
      <div className="p-4 flex justify-between items-center mb-8">
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
            asChild
          >
            <Link href="/admin/products/add">+ Add New Product</Link>
          </Button>
        </div>
      </div>

      <EmptyState
        icon={<EmptyProductIcon />}
        btnText="Add new product"
        header="No Products Here"
        description="Start adding products, set prices and delivery information."
        onClick={() => setIsOpen(true)}
      />
      <DataTable
        handleEdit={() => {
          setCurrentTab("edit");
          setIsOpen(true);
        }}
        handleView={() => {
          setCurrentTab("view");
          setIsOpen(true);
        }}
        handleDelete={() => {
          setCurrentTab("delete");
          setIsOpen(true);
        }}
      />
      <Dialog open={isOpen} onOpenChange={() => setIsOpen(!open)}>
        <DialogContent
          className={`${
            currentTab === "delete"
              ? "max-w-[33.75rem] left-[50%] translate-x-[-50%]"
              : "right-0 p-8 max-w-[40.56rem] h-screen overflow-y-scroll"
          }`}
        >
          <DialogHeader>
            {currentTab !== "delete" && (
              <DialogTitle className="mb-6 text-2xl font-bold text-[#111827] flex gap-[18px] items-center">
                <div
                  onClick={() => setIsOpen(false)}
                  className="cursor-pointer"
                >
                  <ChevronLeft size={24} />
                </div>
                Edit Product
              </DialogTitle>
            )}
          </DialogHeader>
          {currentTab === "view" ? (
            <ViewProduct setClose={() => setIsOpen(false)} />
          ) : currentTab === "edit" ? (
            <EditProduct setClose={() => setIsOpen(false)} />
          ) : (
            <DeleteContent
              handleClose={() => setIsOpen(false)}
              description="This action is irreversible and will permanently remove all associated data."
              title="Product"
            />
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
