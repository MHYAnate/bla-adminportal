"use client"

import type React from "react"
import TransactionsTable from "./transaction-table"
import PaymentAnalytics from "./payment-analytics"
import { useGetAllTransactionsClientPagination } from "../../../../services/payment"
// import {useTransactions} from "@/services/payment/index"

const PaymentManagementPage: React.FC = () => {
  const { transactions, pagination, summaryStats, filters, setFilters, isLoading, error, refetch } =
    useGetAllTransactionsClientPagination({
      initialFilters: { status: "success" },
      initialPageSize: 10,
    })
  const transaction =     transactions || []

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
          <h1 className="text-2xl font-bold text-gray-900">Payment Management</h1>
          <p className="text-gray-600 mt-1">Monitor and manage all payment transactions</p>
        </div>

        {/* Analytics Section */}
        <PaymentAnalytics transactions={transaction} isLoading={isLoading} />

        {/* Transactions Table */}
        <TransactionsTable data={transactions} refetch={()=>{}} isLoading={isLoading} />
      </div>
    </div>
  )
}

export default PaymentManagementPage
