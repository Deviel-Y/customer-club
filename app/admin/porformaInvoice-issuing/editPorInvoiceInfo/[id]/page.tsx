import PorInvoiceForm from "@/app/admin/components/PorInvoiceForm";
import getSession from "@/app/libs/getSession";
import { authorizeAdmin } from "@/app/utils/authorizeRole";
import prisma from "@/prisma/client";
import { notFound } from "next/navigation";

interface Props {
  params: { id: string };
}

const EditPorInvoiceInfoPage = async ({ params: { id } }: Props) => {
  const session = await getSession();
  authorizeAdmin(session!);

  const [porformaInvoice, users] = await Promise.all([
    prisma.porformaInvoice.findUnique({
      where: { id },
    }),

    prisma.user.findMany({ where: { role: "USER" } }),
  ]);

  if (!porformaInvoice) notFound();

  return (
    <div>
      <PorInvoiceForm Userlist={users} PorInvoice={porformaInvoice} />
    </div>
  );
};

export default EditPorInvoiceInfoPage;
