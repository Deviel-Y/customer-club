"use client";

import { Button, Input } from "@nextui-org/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChangeEvent } from "react";

interface Props {
  endpoint?: string;
  buttonLabel?: string;
  isAdmin?: boolean;
}

const ActionBar = ({ endpoint, buttonLabel, isAdmin = true }: Props) => {
  const pathname = usePathname();
  const searchParmas = useSearchParams();
  const router = useRouter();

  const numberOnChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const newParams = new URLSearchParams(searchParmas);

    if (event.target.value) {
      newParams.set("number", event.target.value as string);
    } else {
      newParams.delete("number");
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

    if (searchParmas.get("pageNumber")) newParams.delete("pageNumber");

    router.push(`?${newParams.toString()}`);
  };

  const descriptionOnChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const newParams = new URLSearchParams(searchParmas);

    if (event.target.value) {
      newParams.set("description", event.target.value as string);
    } else {
      newParams.delete("description");
    }

    if (searchParmas.get("number"))
      newParams.set("number", searchParmas.get("number")!);

    if (searchParmas.get("organization"))
      newParams.set("organization", searchParmas.get("organization")!);

    if (searchParmas.get("organizationBranch"))
      newParams.set(
        "organizationBranch",
        searchParmas.get("organizationBranch")!
      );

    if (searchParmas.get("pageNumber")) newParams.delete("pageNumber");

    router.push(`?${newParams.toString()}`);
  };

  const organizationOnChangeHandler = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
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

    if (searchParmas.get("number"))
      newParams.set("number", searchParmas.get("number")!);

    if (searchParmas.get("pageNumber")) newParams.delete("pageNumber");

    router.push(`?${newParams.toString()}`);
  };

  const componyBranchOnChangeHandler = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const newParams = new URLSearchParams(searchParmas);

    if (event.target.value) {
      newParams.set("organizationBranch", event.target.value as string);
    } else {
      newParams.delete("organizationBranch");
    }

    if (searchParmas.get("description"))
      newParams.set("description", searchParmas.get("description")!);

    if (searchParmas.get("organization"))
      newParams.set("organization", searchParmas.get("organization")!);

    if (searchParmas.get("number"))
      newParams.set("number", searchParmas.get("number")!);

    if (searchParmas.get("pageNumber")) newParams.delete("pageNumber");

    router.push(`?${newParams.toString()}`);
  };

  return (
    <div className=" flex flex-row gap-5 w-full place-content-center place-items-center">
      {isAdmin && (
        <Button
          className="self-center"
          color="secondary"
          variant="shadow"
          onPress={() => router.push(endpoint!)}
        >
          {buttonLabel}
        </Button>
      )}

      <div className="grid grid-cols-4 grid-rows-1 w-full gap-5 mb-5">
        <Input
          onChange={numberOnChangeHandler}
          label={
            pathname?.includes("porformaInvoice")
              ? "شماره پیش فاکتور"
              : "شماره فاکتور"
          }
          type="search"
          variant="underlined"
        />

        <Input
          onChange={descriptionOnChangeHandler}
          label="توضیحات"
          type="search"
          variant="underlined"
        />

        {isAdmin && (
          <Input
            onChange={organizationOnChangeHandler}
            label="سازمان"
            type="search"
            variant="underlined"
          />
        )}

        {isAdmin && (
          <Input
            onChange={componyBranchOnChangeHandler}
            label="شعبه"
            type="search"
            variant="underlined"
          />
        )}
      </div>
    </div>
  );
};

export default ActionBar;
