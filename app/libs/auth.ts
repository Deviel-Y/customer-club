import prisma from "@/prisma/client";
import { Role } from "@prisma/client";
import bcrypt from "bcrypt";
import moment from "moment-jalaali";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const { handlers, signIn, signOut, auth } = NextAuth({
  pages: {
    signIn: "/userAuth/login",
  },

  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        phoneNumber: {
          name: "phoneNumber",
          label: "phoneNumber",
          type: "text",
          placeholder: "09...",
        },
        password: {
          name: "password",
          label: "Password",
          type: "password",
          placeholder: "Account Password",
        },
      },
      async authorize(credentials) {
        if (!credentials.phoneNumber || !credentials.password) return null;

        const user = await prisma.user.findUnique({
          where: { phoneNumber: credentials.phoneNumber as string },
        });

        if (!user) return null;

        const isPasswordsMatch = await bcrypt.compare(
          credentials.password as string,
          user.hashedPassword!
        );

        await prisma.log.create({
          data: {
            assignedToSection: "LOGIN",
            issuer:
              user.role === "CUSTOMER"
                ? `${user.companyName} شعبه ${user.companyBranch}`
                : user.adminName!,
            message: `کاربر در تاریخ ${moment(new Date()).format(
              "jYYYY/jM/jD HH:mm"
            )} احراز هویت کرد`,
          },
        });

        return isPasswordsMatch ? user : null;
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user, session, trigger }) {
      if (trigger === "update") {
        token.name = session.name;
        token.phoneNumber = session.phoneNumber;
        token.picture = session.image;
      }

      if (user) {
        return {
          ...token,
          id: user?.id,
          phoneNumber: user.phoneNumber,
          image: user?.image,
          role: user?.role,
        };
      }

      return token;
    },

    async session({ session, token, user }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.sub,
          role: token.role as Role,
          phoneNumber: token.phoneNumber as string,
        },
      };
    },
  },
  session: { maxAge: 60 * 60, strategy: "jwt" }, // One hour
});
