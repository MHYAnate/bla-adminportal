"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import SubAdminRegistrationForm from "./SubAdminRegistratuinForm";
import { Loader2 } from "lucide-react";
import httpService from "@/services/httpService";

export default function AdminRegistrationPage() {
  const searchParams = useSearchParams();

  // ✅ REMOVED: No validation, no loading, no error states
  // Just render the form directly

  return <SubAdminRegistrationForm />;
}