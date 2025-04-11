import { IOrderCard } from "@/types";
import { Card, CardContent } from "../ui/card";
interface iProps {
  report: IOrderCard;
}

const OrderCard: React.FC<iProps> = ({ report }) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="font-dmsans flex justify-between items-center">
          <div className="text-[#030C0A] font-medium">
            <p className="mb-[0.875rem] font-medium text-[1rem]">
              {report.title}
            </p>
            <h5 className="font-medium text-[1.5rem] text-[#6A7186]">
              {report.value}
            </h5>
          </div>
          <span>{report.icon}</span>
        </div>
      </CardContent>
    </Card>
  );
};
export default OrderCard;
