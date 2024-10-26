import getSession from "@/app/libs/getSession";
import {
  ModifyPorInvoiceType,
  modifyPorInvoice,
} from "@/app/libs/validationSchema";
import prisma from "@/prisma/client";
import { endOfDay, startOfDay } from "date-fns";
import moment from "moment-jalaali";
import { NextRequest, NextResponse } from "next/server";

export const DELETE = async (request: NextRequest) => {
  const session = await getSession();

  const body: ModifyPorInvoiceType = await request.json();
  const { fromDate, toDate } = body;

  const fromDateStart = startOfDay(fromDate);
  const toDateEnd = endOfDay(toDate);

  const jalaliFromDateStart = moment(fromDateStart).format("jYYYY/jM/jD");
  const jalaliToDateEnd = moment(toDateEnd).format("jYYYY/jM/jD");

  const validation = modifyPorInvoice.safeParse(body);
  if (!validation.success)
    return NextResponse.json("ورودی داده صحیح نیست", { status: 400 });

  if (fromDate > toDate)
    return NextResponse.json("تاریخ پایان باید از تاریخ شروع جدید تر باشد", {
      status: 400,
    });

  try {
    const [archivedPorformaInvoices, issuer] = await prisma.$transaction([
      prisma.archivedPorformaInvoice.findMany({
        where: { createdAt: { lte: toDateEnd, gte: fromDateStart } },
      }),

      prisma.user.findUnique({
        where: { id: session?.user.id },
        select: { adminName: true },
      }),
    ]);
    if (archivedPorformaInvoices.length === 0)
      return NextResponse.json("پیش فاکتور در تاریخ ثبت شده یافت نشد", {
        status: 404,
      });

    await prisma.$transaction([
      prisma.archivedPorformaInvoice.deleteMany({
        where: { createdAt: { lte: toDateEnd, gte: fromDateStart } },
      }),

      prisma.log.create({
        data: {
          assignedToSection: "POR_INVOICE",
          issuer: issuer?.adminName!,
          message: `کاربر ${issuer?.adminName} پیش فاکتورهای از تاریخ ${jalaliFromDateStart} تا تاریخ ${jalaliToDateEnd} راحذف کرد`,
        },
      }),
    ]);

    return NextResponse.json("Selected porforma invoices have been deleted");
  } catch (error) {
    console.log(error);
    return NextResponse.json(error, { status: 500 });
  }
};
