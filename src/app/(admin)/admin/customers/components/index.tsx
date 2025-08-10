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
import { useGetCustomers } from "@/services/customers";
import { InputFilter } from "@/app/(admin)/components/input-filter";
import { SelectFilter } from "@/app/(admin)/components/select-filter";
import DeleteContent from "@/app/(admin)/components/delete-content";
import { RoleData } from "@/types";
import RoleCard from "./roleCard";

// ✅ Create a simple interface that matches what RoleCard expects
interface CustomerRoleCardData {
  id: number;
  name: string;
  type?: string;
  description?: string;
  isSystem?: boolean;
  _count?: {
    users: number;
  };
  permissions?: any[];
  // Add any missing properties that RoleData requires
  email?: string;
  data?: any;
  createdAt?: string;
  updatedAt?: string;
  toLowerCase?: () => string;
}

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

  const onPageChange = (page: number) => {
    setCurrentPage(page);
  };

  const payload = {
    page: currentPage,
    pageSize: Number(pageSize),
    search: filter,
    type: type === "all" ? "" : type,
    status: status === "all" ? "" : status,
    kycStatus: kycStatus === "all" ? "" : kycStatus,
  };

  useEffect(() => {
    console.log('🔍 Setting customer filter:', payload);
    setCustomersFilter(payload);
  }, [filter, type, status, pageSize, currentPage, kycStatus]);

  const customerList = [
    { text: "All", value: "all" },
    { text: "Individual", value: "individual" },
    { text: "Business", value: "business" },
  ];

  const statusList = [
    { text: "All", value: "all" },
    { text: "Active", value: "ACTIVE" },
    { text: "Inactive", value: "INACTIVE" },
    { text: "Suspended", value: "SUSPENDED" },
  ];

  const kycList = [
    { text: "All", value: "all" },
    { text: "Verified", value: "Verified" },
    { text: "Not Verified", value: "Not Verified" },
  ];

  console.log("customers data:", data);

  // ✅ CRITICAL: Use overallStats (not currentPageStats) for role cards
  // overallStats contains the total counts without filters applied
  const overallStats = data?.overallStats;
  const currentPageStats = data?.currentPageStats; // Use this for statistics cards

  console.log("✅ overallStats for role cards:", overallStats);
  console.log("📊 currentPageStats for stats cards:", currentPageStats);

  // ✅ FIXED: Create role cards from overallStats (unfiltered totals)
  const createCustomerRoleCards = (): CustomerRoleCardData[] => {
    if (!overallStats) {
      console.log("❌ No overallStats available for role cards");
      return [];
    }

    const roles: CustomerRoleCardData[] = [];

    // Individual customers role card
    if (overallStats.individualUsers !== undefined) {
      roles.push({
        id: 1,
        name: 'individual',
        type: 'INDIVIDUAL',
        description: 'Personal shoppers and consumers',
        isSystem: true,
        _count: {
          users: overallStats.individualUsers || 0
        },
        permissions: [],
        // Add default values for required properties
        email: '',
        data: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        toLowerCase: () => 'individual'
      });
    }

    // Business customers role card
    if (overallStats.businessUsers !== undefined) {
      roles.push({
        id: 2,
        name: 'business',
        type: 'BUSINESS',
        description: 'Business owners and enterprises',
        isSystem: true,
        _count: {
          users: overallStats.businessUsers || 0
        },
        permissions: [],
        // Add default values for required properties
        email: '',
        data: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        toLowerCase: () => 'business'
      });
    }

    console.log("✅ Created role cards:", roles);
    return roles;
  };

  const customerRoleCards = createCustomerRoleCards();

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

          {/* ✅ Statistics Overview Cards - Use currentPageStats (reflects current filters) */}
          {currentPageStats && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-green-600">
                    {currentPageStats.totalCustomers || 0}
                  </div>
                  <div className="text-sm text-gray-500">Total Customers (Filtered)</div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-blue-600">
                    {currentPageStats.individualUsers || 0}
                  </div>
                  <div className="text-sm text-gray-500">Individual (Filtered)</div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-purple-600">
                    {currentPageStats.businessUsers || 0}
                  </div>
                  <div className="text-sm text-gray-500">Business (Filtered)</div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-orange-600">
                    {currentPageStats.verifiedCustomers || 0}
                  </div>
                  <div className="text-sm text-gray-500">KYC Verified (Filtered)</div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* ✅ Role Cards Section - Use overallStats (total unfiltered counts) */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4">Customer Types Overview</h3>
            {getCustomersIsLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                <div className="animate-pulse bg-gray-200 h-[200px] rounded-lg"></div>
                <div className="animate-pulse bg-gray-200 h-[200px] rounded-lg"></div>
              </div>
            ) : customerRoleCards.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                {customerRoleCards.map((role: CustomerRoleCardData) => (
                  <RoleCard key={`role-${role.id}`} role={role as any} />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                <div className="text-center text-gray-500 p-8 border rounded-lg">
                  <p>No customer role data available</p>
                  <p className="text-sm mt-2">Customer role cards will appear here once data is loaded</p>
                </div>
              </div>
            )}
          </div>

          {/* Filters Section */}
          <div className="flex items-center gap-4 mb-6">
            <div className="w-1/2 me-auto">
              <InputFilter
                setQuery={setFilter}
                placeholder="Search customers..."
              />
            </div>
            <SelectFilter
              setFilter={setType}
              placeholder="Customer type"
              list={customerList}
            />
            <SelectFilter
              setFilter={setStatus}
              placeholder="Status"
              list={statusList}
            />
            <SelectFilter
              setFilter={setkycStatus}
              list={kycList}
              placeholder="KYC status"
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