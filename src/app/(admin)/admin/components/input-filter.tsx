"use client";

import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";

interface InputFilterProps {
    setQuery: React.Dispatch<React.SetStateAction<string>>;
    placeholder?: string;
    // Remove value prop since it doesn't exist in your original component
}

export const InputFilter: React.FC<InputFilterProps> = ({
    setQuery,
    placeholder = "Search...",
}) => {
    const [inputValue, setInputValue] = useState("");

    // Debounce function
    const debounce = useCallback(
        (func: Function, delay: number) => {
            let timeoutId: NodeJS.Timeout;
            return (...args: any[]) => {
                clearTimeout(timeoutId);
                timeoutId = setTimeout(() => func.apply(null, args), delay);
            };
        },
        []
    );

    // Debounced search function
    const debouncedSearch = useCallback(
        debounce((searchValue: string) => {
            console.log("Search query:", searchValue);
            setQuery(searchValue);
        }, 300),
        [setQuery]
    );

    // Handle input change
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setInputValue(newValue);
        debouncedSearch(newValue);
    };

    // Clear input
    const clearInput = () => {
        setInputValue("");
        setQuery("");
    };

    // Handle Enter key press for immediate search
    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            setQuery(inputValue);
        }
    };

    return (
        <div className="relative">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                    type="text"
                    placeholder={placeholder}
                    value={inputValue}
                    onChange={handleInputChange}
                    onKeyPress={handleKeyPress}
                    className="pl-10 pr-10 bg-white border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
                {inputValue && (
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={clearInput}
                        className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-gray-100"
                    >
                        <X className="h-4 w-4 text-gray-400" />
                    </Button>
                )}
            </div>
        </div>
    );
};