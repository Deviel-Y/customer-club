import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { ReadonlyURLSearchParams } from "next/navigation";
import { ChangeEvent, Key } from "react";

export const actionBarOnChangeHandlers = (
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

  const companyBranchOnChangeHandler = (
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
    companyBranchOnChangeHandler,
    statusFilterOnChangeHandler,
  };
};

export const userSearchFieldOnchangeHandlers = (
  searchParmas: ReadonlyURLSearchParams,
  router: AppRouterInstance
) => {
  const roleOnChangeHandler = (event: Key | null) => {
    const newParams = new URLSearchParams(searchParmas);

    if (event) {
      newParams.set("role", event as string);
    } else {
      newParams.delete("role");
    }

    if (searchParmas.get("companyName"))
      newParams.set("companyName", searchParmas.get("companyName")!);

    if (searchParmas.get("companyBranch"))
      newParams.set("companyBranch", searchParmas.get("companyBranch")!);

    if (searchParmas.get("itManager"))
      newParams.set("itManager", searchParmas.get("itManager")!);

    if (searchParmas.get("email"))
      newParams.set("email", searchParmas.get("email")!);

    if (searchParmas.get("pageNumber")) newParams.delete("pageNumber");

    router.push(`?${newParams.toString()}`);
  };

  const componyNameOnChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const newParams = new URLSearchParams(searchParmas);

    if (event.target.value) {
      newParams.set("companyName", event.target.value as string);
    } else {
      newParams.delete("companyName");
    }

    if (searchParmas.get("role"))
      newParams.set("role", searchParmas.get("role")!);

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

    if (searchParmas.get("role"))
      newParams.set("role", searchParmas.get("role")!);

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

    if (searchParmas.get("role"))
      newParams.set("role", searchParmas.get("role")!);

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

    if (searchParmas.get("role"))
      newParams.set("role", searchParmas.get("role")!);

    if (searchParmas.get("companyBranch"))
      newParams.set("companyBranch", searchParmas.get("companyBranch")!);

    if (searchParmas.get("email"))
      newParams.set("email", searchParmas.get("email")!);

    if (searchParmas.get("companyName"))
      newParams.set("companyName", searchParmas.get("companyName")!);

    if (searchParmas.get("pageNumber")) newParams.delete("pageNumber");

    router.push(`?${newParams.toString()}`);
  };

  return {
    componyNameOnChangeHandler,
    componyBranchOnChangeHandler,
    emailAddressOnChangeHandler,
    itMnagerOnChangeHandler,
    roleOnChangeHandler,
  };
};

