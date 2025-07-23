"use client";

import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { ChevronDown } from "lucide-react";
import { ChatIcon, EmailIcon } from "../../../../public/icons";
import { Input } from "@/components/ui/input";
import { ChangeEvent, useState } from "react";
import { useSearchParams, usePathname} from "next/navigation";


const Navbar: React.FC = () => {
  const [query, setQuery] = useState<string>("");
  const searchParams = useSearchParams();
  const path = usePathname();
 


  const signature = searchParams.get('signature') ?? '';
  return (
    (path === "/admin/register"?<></>:
    <section
      className={cn(
        "flex items-center justify-between border-b border-[#E9EAEC] px-8 py-6 sticky top-0 z-10 bg-white"
      )}
    >
      <div className={``}>
        <Input
          placeholder="Search anything…"
          onChange={async (event: ChangeEvent<HTMLInputElement>) =>
            setQuery(event.target.value)
          }
          className="h-12 w-[180%] ps-12"
          type="search"
        />
      </div>
      <div className={cn("flex items-center gap-6")}>
        <div className="relative w-6 h-6 flex items-center justify-center">
          <EmailIcon />
          <div className="w-2 h-2 rounded-full bg-[#E03137] absolute top-[-0.5px] right-[-2px] border border-white"></div>
        </div>
        <div className="relative w-6 h-6 flex items-center justify-center">
          <ChatIcon />
          <div className="w-2 h-2 rounded-full bg-[#E03137] absolute top-[-2px] right-[-1px] border border-white"></div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center gap-2"
              size="xl"
            >
              <Image
                src="/images/user-avatar.jpg"
                height={32}
                width={32}
                alt="User avatar"
                className="h-8 w-8 rounded-full"
              />
              <ChevronDown className="ml-auto text-[#111827]" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>View payment details</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </section>)
  );
};

export default Navbar;
