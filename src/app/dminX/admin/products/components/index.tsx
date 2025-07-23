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
import { useGetManufacturers } from "@/services/manufacturers";
import { capitalizeFirstLetter, showSuccessAlert } from "@/lib/utils";

export default function Products() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [currentTab, setCurrentTab] = useState<string>("view");
  const [filter, setFilter] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [pageSize, setPageSize] = useState<string>("10");
  const [currentPage, setCurrentPage] = useState(1);
  const [startDate, setStartDate] = useState<string | null>(null);
  const [open, setOpen] = useState<boolean>(false);
  const [tab, setTab] = useState<string>("");
  const [endDate, setEndDate] = useState<string | null>(null);
    const [selectedProduct, setSelectedProduct] = useState<any>(null);
  
  const onPageChange = (page: number) => {
    setCurrentPage(page);
  };
    const {
      getManufacturersData,
      getManufacturersIsLoading,
      refetchManufacturers,
      setManufacturersFilter,
    } = useGetManufacturers();
  const {
    getPRoductsIsLoading,
    getProductsData,
    setProductsFilter,
    refetchProducts,
  } = useGetProducts();

  const {
    deleteProduct,
    isLoading,
    error: deleteProductError,
    data: deleteProductPayload,
  } = useDeleteProduct((res: any) => {
    refetchProducts();
    setIsOpen(false);
  });

  const payload = {
    // search: filter,
    page: currentPage,
    pageSize,
    type: status,
  };

    // Handlers for product actions
    const handleViewProduct = (product: any) => {
      setSelectedProduct(product);
      setTab("view");
      setOpen(true);
    };
  
    const handleEditProduct = (product: any) => {
      setSelectedProduct(product);
      setTab("edit");
      setOpen(true);
    };
  
    const handleDeleteProduct = (product: any) => {
      setSelectedProduct(product);
      setTab("delete-product");
      setOpen(true);
    };
    const handleConfirmDelete = () => {
      if (selectedProduct) {
        deleteProduct(selectedProduct.id);
      }
    };
  

  useEffect(() => {
    setProductsFilter(payload);
  }, [filter, status, pageSize]);

  const renderItem = () => {
      switch (tab) {
     
        case "view":
          return (
            <ViewProduct 
              setClose={() => setOpen(false)} 
              productData={selectedProduct} 
            />
          );
        case "edit":
          return (
            <>
              <EditProduct
              setClose={() => setOpen(false)} 
              product={selectedProduct} 
              manufacturers={getManufacturersData?.data || []}
               />
            </>
          );
        case "delete-product":
          return (
            <DeleteContent 
              handleClose={() => setOpen(false)} 
              title="Product" 
              handleClick={handleConfirmDelete}
              isLoading={isLoading}
            />
          );
        default:
          return     <ViewProduct 
          setClose={() => setOpen(false)} 
          productData={selectedProduct} 
        />;
      }
    };
  

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
            handleEdit={handleEditProduct}
            handleView={handleViewProduct}
            handleDelete={handleDeleteProduct}
            setPageSize={setPageSize}
            data={getProductsData?.data || []}
            currentPage={currentPage}
            onPageChange={onPageChange}
            pageSize={Number(pageSize)}
            totalPages={getProductsData?.pagination?.totalPages || 1}
            loading={getPRoductsIsLoading}
          />
        </CardContent>
      </Card>

       <Dialog open={open} onOpenChange={() => setOpen(!open)}>
              <DialogContent
                className={`${
                  tab !== "delete" && tab !== "delete-product"
                    ? "right-0 p-8 max-w-[47.56rem] h-screen overflow-y-scroll"
                    : "max-w-[33.75rem] left-[50%] translate-x-[-50%] py-10"
                }`}
              >
                {tab !== "delete" && tab !== "delete-product" && (
                  <DialogHeader>
                    <DialogTitle className="mb-6 text-2xl font-bold text-[#111827] flex gap-4.5 items-center">
                      <div onClick={() => setOpen(false)} className="cursor-pointer">
                        <ChevronLeft size={24} />
                      </div>
                      {capitalizeFirstLetter(tab)}{" "}
                      {tab === "update" ? "Manufacturer" : "Product"}
                    </DialogTitle>
                  </DialogHeader>
                )}
                {renderItem()}
              </DialogContent>
            </Dialog>
    </section>
  );
}
