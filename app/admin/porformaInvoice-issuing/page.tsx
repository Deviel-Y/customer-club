import ActionBar from "@/app/components/ActionBar";
import getSession from "@/app/libs/getSession";
import { authorizeAdmin } from "@/app/utils/authorizeRole";
import prisma from "@/prisma/client";
import { Status } from "@prisma/client";
import dynamic from "next/dynamic";

interface Props {
  searchParams: {
    number: string;
    description: string;
    organization: string;
    organizationBranch: string;
    pageNumber: number;
    statusFilter: string;
  };
}

const porformaInvoiceListPage = async ({
  searchParams: {
    description,
    number,
    organization,
    organizationBranch,
    pageNumber,
    statusFilter,
  },
}: Props) => {
  const session = await getSession();
  authorizeAdmin(session!);

  await prisma.porformaInvoice.updateMany({
    where: {
      expiredAt: { lt: new Date(new Date().setHours(0, 0, 0, 0)) },
      status: "IN_PROGRESS",
    },
    data: {
      status: "EXPIRED",
    },
  });
  const prismaStatus = Object.values(Status);
  const allStatuses = [...prismaStatus, "ALL"];
  const statusFilterEnum =
    statusFilter === "ALL" || !allStatuses.includes(statusFilter)
      ? undefined
      : (statusFilter as Status);

  const currentPage = pageNumber || 1;

  const [porformaInvoiceCount, adminSidePorformaInvoiceList] =
    await prisma.$transaction([
      prisma.porformaInvoice.count({
        where: {
          description: { contains: description },
          porformaInvoiceNumber: { contains: number },
          organization: { contains: organization },
          organizationBranch: { contains: organizationBranch },
          status: statusFilterEnum,
        },
      }),

      prisma.porformaInvoice.findMany({
        where: {
          description: { contains: description },
          porformaInvoiceNumber: { contains: number },
          organization: { contains: organization },
          organizationBranch: { contains: organizationBranch },
          status: statusFilterEnum,
        },
        take: pageSize,
        skip: (currentPage - 1) * pageSize,
        orderBy: { createdAt: "desc" },
      }),
    ]);

  const AdminPorformaInvoiceTable = dynamic(
    () =>
      import("@/app/admin/porformaInvoice-issuing/AdminPorformaInvoiceTable"),
    {
      ssr: false,
    }
  );

  return (
    <div className="flex flex-col gap-5 px-5 py-2 w-full">
      <ActionBar isAdmin />

      <AdminPorformaInvoiceTable
        buttonLabel="صدور پیش فاکتور جدید"
        endpoint="/admin/porformaInvoice-issuing/createNewPorInvoice"
        userRole={session?.user.role!}
        porformaInvoice={adminSidePorformaInvoiceList}
        totalPage={Math.ceil(porformaInvoiceCount / pageSize)}
      />
    </div>
  );
};

export default porformaInvoiceListPage;

const pageSize: number = 6;
