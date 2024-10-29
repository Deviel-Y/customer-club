"use client";

import { userSearchFieldOnchangeHandlers } from "@/app/utils/onChangeHandlers";
import { Autocomplete, AutocompleteItem, Input } from "@nextui-org/react";
import { Role } from "@prisma/client";
import { useRouter, useSearchParams } from "next/navigation";

const UserSearchField = () => {
  const searchParmas = useSearchParams();
  const router = useRouter();

  const {
    componyBranchOnChangeHandler,
    componyNameOnChangeHandler,
    emailAddressOnChangeHandler,
    itMnagerOnChangeHandler,
    roleOnChangeHandler,
  } = userSearchFieldOnchangeHandlers(searchParmas, router);

  return (
    <div className=" flex flex-row max-sm:flex-col max-sm:flex mb-5 max-md:grid max-md:grid-cols-2 max-md:grid-rows-3 gap-5 max-sm:gap-1 max-sm:mt-2">
      <Input
        defaultValue={searchParmas.get("companyName") || ""}
        onChange={componyNameOnChangeHandler}
        label="نام سازمان"
        type="search"
        variant="underlined"
      />

      <Input
        defaultValue={searchParmas.get("companyBranch") || ""}
        onChange={componyBranchOnChangeHandler}
        label="شعبه"
        type="search"
        variant="underlined"
      />

      <Input
        defaultValue={searchParmas.get("email") || ""}
        onChange={emailAddressOnChangeHandler}
        label="آدرس ایمیل"
        type="search"
        variant="underlined"
      />

      <Input
        defaultValue={searchParmas.get("itManager") || ""}
        onChange={itMnagerOnChangeHandler}
        label="مسئول انفوماتیک"
        type="search"
        variant="underlined"
      />

      <Autocomplete
        defaultSelectedKey={searchParmas?.get("role") || "ALL"}
        listboxProps={{ emptyContent: "نتیجه ای یافت نشد" }}
        onSelectionChange={roleOnChangeHandler}
        label="سطح دسترسی"
        variant="underlined"
        className="max-md:col-span-2"
      >
        {roles.map((role) => (
          <AutocompleteItem key={role.value}>{role.label}</AutocompleteItem>
        ))}
      </Autocomplete>
    </div>
  );
};

export default UserSearchField;

const roles: { label: string; value: Role | "ALL" }[] = [
  { value: "ALL", label: "همه کاربرها" },
  { value: "ADMIN", label: "ادمین" },
  { value: "CUSTOMER", label: "مشتری" },
];
