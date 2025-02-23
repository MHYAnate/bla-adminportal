import { IFinancialReportCard } from "@/types";
import { DowngressIcon, ProgressIcon } from "../../../public/icons";
import { Card, CardContent } from "../ui/card";
import SinglePieComponent from "@/app/(admin)/components/single-pie";
interface iProps {
  report: IFinancialReportCard;
}

const FinancialReportCard: React.FC<iProps> = ({ report }) => {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-[2.25rem]">
          <div className="text-[#202224]">
            <p className="mb-[0.875rem] font-medium text-[1rem]">
              {report.title}
            </p>
          </div>
          {/* <span>{report.icon}</span> */}
        </div>
        <div className="flex items-center justify-between">
          <h5 className="font-bold text-[1.5rem]">₦{report.value}</h5>
          <div className="flex-1">
            <SinglePieComponent />
          </div>
        </div>
        <div className="inline-flex gap-3 items-center mt-4">
          {report.isProgressive ? <ProgressIcon /> : <DowngressIcon />}{" "}
          <p className="font-medium text-[1rem] text-[#606060]">
            <span
              className={`${
                report.isProgressive ? "text-[#00B69B]" : "text-[#F93C65]"
              }`}
            >
              {report.count}%{" "}
            </span>
            {report.description}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
export default FinancialReportCard;
