"use client";

import { Input } from "@nextui-org/react";
import { useRouter, useSearchParams } from "next/navigation";

const UserActionBar = () => {
  const searchParmas = useSearchParams();
  const router = useRouter();

  return (
    <div className="grid grid-cols-2 gap-5 w-1/2">
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
            newParams.set("invoiceNumber", searchParmas.get("invoiceNumber")!);

          router.push(`?${newParams.toString()}`);
        }}
        label="موضوع"
        type="search"
        size="lg"
        variant="underlined"
      />
    </div>
  );
};

export default UserActionBar;
