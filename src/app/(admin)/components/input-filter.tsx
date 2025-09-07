"use client";

import type { ChangeEvent } from "react";
import { Input } from "@/components/ui/input";

export function InputFilter({
  placeholder = "Search by name or email",
  setQuery,
}: {
  placeholder?: string;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
}) {
  return (
    <Input
      placeholder={placeholder}
      onChange={async (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        console.log('⌨️ InputFilter onChange:', value);
        setQuery(value);
      }}
      pos={true}
      className="h-11 w-1/2"
    />
  );
}