"use client"

import type React from "react"
import { useState, useMemo } from "react"
import { Eye, Search, Filter, ChevronDown, Download, RefreshCw } from "lucide-react"
import Pagination from "./pagination"
import { toast } from "sonner"

interface Transaction {
  id: number
  amount: number
  createdAt: string
  orderId: number
  reference: string
  status: "success" | "pending" | "failed"
  user: {
    id: number
    email: string
    name: string
  }
}

interface TransactionsTableProps {
  data: Transaction[]
  refetch: () => void
  isLoading: boolean
}

const TransactionsTable: React.FC<TransactionsTableProps> = ({ data, refetch, isLoading }) => {
  const [currentPage, setCurrentPage] = useState(1)
  const [postsPerPage] = useState(10)
  const [filters, setFilters] = useState({
    reference: "",
    email: "",
    status: "",
    dateFrom: "",
    dateTo: "",
  })
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null)
  const [showFilters, setShowFilters] = useState(false)

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFilters((prev) => ({ ...prev, [name]: value }))
    setCurrentPage(1)
  }

  const filteredData = useMemo(() => {
    return (
      data?.filter((transaction) => {
        const referenceMatch =
          !filters.reference || transaction.reference.toLowerCase().includes(filters.reference.toLowerCase())

        const emailMatch = !filters.email || transaction.user.email.toLowerCase().includes(filters.email.toLowerCase())

        const statusMatch = !filters.status || transaction.status.toLowerCase() === filters.status.toLowerCase()

        const dateFromMatch = !filters.dateFrom || new Date(transaction.createdAt) >= new Date(filters.dateFrom)

        const dateToMatch = !filters.dateTo || new Date(transaction.createdAt) <= new Date(filters.dateTo)

        return referenceMatch && emailMatch && statusMatch && dateFromMatch && dateToMatch
      }) || []
    )
  }, [data, filters])

  const indexOfLastPost = currentPage * postsPerPage
  const indexOfFirstPost = indexOfLastPost - postsPerPage
  const currentPosts = filteredData.slice(indexOfFirstPost, indexOfLastPost)

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

  const handleView = (transaction: Transaction) => {
    setSelectedTransaction(transaction)
    setIsViewModalOpen(true)
  }

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "success":
        return "bg-green-50 text-green-700 border-green-200"
      case "pending":
        return "bg-yellow-50 text-yellow-700 border-yellow-200"
      case "failed":
        return "bg-red-50 text-red-700 border-red-200"
      default:
        return "bg-gray-50 text-gray-700 border-gray-200"
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const exportToCSV = () => {
    const headers = ["Reference", "Amount", "Status", "Customer Email", "Order ID", "Date"]
    const csvData = filteredData.map((transaction) => [
      transaction.reference,
      transaction.amount,
      transaction.status,
      transaction.user.email,
      transaction.orderId,
      formatDate(transaction.createdAt),
    ])

    const csvContent = [headers, ...csvData].map((row) => row.map((field) => `"${field}"`).join(",")).join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `transactions-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
    toast.success("Transactions exported successfully")
  }

  // Mobile card view for each transaction
  const TransactionCard = ({ transaction }: { transaction: Transaction }) => (
    <div className="bg-white p-4 rounded-lg border border-gray-200 mb-3">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-medium text-gray-900">{transaction.reference}</h3>
          <p className="text-sm text-gray-600">{transaction.user.email}</p>
        </div>
        <span
          className={`px-2.5 py-1 text-xs font-medium rounded-full border ${getStatusBadgeClass(transaction.status)}`}
        >
          {transaction.status}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-3">
        <div>
          <p className="text-xs text-gray-500">Amount</p>
          <p className="text-sm font-medium">₦{transaction.amount.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Order ID</p>
          <p className="text-sm">{transaction.orderId}</p>
        </div>
        <div className="col-span-2">
          <p className="text-xs text-gray-500">Date</p>
          <p className="text-sm">{formatDate(transaction.createdAt)}</p>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={() => handleView(transaction)}
          className="text-blue-600 hover:text-blue-800 transition-colors p-1 rounded-full hover:bg-blue-50"
          aria-label="View transaction"
        >
          <Eye className="h-4 w-4" />
        </button>
      </div>
    </div>
  )

  if (isLoading) {
    return (
      <div className="w-full bg-white rounded-lg shadow-sm border border-gray-100 max-w-full">
        <div className="p-8 text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto text-gray-400" />
          <p className="text-gray-500 mt-2">Loading transactions...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full bg-white rounded-lg shadow-sm border border-gray-100 max-w-full">
      {/* Header with filter toggle and export */}
      <div className="p-4 border-b border-gray-100 flex justify-between items-center">
        <h2 className="text-lg font-medium text-gray-900">Transactions ({filteredData.length})</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={exportToCSV}
            className="hidden md:flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <Download className="h-4 w-4" />
            Export
          </button>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="md:hidden p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md"
            aria-label="Toggle filters"
          >
            <Filter className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Filters - responsive */}
      <div className={`border-b border-gray-100 ${showFilters ? "block" : "hidden md:block"}`}>
        <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              name="reference"
              value={filters.reference}
              onChange={handleFilterChange}
              placeholder="Filter by reference"
              className="pl-10 w-full h-10 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              name="email"
              value={filters.email}
              onChange={handleFilterChange}
              placeholder="Filter by email"
              className="pl-10 w-full h-10 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Filter className="h-4 w-4 text-gray-400" />
            </div>
            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="pl-10 w-full h-10 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none transition-all pr-10"
            >
              <option value="">All Status</option>
              <option value="success">Success</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </div>
          </div>

          <input
            type="date"
            name="dateFrom"
            value={filters.dateFrom}
            onChange={handleFilterChange}
            className="w-full h-10 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />

          <input
            type="date"
            name="dateTo"
            value={filters.dateTo}
            onChange={handleFilterChange}
            className="w-full h-10 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>
      </div>

      {/* Mobile view */}
      <div className="md:hidden p-4">
        {currentPosts.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No matching transactions found.</div>
        ) : (
          currentPosts.map((transaction) => <TransactionCard key={transaction.id} transaction={transaction} />)
        )}
      </div>

      {/* Desktop table view */}
      <div className="hidden md:block overflow-x-auto">
        <div className="inline-block min-w-full align-middle">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr className="bg-gray-50 text-left">
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Reference</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Order ID</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {currentPosts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                    No matching transactions found.
                  </td>
                </tr>
              ) : (
                currentPosts.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{transaction.reference}</td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">
                      ₦{transaction.amount.toLocaleString()}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2.5 py-1 text-xs font-medium rounded-full border ${getStatusBadgeClass(transaction.status)}`}
                      >
                        {transaction.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 max-w-[200px] truncate">{transaction.user.email}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{transaction.orderId}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{formatDate(transaction.createdAt)}</td>
                    <td className="px-4 py-3 text-sm">
                      <button
                        onClick={() => handleView(transaction)}
                        className="bg-[#27A376] p-2.5 rounded-lg hover:bg-[#1e8a63] transition-colors"
                        aria-label="View transaction"
                      >
                        <Eye className="h-4 w-4 text-white" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="px-4 py-3 border-t border-gray-100">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-sm text-gray-500 w-full sm:w-auto text-center sm:text-left">
            Showing {currentPosts.length > 0 ? indexOfFirstPost + 1 : 0} to{" "}
            {Math.min(indexOfLastPost, filteredData.length)} of {filteredData.length} entries
          </div>
          <Pagination
            postsPerPage={postsPerPage}
            totalPosts={filteredData.length}
            paginate={paginate}
            currentPage={currentPage}
          />
        </div>
      </div>

      {/* View Modal */}
      {isViewModalOpen && selectedTransaction && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Transaction Details</h3>
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="text-gray-500 hover:text-gray-700 transition-colors text-xl"
                aria-label="Close modal"
              >
                ×
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Reference</p>
                <p className="text-base font-medium text-gray-900">{selectedTransaction.reference}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Amount</p>
                <p className="text-base font-medium text-gray-900">₦{selectedTransaction.amount.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <span
                  className={`inline-flex px-2.5 py-1 text-xs font-medium rounded-full border ${getStatusBadgeClass(selectedTransaction.status)}`}
                >
                  {selectedTransaction.status}
                </span>
              </div>
              <div>
                <p className="text-sm text-gray-500">Customer Email</p>
                <p className="text-base font-medium text-gray-900">{selectedTransaction.user.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Order ID</p>
                <p className="text-base font-medium text-gray-900">{selectedTransaction.orderId}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Date</p>
                <p className="text-base font-medium text-gray-900">{formatDate(selectedTransaction.createdAt)}</p>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default TransactionsTable
