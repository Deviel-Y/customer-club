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
    const porformaInvoices = await prisma.porformaInvoice.findMany({
      where: { createdAt: { lte: toDateEnd, gte: fromDateStart } },
    });
    if (porformaInvoices.length === 0)
      return NextResponse.json("پیش فاکتور در تاریخ ثبت شده یافت نشد", {
        status: 404,
      });

    await prisma.archivedPorformaInvoice.createMany({
      data: porformaInvoices.map((por_invoice) => ({
        assignedToUserId: por_invoice?.assignedToUserId,
        description: por_invoice?.description,
        issuerId: por_invoice?.issuerId,
        organization: por_invoice?.organization,
        organizationBranch: por_invoice?.organizationBranch,
        porformaInvoiceNumber: por_invoice?.porformaInvoiceNumber,
        createdAt: por_invoice?.createdAt,
        expiredAt: por_invoice?.expiredAt,
        status: por_invoice.status,
      })),
    });

    await prisma.porformaInvoice.deleteMany({
      where: { createdAt: { lte: toDateEnd, gte: fromDateStart } },
    });

    return NextResponse.json("Selected porforma invoices have been archived", {
      status: 201,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(error, { status: 500 });
  }
};
