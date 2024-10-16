import prisma from "@/prisma/client";
import { Status } from "@prisma/client";
import ActionBar from "../../components/ActionBar";
import getSession from "../../libs/getSession";
import { authorizeUser } from "../../utils/authorizeRole";
import UserPorformaInvoiceTable from "./UserPorformaInvoiceTable";

interface Props {
  searchParams: {
    number: string;
    description: string;
    pageNumber: number;
    statusFilter: string;
  };
}

const PorformaInvoicePage = async ({
  searchParams: { number, description, pageNumber, statusFilter },
}: Props) => {
  const session = await getSession();
  authorizeUser(session!);

  const currentPage = pageNumber || 1;
  const statusFilterEnum =
    statusFilter === "ALL" ? undefined : (statusFilter as Status);

  await prisma.porformaInvoice.updateMany({
    where: {
      expiredAt: { lt: new Date(new Date().setHours(0, 0, 0, 0)) },
      status: "IN_PROGRESS",
    },
    data: {
      status: "EXPIRED",
    },
  });

  const [porInvoiceCount, userPorInvoice] = await Promise.all([
    prisma.porformaInvoice.count({
      where: {
        description: { contains: description },
        porformaInvoiceNumber: { contains: number },
        status: statusFilterEnum,
      },
    }),

    prisma.porformaInvoice.findMany({
      where: {
        assignedToUserId: session?.user.id,
        porformaInvoiceNumber: { contains: number },
        description: { contains: description },
        status: statusFilterEnum,
      },
      take: pageSize,
      skip: (currentPage - 1) * pageSize,
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return (
    <div className="flex flex-col gap-5 max-sm:gap-0 px-5 py-2 max-sm:p-5 max-sm:-translate-y-12 w-full">
      <ActionBar isAdmin={false} />

      <UserPorformaInvoiceTable
        totalPage={Math.ceil(porInvoiceCount / pageSize)}
        porInvoices={userPorInvoice}
      />
    </div>
  );
};

export default PorformaInvoicePage;

const pageSize: number = 6;
