"use client";

import type React from "react";
import { useState, useMemo, useEffect } from "react";
import { Eye, Trash2, Search, Filter, ChevronDown } from "lucide-react";
import Pagination from "./pagination";
import { useGetAdmins } from "@/services/admin";
import { useDelete } from "@/services/reports";
import { toast } from "sonner";
import { DeleteIcon, ViewIcon } from "../../../../../../public/icons";

interface Customer {
	name: string | null;
	email: string;
	type: "individual" | "business";
	totalSales: number;
	orderCount?: number;
  
}

interface CustomerTableProps {
	data: Customer[];
  refetch: () => void;
}

const CustomerTable: React.FC<CustomerTableProps> = ({ data,refetch }) => {
	const [currentPage, setCurrentPage] = useState(1);
	const [postsPerPage] = useState(10);
	const [filters, setFilters] = useState({ name: "", email: "", type: "" });
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const [customerToDelete, setCustomerToDelete] = useState<Customer | null>(
		null
	);
    const [adminToDelete, setAdminToDelete] = useState<null | any>(null);
	const [showFilters, setShowFilters] = useState(false);

	const [isViewModalOpen, setIsViewModalOpen] = useState(false);
	const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
		null
	);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

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
        
                const openDeleteDialog = (admin: any) => {
                  setAdminToDelete(admin);
                  setDeleteDialogOpen(true);
                };

	const handleFilterChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
	) => {
		const { name, value } = e.target;
		setFilters((prev) => ({ ...prev, [name]: value }));
		setCurrentPage(1);
	};

  const filteredData = useMemo(() => {
    return (
      data &&
      data.filter((customer) => {
        const nameMatch =
          !filters.name ||
          (customer.name?.toLowerCase() ?? "").includes(filters.name.toLowerCase());
  
        const emailMatch =
          !filters.email ||
          customer.email?.toLowerCase().includes(filters.email.toLowerCase());
  
        const typeMatch =
          !filters.type || customer.type?.toLowerCase() === filters.type.toLowerCase();
  
        return nameMatch && emailMatch && typeMatch;
      })
    );
  }, [data, filters]);

	const indexOfLastPost = currentPage * postsPerPage;
	const indexOfFirstPost = indexOfLastPost - postsPerPage;
	const currentPosts = filteredData?.slice(indexOfFirstPost, indexOfLastPost);

  console.log(filteredData, "dataconFirm", data, "databeforeFilter")

	const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

	const handleView = (customer: Customer) => {
		setSelectedCustomer(customer);
		setIsViewModalOpen(true);
	};

	const openDeleteModal = (customer: Customer) => {
		setCustomerToDelete(customer);
		setIsDeleteModalOpen(true);
	};

	const handleDelete = () => {
		if (customerToDelete) {
			alert(`Deleting customer: 	${customerToDelete.name ?? "N/A"}`);
			setIsDeleteModalOpen(false);
			setCustomerToDelete(null);
		}
	};

	const getTypeBadgeClass = (type: string) => {
		switch (type) {
			case "individual":
				return "bg-blue-50 text-blue-700 border-blue-200";
			case "business":
				return "bg-purple-50 text-purple-700 border-purple-200";
			default:
				return "bg-gray-50 text-gray-700 border-gray-200";
		}
	};

	// Mobile card view for each customer
	const CustomerCard = ({ customer }: { customer: Customer }) => (
		<div className="bg-white p-4 rounded-lg border border-gray-200 mb-3">
			<div className="flex justify-between items-start mb-3">
				<div>
					<h3 className="font-medium text-gray-900">
						{customer.name ?? "N/A"}
					</h3>
					<p className="text-sm text-gray-600">{customer.email}</p>
				</div>
				<span
					className={`px-2.5 py-1 text-xs font-medium rounded-full border 	${getTypeBadgeClass(
						customer.type
					)}`}
				>
					{customer.type}
				</span>
			</div>

			<div className="grid grid-cols-2 gap-2 mb-3">
				<div>
					<p className="text-xs text-gray-500">Total Sales</p>
					<p className="text-sm font-medium">
							₦{customer.totalSales.toLocaleString()}
					</p>
				</div>
				<div>
					<p className="text-xs text-gray-500">Orders</p>
					<p className="text-sm">{customer.orderCount ?? "N/A"}</p>
				</div>
			</div>

			<div className="flex justify-end space-x-3">
				<button
					onClick={() => handleView(customer)}
					className="text-blue-600 hover:text-blue-800 transition-colors p-1 rounded-full hover:bg-blue-50"
					aria-label="View customer"
				>
				  <ViewIcon />
				</button>
				<button
					onClick={() => {openDeleteModal(customer), setAdminToDelete(customer);}}
					className="text-red-600 hover:text-red-800 transition-colors p-1 rounded-full hover:bg-red-50"
					aria-label="Delete customer"
          disabled={deleteAdminIsLoading ||admin?.roles[0]?.role?.name !=="super_admin"}
				>
					  <DeleteIcon />
				</button>
			</div>
		</div>
	);

	return (
		<div className="w-full bg-white rounded-lg shadow-sm border border-gray-100 max-w-full">
			{/* Header with filter toggle for mobile */}
			<div className="p-4 border-b border-gray-100 flex justify-between items-center">
				<h2 className="text-lg font-medium text-gray-900">Customers</h2>
				<button
					onClick={() => setShowFilters(!showFilters)}
					className="md:hidden p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md"
					aria-label="Toggle filters"
				>
					<Filter className="h-5 w-5" />
				</button>
			</div>

			{/* Filters - responsive */}
			<div
				className={`border-b border-gray-100 	${
					showFilters ? "block" : "hidden md:block"
				}`}
			>
				<div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-3">
					<div className="relative">
						<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
							<Search className="h-4 w-4 text-gray-400" />
						</div>
						<input
							type="text"
							name="name"
							value={filters.name}
							onChange={handleFilterChange}
							placeholder="Filter by name"
							className="pl-10 w-full h-10 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
						/>
					</div>

					<div className="relative">
						<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
							<Search className="h-4 w-4 text-gray-400" />
						</div>
						<input
							type="text"
							name="email"
							value={filters.email}
							onChange={handleFilterChange}
							placeholder="Filter by email"
							className="pl-10 w-full h-10 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
						/>
					</div>

					<div className="relative">
						<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
							<Filter className="h-4 w-4 text-gray-400" />
						</div>
						<select
							name="type"
							value={filters.type}
							onChange={handleFilterChange}
							className="pl-10 w-full h-10 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none transition-all pr-10"
						>
							<option value="">All Types</option>
							<option value="individual">Individual</option>
							<option value="business">Business</option>
						</select>
						<div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
							<ChevronDown className="h-4 w-4 text-gray-400" />
						</div>
					</div>
				</div>
			</div>

			{/* Mobile view */}
			<div className="md:hidden p-4">
				{currentPosts?.length === 0 ? (
					<div className="text-center py-8 text-gray-500">
						No matching records found.
					</div>
				) : (
					currentPosts?.map((customer, index) => (
						<CustomerCard key={index} customer={customer} />
					))
				)}
			</div>

			{/* Desktop table view */}
			<div className="hidden md:block overflow-x-auto">
				<div className="inline-block min-w-full align-middle">
					<table className="min-w-full divide-y divide-gray-200">
						<thead>
							<tr className="bg-gray-50 text-left">
								<th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
									Name
								</th>
								<th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
									Email
								</th>
								<th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
									Type
								</th>
								<th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
									Total Sales
								</th>
								<th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
									Order Count
								</th>
								<th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
									Actions
								</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-gray-100 bg-white">
							{currentPosts?.length === 0 ? (
								<tr>
									<td
										colSpan={6}
										className="px-4 py-8 text-center text-gray-500"
									>
										No matching records found.
									</td>
								</tr>
							) : (
								currentPosts?.map((customer, index) => (
									<tr
										key={index}
										className="hover:bg-gray-50 transition-colors"
									>
										<td className="px-4 py-3 text-sm text-gray-900">
											{customer.name ?? "N/A"}
										</td>
										<td className="px-4 py-3 text-sm text-gray-600 max-w-[200px] truncate">
											{customer.email}
										</td>
										<td className="px-4 py-3">
											<span
												className={`px-2.5 py-1 text-xs font-medium rounded-full border 	${getTypeBadgeClass(
													customer.type
												)}`}
											>
												{customer?.type}
											</span>
										</td>
										<td className="px-4 py-3 text-sm font-medium text-gray-900">
											₦{customer?.totalSales.toLocaleString()}
										</td>
										<td className="px-4 py-3 text-sm text-gray-600">
											{customer?.orderCount ?? "N/A"}
										</td>
										<td className="px-4 py-3 text-sm">
											<div className="flex space-x-3">
												<button
													onClick={() => handleView(customer)}
												className="bg-[#27A376] p-2.5 rounded-lg"
													aria-label="View customer"
												>
													<ViewIcon />
												</button>
												<button
													onClick={() => openDeleteModal(customer)}
													className="bg-[#E03137] p-2.5 rounded-lg"
													aria-label="Delete customer"
                          disabled={deleteAdminIsLoading ||admin?.roles[0]?.role?.name !=="super_admin"}
												>
												 <DeleteIcon />
												</button>
											</div>
										</td>
									</tr>
								))
							)}
						</tbody>
					</table>
				</div>
			</div>

			{/* Pagination - responsive */}
			<div className="px-4 py-3 border-t border-gray-100">
				<div className="flex flex-col sm:flex-row justify-between items-center gap-4">
					<div className="text-sm text-gray-500 w-full sm:w-auto text-center sm:text-left">
						Showing {currentPosts?.length > 0 ? indexOfFirstPost + 1 : 0} to{" "}
						{Math.min(indexOfLastPost, filteredData?.length)} of{" "}
						{filteredData?.length} entries
					</div>

					<Pagination
						postsPerPage={postsPerPage}
						totalPosts={filteredData?.length}
						paginate={paginate}
						currentPage={currentPage}
					/>
				</div>
			</div>

			{/* Delete Modal */}
			{isDeleteModalOpen && (
				<div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 p-4">
					<div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-200">
						<div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100 mx-auto mb-4">
							<Trash2 className="h-6 w-6 text-red-600" />
						</div>
						<h3 className="text-lg font-semibold text-center text-gray-900 mb-2">
							Delete Customer
						</h3>
						<p className="text-gray-600 text-center mb-6">
							Are you sure you want to delete{" "}
							{customerToDelete?.name ?? "this customer"}? This action cannot be
							undone.
						</p>
						<div className="flex justify-end gap-3">
							<button
								className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
								onClick={() => setIsDeleteModalOpen(false)}
							>
								Cancel
							</button>
							<button
								className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
								onClick={handleDelete}
							>
								Delete
							</button>
						</div>
					</div>
				</div>
			)}
			{isViewModalOpen && selectedCustomer && (
				<div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 p-4">
					<div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-200">
						<div className="flex items-center justify-between mb-4">
							<h3 className="text-lg font-semibold text-gray-900">
								Customer Details
							</h3>
							<button
								onClick={() => setIsViewModalOpen(false)}
								className="text-gray-500 hover:text-gray-700 transition-colors"
								aria-label="Close modal"
							>
								&times;
							</button>
						</div>
						<div className="space-y-2">
							<div>
								<p className="text-sm text-gray-500">Name</p>
								<p className="text-base font-medium text-gray-900">
									{selectedCustomer?.name ?? "N/A"}
								</p>
							</div>
							<div>
								<p className="text-sm text-gray-500">Email</p>
								<p className="text-base font-medium text-gray-900">
									{selectedCustomer?.email}
								</p>
							</div>
							<div>
								<p className="text-sm text-gray-500">Type</p>
								<p className="text-base font-medium text-gray-900 capitalize">
									{selectedCustomer?.type}
								</p>
							</div>
							<div>
								<p className="text-sm text-gray-500">Total Sales</p>
								<p className="text-base font-medium text-gray-900">
									₦{selectedCustomer?.totalSales.toLocaleString()}
								</p>
							</div>
							<div>
								<p className="text-sm text-gray-500">Order Count</p>
								<p className="text-base font-medium text-gray-900">
									{selectedCustomer?.orderCount ?? "N/A"}
								</p>
							</div>
						</div>
						<div className="mt-6 flex justify-end">
							<button
								onClick={() => setIsViewModalOpen(false)}
								className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
							>
								Close
							</button>
						</div>
					</div>
				</div>
			)}
      {deleteDialogOpen && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
    <div className="sm:max-w-[425px] w-full bg-white p-6 rounded-2xl shadow-xl border border-slate-200">
      <div>
        <h2 className="text-xl font-semibold text-slate-900">Confirm deletion</h2>
        <p className="text-sm text-slate-600 mt-1">
          Are you sure you want to delete {adminToDelete?.name}? This action cannot be undone.
        </p>
      </div>
      <div className="mt-6 flex justify-end space-x-3">
        <button
          className="px-4 py-2 border rounded-lg text-sm text-slate-700 hover:bg-slate-100"
          onClick={() => setDeleteDialogOpen(false)}
        >
          Cancel
        </button>
        <button
          className="px-4 py-2 rounded-lg text-sm text-white bg-red-600 hover:bg-red-700 disabled:opacity-50"
          onClick={handleDeleteAdmin}
          disabled={deleteAdminIsLoading || admin?.roles[0]?.role?.name !== "super_admin"}
        >
          {deleteAdminIsLoading ? "Deleting..." : "Delete"}
        </button>
      </div>
    </div>
  </div>
)}

		</div>
	);
};

export default CustomerTable;

