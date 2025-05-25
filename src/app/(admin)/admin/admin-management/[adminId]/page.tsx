"use client";
import AdminDetail from "./components";
import { Suspense } from "react";
import LoadingSvg from "@/components/load";

export default function AdminsDetailPage() {
	return (
		<>
			<Suspense fallback={<LoadingSvg />}>
				<AdminDetail />
			</Suspense>
		</>
	);
}
