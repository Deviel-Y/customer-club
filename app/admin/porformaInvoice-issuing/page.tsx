import getSession from "@/app/libs/getSession";
import { authorizeAdmin } from "@/app/utils/authorizeRole";
import prisma from "@/prisma/client";
import AdminPorformaInvoiceTable from "./AdminPorformaInvoiceTable";

interface Props {
  searchParams: {
    porformaInvoiceNumber: string;
    description: string;
    organization: string;
    organizationBranch: string;
    pageNumber: number;
  };
}

const porformaInvoiceListPage = async ({
  searchParams: {
    description,
    porformaInvoiceNumber,
    organization,
    organizationBranch,
    pageNumber,
  },
}: Props) => {
  const session = await getSession();
  authorizeAdmin(session!);

  const currentPage = pageNumber || 1;
  const pageSize: number = 6;
  const porformaInvoiceCount: number = await prisma.porformaInvoice.count({
    where: {
      description: { contains: description },
      proformaInvoiceNumber: { contains: porformaInvoiceNumber },
      organization: { contains: organization },
      organizationBranch: { contains: organizationBranch },
    },
  });

  const adminSidePorformaInvoiceList = await prisma.porformaInvoice.findMany({
    where: {
      description: { contains: description },
      proformaInvoiceNumber: { contains: porformaInvoiceNumber },
      organization: { contains: organization },
      organizationBranch: { contains: organizationBranch },
    },
    take: pageSize,
    skip: (currentPage - 1) * pageSize,
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="flex flex-col gap-1 px-5 py-2 w-full">
      <AdminPorformaInvoiceTable
        porformaInvoice={adminSidePorformaInvoiceList}
        totalPage={Math.ceil(porformaInvoiceCount / pageSize)}
      />
    </div>
  );
};

export default porformaInvoiceListPage;
