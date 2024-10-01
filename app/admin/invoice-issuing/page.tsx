import ActionBar from "@/app/components/ActionBar";
import getSession from "@/app/libs/getSession";
import { authorizeAdmin } from "@/app/utils/authorizeRole";
import prisma from "@/prisma/client";
import AdminInvoiceTable from "./AdminInvoiceTable";

interface Props {
  searchParams: {
    invoiceNumber: string;
    description: string;
    organization: string;
    organizationBranch: string;
    pageNumber: number;
  };
}

const InvoiceIssuingPage = async ({
  searchParams: {
    description,
    invoiceNumber,
    organization,
    organizationBranch,
    pageNumber,
  },
}: Props) => {
  const session = await getSession();
  authorizeAdmin(session!);

  const currentPage = pageNumber || 1;
  const pageSize: number = 10;
  const invoiceCount: number = await prisma.invoice.count({
    where: {
      description: { contains: description },
      invoiceNumber: { contains: invoiceNumber },
      organization: { contains: organization },
      organizationBranch: { contains: organizationBranch },
    },
  });

  const adminSideInvoiceList = await prisma.invoice.findMany({
    where: {
      description: { contains: description },
      invoiceNumber: { contains: invoiceNumber },
      organization: { contains: organization },
      organizationBranch: { contains: organizationBranch },
    },
    take: pageSize,
    skip: (currentPage - 1) * pageSize,
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="flex flex-col gap-1 p-5 w-full">
      <ActionBar />

      <AdminInvoiceTable
        totalPage={Math.ceil(invoiceCount / pageSize)}
        invoices={adminSideInvoiceList}
      />
    </div>
  );
};

export default InvoiceIssuingPage;
