import prisma from "@/prisma/client";
import { PorformaInvoice } from "@prisma/client";
import ActionBar from "../../components/ActionBar";
import getSession from "../../libs/getSession";
import { authorizeUser } from "../../utils/authorizeRole";
import UserPorformaInvoiceTable from "./UserPorformaInvoiceTable";

interface Props {
  searchParams: {
    number: string;
    description: string;
    pageNumber: number;
  };
}

const PorformaInvoicePage = async ({
  searchParams: { number, description, pageNumber },
}: Props) => {
  const session = await getSession();
  authorizeUser(session!);

  await prisma.porformaInvoice.updateMany({
    where: {
      expiredAt: { lt: new Date(new Date().setHours(0, 0, 0, 0)) },
      status: "IN_PROGRESS",
    },
    data: {
      status: "EXPIRED",
    },
  });

  const currentPage = pageNumber || 1;

  const porInvoiceCount: number = await prisma.porformaInvoice.count({
    where: {
      description: { contains: description },
      porformaInvoiceNumber: { contains: number },
      expiredAt: { gt: new Date() },
    },
  });

  const userPorInvoice: PorformaInvoice[] =
    await prisma.porformaInvoice.findMany({
      where: {
        assignedToUserId: session?.user.id,
        porformaInvoiceNumber: { contains: number },
        description: { contains: description },
        expiredAt: { gt: new Date() },
      },
      take: pageSize,
      skip: (currentPage - 1) * pageSize,
    });

  return (
    <div className="flex flex-col gap-5 p-10 w-full">
      <ActionBar isAdmin={false} />

      <UserPorformaInvoiceTable
        totalPage={Math.ceil(porInvoiceCount / pageSize)}
        invoices={userPorInvoice}
      />
    </div>
  );
};

export default PorformaInvoicePage;

const pageSize: number = 6;
