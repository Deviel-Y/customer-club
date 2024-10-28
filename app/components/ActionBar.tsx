"use client";

import { Autocomplete, AutocompleteItem, Input } from "@nextui-org/react";
import { Status } from "@prisma/client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { actionBarOnChangeHandlers } from "../utils/onChangeHandlers";

interface Props {
  isAdmin?: boolean;
}

const ActionBar = ({ isAdmin = true }: Props) => {
  const pathname = usePathname();
  const searchParmas = useSearchParams();
  const router = useRouter();
  const {
    companyBranchOnChangeHandler,
    descriptionOnChangeHandler,
    numberOnChangeHandler,
    organizationOnChangeHandler,
    statusFilterOnChangeHandler,
  } = actionBarOnChangeHandlers(searchParmas, router);

  return (
    <div
      className={`grid ${
        pathname === "/admin/invoice-issuing"
          ? "grid-cols-4 max-sm:grid-rows-4 max-md:grid-rows-2"
          : "grid-cols-5 max-sm:grid-rows-5 max-md:grid-rows-3"
      }  grid-rows-1 w-full gap-x-5 mb-5 max-md:gap-x-3 max-md:grid-cols-2  max-sm:grid-cols-1`}
    >
      <Input
        defaultValue={searchParmas?.get("number") || ""}
        onChange={numberOnChangeHandler}
        label={
          pathname?.includes("porformaInvoice")
            ? "شماره پیش فاکتور"
            : "شماره فاکتور"
        }
        type="search"
        variant="underlined"
      />

      {pathname.includes("porformaInvoice") &&
        !pathname.includes("archived") && (
          <Autocomplete
            defaultSelectedKey={searchParmas?.get("statusFilter") || ""}
            listboxProps={{ emptyContent: "نتیجه ای یافت نشد" }}
            onSelectionChange={statusFilterOnChangeHandler}
            variant="underlined"
            label="وضعیت اعتبار"
          >
            {statusFilter.map((status) => (
              <AutocompleteItem key={status.value}>
                {status.label}
              </AutocompleteItem>
            ))}
          </Autocomplete>
        )}

      {isAdmin && (
        <Input
          defaultValue={searchParmas?.get("organization") || ""}
          onChange={organizationOnChangeHandler}
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
        defaultValue={searchParmas?.get("description") || ""}
        onChange={descriptionOnChangeHandler}
        label="توضیحات"
        type="search"
        variant="underlined"
        className={`${
          pathname === "/admin/invoice-issuing"
            ? "max-md:col-span-1"
            : "max-md:col-span-2"
        }  max-sm:col-span-1`}
      />
    </div>
  );
};

export default ActionBar;

const statusFilter: { label: string; value: Status | "ALL" }[] = [
  { label: "همه پیش فاکتورها", value: "ALL" },
  { label: "دارای اعتبار", value: "IN_PROGRESS" },
  { label: "منقضی شده", value: "EXPIRED" },
];
