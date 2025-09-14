
"use client";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface selectType {
  value: string;
  text: string;
}

interface IProps {
  list: { value: string; text: string }[];
  setFilter?: (value: string) => void;
  className?: string;
  placeholder?: string;
  value?: string;
}

export function SelectFilter({
  list,
  placeholder = "Status",
  setFilter,
  className = "w-[186px] h-11",
  value,
}: IProps) {
  const validItems = list?.filter(item => item?.value && item.value.trim() !== '') || [];

  return (
    <Select
      value={value}
      onValueChange={(value) => {
        if (setFilter) {
          setFilter(value);
        }
      }}
    >
      <SelectTrigger className={cn(
        className, 
        "bg-white border-gray-300 hover:border-blue-400 transition-all duration-200",
        "focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50",
        "text-sm"
      )}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent className="bg-white border border-gray-200 shadow-lg rounded-md">
        <SelectGroup>
          {validItems.map((item, index: number) => (
            <SelectItem 
              value={item.value} 
              key={index}
              className="hover:bg-blue-50 focus:bg-blue-50 cursor-pointer transition-colors duration-150 text-sm"
            >
              {item.text}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
