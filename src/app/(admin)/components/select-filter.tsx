// // "use client";

// // import {
// //   Select,
// //   SelectContent,
// //   SelectGroup,
// //   SelectItem,
// //   SelectTrigger,
// //   SelectValue,
// // } from "@/components/ui/select";

// // interface selectType {
// //   value: string;
// //   text: string;
// // }
// // // interface IProps {
// // //   list: selectType[];
// // //   placeholder?: string;
// // //   setFilter?: React.Dispatch<React.SetStateAction<string>>;
// // //   className?: string;
// // // }
// // interface IProps {
// //   list: { value: string; text: string }[];
// //   setFilter?: (value: string) => void; // Change to simple function type
// //   className?: string;
// //   placeholder?: string;
// //   value?: string;
// // }

// // // In src/app/(admin)/components/select-filter.tsx
// // export function SelectFilter({
// //   list,
// //   placeholder = "Status",
// //   setFilter,
// //   className = "w-[186px] h-11",
// // }: IProps) {
// //   // Filter out items with empty values
// //   const validItems = list?.filter(item => item?.value && item.value.trim() !== '') || [];

// //   return (
// //     <Select
// //       onValueChange={async (value) => {
// //         if (setFilter) await setFilter(value);
// //       }}
// //     >
// //       <SelectTrigger className={className}>
// //         <SelectValue placeholder={placeholder} />
// //       </SelectTrigger>
// //       <SelectContent className="">
// //         <SelectGroup>
// //           {validItems.map((list, index: number) => (
// //             <SelectItem value={list.value} key={index}>
// //               {list.text}
// //             </SelectItem>
// //           ))}
// //         </SelectGroup>
// //       </SelectContent>
// //     </Select>
// //   );
// // }

// "use client";

// import {
//   Select,
//   SelectContent,
//   SelectGroup,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";

// interface selectType {
//   value: string;
//   text: string;
// }

// interface IProps {
//   list: { value: string; text: string }[];
//   setFilter?: (value: string) => void;
//   className?: string;
//   placeholder?: string;
//   value?: string;
// }

// export function SelectFilter({
//   list,
//   placeholder = "Status",
//   setFilter,
//   className = "w-[186px] h-11",
//   value,
// }: IProps) {
//   const validItems = list?.filter(item => item?.value && item.value.trim() !== '') || [];

//   return (
//     <Select
//       value={value}
//       onValueChange={async (value) => {
//         if (setFilter) await setFilter(value);
//       }}
//     >
//       <SelectTrigger className={`${className} bg-white border-gray-300 hover:border-purple-400 transition-all duration-200`}>
//         <SelectValue placeholder={placeholder} />
//       </SelectTrigger>
//       <SelectContent className="bg-white border border-gray-200 shadow-lg rounded-md">
//         <SelectGroup>
//           {validItems.map((list, index: number) => (
//             <SelectItem 
//               value={list.value} 
//               key={index}
//               className="hover:bg-purple-50 focus:bg-purple-50 cursor-pointer transition-colors duration-150"
//             >
//               {list.text}
//             </SelectItem>
//           ))}
//         </SelectGroup>
//       </SelectContent>
//     </Select>
//   );
// }

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
      onValueChange={async (value) => {
        if (setFilter) await setFilter(value);
      }}
    >
      <SelectTrigger className={cn(
        className, 
        "bg-white border-gray-300 hover:border-purple-400 transition-all duration-200",
        "focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
      )}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent className="bg-white border border-gray-200 shadow-lg rounded-md">
        <SelectGroup>
          {validItems.map((list, index: number) => (
            <SelectItem 
              value={list.value} 
              key={index}
              className="hover:bg-purple-50 focus:bg-purple-50 cursor-pointer transition-colors duration-150"
            >
              {list.text}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}