import TicketActionBar from "@/app/components/TicketActionBar";
import getSession from "@/app/libs/getSession";
import { authorizeAdmin } from "@/app/utils/authorizeRole";
import prisma from "@/prisma/client";
import { Category, TicketStatus } from "@prisma/client";
import { subWeeks } from "date-fns";
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

  const currentDate = new Date();
  const startOfOneWeekAgo = subWeeks(currentDate, 1);
  startOfOneWeekAgo.setHours(0, 0, 0, 0);

  const endOfOneWeekAgo = subWeeks(currentDate, 1);
  endOfOneWeekAgo.setHours(23, 59, 59, 999);

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

  const [updatedTickets, tickets, ticketCountCount] = await prisma.$transaction(
    [
      //Set tickets statuses that are one week old and their last message is sent by customer
      prisma.ticket.updateMany({
        where: {
          status: "INVESTIGATING",
          ticketMessage: {
            some: {
              messageType: "REQUEST",
              createdAt: { gte: startOfOneWeekAgo, lte: endOfOneWeekAgo },
            },
          },
        },

        data: { status: "CLOSED" },
      }),

      prisma.ticket.findMany({
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
      }),

      prisma.ticket.count({
        where: {
          category: { equals: categoryFilterEnum },
          title: { contains: title },
          User: {
            companyName: { contains: companyName },
            companyBranch: { contains: companyBranch },
          },
          status: statusFilterEnum,
        },
      }),
    ]
  );

  prisma.log.create({
    data: {
      assignedToSection: "TICKET",
      issuer: " ",
      message: `تعداد ${updatedTickets.count} به صورت خودکار به دلیل عدم پاسخگویی از سوی مشتری بسته شد`,
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

const pageSize: number = 6;
