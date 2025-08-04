"use client"

import type React from "react"
import { useState, useRef, useEffect, useMemo } from "react"
import { format } from "date-fns"

export interface DataPoint {
  month: string
  individuals: number
  businessOwners: number
}

export interface ApiResponse {
  success: boolean
  data: {
    month: string
    month_num: number
    individual: number
    businessOwner: number
    individualOrders: number
    businessOwnerOrders: number
    total: number
    totalOrders: number
  }[]
  summary: {
    averageMonthly: {
      businessOwner: number
      individual: number
      total: number
    }
    totals: {
      businessOwner: number
      businessOwnerOrders: number
      individual: number
      individualOrders: number
      total: number
      totalOrders: number
    }
    year: number
  }
}

export default function SalesPerformance({ data }: { data: any }) {
  const [hoveredPoint, setHoveredPoint] = useState<{
    x: number
    y: number
    data: DataPoint
    type: "individuals" | "businessOwners"
  } | null>(null)

  const containerRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

  // Chart padding
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

    if (!data?.data || data.data.length === 0) {
      return fallbackData
    }

    return data.data.map((monthData:any) => ({
      month: monthData.month,
      individuals: monthData.individual,
      businessOwners: monthData.businessOwner,
    }))
  }, [data])

  const allValues = chartData.flatMap((d:any) => [d.individuals, d.businessOwners])
  const minValue = allValues.length > 0 ? Math.min(...allValues) * 0.9 : 0
  const maxValue = allValues.length > 0 ? Math.max(...allValues) * 1.1 : 100000
  const valueRange = maxValue - minValue

  // Account for header space
  const availableHeight = dimensions.height - 120
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

  const individualsPath = createPath(chartData.map((d:any) => d.individuals))
  const businessOwnersPath = createPath(chartData.map((d:any) => d.businessOwners))

  const yAxisTicks = useMemo(() => {
    const ticks = 4
    const step = valueRange / (ticks - 1)
    return Array.from({ length: ticks }, (_, i) => Math.round(minValue + i * step))
  }, [valueRange, minValue])

  const formatValue = (v: number) => {
    if (v >= 1_000_000) return `₦${(v / 1_000_000).toFixed(1)}M`
    if (v >= 1_000) return `₦${(v / 1_000).toFixed(0)}K`
    return `₦${v}`
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
      y: cy + padding.top + 120,
      data: point,
      type,
    })
  }

  const handleLeave = () => {
    setHoveredPoint(null)
  }

  return (
    <div
      ref={containerRef}
      className="w-full h-full bg-gradient-to-br from-white to-gray-50/50 rounded-3xl shadow-lg border border-gray-100/50 p-8 relative backdrop-blur-sm"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-4">
            Sales Performance
          </h2>
          <div className="flex flex-wrap items-center gap-6 text-sm">
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 shadow-sm"></div>
              <span className="text-gray-700 font-medium">Individuals</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 shadow-sm"></div>
              <span className="text-gray-700 font-medium">Business Owners</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3 px-4 py-3 bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200/50 hover:bg-white/90 transition-all duration-200 cursor-pointer shadow-sm">
          <span className="text-sm font-medium text-gray-700">{data?.summary?.year || new Date().getFullYear()}</span>
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
              <stop offset="50%" stopColor="#0d9488" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>
            <linearGradient id="bizGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#f59e0b" />
              <stop offset="50%" stopColor="#f97316" />
              <stop offset="100%" stopColor="#ea580c" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
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
                stroke="#f1f5f9"
                strokeWidth="1"
                strokeDasharray="2,4"
                opacity="0.6"
              />
            ))}

            {/* Y-axis labels */}
            {yAxisTicks.map((tick) => (
              <text
                key={`label-${tick}`}
                x={-16}
                y={getY(tick)}
                textAnchor="end"
                dominantBaseline="middle"
                className="text-xs fill-gray-500 font-medium"
              >
                {formatValue(tick)}
              </text>
            ))}

            {/* X-axis labels */}
            {chartData.map((d:any, i:any) => (
              <text
                key={`x-${i}`}
                x={getX(i)}
                y={chartHeight + 24}
                textAnchor="middle"
                className="text-sm fill-gray-600 font-medium"
              >
                {d.month}
              </text>
            ))}

            {/* Curves with enhanced styling */}
            <path
              d={individualsPath}
              fill="none"
              stroke="url(#indGradient)"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="drop-shadow-lg"
              filter="url(#glow)"
              opacity="0.9"
            />
            <path
              d={businessOwnersPath}
              fill="none"
              stroke="url(#bizGradient)"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="drop-shadow-lg"
              filter="url(#glow)"
              opacity="0.9"
            />

            {/* Invisible hover areas for data points */}
            {chartData.map((d:any, i:any) => (
              <g key={i}>
                {/* Individuals hover area */}
                <circle
                  cx={getX(i)}
                  cy={getY(d.individuals)}
                  r={20}
                  fill="transparent"
                  className="cursor-pointer"
                  onMouseEnter={(e) => handleHover(e, d, "individuals")}
                  onMouseLeave={handleLeave}
                />
                {/* Business owners hover area */}
                <circle
                  cx={getX(i)}
                  cy={getY(d.businessOwners)}
                  r={20}
                  fill="transparent"
                  className="cursor-pointer"
                  onMouseEnter={(e) => handleHover(e, d, "businessOwners")}
                  onMouseLeave={handleLeave}
                />
              </g>
            ))}
          </g>
        </svg>
      )}

      {/* Animated Tooltip */}
      {hoveredPoint && (
        <div
          className="absolute bg-white/95 backdrop-blur-md border border-gray-200/50 rounded-xl shadow-2xl p-4 pointer-events-none z-50 transform transition-all duration-200 ease-out animate-in fade-in-0 zoom-in-95"
          style={{
            left: hoveredPoint.x,
            top: hoveredPoint.y - 80,
            transform: "translate(-50%, -100%)",
          }}
        >
          <div className="text-sm font-semibold text-gray-900 mb-2 text-center">{hoveredPoint.data.month}</div>
          <div className="flex items-center gap-3 text-sm">
            <div
              className={`w-3 h-3 rounded-full shadow-sm ${
                hoveredPoint.type === "individuals"
                  ? "bg-gradient-to-r from-emerald-500 to-teal-500"
                  : "bg-gradient-to-r from-amber-400 to-orange-500"
              }`}
            ></div>
            <span className="text-gray-600 font-medium">
              {hoveredPoint.type === "individuals" ? "Individuals" : "Business Owners"}:
            </span>
            <span className="font-bold text-gray-900 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              {formatValue(hoveredPoint.data[hoveredPoint.type])}
            </span>
          </div>

          {/* Comparison data */}
          <div className="mt-3 pt-3 border-t border-gray-100">
            <div className="flex items-center justify-between gap-4 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500"></div>
                <span className="text-gray-500">Individuals:</span>
                <span className="font-semibold text-gray-700">{formatValue(hoveredPoint.data.individuals)}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-gradient-to-r from-amber-400 to-orange-500"></div>
                <span className="text-gray-500">Business:</span>
                <span className="font-semibold text-gray-700">{formatValue(hoveredPoint.data.businessOwners)}</span>
              </div>
            </div>
          </div>

          {/* Tooltip arrow */}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2">
            <div className="w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-l-transparent border-r-transparent border-t-white/95"></div>
          </div>
        </div>
      )}
    </div>
  )
}