export const ticketActionBarOnchangeHandlers = (
  searchParmas: ReadonlyURLSearchParams,
  router: AppRouterInstance
) => {
  const categoryOnChangeHandler = (event: Key | null) => {
    const newParams = new URLSearchParams(searchParmas);

    if (event) {
      newParams.set("category", event as string);
    } else {
      newParams.delete("category");
    }

    if (searchParmas.get("title"))
      newParams.set("title", searchParmas.get("title")!);

    if (searchParmas.get("companyName"))
      newParams.set("companyName", searchParmas.get("companyName")!);

    if (searchParmas.get("companyBranch"))
      newParams.set("companyBranch", searchParmas.get("companyBranch")!);

    if (searchParmas.get("statusFilter"))
      newParams.set("statusFilter", searchParmas.get("statusFilter")!);

    if (searchParmas.get("pageNumber")) newParams.delete("pageNumber");

    router.push(`?${newParams.toString()}`);
  };

  const titleOnChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const newParams = new URLSearchParams(searchParmas);

    if (event.target.value) {
      newParams.set("title", event.target.value as string);
    } else {
      newParams.delete("title");
    }

    if (searchParmas.get("category"))
      newParams.set("category", searchParmas.get("category")!);

    if (searchParmas.get("companyName"))
      newParams.set("companyName", searchParmas.get("companyName")!);

    if (searchParmas.get("companyBranch"))
      newParams.set("companyBranch", searchParmas.get("companyBranch")!);

    if (searchParmas.get("statusFilter"))
      newParams.set("statusFilter", searchParmas.get("statusFilter")!);

    if (searchParmas.get("pageNumber")) newParams.delete("pageNumber");

    router.push(`?${newParams.toString()}`);
  };

  const companyNameOnChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const newParams = new URLSearchParams(searchParmas);

    if (event.target.value) {
      newParams.set("companyName", event.target.value as string);
    } else {
      newParams.delete("companyName");
    }

    if (searchParmas.get("category"))
      newParams.set("category", searchParmas.get("category")!);

    if (searchParmas.get("title"))
      newParams.set("title", searchParmas.get("title")!);

    if (searchParmas.get("companyBranch"))
      newParams.set("companyBranch", searchParmas.get("companyBranch")!);

    if (searchParmas.get("statusFilter"))
      newParams.set("statusFilter", searchParmas.get("statusFilter")!);

    if (searchParmas.get("pageNumber")) newParams.delete("pageNumber");

    router.push(`?${newParams.toString()}`);
  };

  const companyBranchOnChangeHandler = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const newParams = new URLSearchParams(searchParmas);

    if (event.target.value) {
      newParams.set("companyBranch", event.target.value as string);
    } else {
      newParams.delete("companyBranch");
    }

    if (searchParmas.get("category"))
      newParams.set("category", searchParmas.get("category")!);

    if (searchParmas.get("title"))
      newParams.set("title", searchParmas.get("title")!);

    if (searchParmas.get("companyName"))
      newParams.set("companyName", searchParmas.get("companyName")!);

    if (searchParmas.get("statusFilter"))
      newParams.set("statusFilter", searchParmas.get("statusFilter")!);

    if (searchParmas.get("pageNumber")) newParams.delete("pageNumber");

    router.push(`?${newParams.toString()}`);
  };

  const statusOnChangeHandler = (event: Key | null) => {
    const newParams = new URLSearchParams(searchParmas);

    if (event) {
      newParams.set("statusFilter", event as string);
    } else {
      newParams.delete("statusFilter");
    }

    if (searchParmas.get("category"))
      newParams.set("category", searchParmas.get("category")!);

    if (searchParmas.get("title"))
      newParams.set("title", searchParmas.get("title")!);

    if (searchParmas.get("companyName"))
      newParams.set("companyName", searchParmas.get("companyName")!);

    if (searchParmas.get("companyBranch"))
      newParams.set("companyBranch", searchParmas.get("companyBranch")!);

    if (searchParmas.get("pageNumber")) newParams.delete("pageNumber");

    router.push(`?${newParams.toString()}`);
  };

  return {
    categoryOnChangeHandler,
    titleOnChangeHandler,
    companyNameOnChangeHandler,
    companyBranchOnChangeHandler,
    statusOnChangeHandler,
  };
};

