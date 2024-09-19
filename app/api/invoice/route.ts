import getSession from "@/app/libs/getSession";
import { invoiceSchema } from "@/app/libs/validationSchema";
import prisma from "@/prisma/client";
import { Invoice } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (request: NextRequest) => {
  try {
    const body: Invoice = await request.json();
    const {
      description,
      invoiceNumber,
      organization,
      organizationBranch,
      assignedToUserId,
    } = body;

    const session = await getSession();

    const validation = invoiceSchema.safeParse(body);
    if (!validation.success)
      return NextResponse.json(validation.error.format(), { status: 400 });

    const invoice = await prisma.invoice.findFirst({
      where: { invoiceNumber },
    });
    if (invoice)
      return NextResponse.json("Invoice with this number is already exists", {
        status: 400,
      });

    const newInvoice = await prisma.invoice.create({
      data: {
        description,
        invoiceNumber,
        organization,
        organizationBranch,
        assignedToUserId,
        issuerId: session?.user.id!,
      },
    });

    return NextResponse.json(newInvoice, { status: 201 });
  } catch (error) {
    return NextResponse.json(error, { status: 500 });
  }
};
