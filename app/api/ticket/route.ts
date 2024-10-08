import getSession from "@/app/libs/getSession";
import { ticketSchema, TicketSchemaType } from "@/app/libs/validationSchema";
import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (request: NextRequest) => {
  try {
    const session = await getSession();

    const body: TicketSchemaType = await request.json();
    const { category, title } = body;

    const validation = ticketSchema.safeParse(body);
    if (!validation.success)
      return NextResponse.json(validation.error.format(), { status: 400 });

    const newTicket = await prisma.ticket.create({
      data: {
        category,
        title: title.trim(),
        issuerId: session?.user.id!,
      },
    });
    return NextResponse.json(newTicket, { status: 201 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(error, { status: 500 });
  }
};
