import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

interface Props {
  params: { id: string };
}

export const DELETE = async (
  request: NextRequest,
  { params: { id } }: Props
) => {
  const deletedInvoice = await prisma.invoice.delete({
    where: { id },
  });

  return NextResponse.json(deletedInvoice);
};
