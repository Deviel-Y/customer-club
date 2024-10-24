import getSession from "@/app/libs/getSession";
import { ticketMessageSchema } from "@/app/libs/validationSchema";
import prisma from "@/prisma/client";
import { TicketMessage } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (request: NextRequest) => {
  try {
    const session = await getSession();

    const body: TicketMessage = await request.json();
    const { message, assignetoTicketId } = body;

    const validation = ticketMessageSchema.safeParse(body);
    if (!validation.success)
      return NextResponse.json(validation.error.format(), { status: 400 });

    const [ticketMessages, ticket, user, adminUsers] = await Promise.all([
      await prisma.ticketMessage.findMany({
        where: { assignetoTicketId },
      }),

      await prisma.ticket.findUnique({
        where: { id: assignetoTicketId },
      }),

      await prisma.user.findUnique({
        where: { id: session?.user.id },
      }),

      prisma.user.findMany({
        where: { role: { in: ["ADMIN", "SUPER_ADMIN"] } },
        select: { id: true },
      }),
    ]);

    (session?.user.role === "ADMIN" || session?.user.role === "SUPER_ADMIN") && // change ticketMessage status to INVESTIGATING if admin send its response
      (await prisma?.ticket.update({
        where: { id: assignetoTicketId },
        data: { status: "INVESTIGATING" },
      }));

    const lastTicketMessage: TicketMessage = (
      await prisma?.ticketMessage.findMany({
        orderBy: { createdAt: "desc" },
        take: 1,
      })
    )[0];

    if (
      session?.user.role === "ADMIN" &&
      lastTicketMessage?.messageType === "RESPONCE"
    )
      return NextResponse.json(
        "شما قادر به ارسال مجدد پیام نیستید. برای ارسال پیام باید منتظر پاسخ کاربر باشید",
        { status: 400 }
      );

    if (
      ticketMessages.length &&
      session?.user.role === "CUSTOMER" &&
      lastTicketMessage?.messageType === "REQUEST"
    )
      return NextResponse.json(
        "شما قادر به ارسال مجدد پیام نیستید. برای ارسال پیام باید منتظر پاسخ ادمین باشید",
        { status: 400 }
      );

    await prisma.ticketMessage.updateMany({
      where: {
        assignetoTicketId,
      },
      data: {
        canBeModified: false,
      },
    });

    const newMesaage = await prisma.ticketMessage.create({
      data: {
        message,
        assignetoTicketId,
        messageType: session?.user.role === "CUSTOMER" ? "REQUEST" : "RESPONCE",
        issuerId: session?.user.id!,
      },
      include: { Ticket: true },
    });

    // Notification Section
    const notificationMessage =
      ticketMessages.length === 0
        ? `تیکت جدیدی به شماره ${ticket?.ticketNumber} ایجاد شد`
        : ticketMessages.length !== 0 && newMesaage.messageType === "REQUEST"
        ? `کاربر ${user?.companyName} شعبه ${user?.companyBranch} به تیکت شماره ${ticket?.ticketNumber} پاسخ خود را ثبت کرد`
        : ticketMessages.length !== 0 && newMesaage.messageType === "RESPONCE"
        ? `پاسخی از سوی ادمین به تیکت شماره ${ticket?.ticketNumber} ثبت شد`
        : "پیام جدید";

    await prisma.notification.create({
      data: {
        message: notificationMessage,
        type: "INFO",
        users: {
          connect:
            newMesaage.messageType === "REQUEST"
              ? adminUsers.map((user) => ({ id: user.id }))
              : { id: ticket?.issuerId },
        },
        assignedToSection:
          ticketMessages.length === 0 ? "TICKET" : "TICKET_MESSAGE",
        assignedToTicketMessageId: newMesaage.id,
      },
    });

    return NextResponse.json(newMesaage, { status: 201 });
  } catch (error) {
    return NextResponse.json(error, { status: 500 });
  }
};
