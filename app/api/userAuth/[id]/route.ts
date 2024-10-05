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
  const invoice = await prisma.invoice.findFirst({
    where: { assignedToUserId: id },
  });
  if (invoice)
    return NextResponse.json(
      "امکان حذف وجود ندارد زیرا فاکتور یا پیش فاکتور به نام این کاربر ثبت شده است",
      { status: 400 }
    );

  const deletedUser = await prisma.user.delete({ where: { id } });
  return NextResponse.json(deletedUser);
};

export const PATCH = async (
  request: NextRequest,
  { params: { id } }: Props
) => {
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
    } = body;

    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) return NextResponse.json("User not found", { status: 404 });

    const validation = fullUserSchame.safeParse(body);
    if (!validation.success)
      return NextResponse.json(validation.error.format(), { status: 400 });

    const similarUser = await prisma.user.findFirst({
      where: { OR: [{ email }, { companyName }], NOT: { id } },
    });
    if (similarUser)
      return NextResponse.json("کاربر با این ایمیل یا نام سازمان وجود دارد", {
        status: 400,
      });

    //For when if user is a regular user
    if (!currentPassword)
      return NextResponse.json("گذرواژه فعلی خود را وارد کنید", {
        status: 400,
      });

    const isCurrentPasswordValid: boolean = await bcrypt.compare(
      currentPassword,
      user.hashedPassword
    );
    if (!isCurrentPasswordValid)
      return NextResponse.json("گذرواژه فعلی خود را به درستی وارد کنید", {
        status: 400,
      });

    if (newPassword !== confirmPassword)
      return NextResponse.json("گذرواژه ها با یکدیگر مطابقت ندارند", {
        status: 400,
      });

    const hashedPassword = await bcrypt.hash(newPassword!, 10);

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
      },
    });
    return NextResponse.json(updatedUser);
  } catch (error) {
    return NextResponse.json(error);
  }
};
