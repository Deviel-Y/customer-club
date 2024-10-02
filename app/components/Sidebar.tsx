"use client";

import templateLogo from "@/app/public/teplateLogo.png";
import {
  HomeIcon,
  NewspaperIcon,
  ShoppingBagIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import { Button, Image } from "@nextui-org/react";
import { motion, useAnimationControls } from "framer-motion";
import { useSession } from "next-auth/react";
import NextImage from "next/image";
import { useEffect, useState } from "react";
import SidebarLink from "./SidebarLink";
import { SignOutConfirmation } from "./SignoutConfirmation";

const Sidebar = () => {
  const { data: session } = useSession();
  const svgControls = useAnimationControls();
  const containerControls = useAnimationControls();
  const [isOpen, setIsOpen] = useState(false);
  const handleClick = () => setIsOpen(!isOpen);

  useEffect(() => {
    isOpen
      ? (containerControls.start("open"), svgControls.start("open"))
      : (containerControls.start("close"), svgControls.start("close"));
  }, [isOpen, svgControls, containerControls]);

  const sidebarDataMap: Record<string, { icon: JSX.Element; href: string }> = {
    داشبورد: {
      href: "/",
      icon: <HomeIcon className="stroke-inherit stroke-[0.75px] min-w-8 w-8" />,
    },
    فاکتورها: {
      href: "/invoice",
      icon: (
        <ShoppingBagIcon className="stroke-inherit stroke-[0.75px] min-w-8 w-8" />
      ),
    },
    "پیش فاکتورها": {
      href: "/porformaInvoice",
      icon: (
        <NewspaperIcon className="stroke-inherit stroke-[0.75px] min-w-8 w-8" />
      ),
    },
    "ویرایش اطلاعات کاربر": {
      href: `/editUserInfo/${session?.user.id}`,
      icon: (
        <UserCircleIcon className="stroke-inherit stroke-[0.75px] min-w-8 w-8" />
      ),
    },
    "پنل مدیریت": {
      href: "/admin",
      icon: <HomeIcon className="stroke-inherit stroke-[0.75px] min-w-8 w-8" />,
    },
    "صدور فاکتور": {
      href: "/admin/invoice-issuing",
      icon: (
        <ShoppingBagIcon className="stroke-inherit stroke-[0.75px] min-w-8 w-8" />
      ),
    },
    "صدور پیش فاکتور": {
      href: "/admin/porformaInvoice-issuing",
      icon: (
        <NewspaperIcon className="stroke-inherit stroke-[0.75px] min-w-8 w-8" />
      ),
    },
    "مدیریت کاربران": {
      href: "/admin/userList",
      icon: (
        <UserCircleIcon className="stroke-inherit stroke-[0.75px] min-w-8 w-8" />
      ),
    },
  };

  if (!session?.user) return null;

  return (
    <motion.aside
      variants={containerVariant}
      animate={containerControls}
      initial="close"
      className="bg-[#ececec] border-l-1 border-neutral-300  flex flex-col z-50 gap-20 p-3 fixed top-0 right-0 h-screen"
    >
      <div className="flex flex-row w-full justify-between items-center">
        <Image
          as={NextImage}
          alt="Compony Logo"
          src={templateLogo.src}
          width={150}
          height={100}
          style={{ height: "auto" }}
          className={` -translate-x-8
            ${
              !isOpen
                ? "translate-x-96 transition-all delay-100"
                : "transition-all "
            }
          `}
        />
        <Button
          className="p-1 flex rounded-full self-start"
          onPress={handleClick}
          isIconOnly
          variant="light"
          size="sm"
          radius="full"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1}
            stroke="currentColor"
            className="w-6 h-6 stroke-neutral-700"
          >
            <motion.path
              initial="close"
              animate={svgControls}
              variants={svgVariant}
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
            />
          </svg>
        </Button>
      </div>

      <div className="flex flex-col gap-3 h-full">
        {session.user?.role === "USER" &&
          userLinkLabels.map((label) => (
            <SidebarLink
              key={label}
              href={sidebarDataMap[label].href}
              label={label}
            >
              {sidebarDataMap[label].icon}
            </SidebarLink>
          ))}

        {session.user?.role === "ADMIN" &&
          adminLinkLabels.map((label) => (
            <SidebarLink
              key={label}
              href={sidebarDataMap[label].href}
              label={label}
            >
              {sidebarDataMap[label].icon}
            </SidebarLink>
          ))}

        <div className="cursor-pointer bottom-3 overflow-clip rounded flex stroke-[0.75px] hover:stroke-neutral-100 stroke-neutral-600 text-neutral-600 place-items-center gap-3 hover:bg-red-500 transition-all duration-[10ms]">
          <SignOutConfirmation />
        </div>
      </div>
    </motion.aside>
  );
};

export default Sidebar;

// Framer motion variants
const containerVariant = {
  open: {
    width: "16rem",
    transition: {
      type: "spring",
      damping: 15,
      duration: 1,
      ease: "easeInOut",
    },
  },

  close: {
    width: "4rem",
    transition: {
      type: "spring",
      damping: 15,
      duration: 0.03,
      ease: "easeInOut",
    },
  },
};
const svgVariant = {
  open: {
    rotate: 180,
    transition: {
      type: "spring",
      damping: 14,
      duration: 0.03,
      ease: "easeInOut",
    },
  },
  close: {
    rotate: 360,
    transition: {
      type: "spring",
      damping: 14,
      duration: 0.01,
      ease: "easeInOut",
    },
  },
};

const userLinkLabels: string[] = [
  "داشبورد",
  "فاکتورها",
  "پیش فاکتورها",
  "ویرایش اطلاعات کاربر",
];

const adminLinkLabels: string[] = [
  "پنل مدیریت",
  "صدور فاکتور",
  "صدور پیش فاکتور",
  "مدیریت کاربران",
];
