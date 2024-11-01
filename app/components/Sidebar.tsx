"use client";

import templateLogo from "@/app/public/teplateLogo.png";
import {
  HomeIcon,
  NewspaperIcon,
  ShoppingBagIcon,
  TicketIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import { Button, Image } from "@nextui-org/react";
import { motion, useAnimationControls } from "framer-motion";
import { Session } from "next-auth";
import NextImage from "next/image";
import { useEffect, useState } from "react";
import SidebarLink from "./SidebarLink";
import { SignOutConfirmation } from "./SignoutConfirmation";

interface Props {
  session: Session;
}

const Sidebar = ({ session }: Props) => {
  const svgControls = useAnimationControls();
  const containerControls = useAnimationControls();
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => setIsOpen(!isOpen);

  const handleLinkClick = () => setIsOpen(false);

  useEffect(() => {
    isOpen
      ? (containerControls.start("open"), svgControls.start("open"))
      : (containerControls.start("close"), svgControls.start("close"));
  }, [isOpen, svgControls, containerControls]);

  if (!session?.user) return null;

  return (
    <motion.aside
      variants={containerVariant}
      animate={containerControls}
      initial="close"
      className="bg-[#ececec] dark:bg-[#868686] border-l-1 border-neutral-300 dark:border-neutral-700 flex flex-col z-50 gap-20 p-3 fixed top-0 right-0 h-screen"
    >
      <div className="flex flex-row w-full justify-between items-center">
        <Image
          as={NextImage}
          alt="Compony Logo"
          src={templateLogo.src}
          width={150}
          height={100}
          style={{ height: "auto" }}
          className={`-translate-x-8 ${
            !isOpen
              ? "translate-x-96 transition-all delay-100"
              : "transition-all"
          }`}
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
            className="w-6 h-6 stroke-neutral-700 dark:stroke-slate-50"
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
        {session.user?.role === "CUSTOMER" &&
          userLinkLabels.map((label) => (
            <SidebarLink
              key={label}
              href={sidebarDataMap[label].href}
              label={label}
              onClick={handleLinkClick}
            >
              {sidebarDataMap[label].icon}
            </SidebarLink>
          ))}

        {(session?.user?.role === "ADMIN" ||
          session?.user?.role === "SUPER_ADMIN") &&
          adminLinkLabels.map((label) => (
            <SidebarLink
              key={label}
              href={sidebarDataMap[label].href}
              label={label}
              onClick={handleLinkClick}
            >
              {sidebarDataMap[label].icon}
            </SidebarLink>
          ))}

        <SignOutConfirmation />
      </div>
    </motion.aside>
  );
};

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
  "تیکت های من": {
    href: "/ticket",
    icon: <TicketIcon className="stroke-inherit stroke-[0.75px] min-w-8 w-8" />,
  },
  "مدیریت تیکت ها": {
    href: "/admin/ticket",
    icon: <TicketIcon className="stroke-inherit stroke-[0.75px] min-w-8 w-8" />,
  },
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
  "تیکت های من",
];

const adminLinkLabels: string[] = [
  "پنل مدیریت",
  "صدور فاکتور",
  "صدور پیش فاکتور",
  "مدیریت تیکت ها",
  "مدیریت کاربران",
];
