import Image from "next/image";
import { Card, CardContent } from "../ui/card";
interface iProps {
  onClick: () => void;
}

const FeedbackCard: React.FC<iProps> = ({ onClick }) => {
  return (
    <Card className="border-0" onClick={onClick}>
      <CardContent className="p-10">
        <div className="flex gap-4 items-center mb-10">
          <div>
            <Image
              width={100}
              height={100}
              alt="Customer avatar"
              src="/images/bladmin-login.jpg"
              className="w-[100px] h-[100px] rounded-full"
            />
          </div>
          <div>
            <h6 className="text-[#111827] font-bold text-xl mb-[10px]">
              Mirabel Okon
            </h6>
            <p className="text-sm text-[#687588] mb-2">Business Owner</p>
          </div>
        </div>
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-[#111827] font-semibold">Feedback Type</p>
          <p className="text-sm text-[#687588] ">Service Rating</p>
        </div>
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-[#111827] font-semibold">Feedback ID</p>
          <p className="text-sm text-[#687588] ">#123456</p>
        </div>
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-[#111827] font-semibold">Date Submitted</p>
          <p className="text-sm text-[#687588] ">March 12, 2025, at 2:30 PM</p>
        </div>
        <div>
          <p className="text-sm text-[#111827] font-semibold mb-4">
            Feedback Message
          </p>
          <p className="text-sm text-[#687588]">
            Great product quality! However, I had issues with the packaging.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default FeedbackCard;
