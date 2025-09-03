// "use client";

// import Header from "@/app/(admin)/components/header";
// import { Button } from "@/components/ui/button";
// import ProductDataTable from "./data-table";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import EditProduct from "./edit-products";
// import { useEffect, useState } from "react";
// import { ChevronLeft } from "lucide-react";
// import { ExportIcon } from "../../../../../../public/icons";
// import Link from "next/link";
// import ViewProduct from "./view-product";
// import DeleteContent from "@/app/(admin)/components/delete-content";
// import { Card, CardContent } from "@/components/ui/card";
// import { SelectFilter } from "@/app/(admin)/components/select-filter";
// import { InputFilter } from "@/app/(admin)/components/input-filter";
// import DatePickerWithRange from "@/components/ui/date-picker";
// import { capitalizeFirstLetter } from "@/lib/utils";

// // ✅ CORRECT SERVICE IMPORTS
// import { useDeleteProduct, useGetProducts } from "@/services/products";
// import { useGetAllCategories } from "@/services/categories";
// import { useGetManufacturers } from "@/services/manufacturers";

// // ✅ CORRECT CONSTANTS IMPORT
// import { productFilterList, productTypeList } from "@/constant";

// export default function Products() {
//   const [filter, setFilter] = useState<string>("");
//   const [status, setStatus] = useState<string>("all");
//   const [pageSize, setPageSize] = useState<string>("10");
//   const [currentPage, setCurrentPage] = useState(1);
//   const [startDate, setStartDate] = useState<string | null>(null);
//   const [open, setOpen] = useState<boolean>(false);
//   const [tab, setTab] = useState<string>("");
//   const [endDate, setEndDate] = useState<string | null>(null);
//   const [selectedProduct, setSelectedProduct] = useState<any>(null);

//   const onPageChange = (page: number) => {
//     setCurrentPage(page);
//   };

//   const {
//     getManufacturersData,
//     getManufacturersIsLoading,
//     refetchManufacturers,
//     setManufacturersFilter,
//   } = useGetManufacturers();

//   const {
//     getProductsIsLoading,
//     getProductsData,
//     setProductsFilter,
//     refetchProducts,
//   } = useGetProducts();

//   const {
//     getAllCategoriesIsLoading,
//     getAllCategoriesData,
//     getAllCategoriesError,
//     setAllCategoriesFilter
//   } = useGetAllCategories();

//   const { categories, pagination } = getAllCategoriesData || { categories: [], pagination: {} };

//   const {
//     deleteProduct,
//     isLoading,
//     error: deleteProductError,
//     data: deleteProductPayload,
//   } = useDeleteProduct((res: any) => {
//     refetchProducts();
//     setOpen(false);
//   });

//   const payload = {
//     page: currentPage,
//     pageSize,
//     type: status,
//     search: filter,
//     startDate,
//     endDate,
//   };

//   // ✅ Initial load effect
//   useEffect(() => {
//     console.log('🎬 Component mounted - triggering initial load');
//     const initialPayload = {
//       page: 1,
//       pageSize: "10",
//       type: "all",
//       search: "",
//       startDate: null,
//       endDate: null,
//     };
//     setProductsFilter(initialPayload);
//   }, [setProductsFilter]);

//   useEffect(() => {
//     console.log('🔍 Component :', {
//       loading: getProductsIsLoading,
//       data: getProductsData,
//       dataType: typeof getProductsData,
//       hasData: !!getProductsData?.data,
//       isArray: Array.isArray(getProductsData?.data),
//       length: getProductsData?.data?.length,
//       firstItem: getProductsData?.data?.[0],
//       pagination: getProductsData?.pagination
//     });
//   }, [getProductsIsLoading, getProductsData]);

//   // ✅ API test effect
//   useEffect(() => {
//     const testAPI = async () => {
//       try {
//         console.log('🧪 Testing API directly...');
//         const response = await fetch('/api/admin/products?page=1&pageSize=10');
//         const result = await response.json();
//         console.log('🧪 Direct API result:', result);
//       } catch (error) {
//         console.error('🧪 Direct API error:', error);
//       }
//     };

//     testAPI();
//   }, []);

//   // Filter change effect
//   useEffect(() => {
//     console.log('🔄 Filter changed, updating with payload:', payload);
//     setProductsFilter(payload);
//   }, [filter, status, pageSize, currentPage, startDate, endDate, setProductsFilter]);

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

