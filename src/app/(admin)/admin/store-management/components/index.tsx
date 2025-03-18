"use client";

import Header from "@/app/(admin)/components/header";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";
import { InputFilter } from "@/app/(admin)/components/input-filter";
import { SelectFilter } from "@/app/(admin)/components/select-filter";
import EmptyState from "@/app/(admin)/components/empty";
import DataTable from "./data-table";

export default function StoreManagement() {
  const [role, setRole] = useState<string>("");
  const [filter, setFilter] = useState<string>("");
  const roleList = [
    {
      text: "Admin",
      value: "admin",
    },
    {
      text: "Super Admin",
      value: "super-admin",
    },
  ];
  return (
    <section>
      <Card>
        <CardContent className="p-4 ">
          <div className="flex justify-between items-center mb-6">
            <Header
              title="Store Managements"
              subtext="Manage Stores and  Supplies"
            />
          </div>
          <EmptyState
            btnText="Add Store"
            header="Store Records Await"
            description="Start Managing Your Suppliers by Adding Your First Store."
            onClick={() => console.log("Hi!")}
          />
          <div className="flex items-center gap-4 mb-6">
            <InputFilter
              setQuery={setFilter}
              placeholder="Search Manufacturers"
            />

            <SelectFilter
              setFilter={setRole}
              placeholder="Select Role"
              list={roleList}
            />
          </div>
          <DataTable />
        </CardContent>
      </Card>
    </section>
  );
}
