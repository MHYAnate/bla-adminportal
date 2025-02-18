import Header from "@/app/(admin)/components/header";
import { Card, CardContent } from "@/components/ui/card";

const OrderDetails: React.FC = () => {
  return (
    <>
      <Card>
        <CardContent className="p-4 ">
          <div className="flex justify-between items-center mb-6">
            <Header
              title="Order Details"
              subtext="Manage orders"
              showBack={true}
            />
          </div>
        </CardContent>
      </Card>
    </>
  );
};
export default OrderDetails;
