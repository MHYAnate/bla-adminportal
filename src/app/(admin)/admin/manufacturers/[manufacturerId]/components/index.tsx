// "use client";

// import Header from "@/app/(admin)/components/header";
// import { Card, CardContent } from "@/components/ui/card";
// import SupplierManagementCard from "@/components/widgets/supplier-management";
// import { useEffect, useState } from "react";
// import {
//     useDeleteManufacturerProduct,
//     useGetManufacturerProducts,
//     useGetManufacturers,
//     useUpdateManufacturerStatus,
//     useDeleteManufacturer,
//     useGetManufacturer
// } from "@/services/manufacturers";
// import {
//     Dialog,
//     DialogContent,
//     DialogHeader,
//     DialogTitle,
// } from "@/components/ui/dialog";
// import { ChevronLeft } from "lucide-react";
// import EditManufacturer from "../../components/edit-manufacturer";
// import DeleteManufacturer from "../../components/delete-manufacturer";
// import ViewProduct from "@/app/(admin)/admin/products/components/view-product";
// import EditProduct from "@/app/(admin)/admin/products/components/edit-products";
// import { InputFilter } from "@/app/(admin)/components/input-filter";
// import { SelectFilter } from "@/app/(admin)/components/select-filter";
// import DatePickerWithRange from "@/components/ui/date-picker";
// import { productFilterList, productTypeList } from "@/constant";
// import { capitalizeFirstLetter, showSuccessAlert } from "@/lib/utils";
// import { useDeleteProduct } from "@/services/products";
// import { useRouter } from "next/navigation";
// import ManufacturerProductTable from "./manufacturer-product-table";
// import DeleteContent from "@/app/(admin)/components/delete-content";
// import { toast } from "sonner";

// interface ManufacturerDetailsProps {
//     manufacturerId: string;
// }

// const ManufacturerDetails: React.FC<ManufacturerDetailsProps> = ({ manufacturerId }) => {
//     const router = useRouter();
//     const [open, setOpen] = useState<boolean>(false);
//     const [tab, setTab] = useState<string>("update");
//     const [filter, setFilter] = useState<string>("");
//     const [status, setStatus] = useState<string>("all");
//     const [pageSize, setPageSize] = useState<string>("10");
//     const [currentPage, setCurrentPage] = useState<number>(1);
//     const [selectedProduct, setSelectedProduct] = useState<any>(null);

//     console.log('🔄 ManufacturerDetails - manufacturerId:', manufacturerId);

//     const onPageChange = (page: number) => {
//         setCurrentPage(page);
//     };

//     // FIXED: Get manufacturers data for finding manufacturer info
//     const {
//         getManufacturersData,
//         getManufacturersIsLoading,
//         refetchManufacturers,
//         setManufacturersFilter,
//     } = useGetManufacturers();

//     // Find manufacturer from the list
//     const findManufacturerById = (id: string) => {
//         if (!getManufacturersData?.data) return null;
//         return getManufacturersData.data.find(
//             (manufacturer: { id: any }) => String(manufacturer.id) === String(id)
//         );
//     };


//     const { data: manufacturer, isLoading, isError, error } = useGetManufacturer(
//         manufacturerId, 
//         {
//           includeProducts: true,
//           includeProductCount: true,
//           productsLimit: 3,
//         }
//       );

//     console.log(manufacturer,  "manuInfo")


//     const [filters, setFilters] = useState({
//         page: 1,
//         pageSize: 20,
//         type: "all",
//         search: "",
//         categoryId: null,
//       });
    
//       const {
//         getManufacturerProductsIsLoading,
//         getManufacturerProductsData,
//         getManufacturerProductsError,
//         refetchManufacturerProducts,
//         setManufacturerProductsFilter,
//       } = useGetManufacturerProducts(manufacturerId);
    
//       // Apply filters
//       const handleFilterChange = (newFilters: { page: number; pageSize: number; type: string; search: string; categoryId: null; }) => {
//         setFilters((prev) => ({ ...prev, ...newFilters }));
//         setManufacturerProductsFilter({ ...filters, ...newFilters });
//       };
    
//       const { data: products, pagination } = getManufacturerProductsData;
//     // Delete product hook
//     const {
//         deleteProduct,
//         isLoading: isDeletingProduct
//     } = useDeleteProduct({
//         onSuccess: () => {
//             toast.success("Product deleted successfully!");
//             refetchManufacturerProducts();
//             setOpen(false);
//         },
//     });

