"use client";

import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/react";
import { Notification, Section } from "@prisma/client";
import moment from "moment-jalaali";
import { useSession } from "next-auth/react";
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
  const { data: session } = useSession();
  if (!notifications) return null;

  return (
    <Dropdown>
      <DropdownTrigger>
        <Button color="default" variant="shadow" isIconOnly>
          <AiOutlineNotification size={20} />
          <span className="absolute top-[2px] left-[2px] flex h-3 w-3 ">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-600 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
          </span>
        </Button>
      </DropdownTrigger>

      <DropdownMenu emptyContent="شما پیام جدیدی ندارید" items={notifications}>
        {(notification) => (
          <DropdownItem
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
            key={notification.id}
          >
            {dropdownItemMapping[notification.assignedToSection].label}
          </DropdownItem>
        )}
      </DropdownMenu>
    </Dropdown>
  );
};

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
        className="stroke-[1.3px] bg-slate-300  rounded-lg me-1 w-10"
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
        className="stroke-[1.3px] bg-slate-300  rounded-lg me-1 w-10"
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
        className="stroke-[1.3px] bg-slate-300  rounded-lg me-1 w-10"
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
        className="stroke-[1.3px] bg-slate-300  rounded-lg me-1 w-10"
      />
    ),
  },
};

export default ShowNotificationButton;
