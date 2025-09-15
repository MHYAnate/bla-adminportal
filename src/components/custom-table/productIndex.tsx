// // // "use client";

// // // import {
// // //   Table,
// // //   TableBody,
// // //   TableCell,
// // //   TableHead,
// // //   TableHeader,
// // //   TableRow,
// // // } from "@/components/ui/table";
// // // import { cn } from "@/lib/utils";
// // // import { ProductData, DataItem, ITableProps, InventoryData } from "@/types";
// // // import { ReactNode } from "react";
// // // import { Pagination } from "../ui/pagination";
// // // import { SelectFilter } from "@/app/(admin)/components/select-filter";
// // // import { EmptyProductIcon } from "../../../public/icons";
// // // import TableSkeleton from "../skeletons/table";

// // // type CellRenderer<T> = (item: T, column: keyof T) => ReactNode;

// // // export interface EnhancedTableProps<T extends DataItem> extends ITableProps<T> {
// // //   cellRenderers?: any;
// // //   columnOrder?: (keyof T)[];
// // //   columnLabels?: Partial<Record<keyof T, string>>;
// // // }

// // // export function ProductTableComponent<T extends ProductData>({
// // //   tableData,
// // //   currentPage = 1,
// // //   totalPages = 10,
// // //   onPageChange,
// // //   cellRenderers = {},
// // //   columnOrder,
// // //   columnLabels = {},
// // //   onRowClick,
// // //   setFilter,
// // //   isLoading = true,
// // //   showPagination = true,
// // // }: EnhancedTableProps<T>) {
// // //   const columns = columnOrder || (Object.keys(tableData[0]) as (keyof T)[]);
// // //   if (isLoading) return <TableSkeleton columns={columns} />;
// // //   if (tableData.length === 0)
// // //     return (
// // //       <div className="h-[50vh] flex flex-col items-center justify-center text-gray-500">
// // //         <EmptyProductIcon />
// // //         <p className="text-sm">No data available</p>
// // //       </div>
// // //     );
// // //   const safeOnPageChange = onPageChange ?? (() => { });

// // //   const formatColumnName = (name: string) => {
// // //     return (
// // //       columnLabels[name as keyof T] ||
// // //       name.replace(/([A-Z])/g, " $1").replace(/^./, function (str) {
// // //         return str.toUpperCase();
// // //       })
// // //     );
// // //   };

// // //   const renderCellContent = (item: T, column: keyof T) => {
// // //     if (cellRenderers[column]) {
// // //       return cellRenderers[column]!(item, column);
// // //     }

// // //     return String(item[column]);
// // //   };

// // //   const list = [
// // //     {
// // //       value: "10",
// // //       text: "10",
// // //     },
// // //     {
// // //       value: "20",
// // //       text: "20",
// // //     },
// // //     {
// // //       value: "50",
// // //       text: "50",
// // //     },
// // //   ];

// // //   return (
// // //     <div className="w-fit">
// // //       <div className="rounded-md overflow-hidden">
// // //         <Table>
// // //           <TableHeader className="bg-[#FAFAFA]">
// // //             <TableRow className="border-none">
// // //               {columns.map((column, index) => (
// // //                 <TableHead
// // //                   className={cn(
// // //                     "py-4 font-bold text-xs",
// // //                     index === 0 ? "pl-4" : ""
// // //                   )}
// // //                   key={String(column)}
// // //                 >
// // //                   {formatColumnName(String(column))}
// // //                 </TableHead>
// // //               ))}
// // //             </TableRow>
// // //           </TableHeader>
// // //           <TableBody>
// // //             {tableData.map((item, rowIndex) => (
// // //               <TableRow
// // //                 key={rowIndex}
// // //                 className="border-b border-gray-50 cursor-pointer hover:bg-accent-nuetral"
// // //               >
// // //                 {columns.map((column, colIndex) => (
// // //                   <TableCell
// // //                     className={cn(
// // //                       "py-4 text-[#111827]",
// // //                       colIndex === 0 ? "pl-6" : ""
// // //                     )}
// // //                     key={String(column)}
// // //                   >
// // //                     {renderCellContent(item, column)}
// // //                   </TableCell>
// // //                 ))}
// // //               </TableRow>
// // //             ))}
// // //           </TableBody>
// // //         </Table>
// // //       </div>
// // //       {showPagination && (
// // //         <div className="mt-6 flex justify-between">
// // //           <Pagination
// // //             currentPage={currentPage}
// // //             onPageChange={safeOnPageChange}
// // //             totalPages={totalPages}
// // //           />
// // //           <SelectFilter
// // //             list={list}
// // //             setFilter={setFilter}
// // //             className="h-8 w-[87px]"
// // //             placeholder="Page Size"
// // //           />
// // //         </div>
// // //       )}
// // //     </div>
// // //   );
// // // }

