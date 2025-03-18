import Header from "@/app/(admin)/components/header";
import {
  ExportIcon,
  InventoryInstockIcon,
  InventoryOutstockIcon,
  InventoryTotalIcon,
} from "../../../../../../public/icons";
import { Button } from "@/components/ui/button";
import { IOrderCard } from "@/types";
import OrderCard from "@/components/widgets/order";
import { StackBarComponent } from "./stack-bar";
import { HorizontalBarComponent } from "./horizontal-bar";
import Manufacturer from "../shared/manufacturer";
import { Accordion } from "@/components/ui/accordion";

const InventoryManagement: React.FC = () => {
  const orderlist = [
    {
      value: "405,689",
      icon: <InventoryTotalIcon />,
      title: "Total Product",
    },
    {
      value: "22",
      icon: <InventoryInstockIcon />,
      title: "In Stock Product(s)",
    },
    {
      value: 293,
      icon: <InventoryOutstockIcon />,
      title: "Out of Stock Product(s)",
    },
  ];
  return (
    <>
      <div className="flex justify-between items-center mb-8">
        <Header title="Inventory" subtext="Total of 5000 items" />
        <div className="flex gap-5">
          <Button
            variant={"outline"}
            className="font-bold text-base w-auto py-4 px-5 flex gap-2 items-center"
            size={"xl"}
          >
            <ExportIcon /> Download
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4 mb-6">
        {orderlist.map((report: IOrderCard, index) => (
          <OrderCard report={report} key={index} />
        ))}
      </div>
      <div className="flex gap-4 mb-6">
        <StackBarComponent />
        <HorizontalBarComponent />
      </div>
      <Accordion
        type="single"
        collapsible
        className="flex w-full flex-col gap-6"
      >
        {/* {accordionList.map((accordion, index: number) => ( */}
        <Manufacturer showLink={true} />
        {/* ))} */}
      </Accordion>
    </>
  );
};

export default InventoryManagement;
