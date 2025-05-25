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
  import {  useGetAdmins } from "@/services/admin";

interface DataTableProps {
  customers: Array<{
    id: number;
    email: string;
    type: string;
    name: string;
    status: string;
    kycStatus: string;
    joinDate: string;
    role: string;
  }>;
  refetch: () => void;
}

interface DATA{
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
  
      const [adminToDelete, setAdminToDelete] = useState<null | DATA>(null);
  
  const pageSize = 20;
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  const onPageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Filter customers based on status and type
  const filteredCustomers = customers.filter(customer => 
    (statusFilter === "all" || customer.status === statusFilter) &&
    (typeFilter === "all" || customer.type === typeFilter)
  );

  const tableData: RegisteredReportsData[] = filteredCustomers.map((customer) => ({
    id: customer.id,
    name: customer.name,
    email: customer.email,
    type: customer.type,
    status: customer.status,
    kycStatus: customer.kycStatus,
    joinDate: new Date(customer.joinDate).toLocaleDateString(),
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
    status: (item: RegisteredReportsData) => (
      <span className={`px-2 py-1 rounded-full text-xs ${
        item.status === "ACTIVE" 
          ? "bg-green-100 text-green-800" 
          : "bg-red-100 text-red-800"
      }`}>
        {item.status}
      </span>
    ),
    kycStatus: (item: RegisteredReportsData) => (
      <span className={`px-2 py-1 rounded-full text-xs ${
        item.kycStatus === "verified" 
          ? "bg-blue-100 text-blue-800" 
          : "bg-yellow-100 text-yellow-800"
      }`}>
        {item.kycStatus}
      </span>
    ),
    type: (item: RegisteredReportsData) => (
      <span className="capitalize">{item.type}</span>
    ),
    action: (item: DATA) => (
      <div className="flex gap-2.5">
      <Link
                href={`${ROUTES.ADMIN.SIDEBAR.REPORTS}/${item?.id}?tab=general`}
                className="bg-[#2F78EE] p-2.5 rounded-lg cursor-pointer"
              >
                <ViewIcon />
              </Link>
        <button onClick={()=> openDeleteDialog(item)} className="bg-[#E03137] p-2.5 rounded-lg hover:bg-[#c22a2f]">
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
    name: "Customer Name",
    type: "Customer Type",
    status: "Status",
    kycStatus: "KYC Status",
    joinDate: "Join Date",
    role: "Role",
    action: ""
  };

  const { deleteAdminPayload, deleteAdminIsLoading } = useDelete(() => {
        toast.success("delete successfully");
        setDeleteDialogOpen(false);
        refetch();
      });
  
        const handleDeleteAdmin = async () => {
          if (adminToDelete) {
            try {
              await deleteAdminPayload(adminToDelete.id);
            } catch (error) {
              toast.error("Failed to delete admin");
              console.error(error);
            }
          }
        };
  
          const openDeleteDialog = (admin: DATA) => {
            setAdminToDelete(admin);
            setDeleteDialogOpen(true);
          };
           const[email, setEmail] = useState("");
          
             useEffect(() => {
              if (typeof window !== "undefined") {
                const email = localStorage.getItem("userEmail") || 
                             sessionStorage.getItem("userEmail");
                // Use the email
                setEmail(email? email : "")
              }
            }, []);
          
            const { adminsData, isAdminsLoading } = useGetAdmins({ enabled: true });
            const admin = adminsData?.find((admin: {email : string }) => admin.email === email);
  

  return (
    <Card className="bg-white">
      <CardContent className="p-6">
        <h6 className="font-semibold text-lg text-[#111827] mb-6">
          New Customers Overview
        </h6>

        <div className="flex items-center gap-4 mb-6">
          <InputFilter 
            setQuery={(query) => console.log('Search:', query)} 
            placeholder="Search customers..." 
          />
          <SelectFilter
            setFilter={setStatusFilter}
            placeholder="Filter Status"
            list={[
              { text: "All Statuses", value: "all" },
              { text: "Active", value: "ACTIVE" },
              { text: "Inactive", value: "INACTIVE" },
            ]}
          />
          <SelectFilter
            setFilter={setTypeFilter}
            placeholder="Filter Type"
            list={[
              { text: "All Types", value: "all" },
              { text: "Individual", value: "individual" },
              { text: "Business", value: "business" },
            ]}
          />
        </div>
        
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
      </CardContent>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="fixed inset-0 flex items-center justify-center z-50">
          <div className="sm:max-w-[425px] w-full bg-white p-6 rounded-2xl shadow-xl border border-slate-200">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-slate-900">Confirm deletion</DialogTitle>
            <DialogDescription className="text-sm text-slate-600 mt-1">
              Are you sure you want to delete {adminToDelete?.name}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-6 flex justify-end space-x-3">
            <Button 
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={deleteAdminIsLoading ||admin?.roles[0]?.role?.name !=="super_admin"}
            >
              Cancel
            </Button>
            <Button 
               variant="destructive"
              onClick={handleDeleteAdmin}
              
            >
              {deleteAdminIsLoading ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default RegDataTable;