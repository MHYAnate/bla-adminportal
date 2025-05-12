"use client";

import { useEffect, useState } from "react";
import { useGetAdminRoles } from "@/services/admin";
import httpService from "@/services/httpService";
import { routes } from "@/services/api-routes";
import { ErrorHandler } from "@/services/errorHandler";
import { useGetAdmins } from "@/services/admin";
export const useGetAdminInfo = (adminId: string) => {
  const [adminData, setAdminData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<any>(null);

   const{adminsData, isAdminsLoading,refetchAdmins }= useGetAdmins({ enabled: true });
     console.log(adminId, "id", adminsData);
  
  
    
  
     const admin = adminsData.find(
      (admin: {id:string}) => admin.id == adminId
    )

  const fetchAdminInfo = async () => {
    setIsLoading(true);
    try {
      const response = admin ;
      setAdminData(response.data);
      return response.data;
    } catch (err) {
      setError(err);
      console.error("Error fetching admin info:", ErrorHandler(err));
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (adminId) {
      fetchAdminInfo();
    }
  }, [adminId]);

  const refetchAdminInfo = () => {
    return fetchAdminInfo();
  };

  return {
    adminData,
    isLoading,
    error: ErrorHandler(error),
    refetchAdminInfo
  };
};