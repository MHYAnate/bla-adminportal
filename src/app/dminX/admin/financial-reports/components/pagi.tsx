// import React, { useState } from 'react'
// import NextSvg from "./next";
// import PrevSvg from "./prev";
// import NextPageSvg from "./nextPage";
// import PrevPageSvg from "./prevPage";

// interface PaginationProps {
//   postsPerPage: number
//   totalPosts: number
//   paginate: (pageNumber: number) => void
//   currentPage: number
// }

// const Pagination: React.FC<PaginationProps> = ({ postsPerPage, totalPosts, paginate, currentPage }) => {
//   const pageNumbers: number[] = [];

//   const totalPages = Math.ceil(totalPosts / postsPerPage);

//   const [pageRange, setPageRange] = useState(1);

//   const visibleRangeSize = 5;
  

//   for (let i = 1; i <= Math.ceil(totalPosts / postsPerPage); i++) {
//     pageNumbers.push(i);
//   }

//   const indexOfFirstPageInRange = (pageRange - 1) * visibleRangeSize + 1;
//   const indexOfLastPageInRange = Math.min(pageRange * visibleRangeSize, totalPages);

//   const visiblePageNumbers = pageNumbers.slice(indexOfFirstPageInRange - 1, indexOfLastPageInRange);

//   const handlePrevious = () => {
//     if (currentPage > 1) {
//       paginate(currentPage - 1);
//     }
//   };

//   const handleNext = () => {
//     if (currentPage < pageNumbers.length) {
//       paginate(currentPage + 1);
//     }
//   };

//   const handleNextRange = () => {
//     if (indexOfLastPageInRange < totalPages) {
//       setPageRange(pageRange + 1);
//     }
//   };

//   const handlePrevRange = () => {
//     if (pageRange > 1) {
//       setPageRange(pageRange - 1);
//     }
//   };

//   return (
//     <nav className="flex justify-center items-center mt-8" aria-label="Pagination">
//     <div  className="flex items-center space-x-2">
//       {pageRange > 1 && (<div className="p-2 rounded-full hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
//             aria-label="Previous page range"
//           onClick={()=>handlePrevRange()}> <PrevPageSvg/></div>)}
//       <div className="p-2 rounded-full hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
//           aria-label="Previous page" onClick={()=>handlePrevious()}><PrevSvg/></div>
//       {visiblePageNumbers.map(number => (
//         <div key={number} className="flex items-center space-x-2">
//           <div onClick={() => paginate(number)}  className={currentPage === number ? 'bg-blue-500 text-white'
//                 : 'text-gray-700 hover:bg-gray-200'}>
//             {number}
//           </div>
//         </div>
//       ))}
//       <div className="p-2 rounded-full hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
//           aria-label="Next page" onClick={()=>handleNext()}><NextSvg/></div>
//       {indexOfLastPageInRange < totalPages && (<div className="p-2 rounded-full hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
//             aria-label="Next page range" onClick={()=>{handleNextRange()}}><NextPageSvg/></div>)}
//     </div>
//   </nav>
//   )
// }

// export default Pagination


import NextSvg from "./next";
import PrevSvg from "./prev";
import NextPageSvg from "./nextPage";
import PrevPageSvg from "./prevPage";

// interface PaginationProps {
//   postsPerPage: number;
//   totalPosts: number;
//   paginate: (pageNumber: number) => void;
//   currentPage: number;
// }

// const Pagination: React.FC<PaginationProps> = ({
//   postsPerPage,
//   totalPosts,
//   paginate,
//   currentPage,
// }) => {
//   const pageNumbers: number[] = [];

//   const totalPages = Math.ceil(totalPosts / postsPerPage);

//   const [pageRange, setPageRange] = useState(1);

//   const visibleRangeSize = 5;

//   for (let i = 1; i <= totalPages; i++) {
//     pageNumbers.push(i);
//   }

//   const indexOfFirstPageInRange = (pageRange - 1) * visibleRangeSize + 1;
//   const indexOfLastPageInRange = Math.min(pageRange * visibleRangeSize, totalPages);

//   const visiblePageNumbers = pageNumbers.slice(
//     indexOfFirstPageInRange - 1,
//     indexOfLastPageInRange
//   );

//   const handlePrevious = () => {
//     if (currentPage > 1) {
//       paginate(currentPage - 1);
//     }
//   };

//   const handleNext = () => {
//     if (currentPage < totalPages) {
//       paginate(currentPage + 1);
//     }
//   };

//   const handleNextRange = () => {
//     if (indexOfLastPageInRange < totalPages) {
//       setPageRange(pageRange + 1);
//     }
//   };

//   const handlePrevRange = () => {
//     if (pageRange > 1) {
//       setPageRange(pageRange - 1);
//     }
//   };

//   return (
//     <nav className="flex justify-center items-center mt-4" aria-label="Pagination">
//       <div className="flex items-center space-x-2">
//         {pageRange > 1 && (
//           <button
//             className="p-2 rounded-full hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
//             aria-label="Previous page range"
//             onClick={handlePrevRange}
//           >
//             <PrevPageSvg />
//           </button>
//         )}
//         <button
//           className="p-2 rounded-full hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
//           aria-label="Previous page"
//           onClick={handlePrevious}
//         >
//           <PrevSvg />
//         </button>
//         {visiblePageNumbers.map((number) => (
//           <button
//             key={number}
//             onClick={() => paginate(number)}
//             className={`px-3 py-1 rounded ${
//               currentPage === number
//                 ? 'bg-blue-500 text-white'
//                 : 'text-gray-700 hover:bg-gray-200'
//             }`}
//           >
//             {number}
//           </button>
//         ))}
//         <button
//           className="p-2 rounded-full hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
//           aria-label="Next page"
//           onClick={handleNext}
//         >
//           <NextSvg />
//         </button>
//         {indexOfLastPageInRange < totalPages && (
//           <button
//             className="p-2 rounded-full hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
//             aria-label="Next page range"
//             onClick={handleNextRange}
//           >
//             <NextPageSvg />
//           </button>
//         )}
//       </div>
//     </nav>
//   );
// };

// export default Pagination;

"use client"

import React  from 'react'
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

  if (totalPages <= 1) return null

  return (
    <nav className="flex items-center justify-center sm:justify-end">
      <div className="flex flex-wrap items-center space-x-1">
        <button
          onClick={() => currentPage > 1 && paginate(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-1.5 rounded-md text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none transition-colors"
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        {/* Hide page numbers on very small screens */}
        <div className="hidden xs:flex space-x-1">
          {getPageNumbers().map((number, index) => (
            <React.Fragment key={index}>
              {number === "..." ? (
                <span className="px-2 py-1 text-gray-500">...</span>
              ) : (
                <button
                  onClick={() => paginate(number as number)}
                  className={`w-7 h-7 flex items-center justify-center rounded-md text-xs font-medium transition-colors ${
                    currentPage === number ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-100"
                  }`}
                  aria-current={currentPage === number ? "page" : undefined}
                >
                  {number}
                </button>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Show current page / total on very small screens */}
        <span className="xs:hidden text-xs text-gray-500 px-1">
          {currentPage} / {totalPages}
        </span>

        <button
          onClick={() => currentPage < totalPages && paginate(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-1.5 rounded-md text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none transition-colors"
          aria-label="Next page"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </nav>
  )
}

export default Pagination
