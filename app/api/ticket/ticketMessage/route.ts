import getSession from "@/app/libs/getSession";
import { ticketMessageSchema } from "@/app/libs/validationSchema";
import prisma from "@/prisma/client";
import { TicketMessage } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (request: NextRequest) => {
  try {
    const session = await getSession();

    if (!session)
      return NextResponse.json("you're not authenticated", { status: 401 });

    const body: TicketMessage = await request.json();
    const { message, assignetoTicketId } = body;

    const validation = ticketMessageSchema.safeParse(body);
    if (!validation.success)
      return NextResponse.json(validation.error.format(), { status: 400 });

    const [ticketMessagesCount, ticket, user, adminUsers] =
      await prisma.$transaction([
        prisma.ticketMessage.count({
          where: { assignetoTicketId },
        }),

        prisma.ticket.findUnique({
          where: { id: assignetoTicketId },
          select: { ticketNumber: true, issuerId: true },
        }),

        prisma.user.findUnique({
          where: { id: session?.user.id },
          select: { companyName: true, companyBranch: true },
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

    const [_updatedMessage, newMesaage] = await prisma.$transaction([
      prisma.ticketMessage.updateMany({
        where: {
          assignetoTicketId,
        },
        data: {
          canBeModified: false,
        },
      }),

      prisma.ticketMessage.create({
        data: {
          message,
          assignetoTicketId,
          canBeModified: true,
          messageType:
            session?.user.role === "CUSTOMER" ? "REQUEST" : "RESPONCE",
          issuerId: session?.user.id!,
        },
        include: { Ticket: true },
      }),
    ]);

    // Message for log and notification
    const log_notification_message =
      ticketMessagesCount === 0
        ? `تیکت جدیدی به شماره ${ticket?.ticketNumber} ایجاد شد`
        : ticketMessagesCount !== 0 && newMesaage.messageType === "REQUEST"
        ? `کاربر ${user?.companyName} شعبه ${user?.companyBranch} به تیکت شماره ${ticket?.ticketNumber} پاسخ خود را ثبت کرد`
        : ticketMessagesCount !== 0 && newMesaage.messageType === "RESPONCE"
        ? `پاسخی از سوی ادمین به تیکت شماره ${ticket?.ticketNumber} ثبت شد`
        : "پیام جدید";

    const [issuer] = await prisma.$transaction([
      prisma.user.findUnique({
        where: { id: newMesaage.issuerId },
        select: { adminName: true, companyName: true, companyBranch: true },
      }),

      prisma.notification.create({
        data: {
          message: log_notification_message,
          type: "INFO",
          users: {
            connect:
              newMesaage.messageType === "REQUEST"
                ? adminUsers.map((user) => ({ id: user.id }))
                : { id: ticket?.issuerId },
          },
          assignedToSection:
            ticketMessagesCount === 0 ? "TICKET" : "TICKET_MESSAGE",
          assignedToTicketMessageId: newMesaage.id,
        },
      }),
    ]);

    await prisma.log.create({
      data: {
        assignedToSection:
          ticketMessagesCount === 0 ? "TICKET" : "TICKET_MESSAGE",
        issuer:
          newMesaage.messageType === "REQUEST"
            ? `${issuer?.companyName} - ${issuer?.companyBranch}`
            : issuer?.adminName!,
        message: log_notification_message,
      },
    });

    return NextResponse.json(newMesaage, { status: 201 });
  } catch (error) {
    return NextResponse.json(error, { status: 500 });
  }
};
