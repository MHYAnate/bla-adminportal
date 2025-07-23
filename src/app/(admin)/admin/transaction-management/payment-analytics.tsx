"use client"

import type React from "react"
import { useMemo } from "react"
import { TrendingUp, TrendingDown, DollarSign, CreditCard, Users } from "lucide-react"

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
  }
}

interface PaymentAnalyticsProps {
  transactions: Transaction[]
  isLoading: boolean
}

const PaymentAnalytics: React.FC<PaymentAnalyticsProps> = ({ transactions, isLoading }) => {
  const analytics = useMemo(() => {
    if (!transactions || transactions.length === 0) {
      return {
        totalRevenue: 0,
        totalTransactions: 0,
        successfulTransactions: 0,
        pendingTransactions: 0,
        failedTransactions: 0,
        successRate: 0,
        averageTransactionValue: 0,
        uniqueCustomers: 0,
        dailyData: [],
        statusData: [],
      }
    }

    const totalRevenue = transactions.filter((t) => t.status === "success").reduce((sum, t) => sum + t.amount, 0)

    const totalTransactions = transactions.length
    const successfulTransactions = transactions.filter((t) => t.status === "success").length
    const pendingTransactions = transactions.filter((t) => t.status === "pending").length
    const failedTransactions = transactions.filter((t) => t.status === "failed").length
    const successRate = totalTransactions > 0 ? (successfulTransactions / totalTransactions) * 100 : 0
    const averageTransactionValue = successfulTransactions > 0 ? totalRevenue / successfulTransactions : 0
    const uniqueCustomers = new Set(transactions.map((t) => t.user.email)).size

    // Group transactions by date for chart
    const dailyData = transactions
      .reduce((acc: any[], transaction) => {
        const date = new Date(transaction.createdAt).toLocaleDateString()
        const existingDay = acc.find((d) => d.date === date)

        if (existingDay) {
          existingDay.amount += transaction.status === "success" ? transaction.amount : 0
          existingDay.count += 1
        } else {
          acc.push({
            date,
            amount: transaction.status === "success" ? transaction.amount : 0,
            count: 1,
          })
        }
        return acc
      }, [])
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

    const statusData = [
      { status: "Success", count: successfulTransactions, color: "bg-green-500" },
      { status: "Pending", count: pendingTransactions, color: "bg-yellow-500" },
      { status: "Failed", count: failedTransactions, color: "bg-red-500" },
    ]

    return {
      totalRevenue,
      totalTransactions,
      successfulTransactions,
      pendingTransactions,
      failedTransactions,
      successRate,
      averageTransactionValue,
      uniqueCustomers,
      dailyData,
      statusData,
    }
  }, [transactions])

  const StatCard = ({
    title,
    value,
    icon: Icon,
    trend,
    trendValue,
    color = "blue",
  }: {
    title: string
    value: string | number
    icon: any
    trend?: "up" | "down"
    trendValue?: string
    color?: string
  }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {trend && trendValue && (
            <div className={`flex items-center mt-2 text-sm ${trend === "up" ? "text-green-600" : "text-red-600"}`}>
              {trend === "up" ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
              {trendValue}
            </div>
          )}
        </div>
        <div className={`p-3 rounded-full bg-${color}-100`}>
          <Icon className={`h-6 w-6 text-${color}-600`} />
        </div>
      </div>
    </div>
  )

  const SimpleBarChart = ({ data }: { data: any[] }) => {
    const maxAmount = Math.max(...data.map((d) => d.amount))

    return (
      <div className="space-y-3">
        {data.slice(-7).map((item, index) => (
          <div key={index} className="flex items-center space-x-3">
            <div className="w-16 text-xs text-gray-600">{item.date}</div>
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${maxAmount > 0 ? (item.amount / maxAmount) * 100 : 0}%` }}
              />
            </div>
            <div className="w-20 text-xs text-gray-900 font-medium">₦{item.amount.toLocaleString()}</div>
          </div>
        ))}
      </div>
    )
  }

  const StatusChart = ({ data }: { data: any[] }) => {
    const total = data.reduce((sum, item) => sum + item.count, 0)

    return (
      <div className="space-y-4">
        {data.map((item, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`w-3 h-3 rounded-full ${item.color}`} />
              <span className="text-sm font-medium text-gray-700">{item.status}</span>
            </div>
            <div className="text-right">
              <div className="text-sm font-bold text-gray-900">{item.count}</div>
              <div className="text-xs text-gray-500">{total > 0 ? ((item.count / total) * 100).toFixed(1) : 0}%</div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
            <div className="h-8 bg-gray-200 rounded w-1/2 mb-2" />
            <div className="h-4 bg-gray-200 rounded w-1/4" />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Revenue"
          value={`₦${analytics.totalRevenue.toLocaleString()}`}
          icon={DollarSign}
          color="green"
        />
        <StatCard title="Total Transactions" value={analytics.totalTransactions} icon={CreditCard} color="blue" />
        <StatCard title="Success Rate" value={`${analytics.successRate.toFixed(1)}%`} icon={TrendingUp} color="green" />
        <StatCard title="Unique Customers" value={analytics.uniqueCustomers} icon={Users} color="purple" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Revenue Chart */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Daily Revenue (Last 7 Days)</h3>
          {analytics.dailyData.length > 0 ? (
            <SimpleBarChart data={analytics.dailyData} />
          ) : (
            <div className="text-center py-8 text-gray-500">No data available</div>
          )}
        </div>

        {/* Transaction Status Distribution */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Transaction Status</h3>
          {analytics.statusData.length > 0 ? (
            <StatusChart data={analytics.statusData} />
          ) : (
            <div className="text-center py-8 text-gray-500">No data available</div>
          )}
        </div>
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
          <h4 className="text-sm font-medium text-gray-600 mb-2">Average Transaction Value</h4>
          <p className="text-xl font-bold text-gray-900">₦{analytics.averageTransactionValue.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
          <h4 className="text-sm font-medium text-gray-600 mb-2">Successful Transactions</h4>
          <p className="text-xl font-bold text-green-600">{analytics.successfulTransactions}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
          <h4 className="text-sm font-medium text-gray-600 mb-2">Failed Transactions</h4>
          <p className="text-xl font-bold text-red-600">{analytics.failedTransactions}</p>
        </div>
      </div>
    </div>
  )
}

export default PaymentAnalytics
