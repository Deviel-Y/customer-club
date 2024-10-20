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
    const porformaInvoices = await prisma.archivedPorformaInvoice.findMany({
      where: { createdAt: { lte: toDateEnd, gte: fromDateStart } },
    });
    if (porformaInvoices.length === 0)
      return NextResponse.json("پیش فاکتور در تاریخ ثبت شده یافت نشد", {
        status: 404,
      });

    await prisma.porformaInvoice.createMany({
      data: porformaInvoices.map((por_invoice) => ({
        assignedToUserId: por_invoice.assignedToUserId,
        description: por_invoice.description,
        issuerId: por_invoice.issuerId,
        organization: por_invoice.organization,
        organizationBranch: por_invoice.organizationBranch,
        status: por_invoice.status,
        porformaInvoiceNumber: por_invoice.porformaInvoiceNumber,
        createdAt: por_invoice.createdAt,
        expiredAt: por_invoice.expiredAt!,
      })),
    });

    await prisma.archivedPorformaInvoice.deleteMany({
      where: { createdAt: { lte: toDateEnd, gte: fromDateStart } },
    });

    return NextResponse.json("Selected porforma invoices have been restored", {
      status: 201,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(error, { status: 500 });
  }
};
