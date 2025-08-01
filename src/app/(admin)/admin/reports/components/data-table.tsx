"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { DeleteIcon, ViewIcon } from "../../../../../../public/icons";
import { ReportTableComponent } from "@/components/custom-table/reportIndex";
import { SelectFilter } from "@/app/(admin)/components/select-filter";
import { InputFilter } from "@/app/(admin)/components/input-filter";
import { ReportsData } from "@/types";
import { useDelete } from "@/services/reports";
import { toast } from "sonner";
import { DialogHeader, DialogFooter } from "@/components/ui/dialog";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@radix-ui/react-dialog";
import { Button } from "@/components/ui/button";
import { useGetAdmins } from "@/services/admin";
import Link from "next/link";
import { ROUTES } from "@/constant/routes";

interface DataTableProps {
  customers: Array<{
    userId: number;
    email: string;
    totalSpent: number;
    orderCount: number;
    status: string;
  }>;
  refetch: () => void;
}

interface CustomerData {
  userId: number;
  email: string;
  totalSpent: number;
  orderCount: number;
  status: string;
  name: string;
}

const DataTable: React.FC<DataTableProps> = ({ customers, refetch }) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState<null | CustomerData>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchFilter, setSearchFilter] = useState<string>("");
  const [email, setEmail] = useState("");

  const pageSize = 10;

  // Get admin email for permission checking
  useEffect(() => {
    if (typeof window !== "undefined") {
      const userEmail = localStorage.getItem("userEmail") ||
        sessionStorage.getItem("userEmail");
      setEmail(userEmail || "");
    }
  }, []);

  const { adminsData, isAdminsLoading } = useGetAdmins({ enabled: true });
  const admin = adminsData?.find((admin: { email: string }) => admin.email === email);

  const { deleteAdminPayload, deleteAdminIsLoading } = useDelete(() => {
    toast.success("Customer deleted successfully");
    setDeleteDialogOpen(false);
    refetch();
  });

  // Filter customers based on status and search
  const filteredCustomers = customers.filter(customer => {
    const matchesStatus = statusFilter === "all" || customer.status.toLowerCase() === statusFilter.toLowerCase();
    const matchesSearch = searchFilter === "" ||
      customer.email.toLowerCase().includes(searchFilter.toLowerCase()) ||
      customer.email.split('@')[0].toLowerCase().includes(searchFilter.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  // Paginate the filtered results
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedCustomers = filteredCustomers.slice(startIndex, startIndex + pageSize);

  const onPageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Transform data for table
  const tableData: ReportsData[] = paginatedCustomers.map((customer) => ({
    id: customer.userId,
    name: customer.email.split('@')[0],
    status: customer.status,
    ordercount: customer.orderCount,
    totalsales: customer.totalSpent.toLocaleString("en-NG", {
      style: "currency",
      currency: "NGN",
    }),
    aov: (customer.totalSpent / (customer.orderCount || 1)).toLocaleString(
      "en-NG",
      { style: "currency", currency: "NGN" }
    ),
    email: customer.email,
  }));

  const cellRenderers = {
    name: (item: ReportsData) => (
      <div className="font-normal flex items-center gap-3">
        <Image
          src="/images/user-avatar.jpg"
          width={24}
          height={24}
          alt="Customer avatar"
          className="w-6 h-6 rounded-full"
        />
        <div>
          <p className="font-medium">{item.name}</p>
          <p className="font-normal text-[0.75rem] text-[#A0AEC0]">
            {item.email}
          </p>
        </div>
      </div>
    ),
    status: (item: ReportsData) => (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${item.status?.toLowerCase() === 'active'
          ? "bg-green-100 text-green-800"
          : "bg-red-100 text-red-800"
        }`}>
        {item.status || 'N/A'}
      </span>
    ),
    totalsales: (item: ReportsData) => (
      <span className="font-semibold text-green-600">{item.totalsales}</span>
    ),
    aov: (item: ReportsData) => (
      <div className="font-medium text-blue-600">{item.aov}</div>
    ),
    ordercount: (item: ReportsData) => (
      <span className="font-medium">{item.ordercount}</span>
    ),
    action: (item: any) => (
      <div className="flex gap-2.5">
        <Link
          href={`${ROUTES.ADMIN.SIDEBAR.CUSTOMERSREPORTS}/${item?.id}?tab=general`}
          className="bg-[#27A376] p-2.5 rounded-lg hover:bg-[#1f875d] transition-colors"
          title="View customer details"
        >
          <ViewIcon />
        </Link>
        <button
          onClick={() => openDeleteDialog(item)}
          className="bg-[#E03137] p-2.5 rounded-lg hover:bg-[#c22a2f] transition-colors"
          title="Delete customer"
          disabled={admin?.roles[0]?.role?.name !== "super_admin"}
        >
          <DeleteIcon />
        </button>
      </div>
    ),
  };

  const columnOrder: (keyof ReportsData)[] = [
    "name",
    "status",
    "totalsales",
    "aov",
    "ordercount",
    "action",
  ];

  const columnLabels = {
    name: "Customer",
    status: "Status",
    totalsales: "Total Spent",
    aov: "Avg Order Value",
    ordercount: "Orders",
    action: "Actions",
  };

  const handleDeleteCustomer = async () => {
    if (customerToDelete) {
      try {
        await deleteAdminPayload(customerToDelete.userId);
      } catch (error) {
        toast.error("Failed to delete customer");
        console.error(error);
      }
    }
  };

  const openDeleteDialog = (customer: any) => {
    const customerData: CustomerData = {
      userId: customer.id,
      email: customer.email,
      totalSpent: parseFloat(customer.totalsales.replace(/[₦,]/g, '')),
      orderCount: customer.ordercount,
      status: customer.status,
      name: customer.name,
    };
    setCustomerToDelete(customerData);
    setDeleteDialogOpen(true);
  };

  // Calculate summary stats for current view
  const currentViewStats = {
    totalCustomers: filteredCustomers.length,
    totalSales: filteredCustomers.reduce((acc, customer) => acc + customer.totalSpent, 0),
    totalOrders: filteredCustomers.reduce((acc, customer) => acc + customer.orderCount, 0),
    avgOrderValue: filteredCustomers.length > 0
      ? filteredCustomers.reduce((acc, customer) => acc + customer.totalSpent, 0) /
      filteredCustomers.reduce((acc, customer) => acc + customer.orderCount, 0)
      : 0
  };

  return (
    <Card className="bg-white">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h6 className="font-semibold text-lg text-[#111827]">
              Top Performing Customers
            </h6>
            <p className="text-sm text-gray-500 mt-1">
              Showing {paginatedCustomers.length} of {filteredCustomers.length} customers
            </p>
          </div>

          {/* Quick stats for current filter */}
          <div className="grid grid-cols-3 gap-4 text-right">
            <div>
              <p className="text-xs text-gray-500">Total Sales</p>
              <p className="font-semibold text-green-600">
                ₦{currentViewStats.totalSales.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Total Orders</p>
              <p className="font-semibold">{currentViewStats.totalOrders}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Avg Order Value</p>
              <p className="font-semibold text-blue-600">
                ₦{currentViewStats.avgOrderValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4 mb-6">
          <InputFilter
            setQuery={setSearchFilter}
            placeholder="Search by email or name..."
          />
          <SelectFilter
            setFilter={setStatusFilter}
            placeholder="All Statuses"
            list={[
              { text: "All Statuses", value: "all" },
              { text: "Active", value: "active" },
              { text: "Inactive", value: "inactive" },
            ]}
          />
        </div>

        {/* Table */}
        <ReportTableComponent<ReportsData>
          tableData={tableData}
          currentPage={currentPage}
          onPageChange={onPageChange}
          totalPages={Math.ceil(filteredCustomers.length / pageSize)}
          cellRenderers={cellRenderers}
          columnOrder={columnOrder}
          columnLabels={columnLabels}
          isLoading={false}
        />

        {/* Empty state */}
        {filteredCustomers.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No customers found matching your criteria</p>
          </div>
        )}
      </CardContent>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="fixed inset-0 flex items-center justify-center z-50">
          <div className="sm:max-w-[425px] w-full bg-white p-6 rounded-2xl shadow-xl border border-slate-200">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold text-slate-900">
                Confirm Deletion
              </DialogTitle>
              <DialogDescription className="text-sm text-slate-600 mt-1">
                Are you sure you want to delete <strong>{customerToDelete?.name}</strong>?
                <br />
                <span className="text-xs text-red-500">
                  This will remove ₦{customerToDelete?.totalSpent.toLocaleString()} in sales history.
                </span>
                <br />
                This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="mt-6 flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => setDeleteDialogOpen(false)}
                disabled={deleteAdminIsLoading}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDeleteCustomer}
                disabled={deleteAdminIsLoading || admin?.roles[0]?.role?.name !== "super_admin"}
              >
                {deleteAdminIsLoading ? "Deleting..." : "Delete Customer"}
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default DataTable;