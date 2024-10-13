"use client";

import { Autocomplete, AutocompleteItem, Input } from "@nextui-org/react";
import { NotificationType, Section, TicketStatus } from "@prisma/client";
import { usePathname } from "next/navigation";
import NewTicketPopoverButton from "../(userSide)/ticket/NewTicketPopoverButton";

interface Props {
  isAdmin?: boolean;
}

const NotificationActionBar = ({ isAdmin = true }: Props) => {
  const notificationType = Object.values(NotificationType);
  const sections = Object.values(Section);

  const pathname = usePathname();

  return (
    <div className=" flex flex-row max-sm:flex-col gap-5 max-sm:gap-0 max-sm:mt-5 w-full place-content-center place-items-center">
      {!isAdmin && <NewTicketPopoverButton />}

      <div
        className={`grid ${
          pathname === "/admin/notification" ? "grid-cols-6" : "grid-cols-5"
        }  grid-rows-1 w-full gap-5 max-sm:gap-0 mb-5 max-sm:grid-cols-1`}
      >
        <Autocomplete
          variant="underlined"
          label="نوع اعلان"
          listboxProps={{ emptyContent: "نوع مورد نظر یافت نشد" }}
        >
          {notificationType.map((type) => (
            <AutocompleteItem key={type}>
              {typeMapping[type].label}
            </AutocompleteItem>
          ))}
        </Autocomplete>

        <Autocomplete
          variant="underlined"
          label="مربوط به بخش"
          listboxProps={{ emptyContent: "بخش مورد نظر یافت نشد" }}
        >
          {sections.map((section) => (
            <AutocompleteItem key={section}>
              {typeMapping[section].label}
            </AutocompleteItem>
          ))}
        </Autocomplete>

        {isAdmin && <Input label="سازمان" type="search" variant="underlined" />}

        {isAdmin && <Input label="شعبه" type="search" variant="underlined" />}

        <Input label="متن اعلان" type="search" variant="underlined" />

        <Autocomplete
          listboxProps={{ emptyContent: "وضعیت مورد نظر یافت نشد" }}
          variant="underlined"
          label="وضعیت خوانده شده"
        >
          <AutocompleteItem key="true">خونده شده</AutocompleteItem>

          <AutocompleteItem key="false">خوانده نشده</AutocompleteItem>
        </Autocomplete>
      </div>
    </div>
  );
};

export default NotificationActionBar;

const statusFilter: { label: string; value: TicketStatus | "ALL" }[] = [
  { label: "همه وضعیت ها", value: "ALL" },
  { label: "بسته شده", value: "CLOSED" },
  { label: "در حال بررسی", value: "INVESTIGATING" },
  { label: "جدید", value: "OPEN" },
];

const typeMapping: Record<
  NotificationType | Section | "true" | "false",
  { label: string }
> = {
  INFO: { label: "اطلاع رسانی" },
  WARNING: { label: "هشدار" },

  INVOICE: { label: "فاکتور" },
  POR_INVOICE: { label: "پیش فاکتور" },
  TICKET: { label: "تیکت" },
  TICKET_MESSAGE: { label: "پاسخ به تیکت" },

  true: { label: "خوانده شده" },
  false: { label: "خوانده نشده" },
};
