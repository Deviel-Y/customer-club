import getSession from "@/app/libs/getSession";
import { ticketMessageSchema } from "@/app/libs/validationSchema";
import prisma from "@/prisma/client";
import { TicketMessage } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (request: NextRequest) => {
  try {
    const session = await getSession();

    const body: TicketMessage = await request.json();
    const { assignetoTicketId, message } = body;

    const validation = ticketMessageSchema.safeParse(body);
    if (!validation.success)
      return NextResponse.json(validation.error.format(), { status: 400 });

    const newMesaage = await prisma.ticketMessage.create({
      data: {
        message,
        assignetoTicketId,
        messageType: session?.user.role === "ADMIN" ? "RESPONCE" : "REQUEST",
      },
    });

    return NextResponse.json(newMesaage);
  } catch (error) {
    return NextResponse.json(error);
  }
};
