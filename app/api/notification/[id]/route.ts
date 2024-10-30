import getSession from "@/app/libs/getSession";
import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

interface Props {
  params: { id: string };
}

export const PATCH = async (
  request: NextRequest,
  { params: { id } }: Props
) => {
  const session = await getSession();

  if (!session)
    return NextResponse.json("you're not authenticated", { status: 401 });

  try {
    const body = await request.json();
    const { isRead } = body;

    const updatedNotification = await prisma.notification.update({
      where: { id },
      data: { isRead },
    });
    return NextResponse.json(updatedNotification);
  } catch (error) {
    return NextResponse.json(error);
  }
};
