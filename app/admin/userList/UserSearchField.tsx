"use client";

import { Button, Input } from "@nextui-org/react";
import { useRouter, useSearchParams } from "next/navigation";

const UserSearchField = () => {
  const searchParmas = useSearchParams();
  const router = useRouter();

  return (
    <div className=" flex flex-col gap-5">
      <Button
        onPress={() => router.push("/admin/createNewUser")}
        size="lg"
        className="self-start"
        color="secondary"
        variant="shadow"
      >
        تعریف کاربر جدید
      </Button>

      <div className="grid grid-cols-4 gap-5 mb-5">
        <Input
          onChange={(event) => {
            const newParams = new URLSearchParams(searchParmas);

            if (event.target.value) {
              newParams.set("companyName", event.target.value as string);
            } else {
              newParams.delete("companyName");
            }

            if (searchParmas.get("companyBranch"))
              newParams.set(
                "companyBranch",
                searchParmas.get("companyBranch")!
              );

            if (searchParmas.get("itManager"))
              newParams.set("itManager", searchParmas.get("itManager")!);

            if (searchParmas.get("email"))
              newParams.set("email", searchParmas.get("email")!);

            if (searchParmas.get("pageNumber")) newParams.delete("pageNumber");

            router.push(`?${newParams.toString()}`);
          }}
          label="نام سازمان"
          type="search"
          size="lg"
          variant="underlined"
        />

        <Input
          onChange={(event) => {
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
          }}
          label="شعبه"
          type="search"
          size="lg"
          variant="underlined"
        />

        <Input
          onChange={(event) => {
            const newParams = new URLSearchParams(searchParmas);

            if (event.target.value) {
              newParams.set("email", event.target.value as string);
            } else {
              newParams.delete("email");
            }

            if (searchParmas.get("companyBranch"))
              newParams.set(
                "companyBranch",
                searchParmas.get("companyBranch")!
              );

            if (searchParmas.get("itManager"))
              newParams.set("itManager", searchParmas.get("itManager")!);

            if (searchParmas.get("companyName"))
              newParams.set("companyName", searchParmas.get("companyName")!);

            if (searchParmas.get("pageNumber")) newParams.delete("pageNumber");

            router.push(`?${newParams.toString()}`);
          }}
          label="آدرس ایمیل"
          type="search"
          size="lg"
          variant="underlined"
        />

        <Input
          onChange={(event) => {
            const newParams = new URLSearchParams(searchParmas);

            if (event.target.value) {
              newParams.set("itManager", event.target.value as string);
            } else {
              newParams.delete("itManager");
            }

            if (searchParmas.get("companyBranch"))
              newParams.set(
                "companyBranch",
                searchParmas.get("companyBranch")!
              );

            if (searchParmas.get("email"))
              newParams.set("email", searchParmas.get("email")!);

            if (searchParmas.get("companyName"))
              newParams.set("companyName", searchParmas.get("companyName")!);

            if (searchParmas.get("pageNumber")) newParams.delete("pageNumber");

            router.push(`?${newParams.toString()}`);
          }}
          label="مسئول انفوماتیک"
          type="search"
          size="lg"
          variant="underlined"
        />
      </div>
    </div>
  );
};

export default UserSearchField;
