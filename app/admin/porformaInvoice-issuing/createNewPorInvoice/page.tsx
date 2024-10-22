import getSession from "@/app/libs/getSession";
import { authorizeAdmin } from "@/app/utils/authorizeRole";
import prisma from "@/prisma/client";
import { User } from "@prisma/client";
import PorInvoiceForm from "../../components/PorInvoiceForm";

const CreateNewInvoicePage = async () => {
  const session = await getSession();
  authorizeAdmin(session!);

  const users: User[] = await prisma.user.findMany({
    where: { role: "CUSTOMER" },
  });

  return (
    <div className="py-5 max-sm:py-2 px-2">
      <PorInvoiceForm Userlist={users} />
    </div>
  );
};

export default CreateNewInvoicePage;
