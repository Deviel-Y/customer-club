"use client";

import userPlaceholder from "@/public/user-profile-placeholder.jpg";
import {
  Avatar,
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@nextui-org/react";
import { Notification, User } from "@prisma/client";
import { Session } from "next-auth";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { getHeadingLabel } from "../utils/getHeadingLabel";
import ShowNotificationButton from "./ShowNotificationButton";

interface Props {
  notifications: Notification[];
  unReadNotificationCount: number;
  authenticatedUser: User;
  session: Session;
}

const Navbar = ({
  notifications,
  unReadNotificationCount,
  authenticatedUser,
  session,
}: Props) => {
  const router = useRouter();
  const path = usePathname();
  const heading = getHeadingLabel(path);

  const [isOpen, setIsOpen] = useState(false);

  if (!session) return null;

  return (
    <div className="flex flex-row justify-between items-center px-5 py-2">
      <h1 className="text-[40px] max-md:text-[30px] max-sm:text-[23px]">
        {heading}
      </h1>

      <div className="flex flex-row gap-5 justify-center items-center">
        <ShowNotificationButton
          unReadNotificationCount={unReadNotificationCount}
          notifications={notifications}
        />

        <Popover size="lg" isOpen={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger>
            <Avatar
              src={session?.user?.image || userPlaceholder?.src}
              alt="Profile Avater"
              fallback="?"
              size="lg"
              color="primary"
              className="cursor-pointer transition-all hover:scale-105"
            />
          </PopoverTrigger>

          <PopoverContent>
            <div className="flex flex-col gap-5 p-1">
              <div className="flex flex-col">
                <p className="text-gray-600">{authenticatedUser?.email}</p>
                <p className="text-lg">
                  {authenticatedUser?.role === "ADMIN"
                    ? authenticatedUser?.adminName
                    : authenticatedUser?.companyName}
                </p>
                <p className="-translate-y-1 text-gray-500">
                  {authenticatedUser?.role === "ADMIN"
                    ? "ادمین"
                    : authenticatedUser.role === "SUPER_ADMIN"
                    ? "سوپر ادمین"
                    : authenticatedUser?.companyBranch}
                </p>
              </div>

              <div className="flex flex-col gap-2">
                <Button
                  onPress={() => {
                    setIsOpen(false);

                    router.push(
                      authenticatedUser?.role === "ADMIN"
                        ? `/admin/editProfile/${authenticatedUser.id}`
                        : `/editUserInfo//${authenticatedUser?.id}`
                    );
                  }}
                  color="primary"
                >
                  ویرایش اطلاعات کاربر
                </Button>

                {session.user.role === "SUPER_ADMIN" && (
                  <Button onPress={() => router.push("/admin/logs")}>
                    ریز گزارشات
                  </Button>
                )}
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default Navbar;
