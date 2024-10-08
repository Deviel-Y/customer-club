import NewTicketMessagaForm from "@/app/components/NewTicketMessagaForm";
import getSession from "@/app/libs/getSession";
import { authorizeAdmin } from "@/app/utils/authorizeRole";
import prisma from "@/prisma/client";
import { notFound } from "next/navigation";
import MessageCard from "./MessageCard";

interface Props {
  params: { id: string };
}

const TicketDetailPage = async ({ params: { id } }: Props) => {
  const session = await getSession();
  authorizeAdmin(session!);

  const ticket = await prisma.ticket.findUnique({
    where: { id },
  });

  if (!ticket) notFound();

  const ticketMessages = await prisma.ticketMessage.findMany({
    where: {
      assignetoTicketId: id,
    },
  });

  const users = await prisma.user.findMany();

  return (
    <div className="flex flex-col items-start w-full mt-5 p-5">
      {ticketMessages.map((message) => (
        <MessageCard
          key={message.id}
          ticket={ticket!}
          ticketMessages={message}
          users={users}
        />
      ))}

      <NewTicketMessagaForm ticketId={ticket?.id} />
    </div>
  );
};

export default TicketDetailPage;
