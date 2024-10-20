import getSession from "@/app/libs/getSession";
import { invoiceSchema } from "@/app/libs/validationSchema";
import prisma from "@/prisma/client";
import { Invoice } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (request: NextRequest) => {
  const session = await getSession();

  try {
    const body: Invoice = await request.json();
    const {
      description,
      invoiceNumber,
      organization,
      organizationBranch,
      assignedToUserId,
      price,
      tax,
      priceWithTax,
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

    const newInvoice = await prisma.invoice.create({
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
    });

    await prisma.notification.create({
      data: {
        message: `فاکتوری با شماره ${invoiceNumber} صادر شد`,
        type: "INFO",
        assignedToUserId,
        assignedToSection: "INVOICE",
        assignedToInvoiceId: newInvoice.id,
      },
    });

    return NextResponse.json(newInvoice, { status: 201 });
  } catch (error) {
    return NextResponse.json(error, { status: 500 });
  }
};
