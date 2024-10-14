import TicketActionBar from "@/app/components/TicketActionBar";
import getSession from "@/app/libs/getSession";
import { authorizeUser } from "@/app/utils/authorizeRole";
import prisma from "@/prisma/client";
import { Category, TicketStatus } from "@prisma/client";
import UserTicketListTable from "./UserTicketListTable";

interface Props {
  searchParams: {
    category: Category;
    title: string;
    statusFilter: string;
    pageNumber: number;
  };
}

const TicketIssuingPage = async ({
  searchParams: { pageNumber, statusFilter, category, title },
}: Props) => {
  const session = await getSession();
  authorizeUser(session!);

  const prismaCategory = Object.values(Category);
  const categoryFilterEnum = prismaCategory.includes(category)
    ? category
    : undefined;

  const prismaStatus = Object.values(TicketStatus);
  const allStatuses = [...prismaStatus, "ALL"];
  const statusFilterEnum =
    statusFilter === "ALL" || !allStatuses.includes(statusFilter)
      ? undefined
      : (statusFilter as TicketStatus);

  const currentPage = pageNumber || 1;
  const pageSize: number = 6;

  const [tickets, ticketCountCount] = await Promise.all([
    prisma.ticket.findMany({
      where: {
        title: { contains: title },
        category: { equals: categoryFilterEnum },
        status: { equals: statusFilterEnum },

        issuerId: session?.user.id,
      },
      take: pageSize,
      skip: (currentPage - 1) * pageSize,
      orderBy: { createdAt: "desc" },
    }),

    prisma.ticket.count({
      where: {
        category: { equals: categoryFilterEnum },
        title: { contains: title },
        status: statusFilterEnum,
      },
    }),
  ]);

  return (
    <div className="flex flex-col gap-5 px-5 py-2 w-full">
      <TicketActionBar isAdmin={false} />

      <UserTicketListTable
        totalPage={Math.ceil(ticketCountCount / pageSize)}
        tickets={tickets}
      />
    </div>
  );
};

export default TicketIssuingPage;
