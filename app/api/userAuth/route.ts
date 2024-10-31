import getSession from "@/app/libs/getSession";
import {
  FullUserSchameType,
  fullUserSchame,
} from "@/app/libs/validationSchema";
import prisma from "@/prisma/client";
import bcrypt from "bcrypt";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (request: NextRequest) => {
  const session = await getSession();

  if (!session)
    return NextResponse.json("you're not authenticated", { status: 401 });

  try {
    const body: FullUserSchameType = await request.json();
    const {
      confirmPassword,
      companyBranch,
      companyName,
      phoneNumber,
      adminName,
      itManager,
      newPassword,
      address,
      image,
      role,
    } = body;

    const validation = fullUserSchame.safeParse(body);
    if (!validation.success)
      return NextResponse.json(validation.error.format(), { status: 400 });

    const user = await prisma.user.findFirst({
      where: {
        phoneNumber,
      },
    });
    if (user)
      return NextResponse.json("کاربر با این شماره همراه وجود دارد", {
        status: 400,
      });

    const similarUser = await prisma.user.findFirst({
      where: {
        NOT: { role: "ADMIN" },
        AND: [{ companyName }, { companyBranch }],
      },
    });
    if (similarUser)
      return NextResponse.json(
        "نام سازمان و نام شعبه برای شماره همراه دیگر ثبت شده است",
        {
          status: 400,
        }
      );

    if (!newPassword || !confirmPassword)
      return NextResponse.json("وارد کردن گذرواژه الزامی است", {
        status: 400,
      });

    if (newPassword !== confirmPassword)
      return NextResponse.json("گذرواژه ها با یکدیگر مطابقت ندارند", {
        status: 400,
      });

    const hashedPassword = await bcrypt.hash(newPassword!, 10);

    const newUser = await prisma.user.create({
      data: {
        adminName: role === "ADMIN" ? adminName : undefined,
        companyBranch: role === "CUSTOMER" ? companyBranch : undefined,
        companyName: role === "CUSTOMER" ? companyName : undefined,
        phoneNumber: phoneNumber!,
        itManager: role === "CUSTOMER" ? itManager : undefined,
        hashedPassword,
        address: role === "CUSTOMER" ? address : undefined,
        image,
        role,
      },
    });
    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    return NextResponse.json(error, { status: 500 });
  }
};
