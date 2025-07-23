"use client";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface selectType {
  value: string;
  text: string;
}
// interface IProps {
//   list: selectType[];
//   placeholder?: string;
//   setFilter?: React.Dispatch<React.SetStateAction<string>>;
//   className?: string;
// }
interface IProps {
  list: { value: string; text: string }[];
  setFilter?: (value: string) => void; // Change to simple function type
  className?: string;
  placeholder?: string;
  value?: string;
}

export function SelectFilter({
  list,
  placeholder = "Status",
  setFilter,
  className = "w-[186px] h-11",
}: IProps) {
  return (
    <Select
      onValueChange={async (value) => {
        if (setFilter) await setFilter(value);
      }}
    >
      <SelectTrigger className={className}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent className="">
        <SelectGroup>
          {list?.map((list, index: number) => (
            <SelectItem value={list?.value} key={index}>
              {list?.text}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
