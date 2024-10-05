import getSession from "@/app/libs/getSession";
import Link from "next/link";
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
            href={session.user.role === "USER" ? "/" : "/admin"}
          >
            بازگشت
          </Link>
        </p>
      </div>
    );

  return (
    <div className="grid grid-cols-2 max-md:grid-cols-1 place-content-stretch place-items-center h-screen">
      <div className="p-24 max-md:hidden max-lg:w-full">
        <h1 className="font-extrabold text-[60px] max-lg:text-[50px]">
          پردازش شبکه
        </h1>
        <p className="font-bold text-[29px] mb-5 max-lg:text-[21px] max-lg:my-3">
          پیشرو در پردازش شبکه‌های نوین
        </p>
        <article className="font-semibold text-[16px] mt-3 text-justify">
          پیشرو در پردازش شبکه‌های نوین نشان‌دهنده تمرکز ما بر ارائه راه‌حل‌های
          نوآورانه و به‌روز در زمینه شبکه و فناوری اطلاعات است. هدف ما فراهم
          کردن ابزاری است که به کاربران اجازه می‌دهد شبکه‌های خود را با سرعت،
          امنیت و بهره‌وری بیشتری مدیریت و بهینه‌سازی کنند. ما همواره در حال
          پیشرفت و انطباق با نیازهای دنیای تکنولوژی هستیم تا تجربه بهتری را برای
          مشتریان خود ایجاد کنیم
        </article>
      </div>

      <div className="mt-10 w-full">
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;