//     // Delete manufacturer hook
//     const {
//         deleteManufacturer,
//         isLoading: isDeletingManufacturer
//     } = useDeleteManufacturer({
//         onSuccess: () => {
//             toast.success("Manufacturer deleted successfully!");
//             setOpen(false);
//             setTimeout(() => {
//                 router.push('/admin/manufacturers');
//             }, 1000);
//         },
//     });

//     // Update manufacturer status hook
//     const {
//         updateManufacturerStatusData,
//         updateManufacturerStatusIsLoading,
//         updateManufacturerStatusPayload,
//     } = useUpdateManufacturerStatus(() => {
//         // refetchManufacturerInfo();
//         refetchManufacturers();
//         toast.success("Manufacturer status updated successfully!");
//     });

//     // Build filter payload for products
//     const buildFilterPayload = () => {
//         const payload: any = {
//             page: currentPage,
//             pageSize: parseInt(pageSize),
//         };

//         if (filter.trim()) {
//             payload.search = filter.trim();
//         }

//         if (status !== "all") {
//             payload.status = status;
//         }

//         return payload;
//     };

//     // Handle filter changes
//     useEffect(() => {
//         const payload = buildFilterPayload();

//         console.log('🔄 ManufacturerDetails - Triggering API with:', {
//             manufacturerId,
//             payload,
//             filterValue: filter,
//             statusValue: status
//         });

//         setManufacturerProductsFilter(payload);
//     }, [manufacturerId, filter, status, currentPage, pageSize]);

//     // Debug API responses
//     useEffect(() => {
//         console.log('🔧 Filter values changed:', {
//             filter,
//             status,
//             currentPage,
//             pageSize: pageSize,
//             manufacturerId,
//             payload: buildFilterPayload()
//         });
//     }, [filter, status, currentPage, pageSize, manufacturerId]);

//     // Handlers for product actions
//     const handleViewProduct = (product: any) => {
//         setSelectedProduct(product);
//         setTab("view");
//         setOpen(true);
//     };

//     const handleEditProduct = (product: any) => {
//         setSelectedProduct(product);
//         setTab("edit");
//         setOpen(true);
//     };

//     const handleDeleteProduct = (product: any) => {
//         setSelectedProduct(product);
//         setTab("delete-product");
//         setOpen(true);
//     };

//     const handleConfirmDelete = () => {
//         if (selectedProduct) {
//             deleteProduct(selectedProduct.id);
//         }
//     };

//     const handleDeleteManufacturer = async () => {
//         if (!manufacturer) return;

//         try {
//             await deleteManufacturer(manufacturer.id);
//         } catch (error) {
//             console.error("Delete failed:", error);
//             toast.error("Failed to delete manufacturer");
//         }
//     };

//     const handleFilterReset = () => {
//         setFilter("");
//         setStatus("all");
//         setCurrentPage(1);
//     };

//     const renderItem = () => {
//         switch (tab) {
//             case "update":
//                 return (
//                     <EditManufacturer
//                         setClose={() => setOpen(false)}
//                         manufacturer={manufacturer}
//                     />
//                 );
//             case "delete":
//                 return (
//                     <DeleteManufacturer
//                         handleClose={() => setOpen(false)}
//                         title={manufacturer?.name || "Manufacturer"}
//                         handleClick={handleDeleteManufacturer}
//                         loading={isDeletingManufacturer}
//                         warningMessage="Deleting this manufacturer will permanently remove it and all associated data. This action cannot be undone."
//                     />
//                 );
//             case "view":
//                 return selectedProduct ? (
//                     <ViewProduct
//                         productData={selectedProduct}
//                         setClose={() => setOpen(false)}
//                     />
//                 ) : null;
//             case "edit":
//                 return selectedProduct ? (
//                     <EditProduct
//                         product={selectedProduct}
//                         setClose={() => setOpen(false)}
//                         manufacturers={getManufacturersData?.data || []}
//                         categories={[]} // Add categories if available
//                     />
//                 ) : null;
//             case "delete-product":
//                 return (
//                     <DeleteContent
//                         handleClose={() => setOpen(false)}
//                         title={selectedProduct?.name || "Product"}
//                         handleClick={handleConfirmDelete}
//                         isLoading={isDeletingProduct}
//                     />
//                 );
//             default:
//                 return null;
//         }
//     };

//     if (getManufacturersIsLoading || isLoading) {
//         return (
//             <div className="flex items-center justify-center min-h-screen">
//                 <div className="text-center">
//                     <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
//                     <p className="mt-4 text-gray-600">Loading manufacturer details...</p>
//                 </div>
//             </div>
//         );
//     }

