import prisma from "@/prisma/client";
import { Invoice } from "@prisma/client";
import ActionBar from "../components/ActionBar";
import getSession from "../libs/getSession";
import UserInvoiceTable from "./UserInvoiceTable";

interface Props {
  searchParams: {
    invoiceNumber: string;
    description: string;
    pageNumber: number;
  };
}

const InvoicePage = async ({
  searchParams: { invoiceNumber, description, pageNumber },
}: Props) => {
  const currentPage = pageNumber || 1;
  const pageSize: number = 10;
  const session = await getSession();

  const invoiceCount: number = await prisma.invoice.count({
    where: {
      description: { contains: description },
      invoiceNumber: { contains: invoiceNumber },
    },
  });

  const userInvoice: Invoice[] = await prisma.invoice.findMany({
    where: {
      assignedToUserId: session?.user.id,
      invoiceNumber: { contains: invoiceNumber },
      description: { contains: description },
    },
    take: pageSize,
    skip: (currentPage - 1) * pageSize,
  });

  return (
    <div className="flex flex-col gap-5 p-10 w-full">
      <ActionBar />

      <UserInvoiceTable
        totalPage={Math.ceil(invoiceCount / pageSize)}
        invoices={userInvoice}
      />
    </div>
  );
};

export default InvoicePage;