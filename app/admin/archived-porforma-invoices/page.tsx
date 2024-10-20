import ActionBar from "@/app/components/ActionBar";
import getSession from "@/app/libs/getSession";
import { authorizeAdmin } from "@/app/utils/authorizeRole";
import prisma from "@/prisma/client";
import dynamic from "next/dynamic";
import ArchivedPorformaInvoiceTable from "./ArchivedPorformaInvoiceTable";

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
  authorizeAdmin(session!);

  const currentPage = pageNumber || 1;

  const [porformaInvoiceCount, adminSidePorformaInvoiceList] =
    await Promise.all([
      prisma.porformaInvoice.count({
        where: {
          description: { contains: description },
          porformaInvoiceNumber: { contains: number },
          organization: { contains: organization },
          organizationBranch: { contains: organizationBranch },
        },
      }),

      prisma.porformaInvoice.findMany({
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

  const AdminPorformaInvoiceTable = dynamic(
    () =>
      import("@/app/admin/porformaInvoice-issuing/AdminPorformaInvoiceTable"),
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

      <ArchivedPorformaInvoiceTable
        porformaInvoice={adminSidePorformaInvoiceList}
        totalPage={Math.ceil(porformaInvoiceCount / pageSize)}
      />
    </div>
  );
};

export default ArchivedPorformaInvoicesPage;

const pageSize: number = 6;
