"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { DeleteIcon, ViewIcon } from "../../../../../../public/icons";
import { ReportTableComponent } from "@/components/custom-table/registeredReportIndex";
import { SelectFilter } from "@/app/(admin)/components/select-filter";
import { InputFilter } from "@/app/(admin)/components/input-filter";
import { RegisteredReportsData } from "@/types";
import { useDelete } from "@/services/reports";
import { toast } from "sonner";
import Link from "next/link";
import { ROUTES } from "@/constant/routes";
import { DialogHeader, DialogFooter } from "@/components/ui/dialog";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@radix-ui/react-dialog";
import { Button } from "@/components/ui/button";
import { useGetAdmins } from "@/services/admin";

interface DataTableProps {
  customers: Array<{
    id?: number;
    userId?: number;
    email?: string;
    type?: string;
    name?: string;
    status?: string;
    kycStatus?: string;
    joinDate?: string;
    createdAt?: string;
    role?: string;
    [key: string]: any;
  }>;
  refetch: () => void;
}

interface CustomerData {
  id: number;
  email: string;
  type: string;
  name: string;
  status: string;
  kycStatus: string;
  joinDate: string;
  role: string;
}

const RegDataTable: React.FC<DataTableProps> = ({ customers, refetch }) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState<null | CustomerData>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
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

  const onPageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Normalize customer data structure and handle missing fields
  const normalizedCustomers = customers.map((customer, index) => ({
    id: customer.id || customer.userId || index + 1,
    email: customer.email || "N/A",
    name: customer.name || customer.email?.split('@')[0] || `Customer ${index + 1}`,
    type: customer.type || "individual",
    status: customer.status || "ACTIVE",
    kycStatus: customer.kycStatus || "pending",
    joinDate: customer.joinDate || customer.createdAt || new Date().toISOString(),
    role: customer.role || "customer"
  }));

  // Filter customers based on status, type, and search
  const filteredCustomers = normalizedCustomers.filter(customer => {
    const matchesStatus = statusFilter === "all" || customer.status.toLowerCase() === statusFilter.toLowerCase();
    const matchesType = typeFilter === "all" || customer.type.toLowerCase() === typeFilter.toLowerCase();
    const matchesSearch = searchFilter === "" ||
      customer.email.toLowerCase().includes(searchFilter.toLowerCase()) ||
      customer.name.toLowerCase().includes(searchFilter.toLowerCase());

    return matchesStatus && matchesType && matchesSearch;
  });

  // Paginate the filtered results
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedCustomers = filteredCustomers.slice(startIndex, startIndex + pageSize);

  // Transform data for table
  const tableData: RegisteredReportsData[] = paginatedCustomers.map((customer) => ({
    id: customer.id,
    name: customer.name,
    email: customer.email,
    type: customer.type,
    status: customer.status,
    kycStatus: customer.kycStatus,
    joinDate: new Date(customer.joinDate).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    }),
    role: customer.role
  }));

  const cellRenderers = {
    name: (item: RegisteredReportsData) => (
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
          <p className="text-sm text-gray-500">{item.email}</p>
        </div>
      </div>
    ),
    type: (item: RegisteredReportsData) => (
      <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${item.type === "business"
          ? "bg-blue-100 text-blue-800"
          : "bg-gray-100 text-gray-800"
        }`}>
        {item.type}
      </span>
    ),
    status: (item: RegisteredReportsData) => (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${item.status?.toUpperCase() === "ACTIVE"
          ? "bg-green-100 text-green-800"
          : "bg-red-100 text-red-800"
        }`}>
        {item.status?.toUpperCase()}
      </span>
    ),
    kycStatus: (item: RegisteredReportsData) => (
      <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${item.kycStatus === "verified"
          ? "bg-green-100 text-green-800"
          : item.kycStatus === "pending"
            ? "bg-yellow-100 text-yellow-800"
            : "bg-red-100 text-red-800"
        }`}>
        {item.kycStatus}
      </span>
    ),
    joinDate: (item: RegisteredReportsData) => (
      <span className="text-sm">{item.joinDate}</span>
    ),
    role: (item: RegisteredReportsData) => (
      <span className="text-sm capitalize">{item.role}</span>
    ),
    action: (item: any) => (
      <div className="flex gap-2.5">
        <Link
          href={`${ROUTES.ADMIN.SIDEBAR.CUSTOMERSREPORTS}/${item?.id}?tab=general`}
          className="bg-[#2F78EE] p-2.5 rounded-lg hover:bg-[#1f5bb8] transition-colors"
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

  const columnOrder: (keyof RegisteredReportsData)[] = [
    "name",
    "type",
    "status",
    "kycStatus",
    "joinDate",
    "role",
    "action"
  ];

  const columnLabels = {
    name: "Customer",
    type: "Type",
    status: "Status",
    kycStatus: "KYC Status",
    joinDate: "Join Date",
    role: "Role",
    action: "Actions"
  };

  const handleDeleteCustomer = async () => {
    if (customerToDelete) {
      try {
        await deleteAdminPayload(customerToDelete.id);
      } catch (error) {
        toast.error("Failed to delete customer");
        console.error(error);
      }
    }
  };

  const openDeleteDialog = (customer: any) => {
    const customerData: CustomerData = {
      id: customer.id,
      email: customer.email,
      name: customer.name,
      type: customer.type,
      status: customer.status,
      kycStatus: customer.kycStatus,
      joinDate: customer.joinDate,
      role: customer.role,
    };
    setCustomerToDelete(customerData);
    setDeleteDialogOpen(true);
  };

  // Calculate summary stats for current view
  const currentViewStats = {
    totalCustomers: filteredCustomers.length,
    activeCustomers: filteredCustomers.filter(c => c.status.toUpperCase() === "ACTIVE").length,
    businessCustomers: filteredCustomers.filter(c => c.type === "business").length,
    verifiedCustomers: filteredCustomers.filter(c => c.kycStatus === "verified").length,
    pendingKyc: filteredCustomers.filter(c => c.kycStatus === "pending").length,
  };

  // Calculate recent registration trends (last 7 days, last 30 days)
  const now = new Date();
  const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const recentTrends = {
    last7Days: filteredCustomers.filter(c => new Date(c.joinDate) >= last7Days).length,
    last30Days: filteredCustomers.filter(c => new Date(c.joinDate) >= last30Days).length,
  };

  return (
    <Card className="bg-white">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h6 className="font-semibold text-lg text-[#111827]">
              Recent Customer Registrations
            </h6>
            <p className="text-sm text-gray-500 mt-1">
              Showing {paginatedCustomers.length} of {filteredCustomers.length} new customers
            </p>
          </div>

          {/* Registration trends */}
          <div className="text-right">
            <div className="flex gap-4">
              <div>
                <p className="text-xs text-gray-500">Last 7 days</p>
                <p className="font-semibold text-green-600">{recentTrends.last7Days}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Last 30 days</p>
                <p className="font-semibold text-blue-600">{recentTrends.last30Days}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Summary stats */}
        <Card className="mb-6 bg-purple-50">
          <CardContent className="p-4">
            <h6 className="font-semibold text-purple-800 mb-3">Registration Summary</h6>
            <div className="grid grid-cols-5 gap-4">
              <div className="text-center">
                <p className="text-sm text-purple-600">Total</p>
                <p className="text-xl font-bold text-purple-900">{currentViewStats.totalCustomers}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-purple-600">Active</p>
                <p className="text-xl font-bold text-green-700">{currentViewStats.activeCustomers}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-purple-600">Business</p>
                <p className="text-xl font-bold text-blue-700">{currentViewStats.businessCustomers}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-purple-600">Verified KYC</p>
                <p className="text-xl font-bold text-green-700">{currentViewStats.verifiedCustomers}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-purple-600">Pending KYC</p>
                <p className="text-xl font-bold text-yellow-700">{currentViewStats.pendingKyc}</p>
              </div>
            </div>
          </CardContent>
        </Card>

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
          <SelectFilter
            setFilter={setTypeFilter}
            placeholder="All Types"
            list={[
              { text: "All Types", value: "all" },
              { text: "Individual", value: "individual" },
              { text: "Business", value: "business" },
            ]}
          />
        </div>

        {/* Table */}
        <ReportTableComponent<RegisteredReportsData>
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
            <p className="text-sm text-gray-400 mt-1">Try adjusting your filters or search terms</p>
          </div>
        )}
      </CardContent>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="fixed inset-0 flex items-center justify-center z-50">
          <div className="sm:max-w-[425px] w-full bg-white p-6 rounded-2xl shadow-xl border border-slate-200">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold text-slate-900">
                Confirm Customer Deletion
              </DialogTitle>
              <DialogDescription className="text-sm text-slate-600 mt-1">
                Are you sure you want to delete <strong>{customerToDelete?.name}</strong>?
                <br />
                <span className="text-xs text-red-500">
                  Customer Type: {customerToDelete?.type} • Status: {customerToDelete?.status}
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

export default RegDataTable;