// // "use client";

// // import {
// //   Table,
// //   TableBody,
// //   TableCell,
// //   TableHead,
// //   TableHeader,
// //   TableRow,
// // } from "@/components/ui/table";
// // import { cn } from "@/lib/utils";
// // import { ProductData, DataItem, ITableProps, InventoryData } from "@/types";
// // import { ReactNode } from "react";
// // import { Pagination } from "../ui/pagination";
// // import { SelectFilter } from "@/app/(admin)/components/select-filter";
// // import { EmptyProductIcon } from "../../../public/icons";
// // import TableSkeleton from "../skeletons/table";

// // type CellRenderer<T> = (item: T, column: keyof T) => ReactNode;

// // export interface EnhancedTableProps<T extends DataItem> extends ITableProps<T> {
// //   cellRenderers?: any;
// //   columnOrder?: (keyof T)[];
// //   columnLabels?: Partial<Record<keyof T, string>>;
// // }

// // export function ProductTableComponent<T extends ProductData>({
// //   tableData,
// //   currentPage = 1,
// //   totalPages = 10,
// //   onPageChange,
// //   cellRenderers = {},
// //   columnOrder,
// //   columnLabels = {},
// //   onRowClick,
// //   setFilter,
// //   isLoading = true,
// //   showPagination = true,
// // }: EnhancedTableProps<T>) {
// //   const columns = columnOrder || (Object.keys(tableData[0] || {}) as (keyof T)[]);
  
// //   if (isLoading) return <TableSkeleton columns={columns} />;
  
// //   if (tableData.length === 0)
// //     return (
// //       <div className="h-[50vh] flex flex-col items-center justify-center text-gray-500">
// //         <EmptyProductIcon />
// //         <p className="text-sm">No data available</p>
// //       </div>
// //     );
    
// //   const safeOnPageChange = onPageChange ?? (() => { });

// //   const formatColumnName = (name: string) => {
// //     return (
// //       columnLabels[name as keyof T] ||
// //       name.replace(/([A-Z])/g, " $1").replace(/^./, function (str) {
// //         return str.toUpperCase();
// //       })
// //     );
// //   };

// //   const renderCellContent = (item: T, column: keyof T) => {
// //     if (cellRenderers[column]) {
// //       return cellRenderers[column]!(item, column);
// //     }

// //     return String(item[column]);
// //   };

// //   const pageSizeList = [
// //     {
// //       value: "10",
// //       text: "10",
// //     },
// //     {
// //       value: "20",
// //       text: "20",
// //     },
// //     {
// //       value: "50",
// //       text: "50",
// //     },
// //     {
// //       value: "100",
// //       text: "100",
// //     },
// //   ];

// //   return (
// //     <div className="w-full">
// //       <div className="rounded-md overflow-hidden border border-gray-200">
// //         <Table>
// //           <TableHeader className="bg-gray-50">
// //             <TableRow className="border-none">
// //               {columns.map((column, index) => (
// //                 <TableHead
// //                   className={cn(
// //                     "py-3 font-semibold text-xs text-gray-700 border-b border-gray-200",
// //                     index === 0 ? "pl-4" : "px-2"
// //                   )}
// //                   key={String(column)}
// //                 >
// //                   {formatColumnName(String(column))}
// //                 </TableHead>
// //               ))}
// //             </TableRow>
// //           </TableHeader>
// //           <TableBody>
// //             {tableData.map((item, rowIndex) => (
// //               <TableRow
// //                 key={rowIndex}
// //                 className="border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors duration-150"
// //                 onClick={onRowClick ? () => onRowClick(item) : undefined}
// //               >
// //                 {columns.map((column, colIndex) => (
// //                   <TableCell
// //                     className={cn(
// //                       "py-3 text-gray-900 align-top",
// //                       // FIX: Reduced horizontal padding between table content
// //                       colIndex === 0 ? "pl-4 pr-2" : "px-2"
// //                     )}
// //                     key={String(column)}
// //                   >
// //                     {renderCellContent(item, column)}
// //                   </TableCell>
// //                 ))}
// //               </TableRow>
// //             ))}
// //           </TableBody>
// //         </Table>
// //       </div>
// //       {/* FIX: Improved pagination section */}
// //       {showPagination && (
// //         <div className="mt-4 flex flex-col sm:flex-row justify-between items-center gap-4">
// //           <div className="flex items-center gap-2 text-sm text-gray-600">
// //             <span>Showing</span>
// //             <SelectFilter
// //               list={pageSizeList}
// //               setFilter={(value: string) => {
// //                 if (setFilter) {
// //                   setFilter(value);
// //                 }
// //               }}
// //               className="h-8 w-[70px] text-xs"
// //               placeholder="10"
// //             />
// //             <span>entries per page</span>
// //           </div>
// //           <Pagination
// //             currentPage={currentPage}
// //             onPageChange={safeOnPageChange}
// //             totalPages={totalPages}
// //           />
// //         </div>
// //       )}
// //     </div>
// //   );
// // }