//     if (!manufacturer ) {
//         return (
//             <div className="flex items-center justify-center min-h-screen">
//                 <div className="text-center">
//                     <h2 className="text-2xl font-bold text-gray-900 mb-2">Manufacturer Not Found</h2>
//                     <p className="text-gray-600 mb-4">The manufacturer you're looking for doesn't exist.</p>
//                     <button
//                         onClick={() => router.push('/admin/manufacturers')}
//                         className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
//                     >
//                         Back to Manufacturers
//                     </button>
//                 </div>
//             </div>
//         );
//     }


//     return (
//         <div className="p-6">
//             <Header
//                 title={`${manufacturer?.name  || 'Manufacturer'} Details`}
//                 subtext="Manage manufacturer information and products"
//                 showBack={true}
//             />

//             <div className="mb-6">
//                 <SupplierManagementCard
//                     item={manufacturer }
//                     handleUpdateManufacturerStatus={async () => {
//                         const newStatus = !(manufacturer?.status );
//                         await updateManufacturerStatusPayload({
//                             payload: { status: newStatus },
//                             id: manufacturerId
//                         });
//                     }}
//                     showToggle={true}
//                     showOptions={true}
//                     setTab={setTab}
//                     setOpen={setOpen}
//                     loading={updateManufacturerStatusIsLoading}
//                 />
//             </div>

//             <Card>
//                 <CardContent className="p-6">
//                     <div className="flex justify-between items-center mb-6">
//                         <h3 className="text-xl font-semibold text-gray-900">Products</h3>
//                         <div className="flex items-center gap-4">
//                             <div className="text-sm text-gray-500">
//                                 {getManufacturerProductsData?.pagination?.totalItems || 0} total products
//                             </div>
//                             <button
//                                 onClick={() => {
//                                     setTab("update");
//                                     setOpen(true);
//                                 }}
//                                 className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium"
//                             >
//                                 Edit Manufacturer
//                             </button>
//                         </div>
//                     </div>

//                     <div className="flex gap-4 mb-6">
//                         <InputFilter
//                             setQuery={setFilter}
//                             placeholder="Search by product name, description"
//                         />

//                         {/* <SelectFilter
//                             setFilter={setStatus}
//                             placeholder="Filters"
//                             list={productFilterList}
//                         /> */}
//                     </div>

//                     <ManufacturerProductTable
//                         handleEdit={handleEditProduct}
//                         handleView={handleViewProduct}
//                         handleDelete={handleDeleteProduct}
//                         setPageSize={setPageSize}
//                         data={getManufacturerProductsData?.data || []}
//                         currentPage={currentPage}
//                         onPageChange={onPageChange}
//                         pageSize={Number(pageSize)}
//                         totalPages={getManufacturerProductsData?.pagination?.totalPages || 1}
//                         loading={getManufacturerProductsIsLoading}
//                     />
//                 </CardContent>
//             </Card>

//             <Dialog open={open} onOpenChange={() => setOpen(!open)}>
//                 <DialogContent
//                     className={`${tab !== "delete" && tab !== "delete-product"
//                         ? "right-0 p-8 max-w-[47.56rem] h-screen overflow-y-scroll"
//                         : "max-w-[33.75rem] left-[50%] translate-x-[-50%] py-10"
//                         }`}
//                 >
//                     {tab !== "delete" && tab !== "delete-product" && (
//                         <DialogHeader>
//                             <DialogTitle className="mb-6 text-2xl font-bold text-[#111827] flex gap-4.5 items-center">
//                                 <div onClick={() => setOpen(false)} className="cursor-pointer">
//                                     <ChevronLeft size={24} />
//                                 </div>
//                                 {capitalizeFirstLetter(tab)}{" "}
//                                 {tab === "update" ? "Manufacturer" : "Product"}
//                             </DialogTitle>
//                         </DialogHeader>
//                     )}
//                     {renderItem()}
//                 </DialogContent>
//             </Dialog>
//         </div>
//     );
// };

// export default ManufacturerDetails;

// "use client";

