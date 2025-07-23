"use client"

import { Badge } from "@/components/ui/badge"
import { ExternalLink } from "lucide-react"

const customerData = {
  name: "Mirabel Okon",
  role: "Business Owner",
  status: "ACTIVE",
  profileImage: "/images/mirabel-profile.png",
  shippingAddress: {
    primary: "68 Bode Thomas",
    secondary: "Surulere, Lagos Nigeria.",
    city: "Lagos",
    state: "Lagos Mainland",
    country: "Nigeria",
    postCode: "101271",
  },
}

export default function CustomerProfile() {
  return (
    <div className="w-full max-w-md mx-auto p-8 bg-gray-50">
      <div className="bg-white rounded-lg p-6 shadow-sm">
        {/* Profile Section */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-20 h-20 rounded-full overflow-hidden mb-4">
            <img
              src={customerData.profileImage || "/placeholder.svg"}
              alt={customerData.name}
              className="w-full h-full object-cover"
              crossOrigin="anonymous"
            />
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-1">{customerData.name}</h2>
          <p className="text-gray-500 text-sm mb-3">{customerData.role}</p>
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100 px-3 py-1 text-xs font-medium">
            {customerData.status}
          </Badge>
        </div>

        {/* Shipping Address Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-800">Shipping Address</h3>
            <button className="text-gray-400 hover:text-gray-600 transition-colors">
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-1">
                <label className="text-sm text-gray-500">Primary address</label>
              </div>
              <div className="col-span-2">
                <p className="text-sm font-medium text-gray-800">{customerData.shippingAddress.primary}</p>
                <p className="text-sm font-medium text-gray-800">{customerData.shippingAddress.secondary}</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-1">
                <label className="text-sm text-gray-500">City</label>
              </div>
              <div className="col-span-2">
                <p className="text-sm font-medium text-gray-800">{customerData.shippingAddress.city}</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-1">
                <label className="text-sm text-gray-500">State/Province</label>
              </div>
              <div className="col-span-2">
                <p className="text-sm font-medium text-gray-800">{customerData.shippingAddress.state}</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-1">
                <label className="text-sm text-gray-500">Country</label>
              </div>
              <div className="col-span-2">
                <p className="text-sm font-medium text-gray-800">{customerData.shippingAddress.country}</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-1">
                <label className="text-sm text-gray-500">Post Code</label>
              </div>
              <div className="col-span-2">
                <p className="text-sm font-medium text-gray-800">{customerData.shippingAddress.postCode}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
