"use client";

import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

interface IProps {
  title: string;
  subtext?: string;
  showBack?: boolean;
}

const Header: React.FC<IProps> = ({ title, subtext, showBack = false }) => {
  const router = useRouter();
  return (
    <div className="flex items-start" onClick={() => showBack && router.back()}>
      {showBack && (
        <div className="pe-5 cursor-pointer">
          <ChevronLeft />
        </div>
      )}
      <div>
        <h6 className="font-semibold text-lg text-[#111827] mb-1">{title}</h6>
        {subtext && (
          <p className="text-[#687588] font-medium text-sm">{subtext}</p>
        )}
      </div>
    </div>
  );
};

export default Header;
