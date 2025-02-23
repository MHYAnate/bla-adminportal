import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

const Notifications: React.FC = () => {
  return (
    <div className="flex flex-col gap-6">
      <div className="p-6 border border-[#F1F2F4] flex gap-4 items-center justify-between rounded-[1rem]">
        <div className="flex-1">
          <h6 className="font-semibold text-lg text-[#111827] mb-2.5">
            Order Notification
          </h6>
          <p className="font-medium text-sm text-[#687588]">
            Enable/disable notifications for all order including (pending order,
            delivered order, and canceled order.)
          </p>
        </div>
        <Switch />
      </div>
      <div className="p-6 border border-[#F1F2F4] flex gap-4 items-center justify-between rounded-[1rem]">
        <div className="flex-1">
          <h6 className="font-semibold text-lg text-[#111827] mb-2.5">Chat</h6>
          <p className="font-medium text-sm text-[#687588]">
            Enable/disable notifications for chats
          </p>
        </div>
        <Switch />
      </div>
      <div className="p-6 border border-[#F1F2F4] flex gap-4 items-center justify-between rounded-[1rem]">
        <div className="flex-1">
          <h6 className="font-semibold text-lg text-[#111827] mb-2.5">
            Adminstrator
          </h6>
          <p className="font-medium text-sm text-[#687588]">
            Enable/disable notifications for new admins account creation
          </p>
        </div>
        <Switch />
      </div>
      <div className="p-6 border border-[#F1F2F4] flex gap-4 items-center justify-between rounded-[1rem]">
        <div className="flex-1">
          <h6 className="font-semibold text-lg text-[#111827] mb-2.5">
            Customer
          </h6>
          <p className="font-medium text-sm text-[#687588]">
            Enable/disable notifications for new customers / user creation
          </p>
        </div>
        <Switch />
      </div>
      <div className="p-6 border border-[#F1F2F4] flex gap-4 items-center justify-between rounded-[1rem]">
        <div className="flex-1">
          <h6 className="font-semibold text-lg text-[#111827] mb-2.5">
            Payments
          </h6>
          <p className="font-medium text-sm text-[#687588]">
            Enable/disable notifications for all the payment transactions
          </p>
        </div>
        <Switch />
      </div>
      <div className="mt-6">
        <Button
          variant="warning"
          className="w-auto px-[3rem] py-4 font-bold text-base"
          size="xl"
        >
          Save Changes
        </Button>
      </div>
    </div>
  );
};
export default Notifications;
