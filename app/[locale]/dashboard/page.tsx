import  EnergySection  from "./_sections/EnergySection";
import { NavigationGrid } from './_sections/NavigationGrid';
import YearSection from "./_sections/YearSection";
import PlanSection  from "./_sections/PlanSection";
import { useTranslations } from "next-intl";

export default function Dashboard() {
  const t = useTranslations('');
  return (
    <main className="mx-auto max-w-4xl px-4 pt-6 pb-20 flex flex-col gap-10">
      <div className="flex flex-col gap-12">
        <YearSection />
        <PlanSection targetDate={new Date().toISOString()}/>
        <EnergySection />

        <div className="mt-12 border-t border-slate-200/50 pt-12">
          <h2 className="text-sm font-bold tracking-[0.2em] text-slate-400 uppercase text-center mb-8">
            {t('Navigation.explore_lifeos')}
          </h2>
          <NavigationGrid />
        </div>
      </div>
    </main>
  );
}
