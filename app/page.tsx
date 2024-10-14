import prisma from "@/prisma/client";
import DashboardCard from "./components/DashboardCard";
import getSession from "./libs/getSession";
import { authorizeUser } from "./utils/authorizeRole";

const HomePage = async () => {
  const session = await getSession();
  authorizeUser(session!);

  const [invoiceCount, porInvoiceCount, userTicketCount] = await Promise.all([
    prisma.invoice.count({
      where: {
        assignedToUserId: session?.user.id,
      },
    }),

    prisma.porformaInvoice.count({
      where: {
        assignedToUserId: session?.user.id,
      },
    }),

    prisma.ticket.count({
      where: {
        issuerId: session?.user.id,
      },
    }),
  ]);

  const dashboardCardInfo: { label: string; amount: number }[] = [
    { label: "userInvoice", amount: invoiceCount },
    { label: "userProformaInvoice", amount: porInvoiceCount },
    { label: "userTicket", amount: userTicketCount },
  ];

  return (
    <div>
      <section className="grid grid-cols-4 max-lg:grid-cols-3 grid-rows-1 max-sm:grid-rows-3 max-sm:grid-cols-1 gap-5 p-5">
        {dashboardCardInfo.map((info) => (
          <DashboardCard
            amount={info.amount}
            label={info.label}
            key={info.label}
          />
        ))}
      </section>
    </div>
  );
};

export default HomePage;
