"use client";

import { Button, Input } from "@nextui-org/react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChangeEvent } from "react";

const UserSearchField = () => {
  const searchParmas = useSearchParams();
  const router = useRouter();

  const componyNameOnChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const newParams = new URLSearchParams(searchParmas);

    if (event.target.value) {
      newParams.set("companyName", event.target.value as string);
    } else {
      newParams.delete("companyName");
    }

    if (searchParmas.get("companyBranch"))
      newParams.set("companyBranch", searchParmas.get("companyBranch")!);

    if (searchParmas.get("itManager"))
      newParams.set("itManager", searchParmas.get("itManager")!);

    if (searchParmas.get("email"))
      newParams.set("email", searchParmas.get("email")!);

    if (searchParmas.get("pageNumber")) newParams.delete("pageNumber");

    router.push(`?${newParams.toString()}`);
  };

  const componyBranchOnChangeHandler = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const newParams = new URLSearchParams(searchParmas);

    if (event.target.value) {
      newParams.set("companyBranch", event.target.value as string);
    } else {
      newParams.delete("companyBranch");
    }

    if (searchParmas.get("companyName"))
      newParams.set("companyName", searchParmas.get("companyName")!);

    if (searchParmas.get("itManager"))
      newParams.set("itManager", searchParmas.get("itManager")!);

    if (searchParmas.get("email"))
      newParams.set("email", searchParmas.get("email")!);

    if (searchParmas.get("pageNumber")) newParams.delete("pageNumber");

    router.push(`?${newParams.toString()}`);
  };

  const emailAddressOnChangeHandler = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const newParams = new URLSearchParams(searchParmas);

    if (event.target.value) {
      newParams.set("email", event.target.value as string);
    } else {
      newParams.delete("email");
    }

    if (searchParmas.get("companyBranch"))
      newParams.set("companyBranch", searchParmas.get("companyBranch")!);

    if (searchParmas.get("itManager"))
      newParams.set("itManager", searchParmas.get("itManager")!);

    if (searchParmas.get("companyName"))
      newParams.set("companyName", searchParmas.get("companyName")!);

    if (searchParmas.get("pageNumber")) newParams.delete("pageNumber");

    router.push(`?${newParams.toString()}`);
  };

  const itMnagerOnChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const newParams = new URLSearchParams(searchParmas);

    if (event.target.value) {
      newParams.set("itManager", event.target.value as string);
    } else {
      newParams.delete("itManager");
    }

    if (searchParmas.get("companyBranch"))
      newParams.set("companyBranch", searchParmas.get("companyBranch")!);

    if (searchParmas.get("email"))
      newParams.set("email", searchParmas.get("email")!);

    if (searchParmas.get("companyName"))
      newParams.set("companyName", searchParmas.get("companyName")!);

    if (searchParmas.get("pageNumber")) newParams.delete("pageNumber");

    router.push(`?${newParams.toString()}`);
  };

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
          onChange={componyNameOnChangeHandler}
          label="نام سازمان"
          type="search"
          variant="underlined"
        />

        <Input
          onChange={componyBranchOnChangeHandler}
          label="شعبه"
          type="search"
          variant="underlined"
        />

        <Input
          onChange={emailAddressOnChangeHandler}
          label="آدرس ایمیل"
          type="search"
          variant="underlined"
        />

        <Input
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
