"use client";

import { logActionBarOnchangeHandlers } from "@/app/utils/onChangeHandlers";
import { Autocomplete, AutocompleteItem, Input } from "@nextui-org/react";
import { Section } from "@prisma/client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const LogActionBar = () => {
  const pathname = usePathname();
  const searchParmas = useSearchParams();
  const router = useRouter();

  const { messageOnChange, issuerOnChange, sectionOnChange } =
    logActionBarOnchangeHandlers(searchParmas, router);

  return (
    <div className=" flex flex-row max-sm:flex-col gap-5 max-sm:gap-0 max-sm:mt-5 w-full place-content-center place-items-center">
      <div
        className={`grid ${
          pathname === "/admin/invoice-issuing" ? "grid-cols-4" : "grid-cols-5"
        }  grid-rows-1 w-full gap-5 max-sm:gap-0 mb-5 max-sm:grid-cols-1`}
      >
        <Input
          defaultValue={searchParmas?.get("issuer") || ""}
          onChange={issuerOnChange}
          label="صادر کننده"
          type="search"
          variant="underlined"
        />

        <Autocomplete
          defaultSelectedKey={searchParmas?.get("section") || ""}
          listboxProps={{ emptyContent: "نتیجه ای یافت نشد" }}
          onSelectionChange={sectionOnChange}
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
          defaultValue={searchParmas?.get("message") || ""}
          onChange={messageOnChange}
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
