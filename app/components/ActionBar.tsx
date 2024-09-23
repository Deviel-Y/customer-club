"use client";

import { Button, Input } from "@nextui-org/react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

const ActionBar = () => {
  const { data: session } = useSession();
  const searchParmas = useSearchParams();
  const router = useRouter();

  return (
    <div className=" flex flex-col gap-5">
      <Button
        size="lg"
        className="self-start"
        color="secondary"
        variant="shadow"
      >
        صدور فاکتور جدید
      </Button>
      <div className="grid grid-cols-4 gap-5 mb-5">
        <Input
          onChange={(event) => {
            const newParams = new URLSearchParams(searchParmas);

            if (event.target.value) {
              newParams.set("invoiceNumber", event.target.value as string);
            } else {
              newParams.delete("invoiceNumber");
            }

            if (searchParmas.get("description"))
              newParams.set("description", searchParmas.get("description")!);

            if (searchParmas.get("organization"))
              newParams.set("organization", searchParmas.get("organization")!);

            if (searchParmas.get("organizationBranch"))
              newParams.set(
                "organizationBranch",
                searchParmas.get("organizationBranch")!
              );

            router.push(`?${newParams.toString()}`);
          }}
          label="شماره فاکتور"
          type="search"
          size="lg"
          variant="underlined"
        />

        <Input
          onChange={(event) => {
            const newParams = new URLSearchParams(searchParmas);

            if (event.target.value) {
              newParams.set("description", event.target.value as string);
            } else {
              newParams.delete("description");
            }

            if (searchParmas.get("invoiceNumber"))
              newParams.set(
                "invoiceNumber",
                searchParmas.get("invoiceNumber")!
              );

            if (searchParmas.get("organization"))
              newParams.set("organization", searchParmas.get("organization")!);

            if (searchParmas.get("organizationBranch"))
              newParams.set(
                "organizationBranch",
                searchParmas.get("organizationBranch")!
              );

            router.push(`?${newParams.toString()}`);
          }}
          label="توضیحات"
          type="search"
          size="lg"
          variant="underlined"
        />

        {session?.user.role === "ADMIN" && (
          <Input
            onChange={(event) => {
              const newParams = new URLSearchParams(searchParmas);

              if (event.target.value) {
                newParams.set("organization", event.target.value as string);
              } else {
                newParams.delete("organization");
              }

              if (searchParmas.get("description"))
                newParams.set("description", searchParmas.get("description")!);

              if (searchParmas.get("organizationBranch"))
                newParams.set(
                  "organizationBranch",
                  searchParmas.get("organizationBranch")!
                );

              if (searchParmas.get("invoiceNumber"))
                newParams.set(
                  "invoiceNumber",
                  searchParmas.get("invoiceNumber")!
                );

              router.push(`?${newParams.toString()}`);
            }}
            label="سازمان"
            type="search"
            size="lg"
            variant="underlined"
          />
        )}

        {session?.user.role === "ADMIN" && (
          <Input
            onChange={(event) => {
              const newParams = new URLSearchParams(searchParmas);

              if (event.target.value) {
                newParams.set(
                  "organizationBranch",
                  event.target.value as string
                );
              } else {
                newParams.delete("organizationBranch");
              }

              if (searchParmas.get("description"))
                newParams.set("description", searchParmas.get("description")!);

              if (searchParmas.get("organization"))
                newParams.set(
                  "organization",
                  searchParmas.get("organization")!
                );

              if (searchParmas.get("invoiceNumber"))
                newParams.set(
                  "invoiceNumber",
                  searchParmas.get("invoiceNumber")!
                );

              router.push(`?${newParams.toString()}`);
            }}
            label="شعبه"
            type="search"
            size="lg"
            variant="underlined"
          />
        )}
      </div>
    </div>
  );
};

export default ActionBar;
