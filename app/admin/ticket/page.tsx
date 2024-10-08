import TicketActionBar from "@/app/components/TicketActionBar";
import getSession from "@/app/libs/getSession";
import { authorizeAdmin } from "@/app/utils/authorizeRole";
import prisma from "@/prisma/client";
import { Category, TicketStatus } from "@prisma/client";
import TicketListTable from "./TicketListTable";

interface Props {
  searchParams: {
    category: Category;
    title: string;
    statusFilter: string;
    companyName: string;
    companyBranch: string;
    pageNumber: number;
  };
}

const AdminTicketIssuingPage = async ({
  searchParams: {
    companyBranch,
    companyName,
    pageNumber,
    statusFilter,
    category,
    title,
  },
}: Props) => {
  const session = await getSession();
  authorizeAdmin(session!);

  const prismaCategory = Object.values(Category);
  const categoryFilterEnum = prismaCategory.includes(category)
    ? (category as Category)
    : undefined;

  const prismaStatus = Object.values(TicketStatus);
  const allStatuses = [...prismaStatus, "ALL"];
  const statusFilterEnum =
    statusFilter === "ALL" || !allStatuses.includes(statusFilter)
      ? undefined
      : (statusFilter as TicketStatus);

  const currentPage = pageNumber || 1;
  const pageSize: number = 6;

  const tickets = await prisma.ticket.findMany({
    where: {
      title: { contains: title },
      category: { equals: categoryFilterEnum },
      User: {
        companyName: { contains: companyName },
        companyBranch: { contains: companyBranch },
      },
      status: { equals: statusFilterEnum },
    },
    take: pageSize,
    skip: (currentPage - 1) * pageSize,
    orderBy: { createdAt: "desc" },
    include: { User: true },
  });

  const ticketCountCount: number = await prisma.ticket.count({
    where: {
      category: { equals: categoryFilterEnum },
      title: { contains: title },
      User: {
        companyName: { contains: companyName },
        companyBranch: { contains: companyBranch },
      },
      status: statusFilterEnum,
    },
  });

  return (
    <div className="flex flex-col gap-5 px-5 py-2 w-full">
      <TicketActionBar isAdmin />

      <TicketListTable
        totalPage={Math.ceil(ticketCountCount / pageSize)}
        tickets={tickets}
      />
    </div>
  );
};

export default AdminTicketIssuingPage;
