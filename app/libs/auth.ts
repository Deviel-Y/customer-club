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
        email: {
          name: "email",
          label: "Email",
          type: "email",
          placeholder: "example@domail.com",
        },
        password: {
          name: "password",
          label: "Password",
          type: "password",
          placeholder: "Account Password",
        },
      },
      async authorize(credentials) {
        if (!credentials.email || !credentials.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
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
        token.email = session.email;
        token.picture = session.image;
      }

      if (user) {
        return {
          ...token,
          id: user?.id,
          name: user?.name,
          email: user?.email,
          image: user?.image,
          role: user?.role,
        };
      }

      return token;
    },

    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.sub,
          role: token.role as Role,
        },
      };
    },
  },
  session: { maxAge: 60 * 60, strategy: "jwt" }, // One hour
});
