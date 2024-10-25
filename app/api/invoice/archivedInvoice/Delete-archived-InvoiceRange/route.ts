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
    const [issuer, archivedInvoices] = await prisma.$transaction([
      prisma.user.findUnique({
        where: { id: session?.user.id },
        select: { adminName: true },
      }),

      prisma.archivedInvoice.findMany({
        where: { createdAt: { lte: toDateEnd, gte: fromDateStart } },
        select: { id: true },
      }),
    ]);

    if (archivedInvoices.length === 0)
      return NextResponse.json("فاکتور در تاریخ ثبت شده یافت نشد", {
        status: 404,
      });

    await prisma.$transaction([
      prisma.archivedInvoice.deleteMany({
        where: { createdAt: { lte: toDateEnd, gte: fromDateStart } },
      }),

      prisma.log.create({
        data: {
          assignedToSection: "INVOICE",
          issuer: issuer?.adminName!,
          message: `کاربر ${issuer?.adminName} فاکتورهای از تاریخ ${jalaliFromDateStart} تا تاریخ ${jalaliToDateEnd} راحذف کرد`,
        },
      }),
    ]);

    return NextResponse.json("Selected invoices have been deleted", {
      status: 201,
    });
  } catch (error) {
    return NextResponse.json(error, { status: 500 });
  }
};
