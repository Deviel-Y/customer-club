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
