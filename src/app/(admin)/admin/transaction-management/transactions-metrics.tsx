"use client"

import type React from "react"
import { TrendingUp, TrendingDown, DollarSign, CreditCard, Users, Clock, AlertCircle, CheckCircle } from "lucide-react"

interface MetricsData {
  totalRevenue: number
  totalTransactions: number
  averageTransactionValue: number
  successRate: number
  totalCustomers: number
  pendingTransactions: number
  failedTransactions: number
  refundedAmount: number
  revenueGrowth?: number
  transactionGrowth?: number
  customerGrowth?: number
  successRateChange?: number
}

interface TransactionMetricsProps {
  metrics: MetricsData
  isLoading?: boolean
}

const TransactionMetrics: React.FC<any> = ({ metrics, isLoading = false }) => {
  const MetricCard = ({
    title,
    value,
    icon: Icon,
    trend,
    trendValue,
    color = "blue",
    subtitle,
  }: {
    title: string
    value: string | number
    icon: any
    trend?: "up" | "down" | "neutral"
    trendValue?: string
    color?: "blue" | "green" | "red" | "yellow" | "purple" | "gray"
    subtitle?: string
  }) => {
    const colorClasses = {
      blue: "bg-blue-50 text-blue-600 border-blue-100",
      green: "bg-green-50 text-green-600 border-green-100",
      red: "bg-red-50 text-red-600 border-red-100",
      yellow: "bg-yellow-50 text-yellow-600 border-yellow-100",
      purple: "bg-purple-50 text-purple-600 border-purple-100",
      gray: "bg-gray-50 text-gray-600 border-gray-100",
    }

    const trendColors = {
      up: "text-green-600",
      down: "text-red-600",
      neutral: "text-gray-600",
    }

    if (isLoading) {
      return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
              <div className="h-8 bg-gray-200 rounded w-1/2 mb-2" />
              <div className="h-3 bg-gray-200 rounded w-1/4" />
            </div>
            <div className="w-12 h-12 bg-gray-200 rounded-lg" />
          </div>
        </div>
      )
    }

    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
            <p className="text-2xl font-bold text-gray-900 mb-1">{value}</p>
            {subtitle && <p className="text-xs text-gray-500 mb-2">{subtitle}</p>}
            {trend && trendValue && (
              <div className={`flex items-center text-sm ${trendColors[trend]}`}>
                {trend === "up" && <TrendingUp className="h-4 w-4 mr-1" />}
                {trend === "down" && <TrendingDown className="h-4 w-4 mr-1" />}
                {trend === "neutral" && <span className="w-4 h-4 mr-1 flex items-center justify-center">•</span>}
                <span className="font-medium">{trendValue}</span>
                <span className="text-gray-500 ml-1">vs last period</span>
              </div>
            )}
          </div>
          <div className={`p-3 rounded-lg border ${colorClasses[color]}`}>
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </div>
    )
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`
  }

  const getTrendDirection = (value?: number): "up" | "down" | "neutral" => {
    if (!value) return "neutral"
    if (value > 0) return "up"
    if (value < 0) return "down"
    return "neutral"
  }

  const formatTrendValue = (value?: number) => {
    if (!value) return "No change"
    const sign = value > 0 ? "+" : ""
    return `${sign}${value.toFixed(1)}%`
  }

  return (
    <div className="space-y-6">
      {/* Primary Metrics */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Performance Metrics</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Total Revenue"
            value={formatCurrency(metrics.totalRevenue)}
            icon={DollarSign}
            trend={getTrendDirection(metrics.revenueGrowth)}
            trendValue={formatTrendValue(metrics.revenueGrowth)}
            color="green"
          />
          <MetricCard
            title="Total Transactions"
            value={metrics.totalTransactions.toLocaleString()}
            icon={CreditCard}
            trend={getTrendDirection(metrics.transactionGrowth)}
            trendValue={formatTrendValue(metrics.transactionGrowth)}
            color="blue"
          />
          <MetricCard
            title="Average Transaction"
            value={formatCurrency(metrics.averageTransactionValue)}
            icon={TrendingUp}
            subtitle="Per transaction"
            color="purple"
          />
          <MetricCard
            title="Success Rate"
            value={formatPercentage(metrics.successRate)}
            icon={CheckCircle}
            trend={getTrendDirection(metrics.successRateChange)}
            trendValue={formatTrendValue(metrics.successRateChange)}
            color="green"
          />
        </div>
      </div>

      {/* Secondary Metrics */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Unique Customers"
            value={metrics.totalCustomers.toLocaleString()}
            icon={Users}
            trend={getTrendDirection(metrics.customerGrowth)}
            trendValue={formatTrendValue(metrics.customerGrowth)}
            color="blue"
          />
          <MetricCard
            title="Pending Transactions"
            value={metrics.pendingTransactions.toLocaleString()}
            icon={Clock}
            subtitle="Awaiting processing"
            color="yellow"
          />
          <MetricCard
            title="Failed Transactions"
            value={metrics.failedTransactions.toLocaleString()}
            icon={AlertCircle}
            subtitle="Requires attention"
            color="red"
          />
          <MetricCard
            title="Refunded Amount"
            value={formatCurrency(metrics.refundedAmount)}
            icon={TrendingDown}
            subtitle="Total refunds issued"
            color="gray"
          />
        </div>
      </div>

      {/* Summary Stats */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h4 className="text-md font-semibold text-gray-900 mb-4">Transaction Summary</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {(
                ((metrics.totalTransactions - metrics.pendingTransactions - metrics.failedTransactions) /
                  metrics.totalTransactions) *
                100
              ).toFixed(1)}
              %
            </div>
            <div className="text-sm text-gray-600">Completed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {((metrics.pendingTransactions / metrics.totalTransactions) * 100).toFixed(1)}%
            </div>
            <div className="text-sm text-gray-600">Pending</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">
              {((metrics.failedTransactions / metrics.totalTransactions) * 100).toFixed(1)}%
            </div>
            <div className="text-sm text-gray-600">Failed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {(metrics.totalRevenue / metrics.totalCustomers).toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">Revenue per Customer</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TransactionMetrics
