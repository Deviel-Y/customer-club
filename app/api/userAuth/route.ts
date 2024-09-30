import { UserSchameType, userSchame } from "@/app/libs/validationSchema";
import prisma from "@/prisma/client";
import bcrypt from "bcrypt";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (request: NextRequest) => {
  try {
    const body: UserSchameType = await request.json();
    const {
      confirmPassword,
      companyBranch,
      companyName,
      email,
      itManager,
      password,
      address,
      image,
      role,
    } = body;

    const validation = userSchame.safeParse(body);
    if (!validation.success)
      return NextResponse.json(validation.error.format(), { status: 400 });

    const user = await prisma.user.findFirst({
      where: { OR: [{ email: email! }, { companyName }] },
    });
    if (user)
      return NextResponse.json("کاربر با این ایمیل یا نام سازمان وجود دارد", {
        status: 400,
      });

    if (!password || !confirmPassword)
      return NextResponse.json("وارد کردن گذرواژه الزامی است", {
        status: 400,
      });

    if (password !== confirmPassword)
      return NextResponse.json("گذرواژه ها با یکدیگر مطابقت ندارند", {
        status: 400,
      });

    const hashedPassword = await bcrypt.hash(password!, 10);

    const newUser = await prisma.user.create({
      data: {
        companyBranch: role === "ADMIN" ? undefined : companyBranch,
        companyName: role === "ADMIN" ? undefined : companyName,
        email: email?.toLocaleLowerCase()!,
        itManager: role === "ADMIN" ? undefined : itManager,
        hashedPassword,
        address: role === "ADMIN" ? undefined : address,
        image,
        role,
      },
    });
    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    return NextResponse.json(error, { status: 500 });
  }
};
