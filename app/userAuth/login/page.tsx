import getSession from "@/app/libs/getSession";
import Link from "next/link";
import BrandInfo from "./BrandInfo";
import LoginForm from "./LoginForm";

const LoginPage = async () => {
  const session = await getSession();

  if (session?.user)
    return (
      <div className="flex justify-center items-center w-full h-full">
        <p className="text-lg">
          شما در حال حاضر وارد شده اید!
          <Link
            className="mx-5 text-blue-600"
            href={session.user.role === "CUSTOMER" ? "/" : "/admin"}
          >
            بازگشت
          </Link>
        </p>
      </div>
    );

  return (
    <div className="overflow-hidden grid grid-cols-2 max-md:grid-cols-1 place-content-stretch place-items-center h-screen">
      <BrandInfo />

      <div className="mt-10 w-full">
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;
