"use client";

import {
  Badge,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/react";
import { Notification, Section } from "@prisma/client";
import moment from "moment-jalaali";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { AiOutlineNotification } from "react-icons/ai";
import {
  HiOutlineNewspaper,
  HiOutlineShoppingBag,
  HiOutlineTicket,
} from "react-icons/hi";

interface Props {
  notifications: Notification[];
}

const ShowNotificationButton = ({ notifications }: Props) => {
  const router = useRouter();
  const { data: session } = useSession();

  if (!notifications) return null;

  return (
    <Dropdown type="listbox">
      <DropdownTrigger>
        <Button
          color="warning"
          variant="shadow"
          className="stroke-[1.2px]"
          isIconOnly
        >
          <Badge
            size="sm"
            className="animate-pulse z-50 -translate-y-2"
            content={notifications.length}
            color="danger"
          >
            <AiOutlineNotification size={20} />
          </Badge>
        </Button>
      </DropdownTrigger>

      <DropdownMenu
        topContent={
          <div className="flex flex-row justify-start mb-4 items-center w-full">
            <p className="text-lg">اعلان های اخیر</p>
          </div>
        }
        bottomContent={
          <div className="flex flex-row justify-center items-center mt-4 w-full">
            <Button
              onPress={() =>
                router.push(
                  `${
                    session?.user.role === "ADMIN"
                      ? "/admin/notification"
                      : "/notification"
                  }`
                )
              }
              variant="light"
              className="w-full"
              size="sm"
            >
              همه اعلان ها
            </Button>
          </div>
        }
        aria-label="Notification Menu"
        emptyContent="شما پیام جدیدی ندارید"
      >
        {notifications.map((notification) => (
          <DropdownItem
            className="my-1"
            key={notification.id}
            href={
              session?.user.role === "USER"
                ? dropdownItemMapping[notification.assignedToSection].userHref
                : dropdownItemMapping[notification.assignedToSection].adminHref
            }
            endContent={moment(notification.createdAt).format("jYYYY/jM/jD")}
            startContent={
              dropdownItemMapping[notification.assignedToSection].icon
            }
            description={notification.message}
          >
            {dropdownItemMapping[notification.assignedToSection].label}
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
};

export default ShowNotificationButton;

const dropdownItemMapping: Record<
  Section,
  { label: string; userHref: string; adminHref: string; icon: JSX.Element }
> = {
  INVOICE: {
    label: "فاکتور جدید",
    userHref: "/invoice",
    adminHref: "/admin/invoice-issuing",
    icon: (
      <HiOutlineNewspaper
        size={35}
        fill="lightgrey"
        className="stroke-[1.3px] bg-slate-200  rounded-lg me-1 w-10"
      />
    ),
  },

  POR_INVOICE: {
    label: "پیش فاکتور جدید",
    userHref: "/porformaInvoice",
    adminHref: "/admin/invoice-issuing",
    icon: (
      <HiOutlineShoppingBag
        size={35}
        fill="lightgrey"
        className="stroke-[1.3px] bg-slate-200  rounded-lg me-1 w-10"
      />
    ),
  },

  TICKET_MESSAGE: {
    label: "تیکت جدید",
    userHref: "/ticket",
    adminHref: "/admin/ticket",
    icon: (
      <HiOutlineTicket
        size={35}
        fill="lightgrey"
        className="stroke-[1.3px] bg-slate-200  rounded-lg me-1 w-10"
      />
    ),
  },

  TICKET: {
    label: "تیکت جدید",
    userHref: "/ticket",
    adminHref: "/admin/ticket",
    icon: (
      <HiOutlineTicket
        size={35}
        fill="lightgrey"
        className="stroke-[1.3px] bg-slate-200  rounded-lg me-1 w-10"
      />
    ),
  },
};
