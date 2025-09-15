"use client"

import { useState, useEffect, useRef } from "react"
import { useGetAdminRoles, useGetAdmins } from "@/services/admin";

const AdminRolesDashboard = () => {
  const { rolesData, isRolesLoading } = useGetAdminRoles({ enabled: true })
  const { adminsData, isAdminsLoading } = useGetAdmins({ enabled: true })
  const [filteredRoles, setFilteredRoles] = useState<{ id: string; name: string; _count: { users: number }; type: string }[]>([])
  const [totalAdmins, setTotalAdmins] = useState(0)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [showLeftArrow, setShowLeftArrow] = useState(false)
  const [showRightArrow, setShowRightArrow] = useState(true)

  const adminDataFormat = adminsData as any

  console.log("Admins Data:", adminDataFormat)
  useEffect(() => {
    if (rolesData && rolesData.data) {
      // Filter out roles with no users and non-admin roles
      const filtered = rolesData.data.filter((role:any) => role._count.users > 0 && role.type === "ADMIN")
      setFilteredRoles(filtered)
    }
  }, [rolesData])

  useEffect(() => {
    if (adminDataFormat ) {
      setTotalAdmins(adminDataFormat.length)
    }
  }, [adminDataFormat])

  useEffect(() => {
    const checkScroll = () => {
      if (containerRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = containerRef.current
        setShowLeftArrow(scrollLeft > 0)
        setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10)
      }
    }

    const container = containerRef.current
    if (container) {
      container.addEventListener("scroll", checkScroll)
      checkScroll() // Initial check
    }

    return () => {
      if (container) {
        container.removeEventListener("scroll", checkScroll)
      }
    }
  }, [filteredRoles])

  const scroll = (direction:any) => {
    if (containerRef.current) {
      const scrollAmount = 300
      containerRef.current.scrollBy({
        left: direction === "right" ? scrollAmount : -scrollAmount,
        behavior: "smooth",
      })
    }
  }

  if (isRolesLoading || isAdminsLoading) {
    return <div className="text-center py-10 text-lg text-slate-500">Loading admin data...</div>
  }

  return (
    // <div className="p-5 max-w-2/3 mx-auto">
    //   <h2 className="mb-5 text-gray-800 text-2xl font-semibold">Admin Roles Overview</h2>

    //   <div className="relative flex items-center">
    //     {showLeftArrow && (
    //       <button
    //         className="absolute left-[-20px] top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white border border-slate-200 shadow-md text-xl font-bold cursor-pointer z-10 flex items-center justify-center transition-all duration-200 hover:bg-slate-50 hover:shadow-lg md:left-[-15px] md:w-9 md:h-9"
    //         onClick={() => scroll("left")}
    //         aria-label="Scroll left"
    //       >
    //         &#8249;
    //       </button>
    //     )}

    //     <div
    //       className="flex overflow-x-auto scroll-smooth gap-4 py-2.5 scrollbar-none"
    //       ref={containerRef}
    //       style={{
    //         scrollbarWidth: "none",
    //         msOverflowStyle: "none",
    //       }}
    //     >
    //       <div className="flex-none w-[250px] h-[180px] bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded-xl shadow-lg p-5 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl md:w-[220px] md:h-[160px]">
    //         <div className="flex flex-col h-full justify-center items-center">
    //           <h3 className="m-0 mb-3 text-lg text-center font-medium">All Admins</h3>
    //           <div className="text-4xl font-bold my-2">{totalAdmins}</div>
    //           <p className="mt-1 text-sm opacity-80 m-0">Total  Administrators</p>
    //         </div>
    //       </div>

    //       {filteredRoles.map((role) => (
    //         <div
    //           key={role.id}
    //           className="flex-none w-[250px] h-[180px] bg-white rounded-xl shadow-lg p-5 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl md:w-[220px] md:h-[160px]"
    //         >
    //           <div className="flex flex-col h-full justify-center items-center">
    //             <h3 className="m-0 mb-3 text-lg text-center font-medium text-gray-800">{role.name}</h3>
    //             <div className="text-4xl font-bold my-2 text-gray-900">{role._count.users}</div>
    //             <p className="mt-1 text-sm opacity-80 m-0 text-gray-600">Active Users</p>
    //           </div>
    //         </div>
    //       ))}
    //     </div>

    //     {showRightArrow && (
    //       <button
    //         className="absolute right-[-20px] top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white border border-slate-200 shadow-md text-xl font-bold cursor-pointer z-10 flex items-center justify-center transition-all duration-200 hover:bg-slate-50 hover:shadow-lg md:right-[-15px] md:w-9 md:h-9"
    //         onClick={() => scroll("right")}
    //         aria-label="Scroll right"
    //       >
    //         &#8250;
    //       </button>
    //     )}
    //   </div>
    // </div>

    <div className="p-5 mx-auto">
    <h2 className="mb-5 text-gray-800 text-2xl font-semibold">Admin Roles Overview</h2>

    {/* Grid wrapper */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* First card */}
      <div className="bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded-xl shadow-lg p-5 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl">
        <div className="flex flex-col h-full justify-center items-center">
          <h3 className="m-0 mb-3 text-lg text-center font-medium">All Admins</h3>
          <div className="text-4xl font-bold my-2">{totalAdmins}</div>
          <p className="mt-1 text-sm opacity-80 m-0">Total Active Administrators</p>
        </div>
      </div>

      {/* Dynamic cards */}
      {filteredRoles.map((role) => (
        <div
          key={role.id}
          className="bg-white rounded-xl shadow-lg p-5 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl"
        >
          <div className="flex flex-col h-full justify-center items-center">
            <h3 className="m-0 mb-3 text-lg text-center font-medium text-gray-800">{role.name}</h3>
            <div className="text-4xl font-bold my-2 text-gray-900">{role._count.users}</div>
            <p className="mt-1 text-sm opacity-80 m-0 text-gray-600">Active Users</p>
          </div>
        </div>
      ))}
      <div
       
         className="bg-gradient-to-br from-yellow-600 to-purple-600 text-white rounded-xl shadow-lg p-5 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl"
        >
          <div className="flex flex-col h-full justify-center items-center">
            <h3 className="m-0 mb-3 text-lg text-center font-medium text-gray-800">Super Admin</h3>
            <div className="text-4xl font-bold my-2 text-gray-900">1</div>
            
          </div>
        </div>
    </div>
  </div>
  )
}

export default AdminRolesDashboard
