import getSession from "@/app/libs/getSession";
import { authorizeAdmin } from "@/app/utils/authorizeRole";
import prisma from "@/prisma/client";
import { User } from "@prisma/client";
import PorInvoiceForm from "../../components/PorInvoiceForm";

const CreateNewInvoicePage = async () => {
  const session = await getSession();
  authorizeAdmin(session!);

  const users: User[] = await prisma.user.findMany({ where: { role: "USER" } });

  return (
    <div>
      <PorInvoiceForm Userlist={users} />
    </div>
  );
};

export default CreateNewInvoicePage;