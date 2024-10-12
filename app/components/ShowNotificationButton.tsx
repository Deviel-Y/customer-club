"use client";

import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/react";
import { Notification } from "@prisma/client";
import { AiOutlineNotification } from "react-icons/ai";

interface Props {
  notifications: Notification[];
}

const ShowNotificationButton = ({ notifications }: Props) => {
  if (!notifications) return null;

  return (
    <Dropdown>
      <DropdownTrigger>
        <Button size="lg" color="warning" variant="shadow" isIconOnly>
          <AiOutlineNotification size={25} />
          <span className="absolute top-1 left-1 flex h-3 w-3 ">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-600 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
          </span>
        </Button>
      </DropdownTrigger>

      <DropdownMenu emptyContent="شما پیام جدیدی ندارید" items={notifications}>
        {(notification) => (
          <DropdownItem key={notification.id}>
            {notification.message}
          </DropdownItem>
        )}
      </DropdownMenu>
    </Dropdown>
  );
};

export default ShowNotificationButton;
