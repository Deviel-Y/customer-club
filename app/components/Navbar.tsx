"use client";

import { Avatar } from "@nextui-org/react";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { removeLastSegmentURL } from "../utils/removeLastSegmentURL";

const Navbar = () => {
  const { data: session } = useSession();
  const path = usePathname();
  const [pathName, setPathName] = useState<string>("");
  const headingMapping: Record<string, { label: string }> = {
    "/": { label: "داشبورد" },
    "/userAuth/login": { label: "داشبورد" },
    "/invoice": { label: "فاکتورها" },
    "/proformaInvoice": { label: "پیش فاکتورها" },
    "/admin": { label: "پنل مدیریت" },
    "/admin/invoice-issuing": { label: "صدور فاکتور" },
    "/admin/proformaInvoice-issuing": { label: "صدور پیش فاکتور" },
    "/admin/userList": { label: "مدیریت کاربران" },
    "/admin/createNewUser": { label: "تعریف کاربر جدید" },
    "/admin/editUser": { label: "ویرایش کاربر" },
    "/admin/invoice-issuing/createNewInvoice": { label: "صدور فاکتور جدید" },
  };

  useEffect(() => {
    if (path.includes("/admin/editUser")) {
      setPathName(removeLastSegmentURL(path));
    } else {
      setPathName(path);
    }
  }, [path, pathName]);

  if (!session) return null;

  return (
    <div className="flex flex-row justify-between items-center p-5">
      <h1 className="text-[40px]">{headingMapping[pathName].label}</h1>

      <Avatar
        alt="Profile Avater"
        fallback="?"
        size="lg"
        isBordered
        color="primary"
      />
    </div>
  );
};

export default Navbar;
