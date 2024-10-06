import InvoiceForm from "@/app/admin/components/InvoiceForm";
import getSession from "@/app/libs/getSession";
import { authorizeAdmin } from "@/app/utils/authorizeRole";
import prisma from "@/prisma/client";
import { User } from "@prisma/client";

const CreateNewInvoicePage = async () => {
  const session = await getSession();
  authorizeAdmin(session!);

  const users: User[] = await prisma.user.findMany({ where: { role: "USER" } });

  return (
    <div className="py-5 max-sm:py-2 px-2">
      <InvoiceForm Userlist={users} />
    </div>
  );
};

export default CreateNewInvoicePage;
