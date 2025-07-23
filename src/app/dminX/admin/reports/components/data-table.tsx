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
  import {  useGetAdmins } from "@/services/admin";
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
interface DATA{
  userId: number;
  email: string;
  totalSpent: number;
  orderCount: number;
  status: string;
  name:string;
}

const DataTable: React.FC<DataTableProps> = ({ customers,refetch }) => {

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    const [adminToDelete, setAdminToDelete] = useState<null | DATA>(null);

  console.log("checking new customer", customers)
  const pageSize = 20;
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [filter, setFilter] = useState<string>("");

  const onPageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Filter customers based on status
  const filteredCustomers = customers.filter(customer => 
    statusFilter === "all" ? true : customer.status === statusFilter
  );

  const tableData: ReportsData[] = filteredCustomers.map((customer) => ({
    id: customer.userId,
    name: customer.email.split('@')[0], // Use email prefix as name
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
          <p>{item.name}</p>
          <p className="font-normal text-[0.75rem] text-[#A0AEC0]">
            {item.email}
          </p>
        </div>
      </div>
    ),
    status: (item: ReportsData) => (
      <div className="font-normal">{item.status || 'N/A'}</div>),
    totalsales: (item: ReportsData) => (
      <span className="font-normal">{item.totalsales}</span>
    ),
    aov: (item: ReportsData) => (
      <div className="font-normal">{item.aov}</div>
    ),
    ordercount: (item: ReportsData) => (
      <span className="font-normal">{item.ordercount}</span>
    ),
    action: (item: any) => (
      <div className="flex gap-2.5">
        	<Link
					href={`${ROUTES.ADMIN.SIDEBAR.CUSTOMERSREPORTS}/${item?.id}?tab=general`}
					className="bg-[#27A376] p-2.5 rounded-lg"
				>
					<ViewIcon />
				</Link>
        <div  onClick={()=> openDeleteDialog(item)}  className="bg-[#E03137] p-2.5 rounded-lg">
          <DeleteIcon />
        </div>
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
    name: "Customer Name",
    status: "Status",
    totalsales: "Total Sales",
    action: "",
    aov: "AOV",
    ordercount: "Order Count",
  };

  const { deleteAdminPayload, deleteAdminIsLoading } = useDelete(() => {
      toast.success("delete successfully");
      setDeleteDialogOpen(false);
      refetch();
    });

      const handleDeleteAdmin = async () => {
        if (adminToDelete) {
          try {
            await deleteAdminPayload(adminToDelete.userId);
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
          Detailed Metrics Table
        </h6>

        <div className="flex items-center gap-4 mb-6">
          <InputFilter setQuery={setFilter} placeholder="Search customers" />
          <SelectFilter
            setFilter={setStatusFilter}
            placeholder="Select Status"
            list={[
              { text: "All Statuses", value: "all" },
              { text: "Active", value: "ACTIVE" },
              { text: "Inactive", value: "INACTIVE" },
            ]}
          />
        </div>
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
              
            >
              Cancel
            </Button>
            <Button 
               variant="destructive"
              onClick={handleDeleteAdmin}
              disabled={deleteAdminIsLoading ||admin?.roles[0]?.role?.name !=="super_admin"}
              
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

export default DataTable;

// "use client";

// import Image from "next/image";
// import { useState } from "react";
// import { Card, CardContent } from "@/components/ui/card";
// import { DeleteIcon, ViewIcon } from "../../../../../../public/icons";
// import { ReportTableComponent } from "@/components/custom-table/reportIndex";
// import { SelectFilter } from "@/app/(admin)/components/select-filter";
// import { InputFilter } from "@/app/(admin)/components/input-filter";
// import { ReportsData } from "@/types";

// interface DataTableProps {
//   customers: Array<{
//     id: number;
//     email: string;
//     type: string;
//     name: string;
//     status: string;
//     kycStatus: string;
//     joinDate: string;
//     role: string;
//   }>;
// }

// const DataTable: React.FC<DataTableProps> = ({ customers }) => {
//   const pageSize = 10;
//   const [currentPage, setCurrentPage] = useState(1);
//   const [statusFilter, setStatusFilter] = useState<string>("all");
//   const [typeFilter, setTypeFilter] = useState<string>("all");

//   const onPageChange = (page: number) => {
//     setCurrentPage(page);
//   };

//   // Filter customers based on status and type
//   const filteredCustomers = customers.filter(customer => 
//     (statusFilter === "all" || customer.status === statusFilter) &&
//     (typeFilter === "all" || customer.type === typeFilter)
//   );

//   const tableData: ReportsData[] = filteredCustomers.map((customer) => ({
//     id: customer.id,
//     name: customer.name,
//     email: customer.email,
//     type: customer.type,
//     status: customer.status,
//     kycStatus: customer.kycStatus,
//     joinDate: new Date(customer.joinDate).toLocaleDateString(),
//     role: customer.role
//   }));

//   const cellRenderers = {
//     name: (item: ReportsData) => (
//       <div className="font-normal flex items-center gap-3">
//         <Image
//           src="/images/user-avatar.jpg"
//           width={24}
//           height={24}
//           alt="Customer avatar"
//           className="w-6 h-6 rounded-full"
//         />
//         <div>
//           <p className="font-medium">{item.name}</p>
//           <p className="text-sm text-gray-500">{item.email}</p>
//         </div>
//       </div>
//     ),
//     status: (item: ReportsData) => (
//       <span className={`px-2 py-1 rounded-full text-xs ${
//         item.status === "ACTIVE" 
//           ? "bg-green-100 text-green-800" 
//           : "bg-red-100 text-red-800"
//       }`}>
//         {item.status}
//       </span>
//     ),
//     kycStatus: (item: ReportsData) => (
//       <span className={`px-2 py-1 rounded-full text-xs ${
//         item.kycStatus === "verified" 
//           ? "bg-blue-100 text-blue-800" 
//           : "bg-yellow-100 text-yellow-800"
//       }`}>
//         {item.kycStatus}
//       </span>
//     ),
//     type: (item: ReportsData) => (
//       <span className="capitalize">{item.type}</span>
//     ),
//     action: (item: ReportsData) => (
//       <div className="flex gap-2.5">
//         <button className="bg-[#27A376] p-2.5 rounded-lg hover:bg-[#1f875d]">
//           <ViewIcon />
//         </button>
//         <button className="bg-[#E03137] p-2.5 rounded-lg hover:bg-[#c22a2f]">
//           <DeleteIcon />
//         </button>
//       </div>
//     ),
//   };

//   const columnOrder: (keyof ReportsData)[] = [
//     "name",
//     "type",
//     "status",
//     "kycStatus",
//     "joinDate",
//     "role",
//     "action"
//   ];

//   const columnLabels = {
//     name: "Customer Name",
//     type: "Customer Type",
//     status: "Status",
//     kycStatus: "KYC Status",
//     joinDate: "Join Date",
//     role: "Role",
//     action: ""
//   };

//   return (
//     <Card className="bg-white">
//       <CardContent className="p-6">
//         <h6 className="font-semibold text-lg text-[#111827] mb-6">
//           New Customers Overview
//         </h6>

//         <div className="flex items-center gap-4 mb-6">
//           <InputFilter 
//             setQuery={(query) => console.log('Search:', query)} 
//             placeholder="Search customers..." 
//           />
//           <SelectFilter
//             setFilter={setStatusFilter}
//             placeholder="Filter Status"
//             list={[
//               { text: "All Statuses", value: "all" },
//               { text: "Active", value: "ACTIVE" },
//               { text: "Inactive", value: "INACTIVE" },
//             ]}
//           />
//           <SelectFilter
//             setFilter={setTypeFilter}
//             placeholder="Filter Type"
//             list={[
//               { text: "All Types", value: "all" },
//               { text: "Individual", value: "individual" },
//               { text: "Business", value: "business" },
//             ]}
//           />
//         </div>
        
//         <ReportTableComponent<ReportsData>
//           tableData={tableData}
//           currentPage={currentPage}
//           onPageChange={onPageChange}
//           totalPages={Math.ceil(filteredCustomers.length / pageSize)}
//           cellRenderers={cellRenderers}
//           columnOrder={columnOrder}
//           columnLabels={columnLabels}
//           isLoading={false}
//         />
//       </CardContent>
//     </Card>
//   );
// };

// export default DataTable;