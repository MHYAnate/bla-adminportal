"use client";

import Header from "@/app/(admin)/components/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import EmptyState from "../../components/empty";
import { InputFilter } from "@/app/(admin)/components/input-filter";
import SupplierManagementCard from "@/components/widgets/supplier-management";
import Link from "next/link";
import { ROUTES } from "@/constant/routes";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ChevronLeft } from "lucide-react";
import AddManufacturer from "./add-manufacturer";
import { StoreManagementIcon } from "../../../../../public/icons";
import { useGetManufacturers } from "@/services/manufacturers";
import { Pagination } from "@/components/ui/pagination";
import { ISupplierCard } from "@/types";
import SupplierManagementCardSkeleton from "@/components/skeletons/supply-management-card";

export default function Manufacturers() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [role, setRole] = useState<string>("");
  const [filter, setFilter] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);

  const onPageChange = (page: number) => {
    setCurrentPage(page);
  };
  const {
    getManufacturersData,
    getManufacturersIsLoading,
    refetchManufacturers,
    setManufacturersFilter,
  } = useGetManufacturers();
  

  const roleList = [
    {
      text: "Admin",
      value: "admin",
    },
    {
      text: "Super Admin",
      value: "super-admin",
    },
  ];

  useEffect(() => {
    const payload = {
      name: filter,
      pageSize: 10,
      page: currentPage,
    };

    setManufacturersFilter(payload);
  }, [filter, currentPage]);
  console.log(getManufacturersData?.pagination?.totalItems);
  return (
    <section>
      <Card>
        <CardContent className="p-4 ">
          <div className="flex justify-between items-center mb-6">
            <Header
              title="Manufacturers"
              subtext="Manage Manufacturers and  Suppliers"
            />
            <Button
              variant={"outline"}
              className="font-bold text-base w-auto py-4 px-6"
              size={"xl"}
              onClick={() => setIsOpen(true)}
            >
              + Add New Manufacturer
            </Button>
          </div>
          {!getManufacturersIsLoading && (
            <div className="flex items-center gap-4 mb-6 w-[50%]">
              <InputFilter
                setQuery={setFilter}
                placeholder="Search manufacturers by name."
              />
              {/* <SelectFilter
              setFilter={setRole}
              placeholder="Select Role"
              list={roleList}
            /> */}
            </div>
          )}
          {getManufacturersIsLoading ? (
            <div className="grid grid-cols-2 gap-4">
              {Array.from({ length: 4 }).map((_, idx: number) => (
                <SupplierManagementCardSkeleton key={idx} />
              ))}
            </div>
          ) : (
            <>
              {getManufacturersData?.data?.length < 1 ? (
                <EmptyState
                  icon={<StoreManagementIcon />}
                  btnText="Add Manufacturer"
                  header="Manufacturer Records Await"
                  description="Start Managing Your Suppliers by Adding Your First Manufacturer."
                  onClick={() => setIsOpen(true)}
                />
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    {getManufacturersData?.data?.map(
                      (item: ISupplierCard, index: number) => (
                        <Link
                          key={index}
                          href={`${
                            ROUTES.ADMIN.SIDEBAR.SUPPLYMANAGEMENTMANUFACTURERS
                          }/${item.id}`}
                        >
                          <SupplierManagementCard item={item} />
                        </Link>
                      )
                    )}
                  </div>
                  <div className="mt-6 flex items-center justify-center">
                    <Pagination
                      currentPage={currentPage}
                      totalPages={
                        getManufacturersData?.pagination?.totalPages || 0
                      }
                      onPageChange={onPageChange}
                    />
                  </div>
                </>
              )}
            </>
          )}
          <Dialog open={isOpen} onOpenChange={() => setIsOpen(!open)}>
            <DialogContent className="right-0 p-8 max-w-[47.56rem] h-screen overflow-y-scroll">
              <DialogHeader>
                <DialogTitle className="mb-6 text-2xl font-bold text-[#111827] flex gap-4.5 items-center">
                  <div
                    onClick={() => setIsOpen(false)}
                    className="cursor-pointer"
                  >
                    <ChevronLeft size={24} />
                  </div>
                  Add New Manufacturer
                </DialogTitle>
              </DialogHeader>
              <AddManufacturer setClose={() => setIsOpen(false)} />
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </section>
  );
}

