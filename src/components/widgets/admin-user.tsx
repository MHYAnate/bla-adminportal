import Image from "next/image";
import { Card, CardContent } from "../ui/card";

interface iProps {
  count: number;
  rolename: string;
  total: number;
}
const AdminUsersCard: React.FC<iProps> = ({ count, rolename, total }) => {
  return (
    <Card className="w-full">
      <CardContent className="py-4 px-6">
        <p className="font-bold text-base text-[#111827] mb-6">
          {count} Active
        </p>
        <div className="flex items-center justify-between mb-6">
          <div className="flex gap-2 items-center">
            <div className="flex">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className={index !== 0 ? `-ml-2` : ""}>
                  <Image
                    height={32}
                    width={32}
                    alt="Admin user avatar"
                    src="/images/bladmin-login.jpg"
                    className="rounded-full w-8 h-8"
                  />
                </div>
              ))}
            </div>
          </div>
          <p className="font-dmsans font-normal text-[#676767] text-xs">
            {total} members
          </p>
        </div>
        <p className="font-dmsans font-semibold text-[#030C0A] text-sm">
          {rolename}
        </p>
      </CardContent>
    </Card>
  );
};

export default AdminUsersCard;
