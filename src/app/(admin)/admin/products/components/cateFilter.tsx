// import React from "react";
// import { SelectFilter } from "@/app/(admin)/components/select-filter";

// const CategoryFilter = ({ setFilter, value, categories }: any) => {
//   const options = [
//     { label: "All Categories", value: "all" },
//     ...categories.map((c:any) => ({
//       label: c.name.toString(),
//       value: c.id.toString(),
//     })),
//   ];

//   return (
//     <SelectFilter
//       setFilter={setFilter}
//       placeholder="Filter by Category"
//       list={options}
//       value={value}
//     />
//   );
// };

// export default CategoryFilter;

// import React, { useState } from "react";

// export const CategoryFilter = ({
//   setFilter,
//   value,
//   categories,
// }: {
//   setFilter: (val: string) => void;
//   value: string;
//   categories: { id: number; name: string }[];
// }) => {
//   const [open, setOpen] = useState(false);

//   const options = [
//     { label: "All Categories", value: "all" },
//     ...categories.map((c) => ({
//       label: c.name,
//       value: c.id.toString(),
//     })),
//   ];

//   const selectedLabel =
//     options.find((opt) => opt.value === value)?.label || "Select Category";

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
//         </div>
//       )}
//     </div>
//   );
// };

import React, { useState, useRef, useEffect, useMemo } from "react";
import { ChevronDown } from "lucide-react";

interface Category {
  id: number;
  name: string;
}

interface CategoryFilterProps {
  setFilter: (val: string) => void;
  value: string;
  categories: Category[];
}

export const CategoryFilter = ({ setFilter, value, categories }: CategoryFilterProps) => {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const options = useMemo(() => [
    { label: "All Categories", value: "all" },
    ...categories.map((c) => ({ label: c.name, value: c.id.toString() })),
  ], [categories]);

  const selectedLabel = useMemo(() => {
    return options.find((opt) => opt.value === value)?.label || "Select Category";
  }, [options, value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-full md:w-64" ref={wrapperRef}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full px-4 py-2 text-sm text-left text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        <span className="truncate">{selectedLabel}</span>
        <ChevronDown
          className={`w-5 h-5 ml-2 text-gray-400 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5">
          <ul className="max-h-56 overflow-y-auto">
            {options.map((option) => (
              <li
                key={option.value}
                onClick={() => {
                  setFilter(option.value);
                  setOpen(false);
                }}
                className={`px-4 py-2 text-sm text-gray-900 cursor-pointer hover:bg-gray-100 ${
                  value === option.value ? "font-semibold bg-gray-50" : ""
                }`}
              >
                {option.label}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};