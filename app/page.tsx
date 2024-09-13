import DashboardCard from "./components/DashboardCard";

const HomePage = () => {
  const labels = ["bill", "invoice"];
  return (
    <>
      <section className="flex flex-row justify-start gap-5 p-5">
        {labels.map((label, index) => (
          <DashboardCard key={label} label={label} amount={index} />
        ))}
      </section>
    </>
  );
};

export default HomePage;
