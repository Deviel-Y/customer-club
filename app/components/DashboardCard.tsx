"use client";

import {
  NewspaperIcon,
  ShoppingBagIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import { Card } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import {
  HiOutlineNewspaper,
  HiOutlineShoppingBag,
  HiOutlineTicket,
  HiUserCircle,
} from "react-icons/hi";

interface Props {
  label: string;
  amount: number;
}

const DashboardCard = ({ label, amount }: Props) => {
  const router = useRouter();

  return (
    <Card
      isPressable
      onClick={() => router.push(dataMapping[label].href)}
      className={`card hover:scale-105 w-full transition-all h-36 p-5 shadow-md ${dataMapping[label].backgroundColor} ${dataMapping[label].shadowColor}`}
    >
      <div className="flex flex-col h-full w-full justify-between ">
        <div className="flex flex-row justify-between items-center">
          <p className="text-lg text-black/65">{dataMapping[label].label}</p>
          <div
            className={`w-11 h-11 rounded-full flex justify-center items-center ${dataMapping[label].iconBackgroung}`}
          >
            <figure className="flex flex-col justify-between">
              {dataMapping[label].icon}
            </figure>
          </div>
        </div>
        <div className="flex flex-row justify-between">
          <p className="font-thin text-[35px] text-black/65">{amount}</p>
          <figure>{dataMapping[label].figure}</figure>
        </div>
      </div>
    </Card>
  );
};

export default DashboardCard;

const dataMapping: Record<
  string,
  {
    label: string;
    backgroundColor: string;
    icon: JSX.Element;
    figure: JSX.Element;
    iconBackgroung: string;
    href: string;
    shadowColor: string;
  }
> = {
  userInvoice: {
    label: "تعداد فاکتورها",
    backgroundColor: "bg-gradient-to-r from-pink-500 to-rose-500",
    icon: (
      <ShoppingBagIcon className="fill-red-400 stroke-black stroke-[0.75px] opacity-75 w-8 h-8 -translate-y-[2px]" />
    ),
    iconBackgroung: "bg-red-600/70",
    href: "/invoice",
    figure: (
      <HiOutlineShoppingBag className="figureIcon dark:stroke-black absolute bottom-3 left-6 scale-[6] stroke-[2px] opacity-10 w-6 overflow-visible h-8" />
    ),
    shadowColor: "shadow-red-400",
  },

  userProformaInvoice: {
    label: "تعداد پیش فاکتورها",
    backgroundColor: "bg-gradient-to-r from-amber-200 to-yellow-500",
    icon: (
      <NewspaperIcon className="fill-yellow-200 stroke-black stroke-[0.75px] opacity-75 w-8 h-8 text-center " />
    ),
    iconBackgroung: "bg-yellow-400",
    href: "/porformaInvoice",
    figure: (
      <HiOutlineNewspaper className="figureIcon dark:stroke-black absolute bottom-4 left-10 scale-[6] stroke-[2px] opacity-10 w-6 overflow-visible h-8" />
    ),
    shadowColor: "shadow-yellow-200",
  },

  usersCount: {
    label: "تعداد کاربرها",
    backgroundColor:
      "bg-gradient-to-r bg-gradient-to-r bg-gradient-to-r from-neutral-300 to-stone-400",
    icon: (
      <UserCircleIcon className="fill-slate-300 stroke-black stroke-[0.75px] opacity-75 w-8 h-8 text-center " />
    ),
    iconBackgroung: "bg-gray-400",
    href: "/admin/userList",
    figure: (
      <HiUserCircle
        fill="none"
        className="figureIcon dark:stroke-black absolute bottom-[8px] left-7 scale-[6] stroke-[1.6px] opacity-10 w-6 overflow-visible h-8"
      />
    ),
    shadowColor: "shadow-slate-300",
  },

  adminInvoice: {
    label: "تعداد فاکتورها",
    backgroundColor: "bg-gradient-to-r from-pink-500 to-rose-500",
    icon: (
      <ShoppingBagIcon className=" fill-red-400 stroke-black stroke-[0.75px] opacity-75 w-8 h-8 -translate-y-[2px]" />
    ),
    iconBackgroung: "bg-red-600/70",
    href: "/admin/invoice-issuing",
    figure: (
      <HiOutlineShoppingBag className="figureIcon dark:stroke-black absolute bottom-3 left-6 scale-[6] stroke-[2px] opacity-10 w-6 overflow-visible h-8" />
    ),
    shadowColor: "shadow-red-400",
  },

  adminPorformaInvoice: {
    label: "تعداد پیش فاکتورها",
    backgroundColor: "bg-gradient-to-r from-amber-200 to-yellow-500",
    icon: (
      <NewspaperIcon className="fill-yellow-200 stroke-black stroke-[0.75px] opacity-75 w-8 h-8 text-center" />
    ),
    iconBackgroung: "bg-yellow-400",
    href: "/admin/porformaInvoice-issuing",
    figure: (
      <HiOutlineNewspaper className="figureIcon dark:stroke-black absolute bottom-4 left-10 scale-[6] stroke-[2px] opacity-10 w-6 overflow-visible h-8" />
    ),
    shadowColor: "shadow-yellow-200",
  },

  adminTicket: {
    label: "تعداد تیکت های دریافتی",
    backgroundColor: "bg-gradient-to-r from-blue-200 to-cyan-200",
    icon: (
      <HiOutlineTicket className="fill-cyan-200 stroke-black stroke-[0.75px] opacity-75 w-8 h-8 text-center" />
    ),
    iconBackgroung: "bg-blue-300",
    href: "/admin/ticket",
    figure: (
      <HiOutlineTicket className="figureIcon dark:stroke-black absolute bottom-5 left-10 scale-[6] stroke-[2px] opacity-10 w-6 overflow-visible h-8" />
    ),
    shadowColor: "shadow-cyan-200",
  },

  userTicket: {
    label: "تعداد تیکت های ارسالی",
    backgroundColor: "bg-gradient-to-r from-blue-200 to-cyan-200",
    icon: (
      <HiOutlineTicket className="fill-cyan-200 stroke-black stroke-[0.75px] opacity-75 w-8 h-8 text-center" />
    ),
    iconBackgroung: "bg-blue-300",
    href: "/ticket",
    figure: (
      <HiOutlineTicket className="figureIcon dark:stroke-black absolute bottom-5 left-10 scale-[6] stroke-[2px] opacity-10 w-6 overflow-visible h-8" />
    ),
    shadowColor: "shadow-cyan-200",
  },
};
