"use client";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface SelectOption {
    text: string;
    value: string;
}

interface SelectFilterProps {
    setFilter: React.Dispatch<React.SetStateAction<string>>;
    placeholder?: string;
    list: SelectOption[];
    // Remove value prop since it might not exist in your original component
}

export const SelectFilter: React.FC<SelectFilterProps> = ({
    setFilter,
    placeholder = "Select option",
    list,
}) => {
    const handleValueChange = (selectedValue: string) => {
        console.log("Filter changed:", selectedValue);
        // Convert 'empty' back to empty string for "All" options
        const actualValue = selectedValue === 'empty' ? '' : selectedValue;
        setFilter(actualValue);
    };

    return (
        <div className="relative flex items-center gap-2">
            <Select onValueChange={handleValueChange}>
                <SelectTrigger className="w-full min-w-[150px] bg-white border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
                    <SelectValue placeholder={placeholder} />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-200 shadow-lg">
                    {list.map((item) => (
                        <SelectItem
                            key={item.value || 'empty'}
                            value={item.value || 'empty'}
                            className="hover:bg-gray-100 cursor-pointer"
                        >
                            {item.text}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
};