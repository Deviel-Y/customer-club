import prisma from "@/prisma/client";
import DashboardCard from "../components/DashboardCard";
import getSession from "../libs/getSession";
import { authorizeAdmin } from "../utils/authorizeRole";

const AdminPage = async () => {
  const session = await getSession();
  authorizeAdmin(session!);

  const invoiceCount: number = await prisma.invoice.count();
  const proFormaInvoiceCount: number = await prisma.porformaInvoice.count();
  const userCount: number = await prisma.user.count({
    where: { role: "USER" },
  });

  const dashboardCardInfo: { label: string; amount: number }[] = [
    { label: "adminUser", amount: userCount },
    { label: "adminInvoice", amount: invoiceCount },
    { label: "adminPorformaInvoice", amount: proFormaInvoiceCount },
  ];

  return (
    <div className="flex flex-row justify-start gap-5 p-5">
      {dashboardCardInfo.map((info) => (
        <DashboardCard
          amount={info.amount}
          label={info.label}
          key={info.label}
        />
      ))}
    </div>
  );
};

export default AdminPage;
