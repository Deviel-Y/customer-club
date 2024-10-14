import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

interface Props {
  href: string;
  label: string;
  children: ReactNode;
}

const SidebarLink = ({ children, label, href }: Props) => {
  const pathName = usePathname();

  return (
    <Link
      href={href}
      className={`${
        pathName === href
          ? "bg-neutral-900/30 stroke-neutral-50 text-neutral-50"
          : undefined
      } cursor-pointer overflow-clip p-1 rounded flex stroke-[0.75px] hover:stroke-neutral-100  stroke-neutral-600 text-neutral-600 hover:text-neutral-100 place-items-center gap-3 hover:bg-neutral-700/30 transition-colors duration-100`}
    >
      {children}
      <p className="whitespace-nowrap text-inherit tracking-wide">{label}</p>
    </Link>
  );
};

export default SidebarLink;
