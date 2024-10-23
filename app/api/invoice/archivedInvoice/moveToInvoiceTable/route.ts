import {
  ModifyPorInvoiceType,
  modifyPorInvoice,
} from "@/app/libs/validationSchema";
import prisma from "@/prisma/client";
import { endOfDay, startOfDay } from "date-fns";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (request: NextRequest) => {
  const body: ModifyPorInvoiceType = await request.json();
  const { fromDate, toDate } = body;

  const fromDateStart = startOfDay(fromDate);
  const toDateEnd = endOfDay(toDate);

  const validation = modifyPorInvoice.safeParse(body);
  if (!validation.success)
    return NextResponse.json("ورودی داده صحیح نیست", { status: 400 });

  if (fromDate > toDate)
    return NextResponse.json("تاریخ پایان باید از تاریخ شروع جدید تر باشد", {
      status: 400,
    });

  try {
    const Invoices = await prisma.archivedInvoice.findMany({
      where: { createdAt: { lte: toDateEnd, gte: fromDateStart } },
    });
    if (Invoices.length === 0)
      return NextResponse.json("پیش فاکتور در تاریخ ثبت شده یافت نشد", {
        status: 404,
      });

    await prisma.$transaction([
      prisma.invoice.createMany({
        data: Invoices.map((invoice) => ({
          assignedToUserId: invoice.assignedToUserId,
          description: invoice.description,
          issuerId: invoice.issuerId,
          organization: invoice.organization,
          organizationBranch: invoice.organizationBranch,
          invoiceNumber: invoice.InvoiceNumber,
          createdAt: invoice.createdAt,
          price: invoice.price,
          tax: invoice.tax,
          priceWithTax: invoice.priceWithTax,
        })),
      }),

      prisma.archivedInvoice.deleteMany({
        where: { createdAt: { lte: toDateEnd, gte: fromDateStart } },
      }),
    ]);

    return NextResponse.json("Selected porforma invoices have been restored", {
      status: 201,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(error, { status: 500 });
  }
};
