"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, Loader2, Download, RotateCcw } from "lucide-react"

const timelineEvents = [
  {
    id: 1,
    title: "The packing has been started",
    description: "Confirmed by BuyLocal Admin",
    timestamp: "7th February 2024, 09:40 pm",
    status: "in-progress",
    icon: <Loader2 className="w-4 h-4 animate-spin" />,
  },
  {
    id: 2,
    title: "The invoice has been sent to the customer",
    description: "Invoice email was sent to maxdoctor@gmail.com",
    timestamp: "7th February 2024, 09:40 pm",
    status: "completed",
    icon: <Check className="w-4 h-4" />,
    action: {
      type: "button",
      label: "Resend Invoice",
      variant: "outline" as const,
      icon: <RotateCcw className="w-3 h-3" />,
    },
  },
  {
    id: 3,
    title: "The invoice has been sent to the customer",
    description: "Invoice email was sent to maxdoctor@gmail.com",
    timestamp: "7th February 2024, 09:40 pm",
    status: "completed",
    icon: <Check className="w-4 h-4" />,
    action: {
      type: "button",
      label: "Download Invoice",
      variant: "default" as const,
      icon: <Download className="w-3 h-3" />,
    },
  },
  {
    id: 4,
    title: "Order Payment",
    description: "Using Mastercard",
    timestamp: "7th February 2024, 09:40 pm",
    status: "completed",
    icon: <Check className="w-4 h-4" />,
    badge: {
      label: "PAID",
      color: "green",
    },
  },
  {
    id: 5,
    title: "4 Order confirm by BuyLocal Admin",
    description: "",
    timestamp: "7th February 2024, 09:40 pm",
    status: "completed",
    icon: <Check className="w-4 h-4" />,
    orders: ["Order 1", "Order 2", "Order 3", "Order 4"],
  },
]

export default function OrderTimeline() {
  return (
    <div className="w-full max-w-4xl mx-auto p-8 bg-gray-50">
      <div className="bg-white rounded-lg p-8 shadow-sm">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-800">Order Timeline</h1>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200"></div>

          {/* Timeline events */}
          <div className="space-y-8">
            {timelineEvents.map((event, index) => (
              <div key={event.id} className="relative flex items-start gap-6">
                {/* Timeline dot */}
                <div
                  className={`relative z-10 flex items-center justify-center w-12 h-12 rounded-full border-4 border-white shadow-sm ${
                    event.status === "completed"
                      ? "bg-green-500 text-white"
                      : event.status === "in-progress"
                        ? "bg-yellow-500 text-white"
                        : "bg-gray-300 text-gray-600"
                  }`}
                >
                  {event.icon}
                </div>

                {/* Event content */}
                <div className="flex-1 min-w-0 pb-8">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-gray-800 mb-1">{event.title}</h3>
                      {event.description && <p className="text-sm text-gray-500 mb-3">{event.description}</p>}

                      {/* Action buttons */}
                      {event.action && (
                        <div className="mb-3">
                          <Button
                            variant={event.action.variant}
                            size="sm"
                            className={
                              event.action.variant === "default" ? "bg-orange-500 hover:bg-orange-600 text-white" : ""
                            }
                          >
                            {event.action.icon}
                            {event.action.label}
                          </Button>
                        </div>
                      )}

                      {/* Badge */}
                      {event.badge && (
                        <div className="mb-3">
                          <Badge
                            className={
                              event.badge.color === "green" ? "bg-green-100 text-green-800 hover:bg-green-100" : ""
                            }
                          >
                            {event.badge.label}
                          </Badge>
                        </div>
                      )}

                      {/* Order boxes */}
                      {event.orders && (
                        <div className="flex gap-2 mb-3">
                          {event.orders.map((order, orderIndex) => (
                            <div
                              key={orderIndex}
                              className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded border"
                            >
                              {order}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Timestamp */}
                    <div className="text-sm text-gray-500 ml-4 whitespace-nowrap">{event.timestamp}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
