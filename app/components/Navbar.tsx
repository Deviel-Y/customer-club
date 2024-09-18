"use client";

import { Avatar } from "@nextui-org/react";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

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
    "/admin/manage-users": { label: "مدیریت کاربران" },
  };

  useEffect(() => {
    setPathName(path);
  }, [path]);

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
