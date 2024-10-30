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
  const session = await getSession();

  if (!session)
    return NextResponse.json("you're not authenticated", { status: 401 });

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

    if (!session)
      return NextResponse.json("you're not authenticated", { status: 401 });

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
      select: { id: true },
    });
    if (!user)
      return NextResponse.json("سازمان مورد نظر یافت نشد", { status: 404 });

    const invoice = await prisma.invoice.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!invoice)
      return NextResponse.json("Invoice not found", { status: 404 });

    const validation = invoiceSchema.safeParse(body);
    if (!validation.success)
      return NextResponse.json(validation.error.format(), { status: 400 });

    const similerInvoice = await prisma.invoice.findFirst({
      where: { invoiceNumber: invoiceNumber.trim(), NOT: { id } },
      select: { id: true },
    });
    if (similerInvoice)
      return NextResponse.json("فاکتور با این شماره فاکتور موجود میباشد.", {
        status: 400,
      });

    const [updatedInvoice, issuer] = await prisma.$transaction([
      prisma.invoice.update({
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
      }),

      prisma.user.findUnique({
        where: { id: session?.user?.id },
        select: { adminName: true },
      }),
    ]);

    const logMessage = `کاربر ${issuer?.adminName} فاکتور به شماره ${updatedInvoice.invoiceNumber} را ویرایش کرد`;
    await prisma.log.create({
      data: {
        assignedToSection: "INVOICE",
        issuer: issuer?.adminName!,
        message: logMessage,
      },
    });

    return NextResponse.json(updatedInvoice);
  } catch (error) {
    return NextResponse.json(error, { status: 500 });
  }
};
