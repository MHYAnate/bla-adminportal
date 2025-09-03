// import { SelectFilter } from "@/app/(admin)/components/select-filter";
// import React from "react";



//  const ManufacturerFilterWithPagination = ({
//   setFilter,
//   value,
//   manufacturers,
//   fetchMore,
//   hasNextPage,
// }: any) => {
//   const options = [
//     { label: "All Manufacturers", value: "all" },
//     ...manufacturers.map((m:any) => ({
//       label: m.name,
//       value: m.id.toString(),
//     })),
//   ];

//   return (
//     <div className="space-y-2">
//       <SelectFilter
//         setFilter={setFilter}
//         placeholder="Filter by Manufacturer"
//         list={options}
//         value={value}
//       />
//       {hasNextPage && (
//         <button
//           onClick={fetchMore}
//           className="text-blue-600 hover:underline text-sm"
//         >
//           Load more manufacturers
//         </button>
//       )}
//     </div>
//   );
// };

// export default ManufacturerFilterWithPagination

// import React, { useState } from "react";

// export const ManufacturerFilterWithPagination = ({
//   setFilter,
//   value,
//   manufacturers,
//   fetchMore,
//   hasNextPage,
// }: {
//   setFilter: (val: string) => void;
//   value: string;
//   manufacturers: { id: number; name: string }[];
//   fetchMore: () => void;
//   hasNextPage: boolean;
// }) => {
//   const [open, setOpen] = useState(false);

//   const options = [
//     { label: "All Manufacturers", value: "all" },
//     ...manufacturers.map((m) => ({
//       label: m.name,
//       value: m.id.toString(),
//     })),
//   ];

//   const selectedLabel =
//     options.find((opt) => opt.value === value)?.label || "Select Manufacturer";

//   return (
//     <div className="relative w-full">
//       <div
//         className="border px-4 py-2 rounded cursor-pointer bg-white"
//         onClick={() => setOpen(!open)}
//       >
//         {selectedLabel}
//       </div>

//       {open && (
//         <div className="absolute z-10 mt-1 w-full bg-white border rounded shadow">
//           {options.map((option) => (
//             <div
//               key={option.value}
//               className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
//               onClick={() => {
//                 setFilter(option.value);
//                 setOpen(false);
//               }}
//             >
//               {option.label}
//             </div>
//           ))}
//           {hasNextPage && (
//             <div
//               className="px-4 py-2 text-blue-600 hover:underline text-sm cursor-pointer"
//               onClick={fetchMore}
//             >
//               Load more manufacturers
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// "use client";

// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";

// interface Manufacturer {
//   id: number;
//   name: string;
// }

// interface ManufacturerFilterProps {
//   value: string;
//   setFilter: (val: string) => void;
//   manufacturers: Manufacturer[];
//   fetchMore: () => Promise<{ data: Manufacturer[]; hasNextPage: boolean }>;
//   hasNextPage: boolean;
// }

// export function ManufacturerFilterWithPagination({
//   value,
//   setFilter,
//   manufacturers,
//   fetchMore,
//   hasNextPage,
// }: ManufacturerFilterProps) {
//   const [loading, setLoading] = useState(false);
//   const [localManufacturers, setLocalManufacturers] = useState<Manufacturer[]>(manufacturers);

//   const handleLoadMore = async () => {
//     setLoading(true);
//     const result = await fetchMore();
//     setLocalManufacturers((prev) => [...prev, ...result.data]);
//     setLoading(false);
//   };

//   return (
//     <Select value={value} onValueChange={setFilter}>
//       <SelectTrigger className="w-[250px]">
//         <SelectValue placeholder="Filter by Manufacturer" />
//       </SelectTrigger>
//       <SelectContent>
//         <SelectItem value="all">All Manufacturers</SelectItem>
//         {localManufacturers.map((m) => (
//           <SelectItem key={m.id} value={m.id.toString()}>
//             {m.name}
//           </SelectItem>
//         ))}
//         {hasNextPage && (
//           <div className="flex justify-center p-2">
//             <Button
//               variant="outline"
//               size="sm"
//               onClick={handleLoadMore}
//               disabled={loading}
//             >
//               {loading ? "Loading..." : "Load more"}
//             </Button>
//           </div>
//         )}
//       </SelectContent>
//     </Select>
//   );
// }


