import prisma from "@/prisma/client";
import DashboardCard from "../components/DashboardCard";
import getSession from "../libs/getSession";
import { authorizeAdmin } from "../utils/authorizeRole";

const AdminPage = async () => {
  const session = await getSession();
  authorizeAdmin(session!);

  const [invoiceCount, proFormaInvoiceCount, userCount, adminTicketCount] =
    await Promise.all([
      prisma.invoice.count(),

      prisma.porformaInvoice.count(),

      prisma.user.count({
        where: { role: "USER" },
      }),
      prisma.ticket.count({
        where: {
          status: { in: ["INVESTIGATING", "OPEN"] },
        },
      }),
    ]);

  const dashboardCardInfo: { label: string; amount: number }[] = [
    { label: "adminUser", amount: userCount },
    { label: "adminInvoice", amount: invoiceCount },
    { label: "adminPorformaInvoice", amount: proFormaInvoiceCount },
    { label: "adminTicket", amount: adminTicketCount },
  ];

  return (
    <div className="grid grid-cols-4 max-md:grid-cols-3 grid-rows-1 max-sm:grid-rows-3 max-sm:grid-cols-1 gap-5 p-5">
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
