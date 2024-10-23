import getSession from "@/app/libs/getSession";
import { authorizeSuperAdmin } from "@/app/utils/authorizeRole";
import prisma from "@/prisma/client";
import LogTable from "./LogTable";

const SuperAdminLogsPage = async () => {
  const session = await getSession();
  authorizeSuperAdmin(session!);

  const logs = await prisma.log.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="flex flex-col px-5 py-2 w-full">
      <LogTable logs={logs} />
    </div>
  );
};

export default SuperAdminLogsPage;