//   const renderItem = () => {
//     switch (tab) {
//       case "view":
//         return (
//           <ViewProduct
//             setClose={() => setOpen(false)}
//             productData={selectedProduct}
//           />
//         );
//       case "edit":
//         return (
//           <EditProduct
//             categories={categories || []}
//             setClose={() => setOpen(false)}
//             product={selectedProduct}
//             manufacturers={getManufacturersData?.data || []}
//           />
//         );
//       case "delete-product":
//         return (
//           <DeleteContent
//             handleClose={() => setOpen(false)}
//             title="Product"
//             handleClick={handleConfirmDelete}
//             isLoading={isLoading}
//           />
//         );
//       default:
//         return (
//           <ViewProduct
//             setClose={() => setOpen(false)}
//             productData={selectedProduct}
//           />
//         );
//     }
//   };

//   const renderTable = () => {
//     if (getProductsIsLoading) {
//       return (
//         <div className="text-center py-8">
//           <p>Loading products...</p>
//         </div>
//       );
//     }

//     if (!getProductsData) {
//       return (
//         <div className="text-center py-8 bg-red-50 border border-red-200 rounded p-4">
//           <p className="text-red-600">❌ No data returned from API</p>
//         </div>
//       );
//     }

//     if (!getProductsData.data || !Array.isArray(getProductsData.data)) {
//       return (
//         <div className="text-center py-8 bg-yellow-50 border border-yellow-200 rounded p-4">
//           <p className="text-yellow-600">⚠️ Data is not an array</p>
//           <pre className="text-xs mt-2 text-left overflow-auto max-h-32">
//             {JSON.stringify(getProductsData, null, 2)}
//           </pre>
//         </div>
//       );
//     }

//     if (getProductsData.data.length === 0) {
//       return (
//         <div className="text-center py-8 bg-blue-50 border border-blue-200 rounded p-4">
//           <p className="text-blue-600">📭 No products found</p>
//         </div>
//       );
//     }

//     return (
//       <div>
//         <div className="mb-2 text-sm text-green-600">
//           {/* ✅ Found {getProductsData.data.length} products */}
//         </div>
//         <ProductDataTable
//           handleEdit={handleEditProduct}
//           handleView={handleViewProduct}
//           handleDelete={handleDeleteProduct}
//           setPageSize={setPageSize}
//           data={getProductsData.data}
//           currentPage={currentPage}
//           onPageChange={onPageChange}
//           pageSize={Number(pageSize)}
//           totalPages={getProductsData.pagination?.totalPages || 1}
//           loading={getProductsIsLoading}
//         />
//       </div>
//     );
//   };

//   return (
//     <section className="bg-[#FFFFFF] rounded-lg shadow-sm">
//       <div className="p-4 flex justify-between items-center mb-8">
//         <Header title="Products" subtext="Manage Products." />

//         <div className="flex gap-5">
//           <Button
//             variant={"outline"}
//             className="font-bold text-base w-auto py-4 px-5 flex gap-2 items-center"
//             size={"xl"}
//           >
//             <ExportIcon /> Download
//           </Button>
//           <Button
//             variant={"warning"}
//             className="font-bold text-base w-auto py-4 px-6"
//             size={"xl"}
//             asChild
//           >
//             <Link href="/admin/products/add">+ Add New Product</Link>
//           </Button>
//         </div>
//       </div>

//       <Card className="bg-white">
//         <CardContent className="p-6">
//           <h6 className="font-normal text-[#111827] mb-6">
//             Detailed Product Table
//           </h6>



//           <div className="flex items-center gap-4 mb-6">
//             <InputFilter
//               setQuery={setFilter}
//               placeholder="Search by product name, category, manufacturer"
//             />

//             <SelectFilter
//               setFilter={setStatus}
//               placeholder="Filter Products"
//               list={productFilterList}
//               value={status}
//             />
//           </div>

//           {renderTable()}
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
//     </section>
//   );
// }

"use client";

import Header from "@/app/(admin)/components/header";
import { Button } from "@/components/ui/button";
import ProductDataTable from "./data-table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import EditProduct from "./edit-products";
import { useEffect, useState } from "react";
import { ChevronLeft } from "lucide-react";
import { ExportIcon } from "../../../../../../public/icons";
import Link from "next/link";
import ViewProduct from "./view-product";
import DeleteContent from "@/app/(admin)/components/delete-content";
import { Card, CardContent } from "@/components/ui/card";
import { SelectFilter } from "@/app/(admin)/components/select-filter";
import { InputFilter } from "@/app/(admin)/components/input-filter";
import DatePickerWithRange from "@/components/ui/date-picker";
import { capitalizeFirstLetter } from "@/lib/utils";

