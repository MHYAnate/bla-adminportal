import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constant/routes";
import Link from "next/link";

interface iProps {
  showLink?: boolean;
}

const Manufacturer: React.FC<iProps> = ({ showLink = false }) => {
  return (
    <AccordionItem value={`item-1`} key={1}>
      <AccordionTrigger className="py-4 px-5 text-sm font-medium text-black-neutral  border border-[#E9EAEC] rounded-[10px]">
        Manufacturer A
      </AccordionTrigger>
      <AccordionContent className="mt-4 text-base font-semibold text-grey-neutral">
        <div className="p-6 bg-white rounded-[1rem]">
          <div className="text-xl font-bold text-[#111827] flex justify-between mb-6 items-center">
            <p>Manufacturer A</p>
            {showLink && (
              <Button
                variant={"warning"}
                className="font-bold text-sm py-4 text-black w-auto px-6"
                size="xl"
                asChild
              >
                <Link href="/admin/inventory-management/hello">
                  View detailed information
                </Link>
              </Button>
            )}
            <Button
              variant={"outline"}
              className="font-bold text-base w-auto py-4 px-5 flex gap-2 items-center"
              size={"xl"}
              asChild
            >
              <Link
                href={`${ROUTES.ADMIN.SIDEBAR.INVEMTORYMANAGEMENT}/set-stock`}
              >
                Set Stock Limits
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="border-[#F1F2F4] border rounded-[10px] py-4 px-6">
              <p className="text-[#111827] font-bold text-sm mb-[10px]">
                Total Products In Stock
              </p>
              <p className="text-[#687588] font-medium text-sm">2000 items</p>
            </div>
            <div className="border-[#F1F2F4] border rounded-[10px] py-4 px-6">
              <p className="text-[#111827] font-bold text-sm mb-[10px]">
                In Stock
              </p>
              <p className="text-[#687588] font-medium text-sm">2000 items</p>
            </div>
            <div className="border-[#F1F2F4] border rounded-[10px] py-4 px-6">
              <p className="text-[#111827] font-bold text-sm mb-[10px]">
                Low Stock
              </p>
              <p className="text-[#687588] font-medium text-sm">2000 items</p>
            </div>
            <div className="border-[#F1F2F4] border rounded-[10px] py-4 px-6">
              <p className="text-[#111827] font-bold text-sm mb-[10px]">
                Total Products
              </p>
              <p className="text-[#687588] font-medium text-sm">2000 items</p>
            </div>
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};

export default Manufacturer;