// "use client";

// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { cn } from "@/lib/utils";
// import { ProductData, DataItem, ITableProps, InventoryData } from "@/types";
// import { ReactNode } from "react";
// import { Pagination } from "../ui/pagination";
// import { SelectFilter } from "@/app/(admin)/components/select-filter";
// import { EmptyProductIcon } from "../../../public/icons";
// import TableSkeleton from "../skeletons/table";

// type CellRenderer<T> = (item: T, column: keyof T) => ReactNode;

// export interface EnhancedTableProps<T extends DataItem> extends ITableProps<T> {
//   cellRenderers?: any;
//   columnOrder?: (keyof T)[];
//   columnLabels?: Partial<Record<keyof T, string>>;
// }


// export function ProductTableComponent<T extends ProductData>({
//   tableData,
//   currentPage,
//   totalPages,
//   pageSize,
//   onPageChange,
//   cellRenderers = {},
//   columnOrder,
//   columnLabels = {},
//   onRowClick,
//   setFilter,
//   isLoading = true,
//   showPagination = true,
// }: any) {
//   const columns = columnOrder || (Object.keys(tableData[0] || {}) as (keyof T)[]);
  
//   if (isLoading) return <TableSkeleton columns={columns} />;
  
//   if (tableData.length === 0)
//     return (
//       <div className="h-[50vh] flex flex-col items-center justify-center text-gray-500">
//         <EmptyProductIcon />
//         <p className="text-sm">No data available</p>
//       </div>
//     );
    
//   const safeOnPageChange = onPageChange ?? (() => { });

//   const formatColumnName = (name: string) => {
//     return (
//       columnLabels[name as keyof T] ||
//       name.replace(/([A-Z])/g, " $1").replace(/^./, function (str) {
//         return str.toUpperCase();
//       })
//     );
//   };

//   const renderCellContent = (item: T, column: keyof T) => {
//     if (cellRenderers[column]) {
//       return cellRenderers[column]!(item, column);
//     }

//     return String(item[column]);
//   };

//   const pageSizeList = [
//     {
//       value: "10",
//       text: "10",
//     },
//     {
//       value: "20",
//       text: "20",
//     },
//     {
//       value: "50",
//       text: "50",
//     },
//     {
//       value: "100",
//       text: "100",
//     },
//   ];

//   return (
//     <div className="w-full">
//       <div className="rounded-md overflow-hidden border border-gray-200">
//         <Table>
//           <TableHeader className="bg-gray-50">
//             <TableRow className="border-none">
//               {columns.map((column:any, index: any) => (
//                 <TableHead
//                   className={cn(
//                     "py-3 font-semibold text-xs text-gray-700 border-b border-gray-200",
//                     index === 0 ? "pl-4" : "px-2"
//                   )}
//                   key={String(column)}
//                 >
//                   {formatColumnName(String(column))}
//                 </TableHead>
//               ))}
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//             {tableData.map((item:any, rowIndex:any) => (
//               <TableRow
//                 key={rowIndex}
//                 className="border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors duration-150"
//                 onClick={onRowClick ? () => onRowClick(item) : undefined}
//               >
//                 {columns.map((column:any, colIndex:any) => (
//                   <TableCell
//                     className={cn(
//                       "py-3 text-gray-900 align-top",
//                       // FIX: Reduced horizontal padding between table content
//                       colIndex === 0 ? "pl-4 pr-2" : "px-2"
//                     )}
//                     key={String(column)}
//                   >
//                     {renderCellContent(item, column)}
//                   </TableCell>
//                 ))}
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </div>
//       {/* FIX: Improved pagination section */}
//       {showPagination && (
//         <div className="mt-4 flex flex-col sm:flex-row justify-between items-center gap-4">
//           <div className="flex items-center gap-2 text-sm text-gray-600">
//             <span>Showing</span>
//             <SelectFilter
//               list={pageSizeList}
//               setFilter={(value: string) => {
//                 console.log('Page size changed to:', value);
//                 if (setFilter) {
//                   setFilter(value);
//                 }
//               }}
//               className="h-8 w-[70px] text-xs"
//               placeholder="10"
//               value={pageSize?.toString() || "10"}
//             />
//             <span>entries per page</span>
//           </div>
//           <Pagination
//             currentPage={currentPage}
//             onPageChange={safeOnPageChange}
//             totalPages={totalPages}
//           />
//         </div>
//       )}
//     </div>
//   );
// }

