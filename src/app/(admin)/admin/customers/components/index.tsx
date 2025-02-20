import { Button } from "@/components/ui/button";
import { ExportIcon } from "../../../../../../public/icons";
import Header from "@/app/(admin)/components/header";
import { Card, CardContent } from "@/components/ui/card";
import DataTable from "./data-table";

const Customers: React.FC = () => {
  return (
    <Card className="bg-white">
      <CardContent className="p-6">
        <div className="flex justify-between mb-6">
          <Header
            title="Customers"
            subtext="Find all customers and their details."
          />

          <Button
            variant={"outline"}
            className="font-bold text-base w-auto py-4 px-5 flex gap-2 items-center"
            size={"xl"}
          >
            <ExportIcon /> Download
          </Button>
        </div>
        <DataTable />
      </CardContent>
    </Card>
  );
};

export default Customers;
