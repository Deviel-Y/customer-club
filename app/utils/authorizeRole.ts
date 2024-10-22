import { Session } from "next-auth";
import { redirect } from "next/navigation";

export const authorizeUser = (session: Session) => {
  if (!session) redirect("/api/auth/signin");

  if (session?.user?.role !== "CUSTOMER") redirect("/admin");
};

export const authorizeAdmin = (session: Session) => {
  if (!session) redirect("/api/auth/signin");

  if (session?.user?.role === "CUSTOMER") redirect("/");
};

export const authorizeSuperAdmin = (session: Session) => {
  if (!session) redirect("/api/auth/signin");

  if (session?.user?.role !== "SUPER_ADMIN") redirect("/");
};
