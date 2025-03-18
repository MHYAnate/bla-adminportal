"use client";

import Header from "@/app/(admin)/components/header";
import { InputFilter } from "@/app/(admin)/components/input-filter";
import { SelectFilter } from "@/app/(admin)/components/select-filter";
import { Card, CardContent } from "@/components/ui/card";
import FeedbackCard from "@/components/widgets/feeedback";
import { useState } from "react";
import ViewSupport from "./support-details";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ChevronLeft } from "lucide-react";
import { FeedbackBarComponent } from "./feedback-chart";

const Feedbacks: React.FC = () => {
  const [role, setRole] = useState<string>("");
  const [filter, setFilter] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const roleList = [
    {
      text: "Admin",
      value: "admin",
    },
    {
      text: "Super Admin",
      value: "super-admin",
    },
  ];

  return (
    <>
      <Card className="bg-white">
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-6">
            <Header
              title="Customer Feedback Center"
              subtext="View and manage customer feedback to improve service and address concerns effectively."
            />
          </div>
          <FeedbackBarComponent />
          <div className="flex items-center gap-4 my-6">
            <InputFilter setQuery={setFilter} placeholder="Search customers" />

            <SelectFilter
              setFilter={setRole}
              placeholder="Select Role"
              list={roleList}
            />
          </div>
          <div className="grid grid-cols-2 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <FeedbackCard key={index} onClick={() => setIsOpen(true)} />
            ))}
          </div>
        </CardContent>
      </Card>
      <Dialog open={isOpen} onOpenChange={() => setIsOpen(!open)}>
        <DialogContent
          className={`${"right-0 p-8 max-w-[40.56rem] h-screen overflow-y-scroll"}`}
        >
          <DialogHeader>
            <DialogTitle className="mb-6 text-2xl font-bold text-[#111827] flex gap-[18px] items-center">
              <div onClick={() => setIsOpen(false)} className="cursor-pointer">
                <ChevronLeft size={24} />
              </div>
              <div>
                <h5 className="font-bold text-2xl text-[#111827] mb-2">
                  Feedback Details
                </h5>
              </div>
            </DialogTitle>
          </DialogHeader>

          <ViewSupport setClose={setIsOpen} />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Feedbacks;
