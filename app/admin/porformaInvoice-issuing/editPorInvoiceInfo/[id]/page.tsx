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

  const [porformaInvoice, users] = await prisma.$transaction([
    prisma.porformaInvoice.findUnique({
      where: { id },
    }),

    prisma.user.findMany({ where: { role: "CUSTOMER" } }),
  ]);

  if (!porformaInvoice) notFound();

  return (
    <div>
      <PorInvoiceForm Userlist={users} porInvoice={porformaInvoice} />
    </div>
  );
};

export default EditPorInvoiceInfoPage;
