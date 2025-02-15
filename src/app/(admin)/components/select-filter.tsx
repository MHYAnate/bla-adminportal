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
interface IProps {
  list: selectType[];
  placeholder?: string;
  setFilter: React.Dispatch<React.SetStateAction<string>>;
}

export function SelectFilter({
  list,
  placeholder = "Status",
  setFilter,
}: IProps) {
  return (
    <Select
      onValueChange={async (value) => {
        await setFilter(value);
      }}
    >
      <SelectTrigger className="w-[186px]">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
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
