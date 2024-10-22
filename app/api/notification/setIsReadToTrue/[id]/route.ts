import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

interface Props {
  params: { id: string };
}

export const PATCH = async (
  request: NextRequest,
  { params: { id } }: Props
) => {
  try {
    const updatedNotification = await prisma.notification.updateMany({
      where: { users: { some: { id } } },
      data: { isRead: true },
    });

    return NextResponse.json(updatedNotification);
  } catch (error) {
    console.log(error);
    return NextResponse.json(error, { status: 500 });
  }
};
