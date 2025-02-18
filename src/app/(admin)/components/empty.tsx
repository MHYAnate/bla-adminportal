import { Button } from "@/components/ui/button";
import { StoreManagementIcon } from "../../../../public/icons";
interface IProps {
  header: string;
  btnText: string;
  description: string;
}

const EmptyState: React.FC<IProps> = ({ header, description, btnText }) => {
  return (
    <div className="h-[50vh] flex justify-center items-center">
      <div className="max-w-[524px]">
        <div className="flex justify-center">
          <StoreManagementIcon />
        </div>
        <h4 className="text-[#111827] text-2xl font-bold mb-2 mt-4 text-center">
          {header}
        </h4>
        <p className="text-[#687588] font-medium text-sm mb-[52px] text-center">
          {description}
        </p>
        <Button
          variant={"warning"}
          className="font-bold text-sm py-4"
          size="xl"
        >
          {btnText}
        </Button>
      </div>
    </div>
  );
};

export default EmptyState;
