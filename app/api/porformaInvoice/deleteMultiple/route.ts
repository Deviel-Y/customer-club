import getSession from "@/app/libs/getSession";
import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export const DELETE = async (request: NextRequest) => {
  const session = await getSession();

  try {
    const body: string[] = await request.json();

    const [deletedPorInvoices, deletedPorInvoiceNumbers, issuer] =
      await prisma.$transaction([
        prisma.porformaInvoice.deleteMany({
          where: { id: { in: body } },
        }),

        prisma.porformaInvoice.findMany({
          where: { porformaInvoiceNumber: { in: body } },
          select: { porformaInvoiceNumber: true },
        }),

        prisma?.user?.findUnique({
          where: {
            id: session?.user.id,
          },
          select: { adminName: true },
        }),
      ]);

    const deletedPorInvoiceIds = deletedPorInvoiceNumbers
      .map((porInvoice) => porInvoice.porformaInvoiceNumber)
      .join(", ");

    await prisma.log.create({
      data: {
        assignedToSection: "POR_INVOICE",
        issuer: issuer?.adminName!,
        message: `کاربر پیش فاکتور به شماره های ${deletedPorInvoiceIds} را حذف کرد`,
      },
    });

    return NextResponse.json(deletedPorInvoices);
  } catch (error) {
    return NextResponse.json(error, { status: 500 });
  }
};
