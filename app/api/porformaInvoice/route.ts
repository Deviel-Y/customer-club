import getSession from "@/app/libs/getSession";
import { porInvoiceSchema } from "@/app/libs/validationSchema";
import prisma from "@/prisma/client";
import { PorformaInvoice } from "@prisma/client";
import { addDays, endOfDay } from "date-fns";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (request: NextRequest) => {
  try {
    const session = await getSession();

    const body: PorformaInvoice = await request.json();
    const {
      assignedToUserId,
      description,
      expiredAt,
      porformaInvoiceNumber,
      organizationBranch,
      organization,
    } = body;

    const currentDate = new Date();
    const twoDaysFromNowEnd = endOfDay(addDays(currentDate, 2));

    const validation = porInvoiceSchema.safeParse(body);
    if (!validation.success)
      return NextResponse.json(validation.error.format(), { status: 400 });

    const porformaInvoice = await prisma.porformaInvoice.findUnique({
      where: { porformaInvoiceNumber },
    });

    if (porformaInvoice)
      return NextResponse.json("پیش فاکتور با این شماره قبلا صادر شده است", {
        status: 400,
      });

    const [newPorformaInvoice, issuer] = await prisma.$transaction([
      prisma.porformaInvoice.create({
        data: {
          assignedToUserId,
          description,
          expiredAt,
          porformaInvoiceNumber,
          organizationBranch,
          organization,
          issuerId: session?.user.id!,
        },
      }),

      prisma.user.findUnique({
        where: { id: session?.user.id },
        select: { adminName: true },
      }),
    ]);

    await Promise.all([
      prisma.notification.create({
        data: {
          message: `پیش فاکتوری با شماره ${porformaInvoiceNumber} برای شما صادر شد`,
          type: "INFO",
          users: {
            connect: { id: newPorformaInvoice.assignedToUserId },
          },
          assignedToSection: "POR_INVOICE",
          assignedToPorInvoiceId: newPorformaInvoice.id,
        },
      }),

      prisma.log.create({
        data: {
          assignedToSection: "POR_INVOICE",
          issuer: issuer?.adminName!,
          message: `پیش فاکتور به شماره ${newPorformaInvoice.porformaInvoiceNumber} برای سازمان ${newPorformaInvoice.organization} شعبه ${newPorformaInvoice.organizationBranch} صادر شد`,
        },
      }),

      newPorformaInvoice.expiredAt <= twoDaysFromNowEnd &&
        prisma.notification.create({
          data: {
            users: { connect: { id: newPorformaInvoice.assignedToUserId } },
            message: `شماره پیش فاکتور ${newPorformaInvoice.porformaInvoiceNumber} به زودی منقضی میشود`,
            assignedToPorInvoiceId: newPorformaInvoice.id,
            type: "WARNING",
            assignedToSection: "POR_INVOICE",
          },
        }),
    ]);

    return NextResponse.json(newPorformaInvoice, { status: 201 });
  } catch (error) {
    return NextResponse.json(error);
  }
};
