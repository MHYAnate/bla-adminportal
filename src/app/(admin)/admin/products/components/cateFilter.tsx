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

import React, { useState } from "react";

export const CategoryFilter = ({
  setFilter,
  value,
  categories,
}: {
  setFilter: (val: string) => void;
  value: string;
  categories: { id: number; name: string }[];
}) => {
  const [open, setOpen] = useState(false);

  const options = [
    { label: "All Categories", value: "all" },
    ...categories.map((c) => ({
      label: c.name,
      value: c.id.toString(),
    })),
  ];

  const selectedLabel =
    options.find((opt) => opt.value === value)?.label || "Select Category";

  return (
    <div className="relative w-full">
      <div
        className="border px-4 py-2 rounded cursor-pointer bg-white"
        onClick={() => setOpen(!open)}
      >
        {selectedLabel}
      </div>

      {open && (
        <div className="absolute z-10 mt-1 w-full bg-white border rounded shadow">
          {options.map((option) => (
            <div
              key={option.value}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => {
                setFilter(option.value);
                setOpen(false);
              }}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};