import React, { useState, useEffect, useRef, useMemo } from 'react';
import { ChevronDown, Search } from 'lucide-react';

// --- TYPE DEFINITIONS ---
// It's good practice to define the shape of your data.
interface Manufacturer {
  id: string | number;
  name: string;
}

interface ManufacturerFilterProps {
  // Function to update the parent component's filter state.
  setFilter: (value: string) => void;
  // The currently selected manufacturer ID.
  value: string;
  // The list of manufacturer objects to display.
  manufacturers: Manufacturer[];
  // An async function to fetch the next page of manufacturers.
  fetchMore: () => Promise<void>;
  // A boolean to indicate if more pages are available.
  hasNextPage: boolean;
}

// --- COMPONENT IMPLEMENTATION ---
export function ManufacturerFilterWithPagination({
  setFilter,
  value,
  manufacturers,
  fetchMore,
  hasNextPage,
}: ManufacturerFilterProps) {
  // --- STATE MANAGEMENT ---
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // --- HOOKS ---

  // Effect to handle clicks outside the component to close the dropdown.
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [wrapperRef]);

  // Memoized value to find and display the name of the selected manufacturer.
  const selectedManufacturerName = useMemo(() => {
    if (value === 'all' || !manufacturers) {
      return 'Filter by Manufacturer';
    }
    const selected = manufacturers.find((m) => m.id.toString() === value);
    return selected ? selected.name : 'Filter by Manufacturer';
  }, [value, manufacturers]);

  // Memoized value to filter manufacturers based on the search term.
  const filteredManufacturers = useMemo(() => {
    return manufacturers.filter((manufacturer) =>
      manufacturer.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [manufacturers, searchTerm]);


  // --- HANDLER FUNCTIONS ---

  // Sets the filter, and closes the dropdown.
  const handleSelect = (selectedValue: string) => {
    setFilter(selectedValue);
    setIsOpen(false);
  };

  // Handles the "Load More" action.
  const handleLoadMore = async () => {
    setIsLoadingMore(true);
    await fetchMore();
    setIsLoadingMore(false);
  };

  // --- RENDER ---
  return (
    <div className="relative w-full md:w-64" ref={wrapperRef}>
      {/* Trigger Button: Toggles the dropdown visibility */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full px-4 py-2 text-sm text-left text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        <span className="truncate">{selectedManufacturerName}</span>
        <ChevronDown
          className={`w-5 h-5 ml-2 -mr-1 text-gray-400 transition-transform duration-200 ${
            isOpen ? 'transform rotate-180' : ''
          }`}
          aria-hidden="true"
        />
      </button>

      {/* Dropdown Panel: Conditionally rendered */}
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5">
          {/* This internal div contains all the dropdown's content */}
          <div className="py-1">
            {/* Search Input */}
            <div className="px-2 pt-1 pb-2 border-b border-gray-200">
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <Search className="w-5 h-5 text-gray-400" />
                </span>
                <input
                  type="text"
                  placeholder="Search manufacturer..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full py-2 pl-10 pr-3 text-sm placeholder-gray-500 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Scrollable List of Options */}
            <ul className="overflow-y-auto max-h-56">
              {/* "All Manufacturers" Option */}
              <li
                onClick={() => handleSelect('all')}
                className={`px-4 py-2 text-sm text-gray-900 cursor-pointer hover:bg-gray-100 ${
                  value === 'all' ? 'font-semibold bg-gray-50' : ''
                }`}
              >
                All Manufacturers
              </li>

              {/* Mapped Manufacturer Options */}
              {filteredManufacturers.map((manufacturer) => (
                <li
                  key={manufacturer.id}
                  onClick={() => handleSelect(manufacturer.id.toString())}
                  className={`px-4 py-2 text-sm text-gray-900 cursor-pointer hover:bg-gray-100 truncate ${
                    value === manufacturer.id.toString() ? 'font-semibold bg-gray-50' : ''
                  }`}
                >
                  {manufacturer.name}
                </li>
              ))}
            </ul>

            {/* "Load More" Button Section */}
            {hasNextPage && !searchTerm && (
              <div className="px-2 py-2 border-t border-gray-200">
                <button
                  type="button"
                  onClick={handleLoadMore}
                  disabled={isLoadingMore}
                  className="w-full px-4 py-2 text-sm font-medium text-indigo-600 rounded-md hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoadingMore ? 'Loading...' : 'Load More'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}