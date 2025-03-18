"use client";

import Header from "@/app/(admin)/components/header";
import DataTable from "./data-table";
import { Card, CardContent } from "@/components/ui/card";

const Support: React.FC = () => {
  return (
    <>
      <Card className="bg-white">
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-8">
            <Header
              title="Customer Support Center"
              subtext="View and manage customer feedback to improve service and address concerns effectively."
            />
          </div>
          <DataTable />
        </CardContent>
      </Card>
    </>
  );
};

export default Support;
