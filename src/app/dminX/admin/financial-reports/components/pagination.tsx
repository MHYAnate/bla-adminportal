// import React from 'react';
// import { ChevronLeft, ChevronRight } from 'lucide-react';

// interface PaginationProps {
//   currentPage: number;
//   totalPages: number;
//   pageSize: number;
//   onPageChange: (page: number) => void;
//   onPageSizeChange: (size: number) => void;
// }

// const Pagination: React.FC<PaginationProps> = ({
//   currentPage,
//   totalPages,
//   pageSize,
//   onPageChange,
//   onPageSizeChange,
// }) => {
//   const pageSizeOptions = [5, 10, 25, 50];

//   // Generate page numbers to display
//   const getPageNumbers = () => {
//     const pages = [];
//     const maxPagesToShow = 5;
    
//     if (totalPages <= maxPagesToShow) {
//       // If we have fewer pages than the max, show all of them
//       for (let i = 1; i <= totalPages; i++) {
//         pages.push(i);
//       }
//     } else {
//       // Always show first page
//       pages.push(1);
      
//       // Calculate the range around current page
//       let startPage = Math.max(2, currentPage - 1);
//       let endPage = Math.min(totalPages - 1, currentPage + 1);
      
//       // Adjust if we're at the start or end
//       if (currentPage <= 2) {
//         endPage = 3;
//       } else if (currentPage >= totalPages - 1) {
//         startPage = totalPages - 2;
//       }
      
//       // Add ellipsis if there's a gap after page 1
//       if (startPage > 2) {
//         pages.push('ellipsis-start');
//       }
      
//       // Add middle pages
//       for (let i = startPage; i <= endPage; i++) {
//         pages.push(i);
//       }
      
//       // Add ellipsis if there's a gap before the last page
//       if (endPage < totalPages - 1) {
//         pages.push('ellipsis-end');
//       }
      
//       // Always show last page
//       pages.push(totalPages);
//     }
    
//     return pages;
//   };

//   return (
//     <div className="flex flex-col items-center px-4 py-3 mt-4 space-y-3 bg-white border-t border-gray-200 sm:px-6 sm:flex-row sm:justify-between sm:space-y-0">
//       <div className="flex items-center text-sm text-gray-700">
//         <p>
//           Showing{' '}
//           <span className="font-medium">
//             {Math.min((currentPage - 1) * pageSize + 1, totalPages * pageSize)}
//           </span>{' '}
//           to{' '}
//           <span className="font-medium">
//             {Math.min(currentPage * pageSize, totalPages * pageSize)}
//           </span>{' '}
//           of <span className="font-medium">{totalPages * pageSize}</span> results
//         </p>
//         <div className="ml-4">
//           <label htmlFor="pageSize" className="mr-2 text-sm font-medium text-gray-700">
//             Items per page:
//           </label>
//           <select
//             id="pageSize"
//             value={pageSize}
//             onChange={(e) => onPageSizeChange(Number(e.target.value))}
//             className="px-2 py-1 text-sm border-gray-300 rounded focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
//           >
//             {pageSizeOptions.map((size) => (
//               <option key={size} value={size}>
//                 {size}
//               </option>
//             ))}
//           </select>
//         </div>
//       </div>
//       <div className="flex items-center justify-between sm:justify-end">
//         <button
//           onClick={() => onPageChange(currentPage - 1)}
//           disabled={currentPage === 1}
//           className={`relative inline-flex items-center px-2 py-2 text-sm font-medium rounded-md ${
//             currentPage === 1
//               ? 'text-gray-300 cursor-not-allowed'
//               : 'text-gray-700 hover:bg-gray-50'
//           }`}
//         >
//           <span className="sr-only">Previous</span>
//           <ChevronLeft className="w-5 h-5" />
//         </button>
//         <nav className="inline-flex -space-x-px rounded-md shadow-sm isolate" aria-label="Pagination">
//           {getPageNumbers().map((page, index) => {
//             if (page === 'ellipsis-start' || page === 'ellipsis-end') {
//               return (
//                 <span
//                   key={`ellipsis-${index}`}
//                   className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white"
//                 >
//                   ...
//                 </span>
//               );
//             }
            
//             return (
//               <button
//                 key={page}
//                 onClick={() => onPageChange(Number(page))}
//                 className={`relative inline-flex items-center px-4 py-2 text-sm font-medium ${
//                   currentPage === page
//                     ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
//                     : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
//                 } border`}
//                 aria-current={currentPage === page ? 'page' : undefined}
//               >
//                 {page}
//               </button>
//             );
//           })}
//         </nav>
//         <button
//           onClick={() => onPageChange(currentPage + 1)}
//           disabled={currentPage === totalPages}
//           className={`relative inline-flex items-center px-2 py-2 text-sm font-medium rounded-md ${
//             currentPage === totalPages
//               ? 'text-gray-300 cursor-not-allowed'
//               : 'text-gray-700 hover:bg-gray-50'
//           }`}
//         >
//           <span className="sr-only">Next</span>
//           <ChevronRight className="w-5 h-5" />
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Pagination;

"use client"

import React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface PaginationProps {
  postsPerPage: number
  totalPosts: number
  paginate: (pageNumber: number) => void
  currentPage: number
}

const Pagination: React.FC<PaginationProps> = ({ postsPerPage, totalPosts, paginate, currentPage }) => {
  const pageNumbers = []
  const totalPages = Math.ceil(totalPosts / postsPerPage)

  // Logic to display limited page numbers with ellipsis
  const getPageNumbers = () => {
    const delta = 1 // Number of pages to show before and after current page
    const range = []
    const rangeWithDots = []
    let l

    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= currentPage - delta && i <= currentPage + delta)) {
        range.push(i)
      }
    }

    for (const i of range) {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1)
        } else if (i - l !== 1) {
          rangeWithDots.push("...")
        }
      }
      rangeWithDots.push(i)
      l = i
    }

    return rangeWithDots
  }

  return (
    <div className="flex items-center justify-between">
      <div className="text-sm text-gray-500">
        Showing {Math.min(1, totalPosts)} to {Math.min(currentPage * postsPerPage, totalPosts)} of {totalPosts} entries
      </div>

      <nav className="flex items-center space-x-1">
        <button
          onClick={() => currentPage > 1 && paginate(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2 rounded-md text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none transition-colors"
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        {getPageNumbers().map((number, index) => (
          <React.Fragment key={index}>
            {number === "..." ? (
              <span className="px-3 py-1.5 text-gray-500">...</span>
            ) : (
              <button
                onClick={() => paginate(number as number)}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  currentPage === number ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-100"
                }`}
                aria-current={currentPage === number ? "page" : undefined}
              >
                {number}
              </button>
            )}
          </React.Fragment>
        ))}

        <button
          onClick={() => currentPage < totalPages && paginate(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-2 rounded-md text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none transition-colors"
          aria-label="Next page"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </nav>
    </div>
  )
}

export default Pagination
