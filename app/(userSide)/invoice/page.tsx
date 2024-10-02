import prisma from "@/prisma/client";
import { Invoice } from "@prisma/client";
import ActionBar from "../../components/ActionBar";
import getSession from "../../libs/getSession";
import { authorizeUser } from "../../utils/authorizeRole";
import UserInvoiceTable from "./UserInvoiceTable";

interface Props {
  searchParams: {
    number: string;
    description: string;
    pageNumber: number;
  };
}

const InvoicePage = async ({
  searchParams: { number, description, pageNumber },
}: Props) => {
  const session = await getSession();
  authorizeUser(session!);

  const currentPage = pageNumber || 1;

  const invoiceCount: number = await prisma.invoice.count({
    where: {
      description: { contains: description },
      invoiceNumber: { contains: number },
    },
  });

  const userInvoice: Invoice[] = await prisma.invoice.findMany({
    where: {
      assignedToUserId: session?.user.id,
      invoiceNumber: { contains: number },
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

const pageSize: number = 6;
