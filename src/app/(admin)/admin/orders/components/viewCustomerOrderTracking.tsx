"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Calendar } from "lucide-react"

const trackingSteps = [
  { id: 1, name: "Order Placed", status: "completed", icon: "💰" },
  { id: 2, name: "Payment Pending", status: "pending", icon: "💳" },
  { id: 3, name: "Payment Confirmed", status: "pending", icon: "💳" },
  { id: 4, name: "Processing", status: "pending", icon: "📦" },
  { id: 5, name: "Delivered", status: "pending", icon: "🏠" },
]

const orderDetails = {
  orderId: "Order#: 777892",
  brand: "Mr Rice",
  category: "Cereals",
  quantity: 1,
  dateCreated: "Jan 16, 2025",
  estimatedDelivery: "7th Feb, 2025",
  product: {
    name: "Mr. Rice. Foreign long rice (50kg)",
    description: "1 Bag",
    price: "NGN77,000.00",
    quantity: 1,
    total: "₦77,000.00",
    image: "/placeholder.svg?height=200&width=150&text=Mr.Rice",
    status: "Delivered",
  },
}

const ProgressTracker = () => {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between relative">
        {/* Progress line background */}
        <div className="absolute top-6 left-0 right-0 h-0.5 bg-gray-200 z-0"></div>

        {trackingSteps.map((step, index) => (
          <div key={step.id} className="flex flex-col items-center relative z-10">
            {/* Step icon */}
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center text-lg mb-2 border-4 border-white shadow-sm ${
                step.status === "completed" ? "bg-yellow-500 text-white" : "bg-gray-200 text-gray-400"
              }`}
            >
              {step.icon}
            </div>

            {/* Step label */}
            <span
              className={`text-xs text-center max-w-16 ${
                step.status === "completed" ? "text-gray-800 font-medium" : "text-gray-400"
              }`}
            >
              {step.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function OrderTracking() {
  return (
    <div className="w-full max-w-4xl mx-auto p-8 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg p-8 shadow-sm">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <Button variant="ghost" size="sm" className="p-1">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-2xl font-semibold text-gray-800">Order Tracking</h1>
          </div>

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>Home</span>
            <span>›</span>
            <span>Orders</span>
            <span>›</span>
            <span className="text-gray-800">Tracking</span>
          </div>
        </div>

        {/* Progress Tracker */}
        <ProgressTracker />

        {/* Product Details Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Product Details</h2>

          <div className="grid grid-cols-2 gap-6 mb-6">
            <div className="space-y-4">
              <div>
                <span className="text-gray-500 text-sm">Order ID</span>
                <p className="font-semibold text-gray-800">{orderDetails.orderId}</p>
              </div>

              <div>
                <span className="text-gray-500 text-sm">Brand :</span>
                <p className="font-semibold text-gray-800">{orderDetails.brand}</p>
              </div>

              <div>
                <span className="text-gray-500 text-sm">Category :</span>
                <p className="font-semibold text-gray-800">{orderDetails.category}</p>
              </div>

              <div>
                <span className="text-gray-500 text-sm">Quantity :</span>
                <p className="font-semibold text-gray-800">{orderDetails.quantity}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <span className="text-gray-500 text-sm">Date Created</span>
                <p className="font-semibold text-gray-800">{orderDetails.dateCreated}</p>
              </div>

              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-green-500" />
                <span className="text-green-500 font-medium">Estimated delivery: {orderDetails.estimatedDelivery}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Product Card */}
        <div className="flex items-start gap-6 p-6 bg-gray-50 rounded-lg">
          <div className="w-32 h-40 bg-white rounded-lg overflow-hidden shadow-sm">
            <img
              src={orderDetails.product.image || "/placeholder.svg"}
              alt={orderDetails.product.name}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">{orderDetails.product.name}</h3>
            <p className="text-gray-600 mb-3">{orderDetails.product.description}</p>
            <p className="text-gray-600 mb-3">
              {orderDetails.product.price} X {orderDetails.product.quantity}
            </p>
            <p className="text-xl font-bold text-gray-800 mb-3">Total: {orderDetails.product.total}</p>
            <Badge className="bg-green-100 text-green-800 hover:bg-green-100">{orderDetails.product.status}</Badge>
          </div>
        </div>
      </div>
    </div>
  )
}
