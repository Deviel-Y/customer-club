"use client";

import {
  NewspaperIcon,
  ShoppingBagIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import { Card } from "@nextui-org/react";
import { useRouter } from "next/navigation";

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
  },

  userProformaInvoice: {
    label: "تعداد پیش فاکتورها",
    backgroundColor: "bg-gradient-to-r from-amber-200 to-yellow-500",
    icon: (
      <NewspaperIcon className="stroke-[0.75px] opacity-75 w-8 h-8 text-center " />
    ),
    iconBackgroung: "bg-yellow-400",
    href: "/proformaInvoice",
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
  },
  adminInvoice: {
    label: "تعداد فاکتورها",
    backgroundColor: "bg-gradient-to-r from-pink-500 to-rose-500",
    icon: (
      <ShoppingBagIcon className=" fill-red-400 stroke-[0.75px] opacity-75 w-8 h-8 -translate-y-[2px]" />
    ),
    iconBackgroung: "bg-red-600/70",
    href: "/admin/invoice-issuing",
  },

  adminProformaInvoice: {
    label: "تعداد پیش فاکتورها",
    backgroundColor: "bg-gradient-to-r from-amber-200 to-yellow-500",
    icon: (
      <NewspaperIcon className="fill-yellow-200 stroke-[0.75px] opacity-75 w-8 h-8 text-center " />
    ),
    iconBackgroung: "bg-yellow-400",
    href: "/admin/proformaInvoice-issuing",
  },
};

const DashboardCard = ({ label, amount }: Props) => {
  const router = useRouter();

  return (
    <Card
      isPressable
      onClick={() => router.push(dataMapping[label].href)}
      className={`hover:scale-105 transition-all w-1/5 h-36 p-5 ${dataMapping[label].backgroundColor}`}
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
        <p className="font-thin text-[35px] translate-x-[110px]">{amount}</p>
      </div>
    </Card>
  );
};

export default DashboardCard;
