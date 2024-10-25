import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

interface Props {
  href: string;
  label: string;
  children: ReactNode;
  onClick?: () => void;
}

const SidebarLink = ({ children, label, href, onClick }: Props) => {
  const pathName = usePathname();

  return (
    <Link
      href={href}
      onClick={onClick} // Trigger the onClick when a link is clicked
      className={`${
        pathName === href
          ? "bg-neutral-900/30 dark:bg-neutral-200/50 text-neutral-100"
          : undefined
      } cursor-pointer overflow-clip p-1 rounded flex stroke-[0.75px] hover:stroke-neutral-100 stroke-neutral-600 dark:stroke-neutral-50 dark:text-neutral-50 text-neutral-600  hover:text-neutral-100 place-items-center gap-3 hover:bg-neutral-700/30 dark:hover:bg-neutral-300/50 transition-colors duration-100`}
    >
      {children}
      <p className="whitespace-nowrap text-inherit tracking-wide">{label}</p>
    </Link>
  );
};

export default SidebarLink;
