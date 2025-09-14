
// "use client";

// import type { ChangeEvent } from "react";
// import { Input } from "@/components/ui/input";

// export function InputFilter({
//   placeholder = "Search by name or email",
//   setQuery,
// }: {
//   placeholder?: string;
//   setQuery: React.Dispatch<React.SetStateAction<string>>;
// }) {
//   return (
//     <Input
//       placeholder={placeholder}
//       onChange={async (event: ChangeEvent<HTMLInputElement>) => {
//         const value = event.target.value;
//         setQuery(value);
//       }}
//       pos={true}
//       className="h-11 w-1/2"
//     />
//   );
// }

"use client";

import type { ChangeEvent } from "react";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";

export function InputFilter({
  placeholder = "Search by name or email",
  setQuery,
  value,
}: {
  placeholder?: string;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
  value?: string;
}) {
  const [inputValue, setInputValue] = useState(value || "");

  // Update internal state when external value changes
  useEffect(() => {
    setInputValue(value || "");
  }, [value]);

  // Debounce the search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setQuery(inputValue);
    }, 500); // 500ms debounce

    return () => {
      clearTimeout(handler);
    };
  }, [inputValue, setQuery]);

  return (
    <Input
      placeholder={placeholder}
      value={inputValue}
      onChange={(event: ChangeEvent<HTMLInputElement>) => {
        setInputValue(event.target.value);
      }}
      className="h-11 w-full md:w-64"
    />
  );
}