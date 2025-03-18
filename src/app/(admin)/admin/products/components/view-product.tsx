import { Button } from "@/components/ui/button";
import Image from "next/image";

interface iProps {
  setClose: () => void;
}

const ViewProduct: React.FC<iProps> = ({ setClose }) => {
  return (
    <div className="flex flex-col">
      <div className="flex justify-between items-center mb-auto">
        <div>
          <div className="flex gap-1 items-center mb-[26px]">
            <p className="font-normal text-sm text-[#667085]">Product ID:</p>
            <p className="font-semibold text-sm text-[#111827]">#1122112</p>
          </div>
          <div className="flex gap-1 items-center mb-[26px]">
            <p className="font-normal text-sm text-[#667085]">Product Name:</p>
            <p className="font-semibold text-sm text-[#111827]">
              Nescafe Classic Coffee
            </p>
          </div>
          <div className="flex gap-1 items-center mb-[26px]">
            <p className="font-normal text-sm text-[#667085]">Product Price:</p>
            <p className="font-semibold text-sm text-[#111827]">NGN580</p>
          </div>
          <div className="flex gap-1 items-center mb-[26px]">
            <p className="font-normal text-sm text-[#667085]">Quantity:</p>
            <p className="font-semibold text-sm text-[#111827]">120</p>
          </div>
          <div className="flex gap-1 items-center mb-[26px]">
            <p className="font-normal text-sm text-[#667085]">Category:</p>
            <p className="font-semibold text-sm text-[#111827]">Coffee</p>
          </div>
          <div className="flex gap-1 items-center mb-[26px]">
            <p className="font-normal text-sm text-[#667085]">
              Product Status:
            </p>
            <p className="font-semibold text-sm text-[#111827]">In Stock</p>
          </div>
        </div>
        <div>
          <Image
            width={274}
            height={274}
            alt="Product image"
            src="/images/bladmin-login.jpg"
            className="w-[274px] h-[274px] rounded-full"
          />
        </div>
      </div>
      <div className="gap-5 justify-end flex">
        <Button
          variant="warning"
          className="w-auto px-[3rem] py-4 font-bold text-base"
          size="xl"
          onClick={(e) => {
            e.preventDefault();
            setClose();
          }}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default ViewProduct;
