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
import CreateCustomer from "./create-customer";
import { useGetCustomers } from "@/services/customers";
import { InputFilter } from "@/app/(admin)/components/input-filter";
import { SelectFilter } from "@/app/(admin)/components/select-filter";
import DeleteContent from "@/app/(admin)/components/delete-content";
import { useGetAdminRoles } from "@/services/admin";
import { RoleData } from "@/types";
import RoleCard from "./roleCard";

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
  const [kycStatus, setkycStatus] = useState<string>("");
  const [pageSize, setPageSize] = useState<string>("10");
  const [currentPage, setCurrentPage] = useState(1);
  const [currentTab, setCurrentTab] = useState<string>("delete");

  const onPageChange = (page: number) => {
    setCurrentPage(page);
  };

  const payload = {
    page: currentPage,
    pageSize,
    type,
    status,
    kycStatus,
    search: filter,
  };

  useEffect(() => {
    setCustomersFilter(payload);
  }, [filter, type, status, pageSize, currentPage, kycStatus]);

  const customerList = [
    { text: "All", value: "all" },
    { text: "Individual", value: "individual" },
    { text: "Business", value: "business" },
  ];

  const kycList = [
    { text: "All", value: "all" },
    { text: "Verified", value: "Verified" },
    { text: "Pending", value: "Not Verified" },
  ];

  const { rolesData, isRolesLoading } = useGetAdminRoles({ enabled: true });

  console.log("rolesData:", rolesData);
  console.log("customers data:", data);

  // Enhanced data processing for roles with better error handling
  const processRolesData = () => {
    if (!rolesData) return [];

    // Handle different possible data structures
    let roles = [];
    if (Array.isArray(rolesData)) {
      roles = rolesData;
    } else if (rolesData.data && Array.isArray(rolesData.data)) {
      roles = rolesData.data;
    } else if (rolesData.roles && Array.isArray(rolesData.roles)) {
      roles = rolesData.roles;
    }

    // Filter to only show customer-related roles
    return roles.filter((role: RoleData) => {
      const roleName = role.name?.toLowerCase();
      return roleName === 'business' || roleName === 'individual' ||
        roleName === 'business_owner' || roleName === 'customer';
    });
  };

  const safeRolesData = processRolesData();

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

          {/* Role Cards Section */}
          {isRolesLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 mb-8">
              <div className="animate-pulse bg-gray-200 h-[200px] rounded-lg"></div>
              <div className="animate-pulse bg-gray-200 h-[200px] rounded-lg"></div>
            </div>
          ) : safeRolesData.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 mb-8">
              {safeRolesData.map((role: RoleData) => (
                <RoleCard key={role.id} role={role} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 mb-8">
              <div className="text-center text-gray-500 p-8">
                No customer roles found
              </div>
            </div>
          )}

          {/* Filters Section */}
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
              setFilter={setkycStatus}
              list={kycList}
              placeholder="Kyc status"
            />
          </div>

          {/* Data Table */}
          <DataTable
            data={data?.data || []}
            currentPage={currentPage}
            onPageChange={onPageChange}
            pageSize={Number(pageSize)}
            totalPages={data?.pagination?.total || 0}
            setPageSize={setPageSize}
            handleDelete={() => setIsOpen(true)}
            isLoading={getCustomersIsLoading}
          />
        </CardContent>
      </Card>

      {/* Delete Dialog */}
      <Dialog open={isOpen} onOpenChange={() => setIsOpen(!isOpen)}>
        <DialogContent className="max-w-[33.75rem] left-[50%] translate-x-[-50%]">
          <DialogHeader>
            <DialogTitle className="mb-6 text-2xl font-bold text-[#111827] flex gap-4.5 items-center">
              Delete Customer
            </DialogTitle>
          </DialogHeader>
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