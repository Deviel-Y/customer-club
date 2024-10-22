import InvoiceForm from "@/app/admin/components/InvoiceForm";
import getSession from "@/app/libs/getSession";
import { authorizeAdmin } from "@/app/utils/authorizeRole";
import prisma from "@/prisma/client";
import { notFound } from "next/navigation";

interface Props {
  params: { id: string };
}

const EditInvoiceInfoPage = async ({ params: { id } }: Props) => {
  const session = await getSession();
  authorizeAdmin(session!);

  const [invoice, users] = await prisma.$transaction([
    prisma.invoice.findUnique({ where: { id } }),

    prisma.user.findMany({ where: { role: "CUSTOMER" } }),
  ]);

  if (!invoice) notFound();

  return (
    <div>
      <InvoiceForm Userlist={users} invoice={invoice} />
    </div>
  );
};

export default EditInvoiceInfoPage;
