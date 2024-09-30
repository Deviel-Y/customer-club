import {
  createUserSchame,
  CreateUserSchameType,
} from "@/app/libs/validationSchema";
import prisma from "@/prisma/client";
import bcrypt from "bcrypt";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (request: NextRequest) => {
  try {
    const body: CreateUserSchameType = await request.json();
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

    const validation = createUserSchame.safeParse(body);
    if (!validation.success)
      return NextResponse.json(validation.error.format(), { status: 400 });

    const user = await prisma.user.findFirst({
      where: { OR: [{ email }, { companyName }] },
    });
    if (user)
      return NextResponse.json("User is already exist", { status: 400 });

    if (password !== confirmPassword)
      return NextResponse.json("Passwords are not match each other", {
        status: 400,
      });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        companyBranch: role === "ADMIN" ? null : companyBranch,
        companyName: role === "ADMIN" ? null : companyName,
        email,
        itManager: role === "ADMIN" ? null : itManager,
        hashedPassword,
        address: role === "ADMIN" ? null : address,
        image,
        role,
      },
    });
    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    return NextResponse.json(error, { status: 500 });
  }
};
