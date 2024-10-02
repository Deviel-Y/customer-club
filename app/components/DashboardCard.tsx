"use client";

import {
  NewspaperIcon,
  ShoppingBagIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import { Card } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { HiOutlineNewspaper, HiOutlineShoppingBag } from "react-icons/hi";
import { VscAccount } from "react-icons/vsc";

interface Props {
  label: string;
  amount: number;
}

const dataMapping: Record<
  string,
  {
    label: string;
    backgroundColor: string;
    icon: JSX.Element;
    figure: JSX.Element;
    iconBackgroung: string;
    href: string;
  }
> = {
  userInvoice: {
    label: "تعداد فاکتورها",
    backgroundColor: "bg-gradient-to-r from-pink-500 to-rose-500",
    icon: (
      <ShoppingBagIcon className="stroke-[0.75px] opacity-75 w-8 h-8 -translate-y-[2px]" />
    ),
    iconBackgroung: "bg-red-600/70",
    href: "/invoice",
    figure: (
      <HiOutlineShoppingBag className="figureIcon absolute bottom-3 left-6 scale-[6] stroke-[2px] opacity-10 w-6 overflow-visible h-8" />
    ),
  },

  userProformaInvoice: {
    label: "تعداد پیش فاکتورها",
    backgroundColor: "bg-gradient-to-r from-amber-200 to-yellow-500",
    icon: (
      <NewspaperIcon className="stroke-[0.75px] opacity-75 w-8 h-8 text-center " />
    ),
    iconBackgroung: "bg-yellow-400",
    href: "/proformaInvoice",
    figure: (
      <HiOutlineNewspaper className="figureIcon absolute bottom-4 left-10 scale-[6] stroke-[2px] opacity-10 w-6 overflow-visible h-8" />
    ),
  },

  adminUser: {
    label: "تعداد کاربرها",
    backgroundColor:
      "bg-gradient-to-r bg-gradient-to-r bg-gradient-to-r from-neutral-300 to-stone-400",
    icon: (
      <UserCircleIcon className=" fill-slate-300 stroke-[0.75px] opacity-75 w-8 h-8 text-center " />
    ),
    iconBackgroung: "bg-gray-400",
    href: "/admin/userList",
    figure: (
      <VscAccount className="figureIcon absolute bottom-2 left-4 scale-[5] stroke-[0.75px] opacity-10 w-6 overflow-visible h-8" />
    ),
  },

  adminInvoice: {
    label: "تعداد فاکتورها",
    backgroundColor: "bg-gradient-to-r from-pink-500 to-rose-500",
    icon: (
      <ShoppingBagIcon className=" fill-red-400 stroke-[0.75px] opacity-75 w-8 h-8 -translate-y-[2px]" />
    ),
    iconBackgroung: "bg-red-600/70",
    href: "/admin/invoice-issuing",
    figure: (
      <HiOutlineShoppingBag className="figureIcon absolute bottom-3 left-6 scale-[6] stroke-[2px] opacity-10 w-6 overflow-visible h-8" />
    ),
  },

  adminProformaInvoice: {
    label: "تعداد پیش فاکتورها",
    backgroundColor: "bg-gradient-to-r from-amber-200 to-yellow-500",
    icon: (
      <NewspaperIcon className="fill-yellow-200 stroke-[0.75px] opacity-75 w-8 h-8 text-center" />
    ),
    iconBackgroung: "bg-yellow-400",
    href: "/admin/proformaInvoice-issuing",
    figure: (
      <HiOutlineNewspaper className="figureIcon absolute bottom-4 left-10 scale-[6] stroke-[2px] opacity-10 w-6 overflow-visible h-8" />
    ),
  },
};

const DashboardCard = ({ label, amount }: Props) => {
  const router = useRouter();

  return (
    <Card
      isPressable
      onClick={() => router.push(dataMapping[label].href)}
      className={`card hover:scale-105 transition-all w-1/5 h-36 p-5 ${dataMapping[label].backgroundColor}`}
    >
      <div className="flex flex-col h-full w-full justify-between">
        <div className="flex flex-row justify-between items-center">
          <p className="text-lg">{dataMapping[label].label}</p>
          <div
            className={`w-11 h-11 rounded-full flex justify-center items-center ${dataMapping[label].iconBackgroung}`}
          >
            <figure className="flex flex-col justify-between">
              {dataMapping[label].icon}
            </figure>
          </div>
        </div>
        <div className="flex flex-row justify-between">
          <p className="font-thin text-[35px]">{amount}</p>
          <figure>{dataMapping[label].figure}</figure>
        </div>
      </div>
    </Card>
  );
};

export default DashboardCard;
