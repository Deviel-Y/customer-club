import TicketActionBar from "@/app/components/TicketActionBar";
import getSession from "@/app/libs/getSession";
import { authorizeUser } from "@/app/utils/authorizeRole";
import prisma from "@/prisma/client";
import { TicketStatus } from "@prisma/client";
import UserTicketListTable from "./UserTicketListTable";

interface Props {
  searchParams: {
    subject: string;
    title: string;
    statusFilter: string;
    pageNumber: number;
  };
}

const TicketIssuingPage = async ({
  searchParams: { pageNumber, statusFilter, subject, title },
}: Props) => {
  const session = await getSession();
  authorizeUser(session!);

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
      subject: { contains: subject },
      status: { equals: statusFilterEnum },

      issuerId: session?.user.id,
    },
    take: pageSize,
    skip: (currentPage - 1) * pageSize,
    orderBy: { createdAt: "desc" },
  });

  const ticketCountCount: number = await prisma.ticket.count({
    where: {
      subject: { contains: subject },
      title: { contains: title },
      status: statusFilterEnum,
    },
  });

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