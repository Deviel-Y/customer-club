"use client";

import { NewspaperIcon, ShoppingBagIcon } from "@heroicons/react/24/outline";
import { Card } from "@nextui-org/react";
import { useRouter } from "next/navigation";

interface Props {
  label: string;
  amount: number;
}

const dataMapping: Record<
  string,
  {
    backgroundColor: string;
    icon: JSX.Element;
    iconBackgroung: string;
    href: string;
  }
> = {
  bill: {
    backgroundColor: "bg-gradient-to-r from-pink-500 to-rose-500",
    icon: (
      <ShoppingBagIcon className="stroke-[0.75px] opacity-75 w-8 h-8 -translate-y-[2px]" />
    ),
    iconBackgroung: "bg-red-600/70",
    href: "/bill",
  },

  invoice: {
    backgroundColor: "bg-gradient-to-r from-amber-200 to-yellow-500",
    icon: (
      <NewspaperIcon className="stroke-[0.75px] opacity-75 w-8 h-8 text-center " />
    ),
    iconBackgroung: "bg-yellow-400",
    href: "/invoice",
  },
};

const DashboardCard = ({ label, amount }: Props) => {
  const router = useRouter();

  return (
    <Card
      isPressable
      onClick={() => router.push(dataMapping[label].href)}
      className={`w-1/5 h-36 p-5 ${dataMapping[label].backgroundColor}`}
    >
      <div className="flex flex-col h-full w-full justify-between">
        <div className="flex flex-row justify-between items-center">
          <p className="text-lg">{label}</p>
          <div
            className={`w-11 h-11 rounded-full flex justify-center items-center ${dataMapping[label].iconBackgroung}`}
          >
            <figure>{dataMapping[label].icon}</figure>
          </div>
        </div>
        <p className="font-thin text-[35px] translate-x-[110px]">{amount}</p>
      </div>
    </Card>
  );
};

export default DashboardCard;
