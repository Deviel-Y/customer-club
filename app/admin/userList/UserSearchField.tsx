"use client";

import { userSearchFieldOnchangeHandlers } from "@/app/utils/onChangeHandlers";
import { Button, Input } from "@nextui-org/react";
import { useRouter, useSearchParams } from "next/navigation";

const UserSearchField = () => {
  const searchParmas = useSearchParams();
  const router = useRouter();

  const {
    componyBranchOnChangeHandler,
    componyNameOnChangeHandler,
    emailAddressOnChangeHandler,
    itMnagerOnChangeHandler,
  } = userSearchFieldOnchangeHandlers(searchParmas, router);

  return (
    <div className=" flex flex-row gap-5">
      <Button
        onPress={() => router.push("/admin/createNewUser")}
        className="self-center"
        color="secondary"
        variant="shadow"
      >
        تعریف کاربر جدید
      </Button>

      <div className="grid grid-cols-4 grid-rows-1 gap-5 mb-5 w-full">
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
      </div>
    </div>
  );
};

export default UserSearchField;