// import Header from "@/app/(admin)/components/header";
// import { Card, CardContent } from "@/components/ui/card";
// import SupplierManagementCard from "@/components/widgets/supplier-management";
// import { useEffect, useState } from "react";
// import {
//   useDeleteManufacturerProduct,
//   useGetManufacturerProducts,
//   useGetManufacturers,
//   useUpdateManufacturerStatus,
//   useDeleteManufacturer,
//   useGetManufacturer
// } from "@/services/manufacturers";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import { ChevronLeft, ArrowLeft } from "lucide-react";
// import EditManufacturer from "../../components/edit-manufacturer";
// import DeleteManufacturer from "../../components/delete-manufacturer";
// import ViewProduct from "@/app/(admin)/admin/products/components/view-product";
// import EditProduct from "@/app/(admin)/admin/products/components/edit-products";
// import { InputFilter } from "@/app/(admin)/components/input-filter";
// import { SelectFilter } from "@/app/(admin)/components/select-filter";
// import { productFilterList } from "@/constant";
// import { capitalizeFirstLetter } from "@/lib/utils";
// import { useDeleteProduct } from "@/services/products";
// import { useRouter, useSearchParams } from "next/navigation";
// import ManufacturerProductTable from "./manufacturer-product-table";
// import DeleteContent from "@/app/(admin)/components/delete-content";
// import { toast } from "sonner";
// import { Button } from "@/components/ui/button";
// import useDebounce from "../components";

// interface ManufacturerDetailsProps {
//   manufacturerId: string;
// }

// const ManufacturerDetails: React.FC<ManufacturerDetailsProps> = ({ manufacturerId }) => {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const page = searchParams.get('page') || '1';
//   const searchQuery = searchParams.get('search') || '';
  
//   const [open, setOpen] = useState<boolean>(false);
//   const [tab, setTab] = useState<string>("update");
//   const [filter, setFilter] = useState<string>("");
//   const [status, setStatus] = useState<string>("all");
//   const [pageSize, setPageSize] = useState<string>("10");
//   const [currentPage, setCurrentPage] = useState<number>(1);
//   const [selectedProduct, setSelectedProduct] = useState<any>(null);

//   // Use debounced filter for API calls
//   const debouncedFilter = useDebounce(filter, 500);

//   const onPageChange = (page: number) => {
//     setCurrentPage(page);
//   };

//   // Add a back button function
//   const handleBack = () => {
//     router.push(`/admin/manufacturers?page=${page}${searchQuery ? `&search=${encodeURIComponent(searchQuery)}` : ''}`);
//   };

//   const {
//     getManufacturersData,
//     getManufacturersIsLoading,
//   } = useGetManufacturers();

//   const { data: manufacturer, isLoading, isError, error } = useGetManufacturer(
//     manufacturerId, 
//     {
//       includeProducts: true,
//       includeProductCount: true,
//       productsLimit: 3,
//     }
//   );

//   const {
//     getManufacturerProductsIsLoading,
//     getManufacturerProductsData,
//     getManufacturerProductsError,
//     refetchManufacturerProducts,
//     setManufacturerProductsFilter,
//   } = useGetManufacturerProducts(manufacturerId);

//   // Delete product hook
//   const {
//     deleteProduct,
//     isLoading: isDeletingProduct
//   } = useDeleteProduct({
//     onSuccess: () => {
//       toast.success("Product deleted successfully!");
//       refetchManufacturerProducts();
//       setOpen(false);
//     },
//   });

//   // Delete manufacturer hook
//   const {
//     deleteManufacturer,
//     isLoading: isDeletingManufacturer
//   } = useDeleteManufacturer({
//     onSuccess: () => {
//       toast.success("Manufacturer deleted successfully!");
//       setOpen(false);
//       setTimeout(() => {
//         router.push('/admin/manufacturers');
//       }, 1000);
//     },
//   });

//   // Update manufacturer status hook
//   const {
//     updateManufacturerStatusData,
//     updateManufacturerStatusIsLoading,
//     updateManufacturerStatusPayload,
//   } = useUpdateManufacturerStatus(() => {
//     refetchManufacturers();
//     toast.success("Manufacturer status updated successfully!");
//   });

//   // Handle filter changes with debounce
//   useEffect(() => {
//     const payload: any = {
//       page: currentPage,
//       pageSize: parseInt(pageSize),
//     };

//     if (debouncedFilter.trim()) {
//       payload.search = debouncedFilter.trim();
//     }

//     if (status !== "all") {
//       payload.status = status;
//     }

//     setManufacturerProductsFilter(payload);
//   }, [debouncedFilter, status, currentPage, pageSize, setManufacturerProductsFilter]);

//   // Handlers for product actions
//   const handleViewProduct = (product: any) => {
//     setSelectedProduct(product);
//     setTab("view");
//     setOpen(true);
//   };

//   const handleEditProduct = (product: any) => {
//     setSelectedProduct(product);
//     setTab("edit");
//     setOpen(true);
//   };

//   const handleDeleteProduct = (product: any) => {
//     setSelectedProduct(product);
//     setTab("delete-product");
//     setOpen(true);
//   };