export const notificationActionBarOnchangeHandlers = (
  searchParmas: ReadonlyURLSearchParams,
  router: AppRouterInstance
) => {
  const typeOnChange = (event: Key | null) => {
    const newParams = new URLSearchParams(searchParmas);

    if (event) {
      newParams.set("type", event as string);
    } else {
      newParams.delete("type");
    }

    if (searchParmas.get("section"))
      newParams.set("section", searchParmas.get("section")!);

    if (searchParmas.get("companyName"))
      newParams.set("companyName", searchParmas.get("companyName")!);

    if (searchParmas.get("companyBranch"))
      newParams.set("companyBranch", searchParmas.get("companyBranch")!);

    if (searchParmas.get("contenet"))
      newParams.set("contenet", searchParmas.get("contenet")!);

    if (searchParmas.get("pageNumber")) newParams.delete("pageNumber");

    router.push(`?${newParams.toString()}`);
  };

  const sectionOnChange = (event: Key | null) => {
    const newParams = new URLSearchParams(searchParmas);

    if (event) {
      newParams.set("section", event as string);
    } else {
      newParams.delete("section");
    }

    if (searchParmas.get("type"))
      newParams.set("type", searchParmas.get("type")!);

    if (searchParmas.get("companyName"))
      newParams.set("companyName", searchParmas.get("companyName")!);

    if (searchParmas.get("companyBranch"))
      newParams.set("companyBranch", searchParmas.get("companyBranch")!);

    if (searchParmas.get("contenet"))
      newParams.set("contenet", searchParmas.get("contenet")!);

    if (searchParmas.get("pageNumber")) newParams.delete("pageNumber");

    router.push(`?${newParams.toString()}`);
  };

  const companyNameOnChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newParams = new URLSearchParams(searchParmas);

    if (event.target.value) {
      newParams.set("companyName", event.target.value as string);
    } else {
      newParams.delete("companyName");
    }

    if (searchParmas.get("type"))
      newParams.set("type", searchParmas.get("type")!);

    if (searchParmas.get("section"))
      newParams.set("section", searchParmas.get("section")!);

    if (searchParmas.get("companyBranch"))
      newParams.set("companyBranch", searchParmas.get("companyBranch")!);

    if (searchParmas.get("contenet"))
      newParams.set("contenet", searchParmas.get("contenet")!);

    if (searchParmas.get("pageNumber")) newParams.delete("pageNumber");

    router.push(`?${newParams.toString()}`);
  };

  const companyBranchOnChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newParams = new URLSearchParams(searchParmas);

    if (event.target.value) {
      newParams.set("companyBranch", event.target.value as string);
    } else {
      newParams.delete("companyBranch");
    }

    if (searchParmas.get("type"))
      newParams.set("type", searchParmas.get("type")!);

    if (searchParmas.get("section"))
      newParams.set("section", searchParmas.get("section")!);

    if (searchParmas.get("companyName"))
      newParams.set("companyName", searchParmas.get("companyName")!);

    if (searchParmas.get("contenet"))
      newParams.set("contenet", searchParmas.get("contenet")!);

    if (searchParmas.get("pageNumber")) newParams.delete("pageNumber");

    router.push(`?${newParams.toString()}`);
  };

  const contentOnChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newParams = new URLSearchParams(searchParmas);

    if (event.target.value) {
      newParams.set("content", event.target.value as string);
    } else {
      newParams.delete("content");
    }

    if (searchParmas.get("type"))
      newParams.set("type", searchParmas.get("type")!);

    if (searchParmas.get("section"))
      newParams.set("section", searchParmas.get("section")!);

    if (searchParmas.get("companyName"))
      newParams.set("companyName", searchParmas.get("companyName")!);

    if (searchParmas.get("companyBranch"))
      newParams.set("companyBranch", searchParmas.get("companyBranch")!);

    if (searchParmas.get("pageNumber")) newParams.delete("pageNumber");

    router.push(`?${newParams.toString()}`);
  };
  return {
    typeOnChange,
    sectionOnChange,
    companyNameOnChange,
    companyBranchOnChange,
    contentOnChange,
  };
};

export const logActionBarOnchangeHandlers = (
  searchParmas: ReadonlyURLSearchParams,
  router: AppRouterInstance
) => {
  const sectionOnChange = (event: Key | null) => {
    const newParams = new URLSearchParams(searchParmas);

    if (event) {
      newParams.set("section", event as string);
    } else {
      newParams.delete("section");
    }

    if (searchParmas.get("message"))
      newParams.set("message", searchParmas.get("message")!);

    if (searchParmas.get("issuer"))
      newParams.set("issuer", searchParmas.get("issuer")!);

    if (searchParmas.get("pageNumber")) newParams.delete("pageNumber");

    router.push(`?${newParams.toString()}`);
  };

  const messageOnChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newParams = new URLSearchParams(searchParmas);

    if (event.target.value) {
      newParams.set("message", event.target.value as string);
    } else {
      newParams.delete("message");
    }

    if (searchParmas.get("section"))
      newParams.set("section", searchParmas.get("section")!);

    if (searchParmas.get("issuer"))
      newParams.set("issuer", searchParmas.get("issuer")!);

    if (searchParmas.get("pageNumber")) newParams.delete("pageNumber");

    router.push(`?${newParams.toString()}`);
  };

  const issuerOnChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newParams = new URLSearchParams(searchParmas);

    if (event.target.value) {
      newParams.set("issuer", event.target.value as string);
    } else {
      newParams.delete("issuer");
    }

    if (searchParmas.get("section"))
      newParams.set("section", searchParmas.get("section")!);

    if (searchParmas.get("message"))
      newParams.set("message", searchParmas.get("message")!);

    if (searchParmas.get("pageNumber")) newParams.delete("pageNumber");

    router.push(`?${newParams.toString()}`);
  };

  return {
    sectionOnChange,
    messageOnChange,
    issuerOnChange,
  };
};
