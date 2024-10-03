import getSession from "@/app/libs/getSession";
import { porInvoiceSchema } from "@/app/libs/validationSchema";
import prisma from "@/prisma/client";
import { PorformaInvoice } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

interface Props {
  params: { id: string };
}

export const DELETE = async (
  request: NextRequest,
  { params: { id } }: Props
) => {
  const porformaInvoice = await prisma.porformaInvoice.findUnique({
    where: { id },
  });
  if (!porformaInvoice)
    return NextResponse.json("پیش فاکتوری یافت نشد.", { status: 404 });

  const deletedPorInvoice = await prisma.porformaInvoice.delete({
    where: { id },
  });
  return NextResponse.json(deletedPorInvoice);
};

export const PATCH = async (
  request: NextRequest,
  { params: { id } }: Props
) => {
  const session = await getSession();

  const body: PorformaInvoice = await request.json();
  const {
    assignedToUserId,
    description,
    expiredAt,
    organization,
    organizationBranch,
    porformaInvoiceNumber,
  } = body;

  const porInvoice = await prisma.porformaInvoice.findUnique({
    where: { id },
  });
  if (!porInvoice)
    return NextResponse.json("پیش فاکتوری یافت نشد.", { status: 404 });

  const validation = porInvoiceSchema.safeParse(body);
  if (!validation.success)
    return NextResponse.json(validation.error.format(), { status: 400 });

  const similarPorInvoice = await prisma.porformaInvoice.findFirst({
    where: {
      porformaInvoiceNumber: porformaInvoiceNumber.trim(),
      NOT: { id },
    },
  });
  if (similarPorInvoice)
    return NextResponse.json("پیش فاکتور با این شماره قبلا صادر شده است.", {
      status: 400,
    });

  const updatedPorInvoice = await prisma.porformaInvoice.update({
    where: { id },
    data: {
      assignedToUserId,
      description,
      expiredAt,
      organization,
      organizationBranch,
      porformaInvoiceNumber,
      issuerId: session?.user.id,
    },
  });
  return NextResponse.json(updatedPorInvoice);
};
