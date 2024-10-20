import {
  archivePorInvoiceDate,
  ArchivePorInvoiceDateType,
} from "@/app/libs/validationSchema";
import prisma from "@/prisma/client";
import { endOfDay, startOfDay } from "date-fns";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (request: NextRequest) => {
  const body: ArchivePorInvoiceDateType = await request.json();
  const { fromDate, toDate } = body;

  const fromDateStart = startOfDay(fromDate);
  const toDateEnd = endOfDay(toDate);

  const validation = archivePorInvoiceDate.safeParse(body);
  if (!validation.success)
    return NextResponse.json("ورودی داده صحیح نیست", { status: 400 });

  if (fromDate > toDate)
    return NextResponse.json("تاریخ پایان باید از تاریخ شروع جدید تر باشد", {
      status: 400,
    });

  try {
    const archivedPorformaInvoices =
      await prisma.archivedPorformaInvoice.findMany({
        where: { createdAt: { lte: toDateEnd, gte: fromDateStart } },
      });
    if (archivedPorformaInvoices.length === 0)
      return NextResponse.json("پیش فاکتور در تاریخ ثبت شده یافت نشد", {
        status: 404,
      });

    const archivedPorformaInvoiceIds = archivedPorformaInvoices.map(
      (por_invoice) => por_invoice.id
    );

    await prisma.archivedPorformaInvoice.deleteMany({
      where: { id: { in: archivedPorformaInvoiceIds } },
    });

    return NextResponse.json("Selected porforma invoices have been deleted", {
      status: 201,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(error, { status: 500 });
  }
};
