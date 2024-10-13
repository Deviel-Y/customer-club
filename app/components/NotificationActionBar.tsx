"use client";

import { Autocomplete, AutocompleteItem, Input } from "@nextui-org/react";
import { NotificationType, Section } from "@prisma/client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { notificationActionBarOnchangeHandlers } from "../utils/onChangeHandlers";

interface Props {
  isAdmin?: boolean;
}

const NotificationActionBar = ({ isAdmin = true }: Props) => {
  const notificationType = Object.values(NotificationType);
  const sections = Object.values(Section);

  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const {
    companyBranchOnChange,
    companyNameOnChange,
    contentOnChange,
    isReadOnChange,
    sectionOnChange,
    typeOnChange,
  } = notificationActionBarOnchangeHandlers(searchParams, router);

  return (
    <div className=" flex flex-row max-sm:flex-col gap-5 max-sm:gap-0 max-sm:mt-5 w-full place-content-center place-items-center">
      <div
        className={`grid ${
          pathname === "/admin/notification" ? "grid-cols-6" : "grid-cols-4"
        }  grid-rows-1 w-full gap-5 max-sm:gap-0 mb-5 max-sm:grid-cols-1`}
      >
        <Autocomplete
          defaultSelectedKey={searchParams.get("type") || ""}
          onSelectionChange={typeOnChange}
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
          defaultSelectedKey={searchParams.get("section") || ""}
          onSelectionChange={sectionOnChange}
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

        {isAdmin && (
          <Input
            defaultValue={searchParams.get("companyName") || ""}
            onChange={companyNameOnChange}
            label="سازمان"
            type="search"
            variant="underlined"
          />
        )}

        {isAdmin && (
          <Input
            defaultValue={searchParams.get("companyBranch") || ""}
            onChange={companyBranchOnChange}
            label="شعبه"
            type="search"
            variant="underlined"
          />
        )}

        <Input
          defaultValue={searchParams.get("content") || ""}
          onChange={contentOnChange}
          label="متن اعلان"
          type="search"
          variant="underlined"
        />

        <Autocomplete
          defaultSelectedKey={searchParams.get("isRead") || ""}
          onSelectionChange={isReadOnChange}
          listboxProps={{ emptyContent: "وضعیت مورد نظر یافت نشد" }}
          variant="underlined"
          label="وضعیت خوانده شده"
        >
          <AutocompleteItem key="true">خوانده شده</AutocompleteItem>

          <AutocompleteItem key="false">خوانده نشده</AutocompleteItem>
        </Autocomplete>
      </div>
    </div>
  );
};

export default NotificationActionBar;

const typeMapping: Record<NotificationType | Section, { label: string }> = {
  INFO: { label: "اطلاع رسانی" },
  WARNING: { label: "هشدار" },

  INVOICE: { label: "فاکتور" },
  POR_INVOICE: { label: "پیش فاکتور" },
  TICKET: { label: "تیکت" },
  TICKET_MESSAGE: { label: "پاسخ به تیکت" },
};
