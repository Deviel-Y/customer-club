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

  const [porInvoiceCount, userPorInvoice, expiredPorInvoice] =
    await prisma.$transaction([
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

      prisma.porformaInvoice.findMany({
        where: {
          expiredAt: { lt: new Date(new Date().setHours(0, 0, 0, 0)) },
          status: "IN_PROGRESS",
        },
      }),
    ]);

  const expiredPorInvoiceIds = expiredPorInvoice.map(
    (por_invoice) => por_invoice.id
  );

  await prisma.porformaInvoice.updateMany({
    where: {
      id: { in: expiredPorInvoiceIds },
      expiredAt: { lt: new Date(new Date().setHours(0, 0, 0, 0)) },
    },
    data: { status: "EXPIRED" },
  });

  expiredPorInvoice.forEach(async (invocie) => {
    await prisma.notification.create({
      data: {
        assignedToSection: "POR_INVOICE",
        message: `پیش فاکتور شماره ${invocie.porformaInvoiceNumber} منضقی شد`,
        assignedToPorInvoiceId: invocie.id,
        users: { connect: { id: session?.user.id } },
        type: "EXPIRED",
      },
    });
  });

  return (
    <div className="flex flex-col gap-5 px-5 py-2 max-sm:py-5 w-full">
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
