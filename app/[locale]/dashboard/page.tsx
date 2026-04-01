import { createClient } from '@/lib/supabase/server';
import { EnergySection, YearSection } from "./_sections";

export default async function Dashboard() {
  const supabase = await createClient();


  return (
    <main className="mx-auto max-w-4xl px-4 pt-6 pb-20 flex flex-col gap-10">

      <div className="flex flex-col gap-12">
        <YearSection />
        <EnergySection />
      </div>
    </main>
  );
}