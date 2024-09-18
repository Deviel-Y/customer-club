import { redirect } from "next/navigation";
import DashboardCard from "./components/DashboardCard";
import getSession from "./libs/getSession";

const HomePage = async () => {
  const session = await getSession();
  if (!session) redirect("/api/auth/signin");

  return (
    <>
      <section className="flex flex-row justify-start gap-5 p-5">
        <DashboardCard label={"bill"} amount={1} />

        <DashboardCard label={"invoice"} amount={2} />
      </section>
    </>
  );
};

export default HomePage;
