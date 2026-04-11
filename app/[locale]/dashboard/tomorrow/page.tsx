'use client';
import { useEffect } from 'react';
import { PlanSection } from '../_sections/PlanSection';
import { usePlanStore } from '../Plan/_lib/planStore';
import { fetchPlansByDate } from '@/lib/supabase/plans';
import { useTranslations } from 'next-intl';

export default function TomorrowPage() {
  const { setPlans } = usePlanStore();
  const tomorrowDate = new Date();
  tomorrowDate.setDate(tomorrowDate.getDate() + 1);
  const dateStr = tomorrowDate.toISOString().split('T')[0];
  tomorrowDate.setDate(tomorrowDate.getDate() + 1);
  const { plans } = usePlanStore();
    const t = useTranslations('Plan');

  

  const displayPlans = plans.filter(p => p.target_date === dateStr);

  useEffect(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateStr = tomorrow.toISOString().split('T')[0];

    async function load() {
      const { data } = await fetchPlansByDate(dateStr);
      if (data) setPlans(data);
    }
    load();
  }, [setPlans]);


  return (
    <main className="min-h-screen bg-slate-50/50 pt-20">
      <div className="max-w-4xl mx-auto px-6">
        <span className="text-[10px] font-bold tracking-[0.3em] text-emerald-500 uppercase block mb-4 text-center">
        <span className="text-[10px] font-bold tracking-[0.3em] text-emerald-500 uppercase block mb-4 text-center">
          {t('futureProtocol')}
        </span>        </span>
        <PlanSection targetDate={dateStr} />
      </div>
    </main>
  );
}