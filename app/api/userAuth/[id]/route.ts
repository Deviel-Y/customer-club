import { userSchame, UserSchameType } from "@/app/libs/validationSchema";
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
  const deletedUser = await prisma.user.delete({ where: { id } });
  return NextResponse.json(deletedUser);
};

export const PATCH = async (
  request: NextRequest,
  { params: { id } }: Props
) => {
  const body: UserSchameType = await request.json();
  const {
    email,
    password,
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

  const existingUser = await prisma.user.findFirst({
    where: { email: email! },
  });
  if (existingUser)
    return NextResponse.json("کاربر با این آدرس ایمیل وجود دارد", {
      status: 400,
    });

  const validation = userSchame.safeParse(body);
  if (!validation.success)
    return NextResponse.json(validation.error.format(), { status: 400 });

  if (password !== confirmPassword)
    return NextResponse.json("گذرواژه ها با یکدیگر مطابقت ندارند", {
      status: 400,
    });

  const hashedPassword = await bcrypt.hash(password!, 10);

  const updatedUser = await prisma.user.update({
    where: { id },
    data: {
      email: email?.toLocaleLowerCase()!,
      hashedPassword,
      role,
      address,
      companyName,
      companyBranch,
      itManager,
      image,
    },
  });
  return NextResponse.json(updatedUser);
};