// ✅ CORRECT SERVICE IMPORTS
import { useDeleteProduct, useGetProducts } from "@/services/products";
import { useGetAllCategories, useGetCategoriesForSelection } from "@/services/categories";
import { useGetManufacturers } from "@/services/manufacturers";
import {CategoryFilter} from "./cateFilter";
import {ManufacturerFilterWithPagination}  from "./manufactFilter";

// ✅ CORRECT CONSTANTS IMPORT
import { productFilterList, productTypeList } from "@/constant";

// services/manufacturerService.ts
export const getManufacturersPage = async (page: number) => {
  const res = await fetch(`/api/manufacturers?page=${page}`);
  const json = await res.json();
  return {
    data: json.data,
    hasNextPage: json.hasNextPage,
  };
};


export default function Products() {
  const [filter, setFilter] = useState<string>("");
  const [status, setStatus] = useState<string>("all");
  const [pageSize, setPageSize] = useState<string>("10");
  const [currentPage, setCurrentPage] = useState(1);
  const [startDate, setStartDate] = useState<string | null>(null);
  const [open, setOpen] = useState<boolean>(false);
  const [tab, setTab] = useState<string>("");
  const [endDate, setEndDate] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  // New state variables for manufacturer and category filters
  // const [manufacturerFilter, setManufacturerFilter] = useState<string>("all");
  // const [categoryFilter, setCategoryFilter] = useState<string>("all");

  const [nextPage, setNextPage] = useState(2);

  const [manufacturerFilter, setManufacturerFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  // ✅ ADD NEW STATE: For accumulating manufacturers and managing pagination
  const [allManufacturers, setAllManufacturers] = useState<any[]>([]);

  const [manufacturerPage, setManufacturerPage] = useState(1);

const getMoreManufacturers = async () => {
  const result = await getManufacturersPage(nextPage);
  setNextPage((prev) => prev + 1);
  return result;
};

  const onPageChange = (page: number) => {
    setCurrentPage(page);
  };

  const {
    getManufacturersData,
    getManufacturersIsLoading,
    refetchManufacturers,
    setManufacturersFilter,
  } = useGetManufacturers();

  const {
    getProductsIsLoading,
    getProductsData,
    setProductsFilter,
    refetchProducts,
  } = useGetProducts();

  const {
    getAllCategoriesIsLoading,
    getAllCategoriesData,
    getAllCategoriesError,
    setAllCategoriesFilter,
  } = useGetAllCategories();

    const {
      getCategoriesSelectionData,
      getCategoriesSelectionIsLoading,
    } = useGetCategoriesForSelection();

    console.log(getCategoriesSelectionData, "selectcategories")
    console.log(getManufacturersData, "manufacturer")

  const { categories, pagination } = getAllCategoriesData || {
    categories: [],
    pagination: {},
  };

    // ... after other hooks like useGetProducts, etc.

  // ✅ ADD EFFECT 1: Trigger fetching manufacturers when the page number changes.
  // useEffect(() => {
  //   setManufacturersFilter({
  //     page: manufacturerPage,
  //     pageSize: 20 // A larger page size is good for "load more" functionality
  //   });
  // }, [manufacturerPage, setManufacturersFilter]);

  useEffect(() => {
    if (manufacturerPage > 0) {
      setManufacturersFilter({ page: manufacturerPage, pageSize: 1000 });
    }
  }, [manufacturerPage]);

  // ✅ ADD EFFECT 2: Append newly fetched data to the 'allManufacturers' list.
  // useEffect(() => {
  //   if (getManufacturersData?.data) {
  //     // On page 1, we replace the list with fresh data.
  //     if (getManufacturersData.pagination?.currentPage === 1) {
  //       setAllManufacturers(getManufacturersData.data);
  //     } else {
  //       // On subsequent pages, we append new data, filtering out any potential duplicates.
  //       setAllManufacturers(prevList => {
  //         const existingIds = new Set(prevList.map((m:any) => m.id));
  //         const newItems = getManufacturersData.data.filter((m:any) => !existingIds.has(m.id));
  //         return [...prevList, ...newItems];
  //       });
  //     }
  //   }
  // }, [getManufacturersData]); // This effect runs whenever new manufacturer data arrives.

  useEffect(() => {
    if (!getManufacturersData?.data) return;
  
    const newPage = getManufacturersData.pagination?.currentPage;
  
    setAllManufacturers(prev => {
      const existingIds = new Set(prev.map((m:any) => m.id));
      const newItems = getManufacturersData.data.filter((m:any) => !existingIds.has(m.id));
  
      if (newPage === 1) {
        // only replace if the list actually differs
        const isSame = prev.length === getManufacturersData.data.length &&
                       prev.every((m:any, i:number) => m.id === getManufacturersData.data[i].id);
        return isSame ? prev : getManufacturersData.data;
      }
  
      return newItems.length > 0 ? [...prev, ...newItems] : prev;
    });
  }, [getManufacturersData]);
  

  const fetchMoreManufacturers = async () => {
    if (getManufacturersData?.pagination?.hasNextPage) {
      setManufacturerPage(prevPage => prevPage + 1);
    }
  };
  const {
    deleteProduct,
    isLoading,
    error: deleteProductError,
    data: deleteProductPayload,
  } = useDeleteProduct((res: any) => {
    refetchProducts();
    setOpen(false);
  });

  const payload = {
    page: currentPage,
    pageSize,
    type: status,
    search: filter,
    startDate,
    endDate,
  };

  // ✅ Initial load effect
  useEffect(() => {
    console.log("🎬 Component mounted - triggering initial load");
    const initialPayload = {
      page: 1,
      pageSize: "10",
      type: "all",
      search: "",
      startDate: null,
      endDate: null,
    };
    setProductsFilter(initialPayload);
  }, [setProductsFilter]);

  useEffect(() => {
    console.log("🔍 Component :", {
      loading: getProductsIsLoading,
      data: getProductsData,
      dataType: typeof getProductsData,
      hasData: !!getProductsData?.data,
      isArray: Array.isArray(getProductsData?.data),
      length: getProductsData?.data?.length,
      firstItem: getProductsData?.data?.[0],
      pagination: getProductsData?.pagination,
    });
  }, [getProductsIsLoading, getProductsData]);

  // ✅ API test effect
  useEffect(() => {
    const testAPI = async () => {
      try {
        console.log("🧪 Testing API directly...");
        const response = await fetch("/api/admin/products?page=1&pageSize=10");
        const result = await response.json();
        console.log("🧪 Direct API result:", result);
      } catch (error) {
        console.error("🧪 Direct API error:", error);
      }
    };

    testAPI();
  }, []);

  // Filter change effect
  useEffect(() => {
    console.log("🔄 Filter changed, updating with payload:", payload);
    setProductsFilter(payload);
  }, [
    filter,
    status,
    pageSize,
    currentPage,
    startDate,
    endDate,
    setProductsFilter,
  ]);

  // Function to filter products by manufacturer and category on the client side
  const getFilteredProducts = () => {
    if (!getProductsData?.data) return [];

    let filteredProducts = [...getProductsData.data];

    // Apply manufacturer filter
    if (manufacturerFilter !== "all") {
      filteredProducts = filteredProducts.filter(
        (product) =>
          product.manufacturer?.id?.toString() === manufacturerFilter
      );
    }

    // Apply category filter
    if (categoryFilter !== "all") {
      filteredProducts = filteredProducts.filter(
        (product) => product.category?.id?.toString() === categoryFilter
      );
    }

    return filteredProducts;
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

  const renderItem = () => {
    switch (tab) {
      case "view":
        return (
          <ViewProduct
            setClose={() => setOpen(false)}
            productData={selectedProduct}
          />
        );
      case "edit":
        return (
          <EditProduct
            categories={categories || []}
            setClose={() => setOpen(false)}
            product={selectedProduct}
            manufacturers={getManufacturersData?.data || []}
          />
        );
      case "delete-product":
        return (
          <DeleteContent
            handleClose={() => setOpen(false)}
            title="Product"
            handleClick={handleConfirmDelete}
            isLoading={isLoading}
          />
        );
      default:
        return (
          <ViewProduct
            setClose={() => setOpen(false)}
            productData={selectedProduct}
          />
        );
    }
  };

  const renderTable = () => {
    if (getProductsIsLoading) {
      return (
        <div className="text-center py-8">
          <p>Loading products...</p>
        </div>
      );
    }

    if (!getProductsData) {
      return (
        <div className="text-center py-8 bg-red-50 border border-red-200 rounded p-4">
          <p className="text-red-600">❌ No data returned from API</p>
        </div>
      );
    }

    if (!getProductsData.data || !Array.isArray(getProductsData.data)) {
      return (
        <div className="text-center py-8 bg-yellow-50 border border-yellow-200 rounded p-4">
          <p className="text-yellow-600">⚠️ Data is not an array</p>
          <pre className="text-xs mt-2 text-left overflow-auto max-h-32">
            {JSON.stringify(getProductsData, null, 2)}
          </pre>
        </div>
      );
    }

    const filteredData = getFilteredProducts();

    if (filteredData.length === 0) {
      return (
        <div className="text-center py-8 bg-blue-50 border border-blue-200 rounded p-4">
          <p className="text-blue-600">📭 No products found</p>
        </div>
      );
    }

    return (
      <div>
        <ProductDataTable
          handleEdit={handleEditProduct}
          handleView={handleViewProduct}
          handleDelete={handleDeleteProduct}
          setPageSize={setPageSize}
          data={filteredData}
          currentPage={currentPage}
          onPageChange={onPageChange}
          pageSize={Number(pageSize)}
          totalPages={getProductsData.pagination?.totalPages || 1}
          loading={getProductsIsLoading}
        />
      </div>
    );
  };

  return (
    <section className="bg-[#FFFFFF] rounded-lg shadow-sm">
      <div className="p-4 flex justify-between items-center mb-8">
        <Header title="Products" subtext="Manage Products." />

        <div className="flex gap-5">
          <Button
            variant={"outline"}
            className="font-bold text-base w-auto py-4 px-5 flex gap-2 items-center"
            size={"xl"}
          >
            <ExportIcon /> Download
          </Button>
          <Button
            variant={"warning"}
            className="font-bold text-base w-auto py-4 px-6"
            size={"xl"}
            asChild
          >
            <Link href="/admin/products/add">+ Add New Product</Link>
          </Button>
        </div>
      </div>

      <Card className="bg-white">
        <CardContent className="p-6">
          <h6 className="font-normal text-[#111827] mb-6">
            Detailed Product Table
          </h6>

          <div className="flex items-center gap-4 mb-6 flex-wrap">
            <InputFilter
              setQuery={setFilter}
              placeholder="Search by product name, category, manufacturer"
            />

            <SelectFilter
              setFilter={setStatus}
              placeholder="Filter Products"
              list={productFilterList}
              value={status}
            />

            {/* Manufacturer Filter */}
            {/* <SelectFilter
              setFilter={setManufacturerFilter}
              placeholder="Filter by Manufacturer"
              list={[
                { label: "All Manufacturers", value: "all" },
                ...(getManufacturersData?.data || []).map(
                  (manufacturer: any) => ({
                    label: manufacturer.name,
                    value: manufacturer.id.toString(),
                  })
                ),
              ]}
              value={manufacturerFilter}
            /> */}

{/* <ManufacturerFilterWithPagination
  setFilter={setManufacturerFilter}
  value={manufacturerFilter}
  manufacturers={getManufacturersData?.data || []}
  fetchMore={refetchManufacturers || undefined} // or your pagination fetch function
  hasNextPage={getManufacturersData?.pagination?.hasNextPage || false}
/> */}

<ManufacturerFilterWithPagination
    setFilter={setManufacturerFilter}
    value={manufacturerFilter}
    manufacturers={allManufacturers}
    fetchMore={fetchMoreManufacturers}
    hasNextPage={getManufacturersData?.pagination?.hasNextPage || false}
  /> 


            {/* Category Filter */}
            {/* <SelectFilter
              setFilter={setCategoryFilter}
              placeholder="Filter by Category"
              list={[
                { label: "All Categories", value: "all" },
                ...(getAllCategoriesData?.categories || []).map(
                  (category: any) => ({
                    label: category.name,
                    value: category.id.toString(),
                  })
                ),
              ]}
              value={categoryFilter}
            /> */}
            <CategoryFilter
  setFilter={setCategoryFilter}
  value={categoryFilter}
  categories={getCategoriesSelectionData || []}
/>
          </div>

          {renderTable()}
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={() => setOpen(!open)}>
        <DialogContent
          className={`${
            tab !== "delete" && tab !== "delete-product"
              ? "right-0 p-8 max-w-[47.56rem] h-screen overflow-y-scroll"
              : "max-w-[33.75rem] left-[50%] translate-x-[-50%]"
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
    </section>
  );
}