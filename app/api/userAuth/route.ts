import { createUserSchame, CreateUserSchameType } from "@/app/validationSchema";
import prisma from "@/prisma/client";
import bcrypt from "bcrypt";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (request: NextRequest) => {
  const body: CreateUserSchameType = await request.json();
  const {
    companyBranch,
    companyName,
    email,
    itManager,
    password,
    address,
    image,
  } = body;

  const validation = createUserSchame.safeParse(body);
  if (!validation.success)
    return NextResponse.json(validation.error.format(), { status: 400 });

  const user = await prisma.user.findUnique({ where: { email } });
  if (user) return NextResponse.json("User is already exist", { status: 400 });

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await prisma.user.create({
    data: {
      companyBranch,
      companyName,
      email,
      itManager,
      hashedPassword,
      address,
      image,
    },
  });
  return NextResponse.json(newUser, { status: 201 });
};
