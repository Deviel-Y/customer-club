import getSession from "@/app/libs/getSession";
import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

interface Props {
  params: { id: string };
}

export const PATCH = async (
  request: NextRequest,
  { params: { id } }: Props
) => {
  const session = await getSession();

  const body = await request.json();
  const { ticketId } = body;

  const ticket = await prisma.ticket.findUnique({
    where: { id },
    select: { ticketNumber: true },
  });
  if (!ticket) return NextResponse.json("Ticket not found", { status: 404 });

  try {
    const [issuer, updatedTicket] = await prisma.$transaction([
      prisma.user.findUnique({
        where: { id: session?.user.id },
        select: { adminName: true },
      }),

      prisma.ticket.update({
        where: { id: ticketId },
        data: { status: "CLOSED" },
        select: { ticketNumber: true },
      }),

      prisma.ticketMessage.updateMany({
        where: { assignetoTicketId: ticketId },
        data: { canBeModified: false },
      }),
    ]);

    await prisma.log.create({
      data: {
        assignedToSection: "TICKET",
        issuer: issuer?.adminName!,
        message: `تیکت شماره ${updatedTicket.ticketNumber} توسط ${issuer?.adminName} بسته شد`,
      },
    });

    return NextResponse.json(
      `Ticket ${ticket.ticketNumber} has been closed by ${issuer?.adminName}`
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(error, { status: 500 });
  }
};
