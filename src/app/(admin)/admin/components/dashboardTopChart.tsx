"use client"

import type React from "react"

import { useState, useRef, useEffect, useMemo } from "react"
import { format } from "date-fns"

export interface DataPoint {
  month: string
  individuals: number
  businessOwners: number
}

export interface Customer {
  type: "individual" | "business"
  name: string
  id: string
}

export interface SalesData {
  month: string
  total_sales: number
}

export interface ApiData {
  charts?: {
    salesPerformance?: SalesData[]
  }
  recentActivity?: {
    newCustomers?: Customer[]
  }
}

export interface SalesPerformanceProps {
  data: ApiData
}

export default function SalesPerformance({ data }: SalesPerformanceProps) {
  const [hoveredPoint, setHoveredPoint] = useState<{
    x: number
    y: number
    data: DataPoint
    type: "individuals" | "businessOwners"
  } | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

  // Chart padding – adjusted for header space
  const padding = { top: 20, right: 20, bottom: 40, left: 60 }

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect()
        setDimensions({
          width: width,
          height: height > 0 ? height : width * 0.6,
        })
      }
    }

    updateDimensions()
    window.addEventListener("resize", updateDimensions)
    return () => window.removeEventListener("resize", updateDimensions)
  }, [])

  const chartData = useMemo(() => {
    const fallbackData: DataPoint[] = [
      { month: "Jan", individuals: 38000, businessOwners: 42000 },
      { month: "Feb", individuals: 41000, businessOwners: 39000 },
      { month: "Mar", individuals: 44000, businessOwners: 45000 },
      { month: "Apr", individuals: 47000, businessOwners: 50000 },
      { month: "May", individuals: 41000, businessOwners: 40000 },
      { month: "Jun", individuals: 45000, businessOwners: 43000 },
      { month: "Jul", individuals: 50000, businessOwners: 38000 },
    ]

    if (!data?.charts?.salesPerformance || data.charts.salesPerformance.length === 0) {
      return fallbackData
    }

    const customers = data.recentActivity?.newCustomers || []
    const individualCount = customers.filter((c) => c.type === "individual").length
    const businessCount = customers.filter((c) => c.type === "business").length
    const total = individualCount + businessCount
    const individualRatio = total > 0 ? individualCount / total : 0.6
    const businessRatio = total > 0 ? businessCount / total : 0.4

    return data.charts.salesPerformance.map((m) => {
      const month = format(new Date(`${m.month}-01`), "MMM")
      return {
        month,
        individuals: Math.round(m.total_sales * individualRatio),
        businessOwners: Math.round(m.total_sales * businessRatio),
      }
    })
  }, [data])

  const allValues = chartData.flatMap((d) => [d.individuals, d.businessOwners])
  const minValue = allValues.length > 0 ? Math.min(...allValues) * 0.9 : 0
  const maxValue = allValues.length > 0 ? Math.max(...allValues) * 1.1 : 100000
  const valueRange = maxValue - minValue

  // Account for header space
  const availableHeight = dimensions.height - 120 // Reserve space for header
  const chartWidth = dimensions.width - padding.left - padding.right
  const chartHeight = availableHeight - padding.top - padding.bottom

  const getX = (i: number) => (chartData.length > 1 ? (i / (chartData.length - 1)) * chartWidth : chartWidth / 2)

  const getY = (v: number) =>
    valueRange > 0 ? chartHeight - ((v - minValue) / valueRange) * chartHeight : chartHeight / 2

  const createPath = (values: number[]) => {
    if (values.length === 0) return ""
    let path = `M ${getX(0)} ${getY(values[0])}`
    for (let i = 1; i < values.length; i++) {
      const x0 = getX(i - 1),
        y0 = getY(values[i - 1])
      const x1 = getX(i),
        y1 = getY(values[i])
      const cx1 = x0 + (x1 - x0) / 2,
        cy1 = y0
      const cx2 = x1 - (x1 - x0) / 2,
        cy2 = y1
      path += ` C ${cx1} ${cy1}, ${cx2} ${cy2}, ${x1} ${y1}`
    }
    return path
  }

  const individualsPath = createPath(chartData.map((d) => d.individuals))
  const businessOwnersPath = createPath(chartData.map((d) => d.businessOwners))

  const yAxisTicks = useMemo(() => {
    const ticks = 4
    const step = valueRange / (ticks - 1)
    return Array.from({ length: ticks }, (_, i) => Math.round(minValue + i * step))
  }, [valueRange, minValue])

  const formatValue = (v: number) => {
    if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M`
    if (v >= 1_000) return `${(v / 1_000).toFixed(0)}k`
    return `${v}`
  }

  const handleHover = (
    e: React.MouseEvent<SVGCircleElement>,
    point: DataPoint,
    type: "individuals" | "businessOwners",
  ) => {
    const svgBox = svgRef.current?.getBoundingClientRect()
    const containerBox = containerRef.current?.getBoundingClientRect()
    const cx = Number.parseFloat(e.currentTarget.getAttribute("cx") || "0")
    const cy = Number.parseFloat(e.currentTarget.getAttribute("cy") || "0")

    if (!svgBox || !containerBox) return

    setHoveredPoint({
      x: cx + padding.left,
      y: cy + padding.top + 120, // Account for header height
      data: point,
      type,
    })
    e.currentTarget.setAttribute("r", "8")
  }

  const handleLeave = (e: React.MouseEvent<SVGCircleElement>) => {
    setHoveredPoint(null)
    e.currentTarget.setAttribute("r", "6")
  }

  return (
    <div
      ref={containerRef}
      className="w-full h-full bg-white rounded-2xl shadow-sm border border-gray-100 p-6 relative"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">Sales Performance</h2>
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
              <span className="text-gray-600">Individuals</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-amber-400"></div>
              <span className="text-gray-600">Business Owners</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors cursor-pointer">
          <span className="text-sm text-gray-600">Last 7 month</span>
          <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
        </div>
      </div>

      {/* Chart */}
      {dimensions.width > 0 && (
        <svg ref={svgRef} width={dimensions.width} height={availableHeight} className="overflow-visible">
          <defs>
            <linearGradient id="indGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#0d9488" />
            </linearGradient>
            <linearGradient id="bizGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#f97316" />
            </linearGradient>
          </defs>
          <g transform={`translate(${padding.left}, ${padding.top})`}>
            {/* Horizontal grid */}
            {yAxisTicks.map((tick) => (
              <line
                key={tick}
                x1={0}
                y1={getY(tick)}
                x2={chartWidth}
                y2={getY(tick)}
                stroke="#f3f4f6"
                strokeWidth="1"
              />
            ))}
            {/* Y-axis labels */}
            {yAxisTicks.map((tick) => (
              <text
                key={`label-${tick}`}
                x={-12}
                y={getY(tick)}
                textAnchor="end"
                dominantBaseline="middle"
                className="text-xs fill-gray-500"
              >
                {formatValue(tick)}
              </text>
            ))}
            {/* X-axis labels */}
            {chartData.map((d, i) => (
              <text
                key={`x-${i}`}
                x={getX(i)}
                y={chartHeight + 20}
                textAnchor="middle"
                className="text-xs fill-gray-500"
              >
                {d.month}
              </text>
            ))}
            {/* Curves */}
            <path
              d={individualsPath}
              fill="none"
              stroke="url(#indGradient)"
              strokeWidth="3"
              strokeLinecap="round"
              className="drop-shadow-sm"
            />
            <path
              d={businessOwnersPath}
              fill="none"
              stroke="url(#bizGradient)"
              strokeWidth="3"
              strokeLinecap="round"
              className="drop-shadow-sm"
            />
            {/* Points */}
            {chartData.map((d, i) => (
              <g key={i}>
                <circle
                  cx={getX(i)}
                  cy={getY(d.individuals)}
                  r={6}
                  fill="url(#indGradient)"
                  className="cursor-pointer transition-all duration-200 drop-shadow-sm"
                  onMouseEnter={(e) => handleHover(e, d, "individuals")}
                  onMouseLeave={handleLeave}
                />
                <circle
                  cx={getX(i)}
                  cy={getY(d.businessOwners)}
                  r={6}
                  fill="url(#bizGradient)"
                  className="cursor-pointer transition-all duration-200 drop-shadow-sm"
                  onMouseEnter={(e) => handleHover(e, d, "businessOwners")}
                  onMouseLeave={handleLeave}
                />
              </g>
            ))}
          </g>
        </svg>
      )}

      {/* Tooltip */}
      {hoveredPoint && (
        <div
          className="absolute bg-white border border-gray-200 rounded-lg shadow-lg p-3 pointer-events-none z-50"
          style={{
            left: hoveredPoint.x,
            top: hoveredPoint.y - 60,
            transform: "translate(-50%, -100%)",
          }}
        >
          <div className="text-sm font-medium text-gray-900 mb-1 text-center">{hoveredPoint.data.month}</div>
          <div className="flex items-center gap-2 text-sm">
            <div
              className={`w-2 h-2 rounded-full ${
                hoveredPoint.type === "individuals" ? "bg-emerald-500" : "bg-amber-400"
              }`}
            ></div>
            <span className="text-gray-600">
              {hoveredPoint.type === "individuals" ? "Individuals" : "Business Owners"}:
            </span>
            <span className="font-medium text-gray-900">{formatValue(hoveredPoint.data[hoveredPoint.type])}</span>
          </div>
        </div>
      )}
    </div>
  )
}
