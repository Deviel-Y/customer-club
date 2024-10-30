"use client";

import { motion } from "framer-motion";

const BrandInfo = () => {
  return (
    <motion.div
      initial={{ translateX: 30, opacity: 0 }}
      animate={{ translateX: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "backInOut" }}
      className="p-24 max-md:hidden max-lg:w-full"
    >
      <h1 className="font-extrabold text-[60px] max-lg:text-[50px]">
        پردازش شبکه
      </h1>
      <p className="font-bold text-[29px] mb-5 max-lg:text-[21px] max-lg:my-3">
        پیشرو در پردازش شبکه‌های نوین
      </p>
      <article className="font-semibold text-[16px] mt-3 text-justify">
        پیشرو در پردازش شبکه‌های نوین نشان‌دهنده تمرکز ما بر ارائه راه‌حل‌های
        نوآورانه و به‌روز در زمینه شبکه و فناوری اطلاعات است. هدف ما فراهم کردن
        ابزاری است که به کاربران اجازه می‌دهد شبکه‌های خود را با سرعت، امنیت و
        بهره‌وری بیشتری مدیریت و بهینه‌سازی کنند. ما همواره در حال پیشرفت و
        انطباق با نیازهای دنیای تکنولوژی هستیم تا تجربه بهتری را برای مشتریان
        خود ایجاد کنیم
      </article>
    </motion.div>
  );
};

export default BrandInfo;
