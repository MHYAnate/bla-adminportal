import { Card, CardContent } from "../ui/card";
import { Skeleton } from "../ui/skeleton";
import { Badge } from "../ui/badge";

const SupplierManagementCardSkeleton = () => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between mb-6">
          <Skeleton className="w-[146px] h-[66px] rounded-md" />
          <Skeleton className="w-6 h-6 rounded-full" />
        </div>

        <div className="flex justify-between mb-6 items-start">
          <div className="space-y-2">
            <Skeleton className="w-40 h-6 rounded-md" />
            <div className="flex items-center gap-2">
              <Skeleton className="w-4 h-4 rounded-full" />
              <Skeleton className="w-24 h-4 rounded-md" />
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="w-4 h-4 rounded-full" />
              <Skeleton className="w-24 h-4 rounded-md" />
            </div>
            <Skeleton className="w-32 h-4 rounded-md" />
          </div>

          <Badge
            variant="secondary"
            className="py-1 px-4 font-semibold rounded-[8px]"
          >
            <Skeleton className="w-16 h-4" />
          </Badge>
        </div>

        <div className="flex justify-between items-center">
          <Skeleton className="w-32 h-5 rounded-md" />
        </div>
      </CardContent>
    </Card>
  );
};

export default SupplierManagementCardSkeleton;
