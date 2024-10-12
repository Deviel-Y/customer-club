import getSession from "@/app/libs/getSession";
import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
  const session = await getSession();

  const notifications = await prisma.notification.findMany({
    where: {
      isRead: false,
      assignedToUserId:
        session?.user.role === "USER" ? session?.user.id : undefined,
    },

    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(notifications);
};
