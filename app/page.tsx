import prisma from "@/prisma/client";
import DashboardCard from "./components/DashboardCard";
import getSession from "./libs/getSession";
import { authorizeUser } from "./utils/authorizeRole";

const HomePage = async () => {
  const session = await getSession();
  authorizeUser(session!);

  const invoiceCount = await prisma.invoice.count({
    where: {
      assignedToUserId: session?.user.id,
    },
  });

  const dashboardCardInfo: { label: string; amount: number }[] = [
    { label: "userInvoice", amount: invoiceCount },
    { label: "userProformaInvoice", amount: 2 },
  ];

  return (
    <div>
      <section className="flex flex-row justify-start gap-5 p-5">
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