//   const handleConfirmDelete = () => {
//     if (selectedProduct) {
//       deleteProduct(selectedProduct.id);
//     }
//   };

//   const handleDeleteManufacturer = async () => {
//     if (!manufacturer) return;

//     try {
//       await deleteManufacturer(manufacturer.id);
//     } catch (error) {
//       console.error("Delete failed:", error);
//       toast.error("Failed to delete manufacturer");
//     }
//   };

//   const renderItem = () => {
//     switch (tab) {
//       case "update":
//         return (
//           <EditManufacturer
//             setClose={() => setOpen(false)}
//             manufacturer={manufacturer}
//           />
//         );
//       case "delete":
//         return (
//           <DeleteManufacturer
//             handleClose={() => setOpen(false)}
//             title={manufacturer?.name || "Manufacturer"}
//             handleClick={handleDeleteManufacturer}
//             loading={isDeletingManufacturer}
//             warningMessage="Deleting this manufacturer will permanently remove it and all associated data. This action cannot be undone."
//           />
//         );
//       case "view":
//         return selectedProduct ? (
//           <ViewProduct
//             productData={selectedProduct}
//             setClose={() => setOpen(false)}
//           />
//         ) : null;
//       case "edit":
//         return selectedProduct ? (
//           <EditProduct
//             product={selectedProduct}
//             setClose={() => setOpen(false)}
//             manufacturers={getManufacturersData?.data || []}
//             categories={[]}
//           />
//         ) : null;
//       case "delete-product":
//         return (
//           <DeleteContent
//             handleClose={() => setOpen(false)}
//             title={selectedProduct?.name || "Product"}
//             handleClick={handleConfirmDelete}
//             isLoading={isDeletingProduct}
//           />
//         );
//       default:
//         return null;
//     }
//   };

//   if (getManufacturersIsLoading || isLoading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
//           <p className="mt-4 text-gray-600">Loading manufacturer details...</p>
//         </div>
//       </div>
//     );
//   }

//   if (!manufacturer) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <div className="text-center">
//           <h2 className="text-2xl font-bold text-gray-900 mb-2">Manufacturer Not Found</h2>
//           <p className="text-gray-600 mb-4">The manufacturer you're looking for doesn't exist.</p>
//           <button
//             onClick={() => router.push('/admin/manufacturers')}
//             className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
//           >
//             Back to Manufacturers
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="p-6">
//       {/* Add custom back button */}
//       <div className="flex items-center mb-4">
//         <Button
//           variant="ghost"
//           onClick={handleBack}
//           className="flex items-center gap-2"
//         >
//           <ArrowLeft size={16} />
//           Back to Manufacturers (Page {page})
//         </Button>
//       </div>

//       <Header
//         title={`${manufacturer?.name || 'Manufacturer'} Details`}
//         subtext="Manage manufacturer information and products"
//         showBack={false}
//       />

//       <div className="mb-6">
//         <SupplierManagementCard
//           item={manufacturer}
//           handleUpdateManufacturerStatus={async () => {
//             const newStatus = !manufacturer.status;
//             await updateManufacturerStatusPayload({
//               payload: { status: newStatus },
//               id: manufacturerId
//             });
//           }}
//           showToggle={true}
//           showOptions={true}
//           setTab={setTab}
//           setOpen={setOpen}
//           loading={updateManufacturerStatusIsLoading}
//         />
//       </div>

//       <Card>
//         <CardContent className="p-6">
//           <div className="flex justify-between items-center mb-6">
//             <h3 className="text-xl font-semibold text-gray-900">Products</h3>
//             <div className="flex items-center gap-4">
//               <div className="text-sm text-gray-500">
//                 {getManufacturerProductsData?.pagination?.totalItems || 0} total products
//               </div>
//               <button
//                 onClick={() => {
//                   setTab("update");
//                   setOpen(true);
//                 }}
//                 className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium"
//               >
//                 Edit Manufacturer
//               </button>
//             </div>
//           </div>

//           <div className="flex gap-4 mb-6">
//             <InputFilter
//               setQuery={setFilter}
//               placeholder="Search by product name, description"
//             />

//             <SelectFilter
//               setFilter={setStatus}
//               placeholder="Filters"
//               list={productFilterList}
//             />
//           </div>

