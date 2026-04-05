import { createClient } from '@/lib/supabase/server';
import { EnergySection, YearSection } from "./_sections";
import { PlanSection } from './_sections/PlanSection';

export default async function Dashboard() {
  const supabase = await createClient();
  const today = new Date().toISOString().split('T')[0];


  return (
    <main className="mx-auto max-w-4xl px-4 pt-6 pb-20 flex flex-col gap-10">

      <div className="flex flex-col gap-12">
        <YearSection />
        <PlanSection targetDate={today} /> 
        <EnergySection />
      </div>
    </main>
  );
}