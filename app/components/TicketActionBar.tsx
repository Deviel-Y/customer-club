"use client";

import { Autocomplete, AutocompleteItem, Input } from "@nextui-org/react";
import { Category, TicketStatus } from "@prisma/client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ticketActionBarOnchangeHandlers } from "../utils/onChangeHandlers";

interface Props {
  isAdmin?: boolean;
}

const TicketActionBar = ({ isAdmin = true }: Props) => {
  const ticketCategories = Object.values(Category);
  const pathname = usePathname();
  const searchParmas = useSearchParams();
  const router = useRouter();
  const {
    companyBranchOnChangeHandler,
    companyNameOnChangeHandler,
    statusOnChangeHandler,
    categoryOnChangeHandler,
    titleOnChangeHandler,
  } = ticketActionBarOnchangeHandlers(searchParmas, router);

  return (
    <div
      className={`grid ${
        pathname === "/admin/ticket"
          ? "grid-cols-5 max-md:grid-cols-2 max-md:grid-rows-3"
          : "grid-cols-3 max-md:grid-cols-2 max-md:grid-rows-2"
      }  grid-rows-1 w-full gap-x-5 max-sm:gap-x-0 max-sm:grid-cols-1`}
    >
      <Autocomplete
        variant="underlined"
        onSelectionChange={categoryOnChangeHandler}
        label="دسته بندی"
        listboxProps={{ emptyContent: "دسته بندی یافت نشد" }}
      >
        {ticketCategories.map((category) => (
          <AutocompleteItem key={category}>
            {categoryMapping[category].label}
          </AutocompleteItem>
        ))}
      </Autocomplete>

      <Autocomplete
        defaultSelectedKey={searchParmas?.get("statusFilter") || ""}
        listboxProps={{ emptyContent: "نتیجه ای یافت نشد" }}
        onSelectionChange={statusOnChangeHandler}
        variant="underlined"
        label="وضعیت بررسی تیکت"
      >
        {statusFilter.map((status) => (
          <AutocompleteItem key={status.value}>{status.label}</AutocompleteItem>
        ))}
      </Autocomplete>

      {isAdmin && (
        <Input
          defaultValue={searchParmas?.get("organization") || ""}
          onChange={companyNameOnChangeHandler}
          label="سازمان"
          type="search"
          variant="underlined"
        />
      )}

      {isAdmin && (
        <Input
          defaultValue={searchParmas?.get("organizationBranch") || ""}
          onChange={companyBranchOnChangeHandler}
          label="شعبه"
          type="search"
          variant="underlined"
        />
      )}

      <Input
        defaultValue={searchParmas?.get("title") || ""}
        onChange={titleOnChangeHandler}
        label="عنوان"
        type="search"
        variant="underlined"
        className={`${
          pathname === "/admin/ticket"
            ? "col-span-1 max-md:col-span-2 max-sm:col-span-1"
            : "max-md:col-span-2 max-sm:col-span-1"
        }`}
      />
    </div>
  );
};

export default TicketActionBar;

const statusFilter: { label: string; value: TicketStatus | "ALL" }[] = [
  { label: "همه وضعیت ها", value: "ALL" },
  { label: "بسته شده", value: "CLOSED" },
  { label: "در حال بررسی", value: "INVESTIGATING" },
  { label: "جدید", value: "OPEN" },
];

const categoryMapping: Record<Category, { label: string }> = {
  FEATURE_REQUEST: {
    label: "درخواست ویژگی جدید",
  },
  GENERAL_INQUIRY: { label: "سوالات عمومی" },
  PAYMENT: {
    label: "صورتحساب و پردخت ها",
  },
  TECHNICAL_SUPPORT: {
    label: "پشتیبانی فنی",
  },
};
