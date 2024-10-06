"use client";

import {
  Autocomplete,
  AutocompleteItem,
  Button,
  Input,
} from "@nextui-org/react";
import { Status } from "@prisma/client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { actionBarOnChangeHandlers } from "../utils/onChangeHandlers";

interface Props {
  endpoint?: string;
  buttonLabel?: string;
  isAdmin?: boolean;
}

const ActionBar = ({ endpoint, buttonLabel, isAdmin = true }: Props) => {
  const pathname = usePathname();
  const searchParmas = useSearchParams();
  const router = useRouter();
  const {
    componyBranchOnChangeHandler,
    descriptionOnChangeHandler,
    numberOnChangeHandler,
    organizationOnChangeHandler,
    statusFilterOnChangeHandler,
  } = actionBarOnChangeHandlers(searchParmas, router);

  return (
    <div className=" flex flex-row max-sm:flex-col gap-5 max-sm:gap-0 max-sm:mt-5 w-full place-content-center place-items-center">
      {isAdmin && (
        <Button
          className="self-center max-sm:self-start"
          color="secondary"
          variant="shadow"
          onPress={() => router.push(endpoint!)}
        >
          {buttonLabel}
        </Button>
      )}

      <div
        className={`grid ${
          pathname === "/admin/invoice-issuing" ? "grid-cols-4" : "grid-cols-5"
        }  grid-rows-1 w-full gap-5 max-sm:gap-0 mb-5 max-sm:grid-cols-1`}
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
            onChange={componyBranchOnChangeHandler}
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
        />

        {pathname.includes("porformaInvoice") && (
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
      </div>
    </div>
  );
};

export default ActionBar;

const statusFilter: { label: string; value: Status | "ALL" }[] = [
  { label: "همه پیش فاکتورها", value: "ALL" },
  { label: "دارای اعتبار", value: "IN_PROGRESS" },
  { label: "منقضی شده", value: "EXPIRED" },
];
