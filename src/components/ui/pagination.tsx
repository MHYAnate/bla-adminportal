import { IPaginationProps } from "@/types";
import React from "react";
import { Button } from "./button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: IPaginationProps) {
  const pageNumbers = getPageNumbers(currentPage, totalPages);

  return (
    <div className="flex items-center justify-between gap-6">
      <Button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        variant="outline"
        className="bg-transparent !border-[#F1F2F4] w-8 h-8"
      >
        <ChevronLeft size={16} />
      </Button>
      <div className="flex items-center gap-1">
        {pageNumbers.map((pageNumber, index) => (
          <React.Fragment key={index}>
            {pageNumber === null ? (
              <span className="px-2 py-1 text-[#111827]">...</span>
            ) : (
              <Button
                onClick={() => onPageChange(pageNumber as number)}
                className={`text-[#111827] !border-transparent ${
                  currentPage === pageNumber
                    ? "bg-[#F8F8F8]"
                    : "bg-transparent !shadow-none "
                } h-8 w-8 rounded-md`}
                variant={"outline"}
              >
                {pageNumber}
              </Button>
            )}
          </React.Fragment>
        ))}
      </div>
      <Button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="bg-transparent p-0 w-8 h-8 !border-[#F1F2F4]"
        variant="outline"
      >
        <ChevronRight size={16} />
      </Button>
    </div>
  );
}

function getPageNumbers(
  currentPage: number,
  totalPages: number
): (number | null)[] {
  const maxVisiblePages = 5;
  const pageNumbers: (number | null)[] = [];

  if (totalPages <= maxVisiblePages) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  pageNumbers.push(1);

  if (currentPage <= 3) {
    pageNumbers.push(2, 3, 4, null, totalPages);
  } else if (currentPage >= totalPages - 2) {
    pageNumbers.push(
      null,
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages
    );
  } else {
    pageNumbers.push(
      null,
      currentPage - 1,
      currentPage,
      currentPage + 1,
      null,
      totalPages
    );
  }

  return pageNumbers;
}
