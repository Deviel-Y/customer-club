import getSession from "@/app/libs/getSession";
import { invoiceSchema, InvoiceSchemaType } from "@/app/libs/validationSchema";
import prisma from "@/prisma/client";
import { Invoice } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

type InvoiceType = Invoice & InvoiceSchemaType;

export const POST = async (request: NextRequest) => {
  const session = await getSession();

  try {
    const body: InvoiceType = await request.json();
    const {
      description,
      invoiceNumber,
      organization,
      organizationBranch,
      price,
      tax,
      priceWithTax,
      sendNotification,
      assignedToUserId,
    } = body;

    const validation = invoiceSchema.safeParse(body);
    if (!validation.success)
      return NextResponse.json(validation.error.format(), { status: 400 });

    const invoice = await prisma.invoice.findFirst({
      where: { invoiceNumber },
    });
    if (invoice)
      return NextResponse.json(
        "فاکتوری به همین شماره قبلا صادر شده است. لطفا شماره فاکتور را تغییر دهید.",
        {
          status: 400,
        }
      );

    const [issuer, newInvoice] = await prisma.$transaction([
      prisma.user.findUnique({
        where: { id: session?.user?.id },
        select: { adminName: true },
      }),

      prisma.invoice.create({
        data: {
          description,
          invoiceNumber,
          organization,
          organizationBranch,
          assignedToUserId,
          price,
          priceWithTax,
          tax,
          issuerId: session?.user.id!,
        },
      }),
    ]);

    await Promise.all([
      sendNotification &&
        prisma.notification.create({
          data: {
            users: { connect: { id: assignedToUserId } },
            message: `فاکتوری با شماره ${newInvoice.invoiceNumber} برای شما صادر شد`,
            assignedToInvoiceId: newInvoice.id,
            assignedToSection: "INVOICE",
            type: "INFO",
          },
        }),

      prisma.log.create({
        data: {
          assignedToSection: "INVOICE",
          issuer: issuer?.adminName!,
          message: `کاربر ${issuer?.adminName} فاکتور به شماره ${newInvoice.invoiceNumber} را برای ${newInvoice.organization} شعبه ${newInvoice.organizationBranch} صادر کرد`,
        },
      }),
    ]);

    return NextResponse.json(newInvoice, { status: 201 });
  } catch (error) {
    return NextResponse.json(error, { status: 500 });
  }
};
