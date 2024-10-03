import getSession from "@/app/libs/getSession";
import { porInvoiceSchema } from "@/app/libs/validationSchema";
import prisma from "@/prisma/client";
import { PorformaInvoice } from "@prisma/client";
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

    const validation = porInvoiceSchema.safeParse(body);
    if (!validation.success)
      return NextResponse.json(validation.error.format(), { status: 400 });

    const porformaInvoice = await prisma.porformaInvoice.findFirst({
      where: { porformaInvoiceNumber },
    });
    if (porformaInvoice)
      return NextResponse.json("پیش فاکتور با این شماره قبلا صادر شده است", {
        status: 400,
      });

    const newPorformaInvoice = await prisma.porformaInvoice.create({
      data: {
        assignedToUserId,
        description,
        expiredAt,
        porformaInvoiceNumber,
        organizationBranch,
        organization,
        issuerId: session?.user.id!,
      },
    });
    return NextResponse.json(newPorformaInvoice);
  } catch (error) {
    return NextResponse.json(error);
  }
};