//           <ManufacturerProductTable
//             handleEdit={handleEditProduct}
//             handleView={handleViewProduct}
//             handleDelete={handleDeleteProduct}
//             setPageSize={setPageSize}
//             data={getManufacturerProductsData?.data || []}
//             currentPage={currentPage}
//             onPageChange={onPageChange}
//             pageSize={Number(pageSize)}
//             totalPages={getManufacturerProductsData?.pagination?.totalPages || 1}
//             loading={getManufacturerProductsIsLoading}
//           />
//         </CardContent>
//       </Card>

//       <Dialog open={open} onOpenChange={() => setOpen(!open)}>
//         <DialogContent
//           className={`${tab !== "delete" && tab !== "delete-product"
//             ? "right-0 p-8 max-w-[47.56rem] h-screen overflow-y-scroll"
//             : "max-w-[33.75rem] left-[50%] translate-x-[-50%] py-10"
//             }`}
//         >
//           {tab !== "delete" && tab !== "delete-product" && (
//             <DialogHeader>
//               <DialogTitle className="mb-6 text-2xl font-bold text-[#111827] flex gap-4.5 items-center">
//                 <div onClick={() => setOpen(false)} className="cursor-pointer">
//                   <ChevronLeft size={24} />
//                 </div>
//                 {capitalizeFirstLetter(tab)}{" "}
//                 {tab === "update" ? "Manufacturer" : "Product"}
//               </DialogTitle>
//             </DialogHeader>
//           )}
//           {renderItem()}
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// };

// export default ManufacturerDetails;

"use client";

import Header from "@/app/(admin)/components/header";
import { Card, CardContent } from "@/components/ui/card";
import SupplierManagementCard from "@/components/widgets/supplier-management";
import { useEffect, useState } from "react";
import {
    useDeleteManufacturerProduct,
    useGetManufacturerProducts,
    useGetManufacturers,
    useUpdateManufacturerStatus,
    useDeleteManufacturer,
    useGetManufacturer
} from "@/services/manufacturers";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { ArrowLeft, ChevronLeft } from "lucide-react";
import EditManufacturer from "../../components/edit-manufacturer";
import DeleteManufacturer from "../../components/delete-manufacturer";
import ViewProduct from "@/app/(admin)/admin/products/components/view-product";
import EditProduct from "@/app/(admin)/admin/products/components/edit-products";
import { InputFilter } from "@/app/(admin)/components/input-filter";
import { SelectFilter } from "@/app/(admin)/components/select-filter";
import DatePickerWithRange from "@/components/ui/date-picker";
import { productFilterList, productTypeList } from "@/constant";
import { capitalizeFirstLetter, showSuccessAlert } from "@/lib/utils";
import { useDeleteProduct } from "@/services/products";
import { useRouter } from "next/navigation";
import ManufacturerProductTable from "./manufacturer-product-table";
import DeleteContent from "@/app/(admin)/components/delete-content";
import { toast } from "sonner";
import { ROUTES } from "@/constant/routes";
import { Button } from "@/components/ui/button";

interface ManufacturerDetailsProps {
    manufacturerId: string;
}

