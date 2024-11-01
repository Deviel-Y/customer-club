import ActionBar from "@/app/components/ActionBar";
import getSession from "@/app/libs/getSession";
import { authorizeSuperAdmin } from "@/app/utils/authorizeRole";
import prisma from "@/prisma/client";
import dynamic from "next/dynamic";

interface Props {
  searchParams: {
    number: string;
    description: string;
    organization: string;
    organizationBranch: string;
    pageNumber: number;
  };
}

const ArchivedPorformaInvoicesPage = async ({
  searchParams: {
    description,
    number,
    organization,
    organizationBranch,
    pageNumber,
  },
}: Props) => {
  const session = await getSession();
  authorizeSuperAdmin(session!);

  const currentPage = pageNumber || 1;

  const [archivedPorInvoiceCount, archivedPorformaInvoiceList] =
    await prisma.$transaction([
      prisma.archivedPorformaInvoice.count({
        where: {
          description: { contains: description },
          porformaInvoiceNumber: { contains: number },
          organization: { contains: organization },
          organizationBranch: { contains: organizationBranch },
        },
      }),

      prisma.archivedPorformaInvoice.findMany({
        where: {
          description: { contains: description },
          porformaInvoiceNumber: { contains: number },
          organization: { contains: organization },
          organizationBranch: { contains: organizationBranch },
        },
        take: pageSize,
        skip: (currentPage - 1) * pageSize,
        orderBy: { createdAt: "desc" },
      }),
    ]);

  const ArchivedPorformaInvoiceTable = dynamic(
    () =>
      import(
        "@/app/admin/archive/archived-porforma-invoices/ArchivedPorformaInvoiceTable"
      ),
    {
      ssr: false,
    }
  );

  return (
    <div className="flex flex-col gap-1 px-5 py-2 w-full">
      <ActionBar isAdmin />

      <ArchivedPorformaInvoiceTable
        totalPage={Math.ceil(archivedPorInvoiceCount / pageSize)}
        archivedPorInvoice={archivedPorformaInvoiceList}
      />
    </div>
  );
};

export default ArchivedPorformaInvoicesPage;

const pageSize: number = 6;
