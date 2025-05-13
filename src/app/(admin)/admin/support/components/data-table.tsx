"use client";

import { Badge } from "@/components/ui/badge";
import { FeedbackData } from "@/types";
import Image from "next/image";
import { useState } from "react";
import { TableComponent } from "@/components/custom-table";
import { FeedBackTableComponent } from "@/components/custom-table/feedBackIndex";
import { SelectFilter } from "@/app/(admin)/components/select-filter";
import { DeleteIcon, ViewIcon } from "../../../../../../public/icons";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ChevronLeft } from "lucide-react";
import ViewFeedback from "./view-feedback";
import DeleteContent from "@/app/(admin)/components/delete-content";

interface iProps {}

const DataTable: React.FC<iProps> = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [currentTab, setCurrentTab] = useState<string>("view");
  const pageSize = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [role, setRole] = useState<string>("");
  const onPageChange = (page: number) => {
    setCurrentPage(page);
  };

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

  const tableData: FeedbackData[] = [
    {
      id: 1,
      customerName: "Rice",
      customerType: "Business Owner",
      feedbackId: "#123",
      dateSubmitted: "11/03/2025",
      status: "Resolved",
    },
    {
      id: 2,
      customerName: "Rice",
      customerType: "Individual",
      feedbackId: "#123",
      dateSubmitted: "11/03/2025",
      status: "In-review",
    },
    {
      id: 3,
      customerName: "Rice",
      customerType: "Business Owner",
      feedbackId: "#123",
      dateSubmitted: "11/03/2025",
      status: "Resolved",
    },
  ];

  const cellRenderers = {
    customerName: (item: FeedbackData) => (
      <div className="font-medium flex items-center gap-3">
        <Image
          src="/images/user-avatar.png"
          width={36}
          height={36}
          alt="Admin avatar"
          className="w-9 h-9 rounded-full"
        />
        <div>
          <p> {item.customerName}</p>
        </div>
      </div>
    ),
    customerType: (item: FeedbackData) => (
      <div className="font-medium">{item.customerType}</div>
    ),
    feedbackId: (item: FeedbackData) => (
      <span className="font-medium">{item.feedbackId}</span>
    ),
    dateSubmitted: (item: FeedbackData) => (
      <div className="font-medium">{item.dateSubmitted}</div>
    ),
    status: (item: FeedbackData) => (
      <Badge
        variant={
          item.status.toLowerCase() === "resolved" ? "success" : "tertiary"
        }
        className="py-1 px-[26px] font-semibold"
      >
        {item.status.toUpperCase()}
      </Badge>
    ),
    action: (item: FeedbackData) => (
      <div className="flex gap-2.5">
        <div
          className="bg-[#27A376] p-2.5 rounded-lg"
          onClick={() => {
            setCurrentTab("view");
            setIsOpen(true);
          }}
        >
          <ViewIcon />
        </div>
        <div
          className="bg-[#E03137] p-2.5 rounded-lg"
          onClick={() => {
            setCurrentTab("delete");
            setIsOpen(true);
          }}
        >
          <DeleteIcon />
        </div>
      </div>
    ),
  };

  const columnOrder: (keyof FeedbackData)[] = [
    "customerName",
    "customerType",
    "feedbackId",
    "dateSubmitted",
    "status",
    "action",
  ];

  const columnLabels = {
    status: " Status",
    customerName: "Customer Name",
    customerType: "Customer Type",
    feedbackId: "Feedback Id",
    action: "",
    dateSubmitted: "Date Submitted",
  };

  return (
    <>
      <div className="flex items-center gap-4 mb-6 justify-between">
        <h6 className="font-semibold text-lg text-[#111827]">Feedback Table</h6>

        <SelectFilter
          setFilter={setRole}
          placeholder="Select Role"
          list={roleList}
        />
      </div>
      <FeedBackTableComponent<FeedbackData>
        tableData={tableData}
        currentPage={currentPage}
        onPageChange={onPageChange}
        totalPages={Math.ceil(tableData.length / pageSize)}
        cellRenderers={cellRenderers}
        columnOrder={columnOrder}
        columnLabels={columnLabels}
      />
      <Dialog open={isOpen} onOpenChange={() => setIsOpen(!open)}>
        <DialogContent
          className={`${
            currentTab === "delete"
              ? "max-w-[33.75rem] left-[50%] translate-x-[-50%]"
              : "right-0 p-8 max-w-[40.56rem] h-screen overflow-y-scroll"
          }`}
        >
          {currentTab === "view" && (
            <DialogHeader>
              <DialogTitle className="mb-6 text-2xl font-bold text-[#111827] flex gap-[18px] items-center">
                <div
                  onClick={() => setIsOpen(false)}
                  className="cursor-pointer"
                >
                  <ChevronLeft size={24} />
                </div>
                <div>
                  <h5 className="font-bold text-2xl text-[#111827] mb-2">
                    Support Details
                  </h5>
                  <p className="font-medium text-sm text-[#98A2B3]">
                    Review and take action on customer support.
                  </p>
                </div>
              </DialogTitle>
            </DialogHeader>
          )}
          {currentTab === "view" ? (
            <ViewFeedback setClose={() => setIsOpen(false)} />
          ) : (
            <DeleteContent
              handleClose={() => setIsOpen(false)}
              title="Feedback"
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DataTable;
