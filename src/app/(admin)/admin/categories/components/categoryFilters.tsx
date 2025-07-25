"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { X } from "lucide-react";

interface CategoryFiltersProps {
    isOpen: boolean;
    onClose: () => void;
    onApplyFilters: (filters: CategoryFilterValues) => void;
    currentFilters: CategoryFilterValues;
    triggerRef?: React.RefObject<HTMLButtonElement | null>;
}

export interface CategoryFilterValues {
    dateCreated?: string;
    approvalDate?: string;
    approvalStatus?: string[];
    status?: string[];
    search?: string;
    dateRange?: {
        start?: string;
        end?: string;
    };
}

const CategoryFilters: React.FC<CategoryFiltersProps> = ({
    isOpen,
    onClose,
    onApplyFilters,
    currentFilters,
    triggerRef
}) => {
    const [filters, setFilters] = useState<CategoryFilterValues>({
        dateCreated: 'all',
        approvalDate: 'all',
        approvalStatus: [],
        status: [],
        search: '',
        dateRange: { start: '', end: '' },
        ...currentFilters
    });
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setFilters({
            dateCreated: 'all',
            approvalDate: 'all',
            approvalStatus: [],
            status: [],
            search: '',
            dateRange: { start: '', end: '' },
            ...currentFilters
        });
    }, [currentFilters]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node) &&
                triggerRef?.current &&
                !triggerRef.current.contains(event.target as Node)
            ) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, onClose, triggerRef]);

    useEffect(() => {
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
        };
    }, [isOpen, onClose]);

    const handleApply = () => {
        try {
            const cleanedFilters: CategoryFilterValues = {};

            if (filters.dateCreated && filters.dateCreated !== '' && filters.dateCreated !== 'all') {
                cleanedFilters.dateCreated = filters.dateCreated;
            }

            if (filters.approvalDate && filters.approvalDate !== '' && filters.approvalDate !== 'all') {
                cleanedFilters.approvalDate = filters.approvalDate;
            }

            if (filters.approvalStatus && filters.approvalStatus.length > 0) {
                cleanedFilters.approvalStatus = filters.approvalStatus;
            }

            if (filters.status && filters.status.length > 0) {
                cleanedFilters.status = filters.status;
            }

            if (filters.search && filters.search.trim() !== '') {
                cleanedFilters.search = filters.search.trim();
            }

            if (filters.dateRange?.start || filters.dateRange?.end) {
                cleanedFilters.dateRange = filters.dateRange;
            }

            onApplyFilters(cleanedFilters);
            onClose();
        } catch (error) {
            console.error("Error applying filters:", error);
        }
    };

    const handleClearAll = () => {
        const clearedFilters: CategoryFilterValues = {
            dateCreated: 'all',
            approvalDate: 'all',
            approvalStatus: [],
            status: [],
            search: '',
            dateRange: { start: '', end: '' }
        };

        setFilters(clearedFilters);

        try {
            onApplyFilters({});
        } catch (error) {
            console.error("Error clearing filters:", error);
        }
    };

    const handleStatusChange = (statusType: 'approvalStatus' | 'status', value: string, checked: boolean | 'indeterminate') => {
        try {
            setFilters(prev => {
                const currentArray = prev[statusType] || [];

                const newArray = checked === true
                    ? [...currentArray, value]
                    : currentArray.filter(s => s !== value);

                return {
                    ...prev,
                    [statusType]: newArray
                };
            });
        } catch (error) {
            console.error("Error updating status:", error);
        }
    };

    const handleDateRangeChange = (type: 'start' | 'end', value: string) => {
        try {
            setFilters(prev => ({
                ...prev,
                dateRange: {
                    ...prev.dateRange,
                    [type]: value
                }
            }));
        } catch (error) {
            console.error("Error updating date range:", error);
        }
    };

    const handleInputChange = (field: keyof CategoryFilterValues, value: string) => {
        try {
            setFilters(prev => ({
                ...prev,
                [field]: value
            }));
        } catch (error) {
            console.error("Error updating input:", error);
        }
    };

    const getActiveFilterCount = () => {
        let count = 0;
        if (filters.dateCreated && filters.dateCreated !== '' && filters.dateCreated !== 'all') count++;
        if (filters.approvalDate && filters.approvalDate !== '' && filters.approvalDate !== 'all') count++;
        if (filters.approvalStatus && filters.approvalStatus.length > 0) count++;
        if (filters.status && filters.status.length > 0) count++;
        if (filters.search && filters.search.trim() !== '') count++;
        if (filters.dateRange?.start || filters.dateRange?.end) count++;
        return count;
    };

    if (!isOpen) return null;

    const activeFilterCount = getActiveFilterCount();

    return (
        <div
            ref={dropdownRef}
            className="absolute top-full right-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-xl z-50 max-h-[600px] overflow-y-auto"
        >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
                <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold text-gray-900">Filter</h3>
                    {activeFilterCount > 0 && (
                        <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-medium text-white bg-[#F7931E] rounded-full">
                            {activeFilterCount}
                        </span>
                    )}
                </div>
                <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                >
                    <X size={18} />
                </button>
            </div>

            {/* Filter Content */}
            <div className="p-4 space-y-6">
                {/* Date Created Filter */}
                <div className="space-y-3">
                    <label className="text-sm font-medium text-gray-700">
                        Date Created
                    </label>
                    <p className="text-xs text-gray-500">Time period</p>
                    <Select
                        value={filters.dateCreated || 'all'}
                        onValueChange={(value) => handleInputChange('dateCreated', value === 'all' ? '' : value)}
                    >
                        <SelectTrigger className="w-full h-10 border-gray-200">
                            <SelectValue placeholder="All time" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All time</SelectItem>
                            <SelectItem value="today">Today</SelectItem>
                            <SelectItem value="yesterday">Yesterday</SelectItem>
                            <SelectItem value="last7days">Last 7 days</SelectItem>
                            <SelectItem value="last30days">Last 30 days</SelectItem>
                            <SelectItem value="last90days">Last 90 days</SelectItem>
                            <SelectItem value="thisyear">This year</SelectItem>
                            <SelectItem value="custom">Custom Range</SelectItem>
                        </SelectContent>
                    </Select>

                    {filters.dateCreated === 'custom' && (
                        <div className="space-y-2 border-t pt-3 mt-3">
                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <label className="text-xs text-gray-500 mb-1 block">From</label>
                                    <Input
                                        type="date"
                                        value={filters.dateRange?.start || ''}
                                        onChange={(e) => handleDateRangeChange('start', e.target.value)}
                                        className="h-9 text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs text-gray-500 mb-1 block">To</label>
                                    <Input
                                        type="date"
                                        value={filters.dateRange?.end || ''}
                                        onChange={(e) => handleDateRangeChange('end', e.target.value)}
                                        className="h-9 text-sm"
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Approval Date Filter */}
                <div className="space-y-3">
                    <label className="text-sm font-medium text-gray-700">
                        Approval Date
                    </label>
                    <p className="text-xs text-gray-500">Time period</p>
                    <Select
                        value={filters.approvalDate || 'all'}
                        onValueChange={(value) => handleInputChange('approvalDate', value === 'all' ? '' : value)}
                    >
                        <SelectTrigger className="w-full h-10 border-gray-200">
                            <SelectValue placeholder="All time" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All time</SelectItem>
                            <SelectItem value="today">Today</SelectItem>
                            <SelectItem value="yesterday">Yesterday</SelectItem>
                            <SelectItem value="last7days">Last 7 days</SelectItem>
                            <SelectItem value="last30days">Last 30 days</SelectItem>
                            <SelectItem value="last90days">Last 90 days</SelectItem>
                            <SelectItem value="thisyear">This year</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Approval Status Filter */}
                <div className="space-y-3">
                    <label className="text-sm font-medium text-gray-700">
                        Approval Status
                    </label>
                    <div className="space-y-3">
                        {[
                            { value: 'approved', label: 'Approved', color: 'text-green-600' },
                            { value: 'pending', label: 'Pending Approval', color: 'text-yellow-600' },
                            { value: 'rejected', label: 'Rejected', color: 'text-red-600' }
                        ].map((option) => (
                            <div key={option.value} className="flex items-center space-x-3">
                                <Checkbox
                                    id={`approval-${option.value}`}
                                    checked={(filters.approvalStatus || []).includes(option.value)}
                                    onCheckedChange={(checked) =>
                                        handleStatusChange('approvalStatus', option.value, checked)
                                    }
                                    className="data-[state=checked]:bg-[#F7931E] data-[state=checked]:border-[#F7931E]"
                                />
                                <label
                                    htmlFor={`approval-${option.value}`}
                                    className={`text-sm cursor-pointer font-medium ${option.color}`}
                                >
                                    {option.label}
                                </label>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Status Filter */}
                <div className="space-y-3">
                    <label className="text-sm font-medium text-gray-700">
                        Status
                    </label>
                    <div className="space-y-3">
                        {[
                            { value: 'active', label: 'Active', color: 'text-green-600' },
                            { value: 'inactive', label: 'Inactive', color: 'text-gray-600' },
                            { value: 'pending', label: 'Pending', color: 'text-yellow-600' }
                        ].map((option) => (
                            <div key={option.value} className="flex items-center space-x-3">
                                <Checkbox
                                    id={`status-${option.value}`}
                                    checked={(filters.status || []).includes(option.value)}
                                    onCheckedChange={(checked) =>
                                        handleStatusChange('status', option.value, checked)
                                    }
                                    className="data-[state=checked]:bg-[#F7931E] data-[state=checked]:border-[#F7931E]"
                                />
                                <label
                                    htmlFor={`status-${option.value}`}
                                    className={`text-sm cursor-pointer font-medium ${option.color}`}
                                >
                                    {option.label}
                                </label>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Search Filter */}
                <div className="space-y-3">
                    <label className="text-sm font-medium text-gray-700">
                        Search Categories
                    </label>
                    <Input
                        placeholder="Search by name or description..."
                        value={filters.search || ''}
                        onChange={(e) => handleInputChange('search', e.target.value)}
                        className="h-10 border-gray-200"
                    />
                </div>
            </div>

            {/* Footer Actions */}
            <div className="p-4 border-t border-gray-200 bg-gray-50 rounded-b-lg">
                <div className="flex gap-3">
                    <Button
                        variant="outline"
                        onClick={handleClearAll}
                        className="flex-1 h-10 border-gray-200 text-gray-600 hover:bg-gray-100"
                        disabled={activeFilterCount === 0}
                    >
                        Clear all
                    </Button>
                    <Button
                        onClick={handleApply}
                        className="flex-1 h-10 bg-[#F7931E] hover:bg-[#e8851a] text-white font-medium"
                    >
                        Apply {activeFilterCount > 0 && `(${activeFilterCount})`}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default CategoryFilters;