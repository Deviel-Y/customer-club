import InvoiceSummery from "@/app/components/InvoiceSummery";
import prisma from "@/prisma/client";
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

  const [invoiceCount, userInvoice, userAllInvoice] = await prisma.$transaction(
    [
      prisma.invoice.count({
        where: {
          description: { contains: description },
          invoiceNumber: { contains: number },
        },
      }),
      prisma.invoice.findMany({
        where: {
          assignedToUserId: session?.user.id,
          invoiceNumber: { contains: number },
          description: { contains: description },
        },
        take: pageSize,
        skip: (currentPage - 1) * pageSize,
        orderBy: { createdAt: "desc" },
      }),

      prisma.invoice.findMany({
        where: {
          assignedToUserId: session?.user.id,
          invoiceNumber: { contains: number },
          description: { contains: description },
        },
      }),
    ]
  );

  return (
    <div className="flex flex-col gap-5 max-sm:gap-0 px-5 py-2 max-sm:p-5 max-sm:-translate-y-12 w-full">
      <ActionBar isAdmin={false} />

      <UserInvoiceTable
        totalPage={Math.ceil(invoiceCount / pageSize)}
        invoices={userInvoice}
      />

      <InvoiceSummery invoices={userAllInvoice} />
    </div>
  );
};

export default InvoicePage;

const pageSize: number = 6;
