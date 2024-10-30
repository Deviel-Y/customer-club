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

  const [invoiceCount, invoiceList, userAllInvoice] = await prisma.$transaction(
    [
      //invoiceCount : number of invoices for pagination
      prisma.invoice.count({
        where: {
          description: { contains: description },
          invoiceNumber: { contains: number }, //number === invoiceNumber
        },
      }),

      //userInvoice : list of invoices that are assigned to specific user
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

      //userAllInvoice : for InvoiceSummery component to show sum of price, tax and price with tax
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
    <div className="flex flex-col gap-5 px-5 py-2 max-sm:py-5 w-full">
      <ActionBar isAdmin={false} />

      <UserInvoiceTable
        totalPage={Math.ceil(invoiceCount / pageSize)}
        invoices={invoiceList}
      />

      <InvoiceSummery invoices={userAllInvoice} />
    </div>
  );
};

export default InvoicePage;

const pageSize: number = 6;
