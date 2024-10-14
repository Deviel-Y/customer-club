"use client";

import userPlaceholder from "@/public/user-profile-placeholder.jpg";
import { Avatar } from "@nextui-org/react";
import { Notification } from "@prisma/client";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { removeLastSegmentURL } from "../utils/removeLastSegmentURL";
import ShowNotificationButton from "./ShowNotificationButton";

interface Props {
  notifications: Notification[];
  unReadNotificationCount: number;
}

const Navbar = ({ notifications, unReadNotificationCount }: Props) => {
  const { data: session } = useSession();
  const path = usePathname();
  const [pathName, setPathName] = useState<string>("");

  useEffect(() => {
    if (
      path.includes("/ticket/ticketDetail") ||
      path.includes("/admin/ticket/ticketDetail") ||
      path.includes("/admin/editUser") ||
      path.includes("/editUserInfo") ||
      path.includes("/admin/invoice-issuing/editInvoiceInfo") ||
      path.includes("/admin/porformaInvoice-issuing/editPorInvoiceInfo")
    ) {
      setPathName(removeLastSegmentURL(path));
    } else {
      setPathName(path);
    }
  }, [path, pathName]);

  if (!session) return null;

  return (
    <div className="flex flex-row justify-between items-center px-5 py-2">
      <h1 className="text-[40px] max-md:text-[30px] max-sm:text-[23px]">
        {headingMapping[pathName].label}
      </h1>

      <div className="flex flex-row gap-5 justify-center items-center">
        <ShowNotificationButton
          unReadNotificationCount={unReadNotificationCount}
          notifications={notifications}
        />

        <Avatar
          src={session.user.image || userPlaceholder.src}
          alt="Profile Avater"
          fallback="?"
          className="scale-[1.4]"
          color="primary"
        />
      </div>
    </div>
  );
};

export default Navbar;

const headingMapping: Record<string, { label: string }> = {
  "/": { label: "داشبورد" },
  "/userAuth/login": { label: "داشبورد" },
  "/invoice": { label: "فاکتورها" },
  "/porformaInvoice": { label: "پیش فاکتورها" },
  "/editUserInfo": { label: "ویرایش اطلاعات کاربر" },
  "/ticket": { label: "تیکت های من" },
  "/ticket/ticketDetail": { label: "جزئیات تیکت" },
  "/notification": { label: "لیست اعلان ها" },
  "/admin/notification": { label: "لیست اعلان ها" },
  "/admin": { label: "پنل مدیریت" },
  "/admin/invoice-issuing": { label: "صدور فاکتور" },
  "/admin/porformaInvoice-issuing": { label: "صدور پیش فاکتور" },
  "/admin/userList": { label: "مدیریت کاربران" },
  "/admin/createNewUser": { label: "تعریف کاربر جدید" },
  "/admin/editUser": { label: "ویرایش کاربر" },
  "/admin/invoice-issuing/createNewInvoice": { label: "صدور فاکتور جدید" },
  "/admin/invoice-issuing/editInvoiceInfo": { label: "ویرایش فاکتور" },
  "/admin/porformaInvoice-issuing/createNewPorInvoice": {
    label: "صدور پیش فاکتور جدید",
  },
  "/admin/porformaInvoice-issuing/editPorInvoiceInfo": {
    label: "ویرایش پیش فاکتور",
  },
  "/admin/ticket": { label: "مدیریت تیکت ها" },
  "/admin/ticket/ticketDetail": { label: "جزئیات تیکت" },
};