const ManufacturerDetails: React.FC<ManufacturerDetailsProps> = ({ manufacturerId }) => {
    const router = useRouter();
    const [open, setOpen] = useState<boolean>(false);
    const [tab, setTab] = useState<string>("update");
    const [filter, setFilter] = useState<string>("");
    const [status, setStatus] = useState<string>("all");
    const [pageSize, setPageSize] = useState<string>("10");
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [selectedProduct, setSelectedProduct] = useState<any>(null);
    
    // ✅ State for managing back navigation
    const [backUrl, setBackUrl] = useState<string>(ROUTES.ADMIN.SIDEBAR.MANUFACTURERS);

    console.log('🔄 ManufacturerDetails - manufacturerId:', manufacturerId);

    // ✅ Setup smart back navigation on component mount
    useEffect(() => {
        try {
            // Try to get the previous state from sessionStorage
            const savedState = sessionStorage.getItem('manufacturersListState');
            
            if (savedState) {
                const parsedState = JSON.parse(savedState);
                const { page, search, timestamp } = parsedState;
                
                // Check if the saved state is recent (within last 10 minutes)
                const isRecent = timestamp && (Date.now() - timestamp) < 10 * 60 * 1000;
                
                if (isRecent) {
                    // Build back URL with preserved state
                    const params = new URLSearchParams();
                    params.set('page', page.toString());
                    
                    if (search) {
                        params.set('search', search);
                    }
                    
                    setBackUrl(`${ROUTES.ADMIN.SIDEBAR.MANUFACTURERS}?${params.toString()}`);
                    
                    console.log('🔙 Smart back navigation setup:', {
                        page,
                        search,
                        backUrl: `${ROUTES.ADMIN.SIDEBAR.MANUFACTURERS}?${params.toString()}`
                    });
                } else {
                    // Clear old state
                    sessionStorage.removeItem('manufacturersListState');
                }
            }
        } catch (error) {
            console.error('Error setting up back navigation:', error);
            // Fallback to default URL
            setBackUrl(ROUTES.ADMIN.SIDEBAR.MANUFACTURERS);
        }
    }, []);

    const onPageChange = (page: number) => {
        setCurrentPage(page);
    };

    // FIXED: Get manufacturers data for finding manufacturer info
    const {
        getManufacturersData,
        getManufacturersIsLoading,
        refetchManufacturers,
        setManufacturersFilter,
    } = useGetManufacturers();

    // Find manufacturer from the list
    const findManufacturerById = (id: string) => {
        if (!getManufacturersData?.data) return null;
        return getManufacturersData.data.find(
            (manufacturer: { id: any }) => String(manufacturer.id) === String(id)
        );
    };

    const { data: manufacturer, isLoading, isError, error } = useGetManufacturer(
        manufacturerId, 
        {
          includeProducts: true,
          includeProductCount: true,
          productsLimit: 3,
        }
    );

    console.log(manufacturer, "manuInfo")

    const [filters, setFilters] = useState({
        page: 1,
        pageSize: 20,
        type: "all",
        search: "",
        categoryId: null,
    });

    const {
        getManufacturerProductsIsLoading,
        getManufacturerProductsData,
        getManufacturerProductsError,
        refetchManufacturerProducts,
        setManufacturerProductsFilter,
    } = useGetManufacturerProducts(manufacturerId);

    // Apply filters
    const handleFilterChange = (newFilters: { page: number; pageSize: number; type: string; search: string; categoryId: null; }) => {
        setFilters((prev) => ({ ...prev, ...newFilters }));
        setManufacturerProductsFilter({ ...filters, ...newFilters });
    };

    const { data: products, pagination } = getManufacturerProductsData;
    
    // Delete product hook
    const {
        deleteProduct,
        isLoading: isDeletingProduct
    } = useDeleteProduct({
        onSuccess: () => {
            toast.success("Product deleted successfully!");
            refetchManufacturerProducts();
            setOpen(false);
        },
    });

    // Delete manufacturer hook
    const {
        deleteManufacturer,
        isLoading: isDeletingManufacturer
    } = useDeleteManufacturer({
        onSuccess: () => {
            toast.success("Manufacturer deleted successfully!");
            setOpen(false);
            setTimeout(() => {
                handleBackNavigation();
            }, 1000);
        },
    });

    // Update manufacturer status hook
    const {
        updateManufacturerStatusData,
        updateManufacturerStatusIsLoading,
        updateManufacturerStatusPayload,
    } = useUpdateManufacturerStatus(() => {
        // refetchManufacturerInfo();
        refetchManufacturers();
        toast.success("Manufacturer status updated successfully!");
    });

    // Build filter payload for products
    const buildFilterPayload = () => {
        const payload: any = {
            page: currentPage,
            pageSize: parseInt(pageSize),
        };

        if (filter.trim()) {
            payload.search = filter.trim();
        }

        if (status !== "all") {
            payload.status = status;
        }

        return payload;
    };

    // Handle filter changes
    useEffect(() => {
        const payload = buildFilterPayload();

        console.log('🔄 ManufacturerDetails - Triggering API with:', {
            manufacturerId,
            payload,
            filterValue: filter,
            statusValue: status
        });

        setManufacturerProductsFilter(payload);
    }, [manufacturerId, filter, status, currentPage, pageSize]);

    // Debug API responses
    useEffect(() => {
        console.log('🔧 Filter values changed:', {
            filter,
            status,
            currentPage,
            pageSize: pageSize,
            manufacturerId,
            payload: buildFilterPayload()
        });
    }, [filter, status, currentPage, pageSize, manufacturerId]);

    // ✅ Enhanced back navigation handler
    const handleBackNavigation = () => {
        try {
            // Clean up sessionStorage
            sessionStorage.removeItem('manufacturersListState');
            
            // Navigate back with preserved state
            router.push(backUrl);
            
            console.log('🔙 Navigating back to:', backUrl);
        } catch (error) {
            console.error('Error during back navigation:', error);
            // Fallback navigation
            router.push(ROUTES.ADMIN.SIDEBAR.MANUFACTURERS);
        }
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

    const handleDeleteManufacturer = async () => {
        if (!manufacturer) return;

        try {
            await deleteManufacturer(manufacturer.id);
        } catch (error) {
            console.error("Delete failed:", error);
            toast.error("Failed to delete manufacturer");
        }
    };

    const handleFilterReset = () => {
        setFilter("");
        setStatus("all");
        setCurrentPage(1);
    };

    const renderItem = () => {
        switch (tab) {
            case "update":
                return (
                    <EditManufacturer
                        setClose={() => setOpen(false)}
                        manufacturer={manufacturer}
                    />
                );
            case "delete":
                return (
                    <DeleteManufacturer
                        handleClose={() => setOpen(false)}
                        title={manufacturer?.name || "Manufacturer"}
                        handleClick={handleDeleteManufacturer}
                        loading={isDeletingManufacturer}
                        warningMessage="Deleting this manufacturer will permanently remove it and all associated data. This action cannot be undone."
                    />
                );
            case "view":
                return selectedProduct ? (
                    <ViewProduct
                        productData={selectedProduct}
                        setClose={() => setOpen(false)}
                    />
                ) : null;
            case "edit":
                return selectedProduct ? (
                    <EditProduct
                        product={selectedProduct}
                        setClose={() => setOpen(false)}
                        manufacturers={getManufacturersData?.data || []}
                        categories={[]} // Add categories if available
                    />
                ) : null;
            case "delete-product":
                return (
                    <DeleteContent
                        handleClose={() => setOpen(false)}
                        title={selectedProduct?.name || "Product"}
                        handleClick={handleConfirmDelete}
                        isLoading={isDeletingProduct}
                    />
                );
            default:
                return null;
        }
    };

    if (getManufacturersIsLoading || isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
                    <p className="mt-4 text-gray-600">Loading manufacturer details...</p>
                </div>
            </div>
        );
    }

    if (!manufacturer) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Manufacturer Not Found</h2>
                    <p className="text-gray-600 mb-4">The manufacturer you're looking for doesn't exist.</p>
                    <Button
                        onClick={handleBackNavigation}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Manufacturers
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6">
            {/* ✅ Enhanced header with smart back button */}
            <div className="flex items-center gap-4 mb-6">
                <Button
                    variant="ghost"
                    onClick={handleBackNavigation}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-800 px-2"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Manufacturers
                </Button>
                <div className="h-6 w-px bg-gray-300"></div>
                <div>
                    <Header
                        title={`${manufacturer?.name || 'Manufacturer'} Details`}
                        subtext="Manage manufacturer information and products"
                        showBack={false} // We're handling back button manually
                    />
                </div>
            </div>

            <div className="mb-6">
                <SupplierManagementCard
                    item={manufacturer}
                    handleUpdateManufacturerStatus={async () => {
                        const newStatus = !(manufacturer?.status);
                        await updateManufacturerStatusPayload({
                            payload: { status: newStatus },
                            id: manufacturerId
                        });
                    }}
                    showToggle={true}
                    showOptions={true}
                    setTab={setTab}
                    setOpen={setOpen}
                    loading={updateManufacturerStatusIsLoading}
                />
            </div>

            <Card>
                <CardContent className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-semibold text-gray-900">Products</h3>
                        <div className="flex items-center gap-4">
                            <div className="text-sm text-gray-500">
                                {getManufacturerProductsData?.pagination?.totalItems || 0} total products
                            </div>
                            <Button
                                onClick={() => {
                                    setTab("update");
                                    setOpen(true);
                                }}
                                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium"
                            >
                                Edit Manufacturer
                            </Button>
                        </div>
                    </div>

                    <div className="flex gap-4 mb-6">
                        <InputFilter
                            setQuery={setFilter}
                            placeholder="Search by product name, description"
                        />

                        {/* <SelectFilter
                            setFilter={setStatus}
                            placeholder="Filters"
                            list={productFilterList}
                        /> */}
                    </div>

                    <ManufacturerProductTable
                        handleEdit={handleEditProduct}
                        handleView={handleViewProduct}
                        handleDelete={handleDeleteProduct}
                        setPageSize={setPageSize}
                        data={getManufacturerProductsData?.data || []}
                        currentPage={currentPage}
                        onPageChange={onPageChange}
                        pageSize={Number(pageSize)}
                        totalPages={getManufacturerProductsData?.pagination?.totalPages || 1}
                        loading={getManufacturerProductsIsLoading}
                    />
                </CardContent>
            </Card>

            <Dialog open={open} onOpenChange={() => setOpen(!open)}>
                <DialogContent
                    className={`${tab !== "delete" && tab !== "delete-product"
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