"use client";

import { Pagination } from "@nextui-org/react";
import { useRouter, useSearchParams } from "next/navigation";

interface Props {
  totalPage: number;
}

const PaginationControl = ({ totalPage }: Props) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  if (totalPage <= 1) return null;

  return (
    <Pagination
      showControls
      variant="flat"
      size="md"
      page={parseInt(searchParams.get("pageNumber")!) || 1}
      initialPage={parseInt(searchParams.get("pageNumber")!) || 1}
      total={totalPage}
      onChange={(value) => {
        const newParams = new URLSearchParams(searchParams.toString());

        if (totalPage >= 1) {
          newParams.set("pageNumber", value.toString());
        } else {
          newParams.delete("pageNumber");
        }

        if (searchParams.get("description"))
          newParams.set("description", searchParams.get("description")!);

        if (searchParams.get("organizationBranch"))
          newParams.set(
            "organizationBranch",
            searchParams.get("organizationBranch")!
          );

        if (searchParams.get("invoiceNumber"))
          newParams.set("invoiceNumber", searchParams.get("invoiceNumber")!);

        if (searchParams.get("organization"))
          newParams.set("organization", searchParams.get("organization")!);

        router.push(`?${newParams.toString()}`);
      }}
    />
  );
};

export default PaginationControl;
