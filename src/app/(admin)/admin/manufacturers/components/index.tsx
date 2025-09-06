// "use client";

// import Header from "@/app/(admin)/components/header";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";
// import { useEffect, useState } from "react";
// import EmptyState from "../../../components/empty";
// import { InputFilter } from "@/app/(admin)/components/input-filter";
// import SupplierManagementCard from "@/components/widgets/supplier-management";
// import Link from "next/link";
// import { ROUTES } from "@/constant/routes";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import { ChevronLeft } from "lucide-react";
// import AddManufacturer from "./add-manufacturer";
// import { StoreManagementIcon } from "../../../../../../public/icons";
// import { useGetManufacturers } from "@/services/manufacturers";
// import { Pagination } from "@/components/ui/pagination";
// import { ISupplierCard } from "@/types";
// import SupplierManagementCardSkeleton from "@/components/skeletons/supply-management-card";

// export default function Manufacturers() {
//   const [isOpen, setIsOpen] = useState<boolean>(false);
//   const [role, setRole] = useState<string>("");
//   const [filter, setFilter] = useState<string>(""); // What user types
//   const [searchQuery, setSearchQuery] = useState<string>(""); // What we actually search for
//   const [currentPage, setCurrentPage] = useState<number>(1);

//   const onPageChange = (page: number) => {
//     setCurrentPage(page);
//   };

//   const {
//     getManufacturersData,
//     getManufacturersIsLoading,
//     refetchManufacturers,
//     setManufacturersFilter,
//   } = useGetManufacturers();

//   const roleList = [
//     {
//       text: "Admin",
//       value: "admin",
//     },
//     {
//       text: "Super Admin",
//       value: "super-admin",
//     },
//   ];

//   // ✅ Handle Enter key press and clear field
//   const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
//     if (e.key === 'Enter') {
//       setSearchQuery(filter); // Trigger search
//       setCurrentPage(1); // Reset to first page
//       setFilter(""); // Clear the input field
//     }
//   };

//   // ✅ Only trigger API call when searchQuery changes
//   useEffect(() => {
//     const payload = {
//       name: searchQuery,
//       pageSize: 10,
//       page: currentPage,
//     };

//     setManufacturersFilter(payload);
//   }, [searchQuery, currentPage, setManufacturersFilter]);

//   console.log(getManufacturersData?.pagination?.totalItems);

//   return (
//     <section>
//       <Card>
//         <CardContent className="p-4 ">
//           <div className="flex justify-between items-center mb-6">
//             <Header
//               title="Manufacturers"
//               subtext="Manage Manufacturers and Suppliers"
//             />
//             <Button
//               variant={"outline"}
//               className="font-bold text-base w-auto py-4 px-6"
//               size={"xl"}
//               onClick={() => setIsOpen(true)}
//             >
//               + Add New Manufacturer
//             </Button>
//           </div>

//           {!getManufacturersIsLoading && (
//             <div className="flex items-center gap-4 mb-6 w-[50%]">
//               {/* ✅ Modified to handle Enter key and clear field */}
//               <div className="w-full">
//                 <input
//                   type="text"
//                   value={filter}
//                   onChange={(e) => setFilter(e.target.value)}
//                   onKeyDown={handleKeyDown}
//                   placeholder="Search manufacturers by name (Press Enter to search)..."
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 />
//               </div>
//             </div>
//           )}

