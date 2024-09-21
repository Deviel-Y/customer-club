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

  return (
    <>
      <section className="flex flex-row justify-start gap-5 p-5">
        <DashboardCard label={"invoice"} amount={invoiceCount} />

        <DashboardCard label={"proformaInvoice"} amount={2} />
      </section>
    </>
  );
};

export default HomePage;
