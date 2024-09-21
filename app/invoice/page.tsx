import prisma from "@/prisma/client";
import { Invoice } from "@prisma/client";
import UserActionBar from "../components/UserActionBar";
import getSession from "../libs/getSession";
import UserInvoiceTable from "./UserInvoiceTable";

const InvoicePage = async () => {
  const session = await getSession();
  const userInvoice: Invoice[] = await prisma.invoice.findMany({
    where: {
      assignedToUserId: session?.user.id,
    },
  });

  return (
    <div className="flex flex-col gap-5 p-10 w-full">
      <UserActionBar />

      <UserInvoiceTable invoices={userInvoice} />
    </div>
  );
};

export default InvoicePage;
