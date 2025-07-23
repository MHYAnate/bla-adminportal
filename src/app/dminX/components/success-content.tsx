import { Button } from "@/components/ui/button";
import { SuccessIcon } from "../../../../public/icons";
interface iProps {
  handleClick?: () => void;
  title: string;
  description: string;
}

const SuccessContent: React.FC<iProps> = ({
  handleClick,
  title,
  description,
}) => {
  return (
    <div>
      <div className="mb-6 flex items-center justify-center">
        <SuccessIcon />
      </div>
      <h5 className="mb-[5px] text-center text-[#16151C] font-bold text-[1.5rem]">
        {title}
      </h5>
      <p className="font-medium text-base text-[#A2A1A8] mb-6 text-center">
        {description}
      </p>
      <div className="gap-4 justify-center flex">
        <Button
          variant="warning"
          className="w-auto px-[3rem] py-3.5 font-bold text-base"
          size="xl"
          onClick={handleClick}
        >
          Okay
        </Button>
      </div>
    </div>
  );
};
export default SuccessContent;
