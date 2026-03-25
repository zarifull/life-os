import { EnergySection, YearSection } from "./_sections";

export default function Dashboard() {
  return (
    <main className="mx-auto max-w-4xl px-2 pt-0 pb-20 flex flex-col gap-12">
      {/* <YearSection /> */}
     <EnergySection />
    </main>
  );
}