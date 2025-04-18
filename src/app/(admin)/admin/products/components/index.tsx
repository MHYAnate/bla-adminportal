"use client";

import Header from "@/app/(admin)/components/header";
import { Button } from "@/components/ui/button";
import ProductDataTable from "./data-table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import EditProduct from "./edit-products";
import { useEffect, useState } from "react";
import { ChevronLeft } from "lucide-react";
import { ExportIcon } from "../../../../../../public/icons";
import Link from "next/link";
import ViewProduct from "./view-product";
import DeleteContent from "@/app/(admin)/components/delete-content";
import { Card, CardContent } from "@/components/ui/card";
import { SelectFilter } from "@/app/(admin)/components/select-filter";
import { InputFilter } from "@/app/(admin)/components/input-filter";
import { useDeleteProduct, useGetProducts } from "@/services/products";
import DatePickerWithRange from "@/components/ui/date-picker";
import { productTypeList } from "@/constant";

export default function Products() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [currentTab, setCurrentTab] = useState<string>("view");
  const [filter, setFilter] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [pageSize, setPageSize] = useState<string>("10");
  const [currentPage, setCurrentPage] = useState(1);
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const onPageChange = (page: number) => {
    setCurrentPage(page);
  };
  const {
    getPRoductsIsLoading,
    getProductsData,
    setProductsFilter,
    refetchProducts,
  } = useGetProducts();
  const { deleteProductData, deleteProductIsLoading, deleteProductPayload } =
    useDeleteProduct((res: any) => {
      refetchProducts();
      setIsOpen(false);
    });

  const payload = {
    // search: filter,
    page: currentPage,
    pageSize,
    type: status,
  };

  useEffect(() => {
    setProductsFilter(payload);
  }, [filter, status, pageSize]);

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
      <Card className="bg-white">
        <CardContent className="p-6">
          <h6 className="font-semibold text-lg text-[#111827] mb-6">
            Detailed Product Table
          </h6>
          <div className="flex items-center gap-4 mb-6">
            <InputFilter
              setQuery={setFilter}
              placeholder="Search by customer name, categoryId, manufacturerId"
            />

            <SelectFilter
              setFilter={setStatus}
              placeholder="Product Type"
              list={productTypeList}
            />
            <DatePickerWithRange
              setFromDate={setStartDate}
              setToDate={setEndDate}
            />
          </div>

          <ProductDataTable
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
            setPageSize={setPageSize}
            data={[]}
            currentPage={currentPage}
            onPageChange={onPageChange}
            pageSize={Number(pageSize)}
            totalPages={40}
            loading={getPRoductsIsLoading}
          />
        </CardContent>
      </Card>
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
                {currentTab === "view"
                  ? "View"
                  : currentTab === "edit"
                  ? "Edit"
                  : "Delete"}
                Product
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
              title="Product"
            />
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
