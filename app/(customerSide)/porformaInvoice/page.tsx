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

  //Assure that user sends proper proforma invoice status to back-end
  const statusFilterEnum =
    statusFilter === "ALL" ? undefined : (statusFilter as Status);

  const [porInvoiceCount, userPorInvoice, expiredPorInvoice] =
    await prisma.$transaction([
      //porInvoiceCount
      prisma.porformaInvoice.count({
        where: {
          description: { contains: description },
          porformaInvoiceNumber: { contains: number },
          status: statusFilterEnum,
        },
      }),

      //userPorInvoice
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

      //expiredPorInvoice : This is used for creating notification record
      prisma.porformaInvoice.findMany({
        where: {
          expiredAt: { lt: new Date(new Date().setHours(0, 0, 0, 0)) },
          status: "IN_PROGRESS",
        },
      }),
    ]);

  //Getting the list of expired porforma invoice IDs
  const expiredPorInvoiceIds = expiredPorInvoice.map(
    (por_invoice) => por_invoice.id
  );

  //Update expired porforma invoice statuses to EXPIRED
  await prisma.porformaInvoice.updateMany({
    where: {
      id: { in: expiredPorInvoiceIds },
      expiredAt: { lt: new Date(new Date().setHours(0, 0, 0, 0)) },
    },
    data: { status: "EXPIRED" },
  });

  //Create notification record for each porforma invoices that has expired
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
