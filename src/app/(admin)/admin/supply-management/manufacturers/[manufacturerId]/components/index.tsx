import Header from "@/app/(admin)/components/header";
import { Card, CardContent } from "@/components/ui/card";
import SupplierManagementCard from "@/components/widgets/supplier-management";
import DataTable from "./datatable";

const ManufacturerDetails: React.FC = () => {
  const item = {
    isActive: true,
    url: "/images/bladmin-login.jpg",
    total: "6,700",
    status: "Verified",
    name: "Mutiu",
    email: "mutiu@gmail.com",
    location: "Lagos, Nigeria",
    id: "1122-5",
    phonenumber: "+2349011223321",
  };
  return (
    <div>
      <Card>
        <CardContent className="p-4 ">
          <div className="flex justify-between items-center mb-6">
            <Header title="Vendors" subtext="Manage Vendors" showBack={true} />
          </div>
          <div className="mb-6">
            <SupplierManagementCard item={item} />
          </div>
          <DataTable />
        </CardContent>
      </Card>
    </div>
  );
};

export default ManufacturerDetails;
