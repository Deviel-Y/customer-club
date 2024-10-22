import getSession from "@/app/libs/getSession";
import { authorizeSuperAdmin } from "@/app/utils/authorizeRole";

const SuperAdminLogsPage = async () => {
  const session = await getSession();
  authorizeSuperAdmin(session!);

  return <div>LogPage</div>;
};

export default SuperAdminLogsPage;
