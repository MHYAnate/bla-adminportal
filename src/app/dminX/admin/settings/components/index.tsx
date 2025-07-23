"use client";

import Header from "@/app/(admin)/components/header";
import { Card, CardContent } from "@/components/ui/card";
import { useHandlePush } from "@/hooks/use-handle-push";
import { useSearchParams } from "next/navigation";
import {
  NotificationIcon,
  PadlockIcon,
  SettingsIcon,
} from "../../../../../../public/icons";
import { ROUTES } from "@/constant/routes";
import SettingsGeneral from "./general";
import Security from "./security";
import Notifications from "./notifications";

const Settings: React.FC = () => {
  const param = useSearchParams();
  const tabber = param.get("tab") || "general";
  const { handlePush } = useHandlePush();
  const settingsList = [
    {
      id: 1,
      title: "General",
      icon: <SettingsIcon />,
      value: "general",
    },
    {
      id: 2,
      title: "Password",
      icon: <PadlockIcon />,
      value: "password",
    },
    {
      id: 3,
      title: "Notifications",
      icon: <NotificationIcon />,
      value: "notifications",
    },
  ];

  const renderItem = () => {
    switch (tabber) {
      case "general":
        return <SettingsGeneral />;
      case "password":
        return <Security />;
      case "notifications":
        return <Notifications />;
      default:
        return <SettingsGeneral />;
    }
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <Header title="Setting" subtext="Admin account settings" />
      </div>
      <div className="flex gap-6">
        <div>
          <Card className="bg-white w-[300px]">
            <CardContent className="p-6 flex flex-col gap-4">
              {settingsList.map((_, index) => (
                <div
                  className={`py-4 ${
                    tabber === _.value ? "bg-[#F8F8F8] px-4 rounded-[10px]" : ""
                  } flex gap-2.5 cursor-pointer`}
                  key={index}
                  onClick={() =>
                    handlePush(
                      `${ROUTES.ADMIN.SIDEBAR.SETTINGS}?tab=${_.value}`
                    )
                  }
                >
                  <span
                    className={`${
                      tabber === _.value ? "text-[#FFBF3B]" : "text-[#A0AEC0]"
                    }`}
                  >
                    {_.icon}
                  </span>
                  <h6 className="text-sm text-[#111827] font-bold">
                    {_.title}
                  </h6>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
        <Card className="flex-1">
          <CardContent className="p-6 nbg-white">{renderItem()}</CardContent>
        </Card>
      </div>
    </>
  );
};

export default Settings;
