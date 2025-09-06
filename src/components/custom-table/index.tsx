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
// import { AdminData, DataItem, ITableProps } from "@/types";
// import { ReactNode } from "react";
// import { Pagination } from "../ui/pagination";
// import { SelectFilter } from "@/app/(admin)/components/select-filter";
// import { EmptyProductIcon } from "../../../public/icons";
// import TableSkeleton from "../skeletons/table";

// type CellRenderer<T> = (item: T, column: keyof T) => ReactNode;

// // export interface EnhancedTableProps<T extends DataItem> extends ITableProps<T> {
// //   cellRenderers?:any;
// //   columnOrder?: (keyof T)[];
// //   columnLabels?: Partial<Record<keyof T, string>>;
// // }

// // 1. Add a specific prop for page size changes for clarity
// export interface EnhancedTableProps<T extends DataItem> extends ITableProps<T> {
//   cellRenderers?: any;
//   columnOrder?: (keyof T)[];
//   columnLabels?: Partial<Record<keyof T, string>>;
//   onPageSizeChange?: (value: string) => void;
// }

// export function TableComponent<T extends AdminData>({
//   tableData,
//   currentPage = 1,
//   totalPages = 10,
//   onPageChange,
//   cellRenderers = {},
//   columnOrder,
//   columnLabels = {},
//   onRowClick,
//   setFilter,
//   isLoading = true,
//   showPagination = true,
//   onPageSizeChange,
// }: EnhancedTableProps<T>) {
//   const columns = columnOrder || (Object.keys(tableData[0]) as (keyof T)[]);
//   if (isLoading) return <TableSkeleton columns={columns} />;
//   if (tableData.length === 0)
//     return (
//       <div className="h-[50vh] flex flex-col items-center justify-center text-gray-500">
//         <EmptyProductIcon />
//         <p className="text-sm">No data available</p>
//       </div>
//     );
//   const safeOnPageChange = onPageChange ?? (() => {});

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

//   const list = [
//     {
//       value: "10",
//       text: "10",
//     },
//     {
//       value: "20",
//       text: "20",
//     },
//     {
//       value: "30",
//       text: "30",
//     },
//   ];

//   const pageSizeList = [
//     { value: "10", text: "10" },
//     { value: "20", text: "20" },
//     { value: "30", text: "30" },
//   ];

//   return (
//     <div className="w-full">
//       <div className="rounded-md overflow-hidden">
//         <Table>
//           <TableHeader className="bg-[#FAFAFA]">
//             <TableRow className="border-none">
//               {columns.map((column, index) => (
//                 <TableHead
//                   className={cn(
//                     "py-4 font-bold text-xs",
//                     index === 0 ? "pl-4" : ""
//                   )}
//                   key={String(column)}
//                 >
//                   {formatColumnName(String(column))}
//                 </TableHead>
//               ))}
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//             {tableData.map((item, rowIndex) => (
//               <TableRow
//                 key={rowIndex}
//                 className="border-b border-gray-50 cursor-pointer hover:bg-accent-nuetral"
//               >
//                 {columns.map((column, colIndex) => (
//                   <TableCell
//                     className={cn(
//                       "py-4 text-[#111827]",
//                       colIndex === 0 ? "pl-6" : ""
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
//       {showPagination && (
//         <div className="mt-6 flex justify-between">
//           <Pagination
//             currentPage={currentPage}
//             onPageChange={safeOnPageChange}
//             totalPages={totalPages}
//           />
//           {/* <SelectFilter
//             list={list}
//             setFilter={setFilter}
//             className="h-8 w-[87px]"
//             placeholder="Page Size"
//           /> */}
//               {/* 2. Wire the SelectFilter to the onPageSizeChange handler */}
//               <SelectFilter
//             list={pageSizeList}
//             setFilter={onPageSizeChange}
//             className="h-8 w-[87px]"
//             placeholder="10"
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
import { AdminData, DataItem } from "@/types";
import { ReactNode } from "react";
import { Pagination } from "../ui/pagination";
import { SelectFilter } from "@/app/(admin)/components/select-filter";
import { EmptyProductIcon } from "../../../public/icons";
import TableSkeleton from "../skeletons/table";

type CellRenderer<T> = (item: T, column: keyof T) => ReactNode;

export interface EnhancedTableProps<T extends DataItem> {
  tableData: T[];
  currentPage?: number;
  totalPages?: number;
  totalItems?: number;
  onPageChange?: (page: number) => void;
  cellRenderers?: any;
  columnOrder?: (keyof T)[];
  columnLabels?: Partial<Record<keyof T, string>>;
  onRowClick?: (item: T) => void;
  isLoading?: boolean;
  showPagination?: boolean;
  onPageSizeChange?: (value: string) => void;
  pageSize?: number;
}

export function TableComponent<T extends AdminData>({
  tableData,
  currentPage = 1,
  totalPages = 1,
  totalItems = 0,
  onPageChange,
  cellRenderers = {},
  columnOrder,
  columnLabels = {},
  onRowClick,
  isLoading = true,
  showPagination = true,
  onPageSizeChange,
  pageSize = 10,
}: EnhancedTableProps<T>) {
  // Get columns from data or use provided columnOrder
  const columns = columnOrder || (tableData.length > 0 ? Object.keys(tableData[0]) as (keyof T)[] : []);
  
  if (isLoading) return <TableSkeleton columns={columns} />;
  
  if (tableData.length === 0) {
    return (
      <div className="h-[50vh] flex flex-col items-center justify-center text-gray-500">
        <EmptyProductIcon />
        <p className="text-sm">No data available</p>
      </div>
    );
  }

  const safeOnPageChange = onPageChange ?? (() => {});

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
    { value: "10", text: "10" },
    { value: "20", text: "20" },
    { value: "30", text: "30" },
    { value: "50", text: "50" },
  ];

  // Calculate the range of items being shown
  const startItem = ((currentPage - 1) * pageSize) + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  return (
    <div className="w-full">
      <div className="rounded-md overflow-hidden">
        <Table>
          <TableHeader className="bg-[#FAFAFA]">
            <TableRow className="border-none">
              {columns.map((column, index) => (
                <TableHead
                  className={cn(
                    "py-4 font-bold text-xs",
                    index === 0 ? "pl-4" : ""
                  )}
                  key={String(column)}
                >
                  {formatColumnName(String(column))}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {tableData.map((item, rowIndex) => (
              <TableRow
                key={rowIndex}
                className="border-b border-gray-50 cursor-pointer hover:bg-accent-nuetral"
                onClick={() => onRowClick && onRowClick(item)}
              >
                {columns.map((column, colIndex) => (
                  <TableCell
                    className={cn(
                      "py-4 text-[#111827]",
                      colIndex === 0 ? "pl-6" : ""
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
        <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-sm text-gray-600">
            Showing {startItem} to {endItem} of {totalItems} entries
          </div>
          
          <div className="flex items-center gap-4">
            <Pagination
              currentPage={currentPage}
              onPageChange={safeOnPageChange}
              totalPages={totalPages}
            />
            
            {/* <SelectFilter
              list={pageSizeList}
              setFilter={onPageSizeChange}
              className="h-8 w-[87px]"
              placeholder={pageSize.toString()}
            /> */}
          </div>
        </div>
      )}
    </div>
  );
}