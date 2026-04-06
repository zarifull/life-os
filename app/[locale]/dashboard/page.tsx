import { createClient } from '@/lib/supabase/server';
import { EnergySection, YearSection } from "./_sections";
import { PlanSection } from './_sections/PlanSection';
import { NavigationGrid } from './_components/NavigationGrid';

export default async function Dashboard() {
  const supabase = await createClient();
  const today = new Date().toISOString().split('T')[0];


  return (
    <main className="mx-auto max-w-4xl px-4 pt-6 pb-20 flex flex-col gap-10">

      <div className="flex flex-col gap-12">
        {/* <YearSection /> */}
        {/* <PlanSection targetDate={today} />  */}
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