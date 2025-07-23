import { Accordion } from "@/components/ui/accordion";
import Manufacturer from "../../shared/manufacturer";
import DataTable from "./data-table";

const InventoryManufacturer: React.FC = () => {
  return (
    <>
      <div className="mb-6">
        <Accordion
          type="single"
          collapsible
          className="flex w-full flex-col gap-6"
        >
          <Manufacturer />
        </Accordion>
      </div>
      <DataTable />
    </>
  );
};

export default InventoryManufacturer;
