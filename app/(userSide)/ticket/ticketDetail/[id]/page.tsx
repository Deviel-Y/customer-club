import MessageCard from "@/app/admin/ticket/ticketDetail/[id]/MessageCard";
import NewTicketMessagaForm from "@/app/components/NewTicketMessagaForm";
import getSession from "@/app/libs/getSession";
import { authorizeUser } from "@/app/utils/authorizeRole";
import prisma from "@/prisma/client";
import { Category } from "@prisma/client";
import { notFound } from "next/navigation";

interface Props {
  params: { id: string };
}

const TicketDetailPage = async ({ params: { id } }: Props) => {
  const session = await getSession();
  authorizeUser(session!);

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
    <div className="flex flex-col items-start w-full p-5">
      <div className="mb-10 flex flex-col">
        <h2 className="text-[23px]">{ticket.title}</h2>
        <p className="text-[15px] text-gray-500 -translate-y-1">
          {categoryMapping[ticket.category].label}
        </p>
      </div>

      {ticketMessages.map((message) => (
        <MessageCard
          sessionId={session?.user.id!}
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

const categoryMapping: Record<Category, { label: string }> = {
  FEATURE_REQUEST: {
    label: "درخواست ویژگی جدید",
  },
  GENERAL_INQUIRY: { label: "سوالات عمومی" },
  PAYMENT: {
    label: "صورتحساب و پردخت ها",
  },
  TECHNICAL_SUPPORT: {
    label: "پشتیبانی فنی",
  },
};