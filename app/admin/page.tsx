import prisma from "@/prisma/client";
import ActionBar from "../components/ActionBar";
import UserInvoiceTable from "../invoice/UserInvoiceTable";
import getSession from "../libs/getSession";
import { authorizeAdmin } from "../utils/authorizeRole";

const AdminPage = async () => {
  const session = await getSession();
  authorizeAdmin(session!);

  const adminSideInvoiceList = await prisma.invoice.findMany();

  return (
    <div className="flex flex-col gap-5 p-10 w-full">
      <ActionBar />

      <UserInvoiceTable invoices={adminSideInvoiceList} />
    </div>
  );
};

export default AdminPage;
