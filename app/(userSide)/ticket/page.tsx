import getSession from "@/app/libs/getSession";
import { authorizeUser } from "@/app/utils/authorizeRole";
import prisma from "@/prisma/client";
import NewTicketPopoverButton from "./NewTicketPopoverButton";
import UserTicketListTable from "./UserTicketListTable";

const TicketIssuingPage = async () => {
  const session = await getSession();
  authorizeUser(session!);

  const tickets = await prisma.ticket.findMany({
    where: {
      issuerId: session?.user.id,
    },
  });

  return (
    <div className="flex flex-col gap-5 px-5 py-2 w-full">
      <NewTicketPopoverButton />

      <UserTicketListTable tickets={tickets} />
    </div>
  );
};

export default TicketIssuingPage;
