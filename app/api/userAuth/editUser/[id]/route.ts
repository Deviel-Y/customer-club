import getSession from "@/app/libs/getSession";
import {
  FullUserSchameType,
  fullUserSchame,
} from "@/app/libs/validationSchema";
import prisma from "@/prisma/client";
import bcrypt from "bcrypt";
import { NextRequest, NextResponse } from "next/server";

interface Props {
  params: { id: string };
}

export const DELETE = async (
  request: NextRequest,
  { params: { id } }: Props
) => {
  try {
    const [invoice, por_invocie, ticket] = await Promise.all([
      prisma.invoice.findFirst({
        where: { assignedToUserId: id },
      }),

      prisma.porformaInvoice.findFirst({
        where: { assignedToUserId: id },
      }),

      prisma.ticket.findFirst({
        where: { issuerId: id },
      }),
    ]);

    if (invoice || por_invocie || ticket)
      return NextResponse.json(
        "امکان حذف کاربر وجود ندارد. فاکتور، پیش فاکتور و یا تیکتی به نام این کاربر ثبت شده است",
        { status: 403 }
      );

    const deletedUser = await prisma.user.delete({ where: { id } });
    return NextResponse.json(deletedUser);
  } catch (error) {
    console.log(error);
    return NextResponse.json(error);
  }
};

export const PATCH = async (
  request: NextRequest,
  { params: { id } }: Props
) => {
  const session = await getSession();
  try {
    const body: FullUserSchameType = await request.json();
    const {
      email,
      currentPassword,
      newPassword,
      confirmPassword,
      role,
      address,
      companyName,
      companyBranch,
      itManager,
      image,
      adminName,
    } = body;

    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) return NextResponse.json("User not found", { status: 404 });

    const validation = fullUserSchame.safeParse(body);
    if (!validation.success)
      return NextResponse.json(validation.error.format(), { status: 400 });

    const similarEmail = await prisma.user.findFirst({
      where: { email, NOT: { id } },
    });
    if (similarEmail)
      return NextResponse.json("کاربر با این ایمیل وجود دارد", {
        status: 400,
      });

    const similarNameAndBranch = await prisma.user.findFirst({
      where: { AND: [{ companyName, companyBranch }], NOT: { id } },
    });
    if (similarNameAndBranch)
      return NextResponse.json(
        "نام سازمان و نام شعبه برای ایمیل دیگر ثبت شده است",
        {
          status: 400,
        }
      );

    if (session?.user.role === "USER" && newPassword && confirmPassword) {
      const isCurrentPasswordValid: boolean =
        !!currentPassword &&
        (await bcrypt.compare(currentPassword, user.hashedPassword));
      if (!isCurrentPasswordValid)
        return NextResponse.json("گذرواژه فعلی خود را به درستی وارد کنید", {
          status: 400,
        });
    }

    if (newPassword && confirmPassword && newPassword !== confirmPassword)
      return NextResponse.json("گذرواژه ها با یکدیگر مطابقت ندارند", {
        status: 400,
      });

    const hashedPassword = newPassword
      ? await bcrypt.hash(newPassword!, 10)
      : undefined;

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        email: email?.toLocaleLowerCase()!,
        hashedPassword,
        role,
        address: role === "ADMIN" ? null : address,
        companyName: role === "ADMIN" ? null : companyName,
        companyBranch: role === "ADMIN" ? null : companyBranch,
        itManager: role === "ADMIN" ? null : itManager,
        image,
        adminName: role === "ADMIN" ? adminName : null,
      },
    });
    return NextResponse.json(updatedUser);
  } catch (error) {
    console.log(error);
    return NextResponse.json(error, { status: 500 });
  }
};