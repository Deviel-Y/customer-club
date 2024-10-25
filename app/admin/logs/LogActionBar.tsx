"use client";

import { Autocomplete, AutocompleteItem, Input } from "@nextui-org/react";
import { Section } from "@prisma/client";
import { usePathname } from "next/navigation";

const LogActionBar = () => {
  const pathname = usePathname();
  //   const searchParmas = useSearchParams();
  //   const router = useRouter();

  return (
    <div className=" flex flex-row max-sm:flex-col gap-5 max-sm:gap-0 max-sm:mt-5 w-full place-content-center place-items-center">
      <div
        className={`grid ${
          pathname === "/admin/invoice-issuing" ? "grid-cols-4" : "grid-cols-5"
        }  grid-rows-1 w-full gap-5 max-sm:gap-0 mb-5 max-sm:grid-cols-1`}
      >
        <Input
          //   defaultValue={searchParmas?.get("organizationBranch") || ""}
          //   onChange={companyBranchOnChangeHandler}
          label="صادر کننده"
          type="search"
          variant="underlined"
        />

        <Autocomplete
          //   defaultSelectedKey={searchParmas?.get("statusFilter") || ""}
          listboxProps={{ emptyContent: "نتیجه ای یافت نشد" }}
          //   onSelectionChange={statusFilterOnChangeHandler}
          variant="underlined"
          label="مربوط به بخش"
        >
          {sectionFilter.map((section) => (
            <AutocompleteItem key={section.value}>
              {section.label}
            </AutocompleteItem>
          ))}
        </Autocomplete>

        <Input
          //   defaultValue={searchParmas?.get("description") || ""}
          //   onChange={descriptionOnChangeHandler}
          label="پیام"
          type="search"
          variant="underlined"
        />
      </div>
    </div>
  );
};

export default LogActionBar;

const sectionFilter: { label: string; value: Section | "ALL" }[] = [
  { label: "همه بخش ها", value: "ALL" },
  { label: "فاکتور", value: "INVOICE" },
  { label: "پیش فاکتور", value: "POR_INVOICE" },
  { label: "تیکت", value: "TICKET" },
  { label: "پاسخ به تیکت", value: "TICKET_MESSAGE" },
];
