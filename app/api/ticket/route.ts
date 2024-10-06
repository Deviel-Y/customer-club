import { ticketSchema } from "@/app/libs/validationSchema";
import prisma from "@/prisma/client";
import { Ticket } from "@prisma/client";
import { getSession } from "next-auth/react";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (request: NextRequest) => {
  try {
    const session = await getSession();

    const body: Ticket = await request.json();
    const { subject, title } = body;

    const validation = ticketSchema.safeParse(body);
    if (!validation.success)
      return NextResponse.json(validation.error.format(), { status: 400 });

    const newTicket = await prisma.ticket.create({
      data: {
        subject,
        title: title.trim(),
        issuerId: session?.user.id!,
      },
    });
    return NextResponse.json(newTicket, { status: 201 });
  } catch (error) {
    return NextResponse.json(error, { status: 500 });
  }
};
