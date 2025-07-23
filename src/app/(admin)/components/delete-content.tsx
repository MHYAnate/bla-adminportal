import { Button } from "@/components/ui/button";
import { CautionIcon } from "../../../../public/icons";
interface iProps {
  handleClose: () => void;
  handleClick?: () => void;
  title: string;
  isLoading:any
}

const DeleteContent: React.FC<iProps> = ({
  handleClose,
  handleClick,
  title,
  isLoading
}) => {
  return (
    <div>
      <div className="mb-6 flex items-center justify-center">
        <CautionIcon />
      </div>
      <h5 className="mb-[5px] text-center text-[#16151C] font-bold text-[1.5rem]">
        Are you sure you want to delete this {title}
      </h5>
      <p className="font-medium text-base text-[#A2A1A8] mb-6 text-center">
        This action is irreversible and will permanently remove all associated
        data.
      </p>
      <div className="gap-4 justify-center flex mx-10">
        <Button
          variant="outline"
          className="w-full py-3.5 px-[3rem] font-bold text-base"
          size="xl"
          onClick={handleClose}
          disabled={isLoading}
        >
          No
        </Button>
        <Button
          variant="warning"
          className="w-full px-[3rem] py-3.5 font-bold text-base"
          size="xl"
          onClick={handleClick}
          disabled={isLoading}
        >
          {isLoading?"loading...":"Yes"}
       
        </Button>
      </div>
    </div>
  );
};
export default DeleteContent;
