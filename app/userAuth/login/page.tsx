import { auth } from "@/app/auth";
import { redirect } from "next/navigation";
import LoginForm from "./LoginForm";

const LoginPage = async () => {
  const session = await auth();
  if (session) redirect("/");

  return <LoginForm />;
};

export default LoginPage;
