import getSession from "@/app/libs/getSession";
import { authorizeAdmin } from "@/app/utils/authorizeRole";
import prisma from "@/prisma/client";
import TicketListTable from "./TicketListTable";

const AdminTicketListPage = async () => {
  const session = await getSession();
  authorizeAdmin(session!);

  const tickets = await prisma.ticket.findMany({
    include: { User: true },
  });

  return (
    <div className="px-5 py-2 w-full">
      <TicketListTable tickets={tickets} />
    </div>
  );
};

export default AdminTicketListPage;