"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { ProductData, DataItem, ITableProps, InventoryData } from "@/types";
import { ReactNode } from "react";
import { Pagination } from "../ui/pagination";
import { SelectFilter } from "@/app/(admin)/components/select-filter";
import { EmptyProductIcon } from "../../../public/icons";
import TableSkeleton from "../skeletons/table";

type CellRenderer<T> = (item: T, column: keyof T) => ReactNode;

export interface EnhancedTableProps<T extends DataItem> extends ITableProps<T> {
  cellRenderers?: any;
  columnOrder?: (keyof T)[];
  columnLabels?: Partial<Record<keyof T, string>>;
}

export function ProductTableComponent<T extends ProductData>({
  tableData,
  currentPage,
  totalPages,
  pageSize,
  onPageChange,
  cellRenderers = {},
  columnOrder,
  columnLabels = {},
  onRowClick,
  setFilter,
  isLoading = true,
  showPagination = true,
}: any) {
  const columns = columnOrder || (Object.keys(tableData[0] || {}) as (keyof T)[]);
  
  if (isLoading) return <TableSkeleton columns={columns} />;
  
  if (tableData.length === 0)
    return (
      <div className="h-[50vh] flex flex-col items-center justify-center text-gray-500">
        <EmptyProductIcon />
        <p className="text-sm">No data available</p>
      </div>
    );
    
  const safeOnPageChange = onPageChange ?? (() => { });

  const formatColumnName = (name: string) => {
    return (
      columnLabels[name as keyof T] ||
      name.replace(/([A-Z])/g, " $1").replace(/^./, function (str) {
        return str.toUpperCase();
      })
    );
  };

  const renderCellContent = (item: T, column: keyof T) => {
    if (cellRenderers[column]) {
      return cellRenderers[column]!(item, column);
    }

    return String(item[column]);
  };

  const pageSizeList = [
    {
      value: "10",
      text: "10",
    },
    {
      value: "20",
      text: "20",
    },
    {
      value: "50",
      text: "50",
    },
    {
      value: "100",
      text: "100",
    },
  ];

  return (
    <div className="w-full">
      <div className="rounded-md overflow-hidden border border-gray-200">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow className="border-none">
              {columns.map((column:any, index: any) => (
                <TableHead
                  className={cn(
                    "py-3 font-semibold text-xs text-gray-700 border-b border-gray-200",
                    index === 0 ? "pl-4" : "px-2"
                  )}
                  key={String(column)}
                >
                  {formatColumnName(String(column))}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {tableData.map((item:any, rowIndex:any) => (
              <TableRow
                key={rowIndex}
                className="border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors duration-150"
                onClick={onRowClick ? () => onRowClick(item) : undefined}
              >
                {columns.map((column:any, colIndex:any) => (
                  <TableCell
                    className={cn(
                      "py-3 text-gray-900 align-top",
                      colIndex === 0 ? "pl-4 pr-2" : "px-2"
                    )}
                    key={String(column)}
                  >
                    {renderCellContent(item, column)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {showPagination && (
        <div className="mt-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>Showing</span>
            <SelectFilter
              list={pageSizeList}
              setFilter={(value: string) => {
                if (setFilter) {
                  setFilter(value);
                }
              }}
              className="h-8 w-[70px] text-xs"
              placeholder="10"
              value={pageSize?.toString() || "10"}
            />
            <span>entries per page</span>
          </div>
          <Pagination
            currentPage={currentPage}
            onPageChange={safeOnPageChange}
            totalPages={totalPages}
          />
        </div>
      )}
    </div>
  );
}