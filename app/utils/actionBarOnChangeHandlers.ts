import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { ReadonlyURLSearchParams } from "next/navigation";
import { ChangeEvent, Key } from "react";

const actionBarOnChangeHandlers = (
  searchParmas: ReadonlyURLSearchParams,
  router: AppRouterInstance
) => {
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

    if (searchParmas.get("StatusFilter"))
      newParams.set("StatusFilter", searchParmas.get("StatusFilter")!);

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

    if (searchParmas.get("StatusFilter"))
      newParams.set("StatusFilter", searchParmas.get("StatusFilter")!);

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

    if (searchParmas.get("StatusFilter"))
      newParams.set("StatusFilter", searchParmas.get("StatusFilter")!);

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

    if (searchParmas.get("StatusFilter"))
      newParams.set("StatusFilter", searchParmas.get("StatusFilter")!);

    if (searchParmas.get("pageNumber")) newParams.delete("pageNumber");

    router.push(`?${newParams.toString()}`);
  };

  const statusFilterOnChangeHandler = (event: Key | null) => {
    const newParams = new URLSearchParams(searchParmas);

    if (event) {
      newParams.set("statusFilter", event as string);
    } else {
      newParams.delete("statusFilter");
    }

    if (searchParmas.get("description"))
      newParams.set("description", searchParmas.get("description")!);

    if (searchParmas.get("organization"))
      newParams.set("organization", searchParmas.get("organization")!);

    if (searchParmas.get("number"))
      newParams.set("number", searchParmas.get("number")!);

    if (searchParmas.get("organizationBranch"))
      newParams.set(
        "organizationBranch",
        searchParmas.get("organizationBranch")!
      );

    if (searchParmas.get("pageNumber")) newParams.delete("pageNumber");

    router.push(`?${newParams.toString()}`);
  };

  return {
    numberOnChangeHandler,
    descriptionOnChangeHandler,
    organizationOnChangeHandler,
    componyBranchOnChangeHandler,
    statusFilterOnChangeHandler,
  };
};

export default actionBarOnChangeHandlers;
