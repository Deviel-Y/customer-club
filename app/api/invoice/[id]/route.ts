import getSession from "@/app/libs/getSession";
import { invoiceSchema } from "@/app/libs/validationSchema";
import prisma from "@/prisma/client";
import { Invoice } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

interface Props {
  params: { id: string };
}

export const DELETE = async (
  request: NextRequest,
  { params: { id } }: Props
) => {
  const deletedInvoice = await prisma.invoice.delete({
    where: { id },
  });

  return NextResponse.json(deletedInvoice);
};

export const PATCH = async (
  request: NextRequest,
  { params: { id } }: Props
) => {
  try {
    const session = await getSession();

    const body: Invoice = await request.json();
    const {
      organization,
      assignedToUserId,
      description,
      invoiceNumber,
      organizationBranch,
      price,
      tax,
      priceWithTax,
    } = body;

    const user = await prisma.user.findUnique({
      where: { id: assignedToUserId },
    });
    if (!user)
      return NextResponse.json("سازمان مورد نظر یافت نشد", { status: 404 });

    const invoice = await prisma.invoice.findUnique({ where: { id } });
    if (!invoice)
      return NextResponse.json("Invoice not found", { status: 404 });

    const validation = invoiceSchema.safeParse(body);
    if (!validation.success)
      return NextResponse.json(validation.error.format(), { status: 400 });

    const similerInvoice = await prisma.invoice.findFirst({
      where: { invoiceNumber: invoiceNumber.trim(), NOT: { id } },
    });
    if (similerInvoice)
      return NextResponse.json("فاکتور با این شماره فاکتور موجود میباشد.", {
        status: 400,
      });

    const updatedInvoice = await prisma.invoice.update({
      where: { id },
      data: {
        assignedToUserId,
        description: description.trim(),
        invoiceNumber: invoiceNumber.trim(),
        organizationBranch,
        issuerId: session?.user.id,
        organization,
        price,
        tax,
        priceWithTax,
      },
    });

    await prisma.notification.create({
      data: {
        message: `شماره فاکتور ${invoiceNumber} از سمت ادمین ویرایش شد`,
        type: "INFO",
        assignedToUserId,
        assignedToSection: "INVOICE",
        assignedToInvoiceId: updatedInvoice.id,
      },
    });

    return NextResponse.json(updatedInvoice);
  } catch (error) {
    console.log(error);
    return NextResponse.json(error, { status: 500 });
  }
};
