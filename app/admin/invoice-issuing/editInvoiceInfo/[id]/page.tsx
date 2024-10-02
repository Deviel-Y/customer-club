import InvoiceForm from "@/app/admin/components/InvoiceForm";
import prisma from "@/prisma/client";
import { notFound } from "next/navigation";

interface Props {
  params: { id: string };
}

const EditInvoiceInfoPage = async ({ params: { id } }: Props) => {
  const invoice = await prisma.invoice.findUnique({ where: { id } });
  const users = await prisma.user.findMany({ where: { role: "USER" } });

  if (!invoice) notFound();

  return (
    <div>
      <InvoiceForm Userlist={users} invoice={invoice} />
    </div>
  );
};

export default EditInvoiceInfoPage;
