import PorInvoiceForm from "@/app/admin/components/PorInvoiceForm";
import prisma from "@/prisma/client";
import { notFound } from "next/navigation";

interface Props {
  params: { id: string };
}

const EditInvoiceInfoPage = async ({ params: { id } }: Props) => {
  const porformaInvoice = await prisma.porformaInvoice.findUnique({
    where: { id },
  });
  const users = await prisma.user.findMany({ where: { role: "USER" } });

  if (!porformaInvoice) notFound();

  return (
    <div>
      <PorInvoiceForm Userlist={users} PorInvoice={porformaInvoice} />
    </div>
  );
};

export default EditInvoiceInfoPage;
