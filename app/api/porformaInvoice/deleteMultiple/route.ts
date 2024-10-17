import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export const DELETE = async (request: NextRequest) => {
  try {
    const body = await request.json();

    const deletedPorInvoices = await prisma.porformaInvoice.deleteMany({
      where: { id: { in: body } },
    });

    return NextResponse.json(deletedPorInvoices);
  } catch (error) {
    return NextResponse.json(error, { status: 500 });
  }
};
