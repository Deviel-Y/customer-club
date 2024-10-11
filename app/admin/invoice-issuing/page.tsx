import ActionBar from "@/app/components/ActionBar";
import getSession from "@/app/libs/getSession";
import { authorizeAdmin } from "@/app/utils/authorizeRole";
import prisma from "@/prisma/client";
import AdminInvoiceTable from "./AdminInvoiceTable";
import InvoiceSummery from "./InvoiceSummery";

interface Props {
  searchParams: {
    number: string;
    description: string;
    organization: string;
    organizationBranch: string;
    pageNumber: number;
  };
}

const InvoiceIssuingPage = async ({
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
  const pageSize: number = 2;
  const invoiceCount: number = await prisma.invoice.count({
    where: {
      description: { contains: description },
      invoiceNumber: { contains: number },
      organization: { contains: organization },
      organizationBranch: { contains: organizationBranch },
    },
  });

  const adminSideInvoiceList = await prisma.invoice.findMany({
    where: {
      description: { contains: description },
      invoiceNumber: { contains: number },
      organization: { contains: organization },
      organizationBranch: { contains: organizationBranch },
    },
    take: pageSize,
    skip: (currentPage - 1) * pageSize,
    orderBy: { createdAt: "desc" },
  });

  const adminSideAllInvoices = await prisma.invoice.findMany({
    where: {
      description: { contains: description },
      organization: { contains: organization },
      organizationBranch: { contains: organizationBranch },
      invoiceNumber: { contains: number },
    },
  });

  return (
    <div className="flex flex-col gap-1 px-5 py-2 w-full">
      <ActionBar
        isAdmin
        buttonLabel="صدور فاکتور جدید"
        endpoint="/admin/invoice-issuing/createNewInvoice"
      />

      <AdminInvoiceTable
        totalPage={Math.ceil(invoiceCount / pageSize)}
        invoices={adminSideInvoiceList}
      />

      {adminSideAllInvoices.length !== 0 && (
        <InvoiceSummery invoices={adminSideAllInvoices} />
      )}
    </div>
  );
};

export default InvoiceIssuingPage;
