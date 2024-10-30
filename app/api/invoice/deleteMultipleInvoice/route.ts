import getSession from "@/app/libs/getSession";
import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export const DELETE = async (request: NextRequest) => {
  const session = await getSession();

  if (!session)
    return NextResponse.json("you're not authenticated", { status: 401 });

  try {
    const body = await request.json();

    const [invoiceList, deletedInvoices, issuer] = await prisma.$transaction([
      prisma.invoice.findMany({
        where: { id: { in: body } },
        select: { invoiceNumber: true },
      }),

      prisma.invoice.deleteMany({
        where: { id: { in: body } },
      }),

      prisma.user.findUnique({
        where: { id: session?.user.id! },
        select: { adminName: true },
      }),
    ]);

    const deletedInvoiceNumbers = invoiceList
      .map((invoiceList) => invoiceList.invoiceNumber)
      .join(", ");

    await prisma.log.create({
      data: {
        assignedToSection: "INVOICE",
        issuer: issuer?.adminName!,
        message: `کاربر ${issuer?.adminName} تعداد ${deletedInvoices.count} فاکتور به شماره های ${deletedInvoiceNumbers} را حذف کرد`,
      },
    });

    return NextResponse.json(deletedInvoices);
  } catch (error) {
    return NextResponse.json(error, { status: 500 });
  }
};
