import getSession from "@/app/libs/getSession";
import { authorizeSuperAdmin } from "@/app/utils/authorizeRole";
import prisma from "@/prisma/client";
import { LogSection } from "@prisma/client";
import { subMonths } from "date-fns";
import LogActionBar from "./LogActionBar";
import LogTable from "./LogTable";

interface Props {
  searchParams: {
    message: string;
    section: LogSection;
    issuer: string;
    pageNumber: number;
  };
}

const SuperAdminLogsPage = async ({
  searchParams: { issuer, message, section, pageNumber },
}: Props) => {
  const session = await getSession();
  authorizeSuperAdmin(session!);

  const currentDate = new Date();
  const twoMonthsFromNow = subMonths(currentDate, 2);
  await prisma.log.deleteMany({
    where: { createdAt: { lte: twoMonthsFromNow } },
  });

  const prismaSecions = Object?.values(LogSection);
  const selectedSections = prismaSecions.includes(section)
    ? section
    : undefined;

  const currentPage = pageNumber || 1;

  const [logs, logCount] = await prisma.$transaction([
    prisma?.log?.findMany({
      where: {
        assignedToSection: selectedSections,
        issuer: { contains: issuer },
        message: { contains: message },
      },
      orderBy: { createdAt: "desc" },
      take: pageSize,
      skip: (currentPage - 1) * 10,
    }),

    prisma?.log?.count({
      where: {
        assignedToSection: selectedSections,
        issuer: { contains: issuer },
        message: { contains: message },
      },
    }),
  ]);

  return (
    <div className="flex flex-col px-5 py-2 w-full">
      <LogActionBar />

      <LogTable totalPage={Math.ceil(logCount / pageSize)} logs={logs} />
    </div>
  );
};

export default SuperAdminLogsPage;

const pageSize = 10;
