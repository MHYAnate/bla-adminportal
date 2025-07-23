"use client"

import type React from "react"
import { useState } from "react"
import { Search, Filter, Calendar, DollarSign, X, ChevronDown } from "lucide-react"

interface FilterState {
  status?: string
  dateFrom?: string
  dateTo?: string
  amountMin?: string
  amountMax?: string
  search?: string
  paymentMethod?: string
  customerType?: string
}

interface TransactionFiltersProps {
  currentFilters: FilterState
  onFilterChange: (filters: Partial<FilterState>) => void
}

const TransactionFilters: React.FC<TransactionFiltersProps> = ({ currentFilters, onFilterChange }) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [localFilters, setLocalFilters] = useState<FilterState>(currentFilters)

  const statusOptions = [
    { value: "", label: "All Status" },
    { value: "completed", label: "Completed" },
    { value: "pending", label: "Pending" },
    { value: "failed", label: "Failed" },
    { value: "cancelled", label: "Cancelled" },
    { value: "refunded", label: "Refunded" },
  ]

  const paymentMethodOptions = [
    { value: "", label: "All Methods" },
    { value: "card", label: "Credit/Debit Card" },
    { value: "bank_transfer", label: "Bank Transfer" },
    { value: "wallet", label: "Digital Wallet" },
    { value: "ussd", label: "USSD" },
    { value: "qr_code", label: "QR Code" },
  ]

  const customerTypeOptions = [
    { value: "", label: "All Customers" },
    { value: "new", label: "New Customers" },
    { value: "returning", label: "Returning Customers" },
    { value: "vip", label: "VIP Customers" },
  ]

  const handleInputChange = (field: keyof FilterState, value: string) => {
    const updatedFilters = { ...localFilters, [field]: value }
    setLocalFilters(updatedFilters)
    onFilterChange({ [field]: value })
  }

  const handleClearFilters = () => {
    const clearedFilters = {
      status: "",
      dateFrom: "",
      dateTo: "",
      amountMin: "",
      amountMax: "",
      search: "",
      paymentMethod: "",
      customerType: "",
    }
    setLocalFilters(clearedFilters)
    onFilterChange(clearedFilters)
  }

  const getActiveFilterCount = () => {
    return Object.values(currentFilters).filter((value) => value && value !== "").length
  }

  const activeFilterCount = getActiveFilterCount()

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Filter Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-gray-500" />
              <h3 className="text-lg font-medium text-gray-900">Filters</h3>
            </div>
            {activeFilterCount > 0 && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {activeFilterCount} active
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {activeFilterCount > 0 && (
              <button
                onClick={handleClearFilters}
                className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
              >
                <X className="h-4 w-4" />
                Clear all
              </button>
            )}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="lg:hidden flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              {isExpanded ? "Hide" : "Show"} Filters
              <ChevronDown className={`h-4 w-4 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Filter Content */}
      <div className={`p-4 ${isExpanded ? "block" : "hidden lg:block"}`}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {/* Search */}
          <div className="lg:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by reference, email..."
                value={localFilters.search || ""}
                onChange={(e) => handleInputChange("search", e.target.value)}
                className="pl-10 w-full h-10 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={localFilters.status || ""}
              onChange={(e) => handleInputChange("status", e.target.value)}
              className="w-full h-10 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Payment Method */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
            <select
              value={localFilters.paymentMethod || ""}
              onChange={(e) => handleInputChange("paymentMethod", e.target.value)}
              className="w-full h-10 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {paymentMethodOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Customer Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Customer Type</label>
            <select
              value={localFilters.customerType || ""}
              onChange={(e) => handleInputChange("customerType", e.target.value)}
              className="w-full h-10 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {customerTypeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Second Row - Date and Amount Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
          {/* Date From */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date From</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="date"
                value={localFilters.dateFrom || ""}
                onChange={(e) => handleInputChange("dateFrom", e.target.value)}
                className="pl-10 w-full h-10 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Date To */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date To</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="date"
                value={localFilters.dateTo || ""}
                onChange={(e) => handleInputChange("dateTo", e.target.value)}
                className="pl-10 w-full h-10 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Amount Min */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Min Amount</label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="number"
                placeholder="0"
                value={localFilters.amountMin || ""}
                onChange={(e) => handleInputChange("amountMin", e.target.value)}
                className="pl-10 w-full h-10 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Amount Max */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Max Amount</label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="number"
                placeholder="No limit"
                value={localFilters.amountMax || ""}
                onChange={(e) => handleInputChange("amountMax", e.target.value)}
                className="pl-10 w-full h-10 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Quick Filter Buttons */}
        <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-200">
          <span className="text-sm font-medium text-gray-700">Quick filters:</span>
          <button
            onClick={() => handleInputChange("dateFrom", new Date().toISOString().split("T")[0])}
            className="px-3 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded-full hover:bg-blue-200 transition-colors"
          >
            Today
          </button>
          <button
            onClick={() => {
              const lastWeek = new Date()
              lastWeek.setDate(lastWeek.getDate() - 7)
              handleInputChange("dateFrom", lastWeek.toISOString().split("T")[0])
            }}
            className="px-3 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded-full hover:bg-blue-200 transition-colors"
          >
            Last 7 days
          </button>
          <button
            onClick={() => {
              const lastMonth = new Date()
              lastMonth.setMonth(lastMonth.getMonth() - 1)
              handleInputChange("dateFrom", lastMonth.toISOString().split("T")[0])
            }}
            className="px-3 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded-full hover:bg-blue-200 transition-colors"
          >
            Last 30 days
          </button>
          <button
            onClick={() => handleInputChange("status", "completed")}
            className="px-3 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-full hover:bg-green-200 transition-colors"
          >
            Completed only
          </button>
          <button
            onClick={() => handleInputChange("status", "failed")}
            className="px-3 py-1 text-xs font-medium text-red-700 bg-red-100 rounded-full hover:bg-red-200 transition-colors"
          >
            Failed only
          </button>
        </div>
      </div>
    </div>
  )
}

export default TransactionFilters
