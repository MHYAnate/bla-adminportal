"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, RotateCcw, Loader2 } from "lucide-react"

const progressSteps = [
  { id: 1, name: "Order Confirming", status: "completed" },
  { id: 2, name: "Payment Pending", status: "completed" },
  { id: 3, name: "Processing", status: "current" },
  { id: 4, name: "Shipping", status: "pending" },
  { id: 5, name: "Delivered", status: "pending" },
]

const ProgressBar = () => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-medium text-gray-800">Order Progress</h2>

      <div className="relative">
        {/* Progress line background */}
        <div className="absolute top-4 left-0 right-0 h-1 bg-gray-200 rounded-full"></div>

        {/* Progress steps */}
        <div className="flex justify-between relative">
          {progressSteps.map((step, index) => (
            <div key={step.id} className="flex flex-col items-center">
              {/* Progress indicator */}
              <div className="relative z-10 mb-2">
                {step.status === "completed" && <div className="w-8 h-2 bg-green-500 rounded-full"></div>}
                {step.status === "current" && (
                  <div className="w-8 h-2 bg-yellow-500 rounded-full flex items-center justify-center">
                    <Loader2 className="w-3 h-3 text-white animate-spin absolute" />
                  </div>
                )}
                {step.status === "pending" && <div className="w-8 h-2 bg-gray-300 rounded-full"></div>}
              </div>

              {/* Step label */}
              <span
                className={`text-sm ${
                  step.status === "completed" || step.status === "current" ? "text-gray-800" : "text-gray-400"
                }`}
              >
                {step.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function ManageOrders() {
  return (
    <div className="w-full max-w-6xl mx-auto p-8 bg-gray-50">
      <div className="bg-white rounded-lg p-8 shadow-sm">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-light text-gray-600 mb-6">Manage orders</h1>

          {/* Order Info Section */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <h2 className="text-2xl font-semibold text-gray-800">Order#: 777892</h2>
              <Badge className="bg-green-100 text-green-800 hover:bg-green-100 px-3 py-1">PAID</Badge>
              <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 px-3 py-1">In Progress</Badge>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" className="flex items-center gap-2 bg-transparent">
                <RotateCcw className="w-4 h-4" />
                Refund
              </Button>
              <Button className="bg-orange-500 hover:bg-orange-600 text-white">Edit order</Button>
            </div>
          </div>

          {/* Breadcrumb */}
          <p className="text-gray-400 text-sm">
            Order / Order Details / Order #: 777892/15 - 7th Feb, 2025 at 15:00 pm
          </p>
        </div>

        {/* Progress Section */}
        <div className="mb-8">
          <ProgressBar />
        </div>

        {/* Bottom Section */}
        <div className="flex items-center justify-between pt-6 border-t border-gray-100">
          <div className="flex items-center gap-2 text-gray-600">
            <Calendar className="w-5 h-5" />
            <span>Estimated shipping date: 7th Feb, 2025</span>
          </div>

          <Button className="bg-orange-500 hover:bg-orange-600 text-white flex items-center gap-2">
            Track order
            <MapPin className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
