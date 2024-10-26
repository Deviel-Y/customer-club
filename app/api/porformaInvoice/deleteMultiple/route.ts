import getSession from "@/app/libs/getSession";
import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export const DELETE = async (request: NextRequest) => {
  const session = await getSession();

  try {
    const body: string[] = await request.json();

    const [porInvoicesList, deleteSelectedPorInvoices, issuer] =
      await prisma.$transaction([
        prisma.porformaInvoice.findMany({
          where: { id: { in: body } },
          select: { porformaInvoiceNumber: true },
        }),

        prisma.porformaInvoice.deleteMany({
          where: { id: { in: body } },
        }),

        prisma?.user?.findUnique({
          where: {
            id: session?.user.id,
          },
          select: { adminName: true },
        }),
      ]);

    const deletedPorInvoiceNumbers = porInvoicesList
      .map((porInvoice) => porInvoice.porformaInvoiceNumber)
      .join(", ");

    await prisma.log.create({
      data: {
        assignedToSection: "POR_INVOICE",
        issuer: issuer?.adminName!,
        message: `کاربر ${issuer?.adminName} تعداد ${deleteSelectedPorInvoices.count} به شماره های ${deletedPorInvoiceNumbers} را حذف کرد`,
      },
    });

    return NextResponse.json("Selected porforma invoices have been deleted");
  } catch (error) {
    return NextResponse.json(error, { status: 500 });
  }
};
