import { EnergySection } from "./_sections";
import { NavigationGrid } from './_components/NavigationGrid';

export default function Dashboard() {
  return (
    <main className="mx-auto max-w-4xl px-4 pt-6 pb-20 flex flex-col gap-10">
      <div className="flex flex-col gap-12">
        <EnergySection />

        <div className="mt-12 border-t border-slate-200/50 pt-12">
          <h2 className="text-sm font-bold tracking-[0.2em] text-slate-400 uppercase text-center mb-8">
            Explore LifeOS
          </h2>
          <NavigationGrid />
        </div>
      </div>
    </main>
  );
}
