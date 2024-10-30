import { Button } from "@nextui-org/react";
import NextLink from "next/link";
import getSession from "./libs/getSession";

const NotFoundPage = async () => {
  const session = await getSession();

  return (
    <div className="flex flex-col p-5 gap-y-10 justify-center items-center w-full h-full">
      <p className="text-[150px]">404</p>

      <p className="text-[30px] max-lg:text-[25px] text-center">
        متاسفانه قادر به یافتن صفحه مورد نظر نیستیم
      </p>

      <p className="text-2xl max-lg:text-lg text-center">
        ممکن است صفحه مورد نظر جابجا شده باشد. لطفا برای یافتن صفحه مورد نظر، از
        منوی سایت استفاده نمایید
      </p>

      <Button
        size="lg"
        color="primary"
        as={NextLink}
        href={session?.user.role === "CUSTOMER" ? "/" : "/admin"}
      >
        بازگشت به منوی اصلی
      </Button>
    </div>
  );
};

export default NotFoundPage;
