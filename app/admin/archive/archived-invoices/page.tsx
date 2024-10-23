import ActionBar from "@/app/components/ActionBar";
import getSession from "@/app/libs/getSession";
import { authorizeAdmin } from "@/app/utils/authorizeRole";
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

const ArchivedInvoicesPage = async ({
  searchParams: {
    description,
    number,
    organization,
    organizationBranch,
    pageNumber,
  },
}: Props) => {
  const session = await getSession();
  authorizeAdmin(session!);

  const currentPage = pageNumber || 1;

  const [archivedInvoiceCount, archivedInvoiceList] = await prisma.$transaction(
    [
      prisma.archivedInvoice.count({
        where: {
          description: { contains: description },
          InvoiceNumber: { contains: number },
          organization: { contains: organization },
          organizationBranch: { contains: organizationBranch },
        },
      }),

      prisma.archivedInvoice.findMany({
        where: {
          description: { contains: description },
          InvoiceNumber: { contains: number },
          organization: { contains: organization },
          organizationBranch: { contains: organizationBranch },
        },
        take: pageSize,
        skip: (currentPage - 1) * pageSize,
        orderBy: { createdAt: "desc" },
      }),
    ]
  );

  const ArchivedInvoiceTable = dynamic(
    () => import("@/app/admin/archive/archived-invoices/ArchivedInvoiceTable"),
    {
      ssr: false,
    }
  );

  return (
    <div className="flex flex-col gap-1 px-5 py-2 w-full">
      <ActionBar
        isAdmin
        buttonLabel="صدور پیش فاکتور جدید"
        endpoint="/admin/porformaInvoice-issuing/createNewPorInvoice"
      />

      <ArchivedInvoiceTable
        totalPage={Math.ceil(archivedInvoiceCount / pageSize)}
        archivedInvoice={archivedInvoiceList}
      />
    </div>
  );
};

export default ArchivedInvoicesPage;

const pageSize: number = 6;
