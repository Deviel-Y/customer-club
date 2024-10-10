import {
  ticketMessageSchema,
  TicketMessageSchemaType,
} from "@/app/libs/validationSchema";
import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

interface Props {
  params: { id: string };
}

export const DELETE = async (
  request: NextRequest,
  { params: { id } }: Props
) => {
  const message = await prisma.ticketMessage.findUnique({ where: { id } });
  if (!message) return NextResponse.json("Message not found", { status: 404 });

  const deletedMessage = await prisma.ticketMessage.delete({ where: { id } });
  return NextResponse.json(deletedMessage);
};

export const PATCH = async (
  request: NextRequest,
  { params: { id } }: Props
) => {
  const body: TicketMessageSchemaType = await request.json();
  const { message } = body;

  const validation = ticketMessageSchema.safeParse(body);
  if (!validation.success)
    return NextResponse.json(validation.error.format(), { status: 400 });

  const updatedMessage = await prisma.ticketMessage.update({
    where: { id },
    data: { message },
  });

  return NextResponse.json(updatedMessage);
};
