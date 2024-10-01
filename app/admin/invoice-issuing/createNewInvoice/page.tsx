import InvoiceForm from "@/app/components/InvoiceForm";
import prisma from "@/prisma/client";
import { User } from "@prisma/client";

const CreateNewInvoicePage = async () => {
  const users: User[] = await prisma.user.findMany({ where: { role: "USER" } });

  return (
    <div>
      <InvoiceForm Userlist={users} />
    </div>
  );
};

export default CreateNewInvoicePage;
