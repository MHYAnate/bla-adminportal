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
    <div
      className="flex items-start cursor-pointer gap-2"
      onClick={() => showBack && router.back()}
    >
      {showBack && (
        <div className="mt-[2px]">
          <ChevronLeft size={20} />
        </div>
      )}
      <div>
        <h6 className="font-bold text-lg text-[#111827]">{title}</h6>
        {subtext && (
          <p className="text-[#687588] font-medium text-sm mt-1">{subtext}</p>
        )}
      </div>
    </div>
  );
};

export default Header;
