import {
  ModifyPorInvoiceType,
  modifyPorInvoice,
} from "@/app/libs/validationSchema";
import prisma from "@/prisma/client";
import { endOfDay, startOfDay } from "date-fns";
import { NextRequest, NextResponse } from "next/server";

export const DELETE = async (request: NextRequest) => {
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
    const archivedInvoices = await prisma.archivedInvoice.findMany({
      where: { createdAt: { lte: toDateEnd, gte: fromDateStart } },
    });
    if (archivedInvoices.length === 0)
      return NextResponse.json("فاکتور در تاریخ ثبت شده یافت نشد", {
        status: 404,
      });

    const archivedInvoiceIds = archivedInvoices.map(
      (por_invoice) => por_invoice.id
    );

    await prisma.archivedInvoice.deleteMany({
      where: { id: { in: archivedInvoiceIds } },
    });

    return NextResponse.json("Selected invoices have been deleted", {
      status: 201,
    });
  } catch (error) {
    return NextResponse.json(error, { status: 500 });
  }
};