//           {getManufacturersIsLoading ? (
//             <div className="grid grid-cols-2 gap-4">
//               {Array.from({ length: 4 }).map((_, idx: number) => (
//                 <SupplierManagementCardSkeleton key={idx} />
//               ))}
//             </div>
//           ) : (
//             <>
//               {getManufacturersData?.data?.length < 1 ? (
//                 <EmptyState
//                   icon={<StoreManagementIcon />}
//                   btnText="Add Manufacturer"
//                   header="Manufacturer Records Await"
//                   description="Start Managing Your Suppliers by Adding Your First Manufacturer."
//                   onClick={() => setIsOpen(true)}
//                 />
//               ) : (
//                 <>
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                     {getManufacturersData?.data?.map(
//                       (item: ISupplierCard, index: number) => (
//                         <Link
//                           key={index}
//                           href={`${ROUTES.ADMIN.SIDEBAR.MANUFACTURERS}/${item.id}`}
//                           className="block h-full"
//                         >
//                           <SupplierManagementCard item={item} />
//                         </Link>
//                       )
//                     )}
//                   </div>
//                   <div className="mt-8 flex items-center justify-center">
//                     <Pagination
//                       currentPage={currentPage}
//                       totalPages={
//                         getManufacturersData?.pagination?.totalPages || 0
//                       }
//                       onPageChange={onPageChange}
//                     />
//                   </div>
//                 </>
//               )}
//             </>
//           )}

//           <Dialog open={isOpen} onOpenChange={() => setIsOpen(!isOpen)}>
//             <DialogContent className="right-0 p-8 max-w-[47.56rem] h-screen overflow-y-scroll">
//               <DialogHeader>
//                 <DialogTitle className="mb-6 text-2xl font-bold text-[#111827] flex gap-4.5 items-center">
//                   <div
//                     onClick={() => setIsOpen(false)}
//                     className="cursor-pointer"
//                   >
//                     <ChevronLeft size={24} />
//                   </div>
//                   Add New Manufacturer
//                 </DialogTitle>
//               </DialogHeader>
//               <AddManufacturer setClose={() => setIsOpen(false)} />
//             </DialogContent>
//           </Dialog>
//         </CardContent>
//       </Card>
//     </section>
//   );
// }

// "use client";

// import Header from "@/app/(admin)/components/header";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";
// import { useEffect, useState } from "react";
// import EmptyState from "../../../components/empty";
// import SupplierManagementCard from "@/components/widgets/supplier-management";
// import Link from "next/link";
// import { ROUTES } from "@/constant/routes";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import { ChevronLeft } from "lucide-react";
// import AddManufacturer from "./add-manufacturer";
// import { StoreManagementIcon } from "../../../../../../public/icons";
// import { useGetManufacturers } from "@/services/manufacturers";
// import { Pagination } from "@/components/ui/pagination";
// import { ISupplierCard } from "@/types";
// import SupplierManagementCardSkeleton from "@/components/skeletons/supply-management-card";
// import useDebounce from "./debounce";

// export default function Manufacturers() {
//   const [isOpen, setIsOpen] = useState<boolean>(false);
//   const [filter, setFilter] = useState<string>("");
//   const [currentPage, setCurrentPage] = useState<number>(1);
  
//   // Use debounced filter for API calls
//   const debouncedFilter = useDebounce(filter, 500);

//   const {
//     getManufacturersData,
//     getManufacturersIsLoading,
//     refetchManufacturers,
//     setManufacturersFilter,
//   } = useGetManufacturers();

//   const onPageChange = (page: number) => {
//     setCurrentPage(page);
//   };

//   // Trigger API call when debounced filter or page changes
//   useEffect(() => {
//     const payload = {
//       name: debouncedFilter,
//       pageSize: 10,
//       page: currentPage,
//     };

//     setManufacturersFilter(payload);
//   }, [debouncedFilter, currentPage, setManufacturersFilter]);

//   return (
//     <section>
//       <Card>
//         <CardContent className="p-4">
//           <div className="flex justify-between items-center mb-6">
//             <Header
//               title="Manufacturers"
//               subtext="Manage Manufacturers and Suppliers"
//             />
//             <Button
//               variant={"outline"}
//               className="font-bold text-base w-auto py-4 px-6"
//               size={"xl"}
//               onClick={() => setIsOpen(true)}
//             >
//               + Add New Manufacturer
//             </Button>
//           </div>

//           {!getManufacturersIsLoading && (
//             <div className="flex items-center gap-2 mb-6 w-full md:w-[50%]">
//               <div className="flex-1">
//                 <input
//                   type="text"
//                   value={filter}
//                   onChange={(e) => setFilter(e.target.value)}
//                   placeholder="Search manufacturers by name..."
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 />
//               </div>
//               {filter && (
//                 <Button
//                   variant="outline"
//                   onClick={() => setFilter("")}
//                   className="whitespace-nowrap"
//                 >
//                   Clear
//                 </Button>
//               )}
//             </div>
//           )}

//           {getManufacturersIsLoading ? (
//             <div className="grid grid-cols-2 gap-4">
//               {Array.from({ length: 4 }).map((_, idx: number) => (
//                 <SupplierManagementCardSkeleton key={idx} />
//               ))}
//             </div>
//           ) : (
//             <>
//               {getManufacturersData?.data?.length < 1 ? (
//                 <EmptyState
//                   icon={<StoreManagementIcon />}
//                   btnText="Add Manufacturer"
//                   header="Manufacturer Records Await"
//                   description="Start Managing Your Suppliers by Adding Your First Manufacturer."
//                   onClick={() => setIsOpen(true)}
//                 />
//               ) : (
//                 <>
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                     {getManufacturersData?.data?.map(
//                       (item: ISupplierCard, index: number) => (
//                         <Link
//                           key={index}
//                           href={{
//                             pathname: `${ROUTES.ADMIN.SIDEBAR.MANUFACTURERS}/${item.id}`,
//                             query: { 
//                               page: currentPage,
//                               search: filter 
//                             }
//                           }}
//                           className="block h-full"
//                         >
//                           <SupplierManagementCard item={item} />
//                         </Link>
//                       )
//                     )}
//                   </div>
//                   <div className="mt-8 flex items-center justify-center">
//                     <Pagination
//                       currentPage={currentPage}
//                       totalPages={
//                         getManufacturersData?.pagination?.totalPages || 0
//                       }
//                       onPageChange={onPageChange}
//                     />
//                   </div>
//                 </>
//               )}
//             </>
//           )}

//           <Dialog open={isOpen} onOpenChange={() => setIsOpen(!isOpen)}>
//             <DialogContent className="right-0 p-8 max-w-[47.56rem] h-screen overflow-y-scroll">
//               <DialogHeader>
//                 <DialogTitle className="mb-6 text-2xl font-bold text-[#111827] flex gap-4.5 items-center">
//                   <div
//                     onClick={() => setIsOpen(false)}
//                     className="cursor-pointer"
//                   >
//                     <ChevronLeft size={24} />
//                   </div>
//                   Add New Manufacturer
//                 </DialogTitle>
//               </DialogHeader>
//               <AddManufacturer setClose={() => setIsOpen(false)} />
//             </DialogContent>
//           </Dialog>
//         </CardContent>
//       </Card>
//     </section>
//   );
// }

"use client";

import Header from "@/app/(admin)/components/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import EmptyState from "../../../components/empty";
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
import { ChevronLeft, Search, X } from "lucide-react";
import AddManufacturer from "./add-manufacturer";
import { StoreManagementIcon } from "../../../../../../public/icons";
import { useGetManufacturers } from "@/services/manufacturers";
import { Pagination } from "@/components/ui/pagination";
import { ISupplierCard } from "@/types";
import SupplierManagementCardSkeleton from "@/components/skeletons/supply-management-card";
import { useRouter, useSearchParams } from "next/navigation";

export default function Manufacturers() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [role, setRole] = useState<string>("");
  const [filter, setFilter] = useState<string>(""); // What user types
  const [searchQuery, setSearchQuery] = useState<string>(""); // What we actually search for
  const [isSearchActive, setIsSearchActive] = useState<boolean>(false);
  
  // Get current page from URL params, default to 1
  const [currentPage, setCurrentPage] = useState<number>(
    parseInt(searchParams.get('page') || '1')
  );
  
  // Get search query from URL params if available
  useEffect(() => {
    const urlSearch = searchParams.get('search');
    const urlPage = searchParams.get('page');
    
    if (urlSearch) {
      setSearchQuery(urlSearch);
      setFilter(urlSearch);
      setIsSearchActive(true);
    }
    
    if (urlPage) {
      setCurrentPage(parseInt(urlPage));
    }
  }, [searchParams]);

  const onPageChange = (page: number) => {
    setCurrentPage(page);
    
    // Update URL with current page and search params
    const params = new URLSearchParams();
    params.set('page', page.toString());
    
    if (searchQuery) {
      params.set('search', searchQuery);
    }
    
    // Update URL without page reload
    router.push(`${ROUTES.ADMIN.SIDEBAR.MANUFACTURERS}?${params.toString()}`, { scroll: false });
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

  // ✅ Handle search submission
  const handleSearch = () => {
    if (filter.trim() === searchQuery.trim()) return; // Avoid duplicate searches
    
    setSearchQuery(filter.trim());
    setCurrentPage(1); // Reset to first page when searching
    setIsSearchActive(filter.trim().length > 0);
    
    // Update URL with search params
    const params = new URLSearchParams();
    params.set('page', '1');
    
    if (filter.trim()) {
      params.set('search', filter.trim());
    }
    
    router.push(`${ROUTES.ADMIN.SIDEBAR.MANUFACTURERS}?${params.toString()}`, { scroll: false });
  };

  // ✅ Handle Enter key press
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
  };

  // ✅ Clear search
  const handleClearSearch = () => {
    setFilter("");
    setSearchQuery("");
    setIsSearchActive(false);
    setCurrentPage(1);
    
    // Update URL to remove search params
    router.push(`${ROUTES.ADMIN.SIDEBAR.MANUFACTURERS}?page=1`, { scroll: false });
  };

  // ✅ Only trigger API call when searchQuery or currentPage changes
  useEffect(() => {
    const payload = {
      page: currentPage,
      pageSize: 10,
      ...(searchQuery.trim() && { name: searchQuery.trim() }),
    };

    console.log('🔍 Triggering API with payload:', payload);
    setManufacturersFilter(payload);
  }, [searchQuery, currentPage, setManufacturersFilter]);

  // ✅ Enhanced Link component to preserve current state
  const ManufacturerLink = ({ manufacturer, children }: { manufacturer: ISupplierCard, children: React.ReactNode }) => {
    const handleClick = () => {
      // Store current state in sessionStorage before navigation
      const currentState = {
        page: currentPage,
        search: searchQuery,
        timestamp: Date.now()
      };
      
      sessionStorage.setItem('manufacturersListState', JSON.stringify(currentState));
    };

    return (
      <Link
        href={`${ROUTES.ADMIN.SIDEBAR.MANUFACTURERS}/${manufacturer.id}`}
        className="block h-full"
        onClick={handleClick}
      >
        {children}
      </Link>
    );
  };

  console.log('🔍 Current state:', {
    filter,
    searchQuery,
    currentPage,
    isSearchActive,
    totalItems: getManufacturersData?.pagination?.totalItems
  });

  return (
    <section>
      <Card>
        <CardContent className="p-4 ">
          <div className="flex justify-between items-center mb-6">
            <Header
              title="Manufacturers"
              subtext="Manage Manufacturers and Suppliers"
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
            <div className="flex items-center gap-4 mb-6 w-[70%]">
              {/* ✅ Enhanced search input with better UX */}
              <div className="relative w-full">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Search manufacturers by name..."
                    className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                  {filter && (
                    <button
                      onClick={() => setFilter("")}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
              
              {/* Search button */}
              <Button
                onClick={handleSearch}
                variant="outline"
                className="px-6 py-3 whitespace-nowrap"
                disabled={!filter.trim()}
              >
                Search
              </Button>
              
              {/* Clear search button (show when search is active) */}
              {isSearchActive && (
                <Button
                  onClick={handleClearSearch}
                  variant="ghost"
                  className="px-4 py-3 text-gray-600 hover:text-gray-800 whitespace-nowrap"
                >
                  Clear
                </Button>
              )}
            </div>
          )}

          {/* Show search status */}
          {isSearchActive && !getManufacturersIsLoading && (
            <div className="mb-4 text-sm text-gray-600">
              {getManufacturersData?.data?.length === 0 
                ? `No results found for "${searchQuery}"`
                : `Found ${getManufacturersData?.pagination?.totalItems || 0} results for "${searchQuery}"`
              }
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
                  header={isSearchActive ? "No Results Found" : "Manufacturer Records Await"}
                  description={
                    isSearchActive 
                      ? `No manufacturers found matching "${searchQuery}". Try different keywords or add a new manufacturer.`
                      : "Start Managing Your Suppliers by Adding Your First Manufacturer."
                  }
                  onClick={() => setIsOpen(true)}
                />
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {getManufacturersData?.data?.map(
                      (item: ISupplierCard, index: number) => (
                        <ManufacturerLink key={item.id} manufacturer={item}>
                          <SupplierManagementCard item={item} />
                        </ManufacturerLink>
                      )
                    )}
                  </div>
                  <div className="mt-8 flex items-center justify-center">
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

          <Dialog open={isOpen} onOpenChange={() => setIsOpen(!isOpen)}>
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