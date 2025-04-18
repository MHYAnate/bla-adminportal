"use client";

import Header from "@/app/(admin)/components/header";
import { Card, CardContent } from "@/components/ui/card";
import SupplierManagementCard from "@/components/widgets/supplier-management";
import { useEffect, useState } from "react";
import {
  useDeleteManufacturerProduct,
  useGetManufacturerInfo,
  useGetManufacturerProducts,
  useUpdateManufacturerStatus,
} from "@/services/manufacturers";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ChevronLeft } from "lucide-react";
import EditManufacturer from "./edit-manufacturer";
import DeleteContent from "@/app/(admin)/components/delete-content";
import ViewProduct from "@/app/(admin)/admin/products/components/view-product";
import EditProduct from "@/app/(admin)/admin/products/components/edit-products";
import ProductDataTable from "@/app/(admin)/admin/products/components/data-table";
import { InputFilter } from "@/app/(admin)/components/input-filter";
import { SelectFilter } from "@/app/(admin)/components/select-filter";
import DatePickerWithRange from "@/components/ui/date-picker";
import { productTypeList } from "@/constant";
import { capitalizeFirstLetter, showSuccessAlert } from "@/lib/utils";
interface iProps {
  manufacturerId: string;
}

const ManufacturerDetails: React.FC<iProps> = ({ manufacturerId }) => {
  const [manufacturerStatus, setManufacturerStatus] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const [tab, setTab] = useState<string>("update");
  const [filter, setFilter] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [pageSize, setPageSize] = useState<string>("10");
  const [currentPage, setCurrentPage] = useState(1);
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const onPageChange = (page: number) => {
    setCurrentPage(page);
  };
  const item = {
    logo: "/images/bladmin-login.jpg",
    total: "6,700",
    status: false,
    name: "Mutiu",
    email: "mutiu@gmail.com",
    country: "Nigeria",
    contactPerson: "Mutiu Garuba",
    id: "1122-5",
    phone: "+2349011223321",
    createdAt: "",
    updatedAt: "",
  };

  const {
    getManufacturerInfoData: data,
    getManufacturerInfoIsLoading,
    refetchManufacturerInfo,
    setManufacturerInfoFilter,
  } = useGetManufacturerInfo();

  useEffect(() => {
    setManufacturerInfoFilter(manufacturerId);
  }, [manufacturerId]);

  console.log(data);

  const {
    getManufacturerProductsData,
    getManufacturerProductsError,
    getManufacturerProductsIsLoading,
    refetchManufacturerProducts,
    setManufacturerProductsFilter,
  } = useGetManufacturerProducts();
  const { deleteProductData, deleteProductIsLoading, deleteProductPayload } =
    useDeleteManufacturerProduct((res: any) => {
      refetchManufacturerProducts();
      setOpen(false);
    });
  const {
    updateManufacturerStatusData,
    updateManufacturerStatusIsLoading,
    updateManufacturerStatusPayload,
  } = useUpdateManufacturerStatus((res: any) => {
    console.log(res);
    refetchManufacturerInfo();
    showSuccessAlert("Manufacturer status updated succcessfully!");
  });
  const updatePayload = {
    status: true,
  };
  const payload = {
    // search: filter,
    page: currentPage,
    pageSize,
    type: status,
  };

  useEffect(() => {
    setManufacturerProductsFilter({ manufacturerId, data: payload });
  }, [filter, status, pageSize]);

  const renderItem = () => {
    switch (tab) {
      case "update":
        return <EditManufacturer setClose={() => setOpen(false)} />;
      case "delete":
        return (
          <DeleteContent
            handleClose={() => setOpen(false)}
            title="manufacturer"
            handleClick={() => deleteProductPayload(manufacturerId)}
          />
        );
      case "view":
        return <ViewProduct setClose={() => setOpen(false)} />;
      case "edit":
        return <EditProduct setClose={() => setOpen(false)} />;
      case "delete-product":
        return (
          <DeleteContent handleClose={() => setOpen(false)} title="Product" />
        );
      default:
        return <EditManufacturer setClose={() => setOpen(false)} />;
    }
  };

  const handleToggle = () => {
    updateManufacturerStatusPayload({
      payload: updatePayload,
      id: manufacturerId,
    });
  };

  return (
    <div>
      <Card>
        <CardContent className="p-4 ">
          <div className="flex justify-between items-center mb-6">
            <Header
              title="Manufacturer"
              subtext="Manage Manufacturer"
              showBack={true}
            />
          </div>

          <div className="mb-6">
            <SupplierManagementCard
              item={item}
              handleUpdateManufacturerStatus={handleToggle}
              showToggle={true}
              showOptions={true}
              setTab={setTab}
              setOpen={setOpen}
              loading={updateManufacturerStatusIsLoading || false}
            />
          </div>

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
              setTab("edit");
              setOpen(true);
            }}
            handleView={() => {
              setTab("view");
              setOpen(true);
            }}
            handleDelete={() => {
              setTab("delete-product");
              setOpen(true);
            }}
            setPageSize={setPageSize}
            data={[]}
            currentPage={currentPage}
            onPageChange={onPageChange}
            pageSize={Number(pageSize)}
            totalPages={40}
            loading={getManufacturerProductsIsLoading}
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
    </div>
  );
};

export default ManufacturerDetails;
