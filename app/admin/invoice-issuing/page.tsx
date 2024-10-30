import ActionBar from "@/app/components/ActionBar";
import getSession from "@/app/libs/getSession";
import { authorizeAdmin } from "@/app/utils/authorizeRole";
import prisma from "@/prisma/client";
import InvoiceSummery from "../../components/InvoiceSummery";
import AdminInvoiceTable from "./AdminInvoiceTable";

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

  const [invoiceCount, adminSideInvoiceList, adminSideAllInvoices] =
    await prisma.$transaction([
      prisma.invoice.count({
        where: {
          description: { contains: description },
          invoiceNumber: { contains: number },
          organization: { contains: organization },
          organizationBranch: { contains: organizationBranch },
        },
      }),

      prisma.invoice.findMany({
        where: {
          description: { contains: description },
          invoiceNumber: { contains: number },
          organization: { contains: organization },
          organizationBranch: { contains: organizationBranch },
        },
        take: pageSize,
        skip: (currentPage - 1) * pageSize,
        orderBy: { createdAt: "desc" },
      }),

      prisma.invoice.findMany({
        where: {
          description: { contains: description },
          organization: { contains: organization },
          organizationBranch: { contains: organizationBranch },
          invoiceNumber: { contains: number },
        },
      }),
    ]);

  return (
    <div className="flex flex-col gap-5 px-5 py-2 w-full">
      <ActionBar isAdmin />

      <AdminInvoiceTable
        buttonLabel="صدور فاکتور جدید"
        endpoint="/admin/invoice-issuing/createNewInvoice"
        userRole={session?.user.role!}
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

const pageSize: number = 6;
