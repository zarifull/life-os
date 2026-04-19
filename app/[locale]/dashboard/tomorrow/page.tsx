'use client';

import { useEffect } from 'react';
import { PlanSection } from '../_sections/PlanSection';
import { usePlanStore } from '../Plan/_lib/planStore';
import { fetchPlansByDate } from '@/lib/actions/plans';
import { useTranslations } from 'next-intl';

export default function TomorrowPage() {
  const { setPlans, plans } = usePlanStore();
  const t = useTranslations('Plan');

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const dateStr = tomorrow.toISOString().split('T')[0];

  useEffect(() => {
    async function load() {
      const { data } = await fetchPlansByDate(dateStr);
      if (data) setPlans(data);
    }
    load();
  }, [setPlans, dateStr]);

  return (
    <main className="min-h-screen  pt-24"  style={{
      borderRadius: "20px",
      background: "linear-gradient(145deg, #ece9ff 0%, #f3eeff 22%, #ffe8f8 52%, #e8f0ff 78%, #e4f5ff 100%)",
      backdropFilter: "blur(80px) saturate(180%)",
      WebkitBackdropFilter: "blur(80px) saturate(180%)",
    }}>
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-5%] right-[-5%] w-[40%] h-[40%] rounded-full bg-purple-100/30 blur-[100px]" />
        <div className="absolute bottom-[-5%] left-[-5%] w-[40%] h-[40%] rounded-full bg-indigo-100/30 blur-[100px]" />
      </div>

      <div className="relative max-w-2xl mx-auto px-6">
        <header className="mb-12 text-center">
          <div className="inline-flex items-center gap-3 mb-3">
            <div className="h-[1px] w-8 bg-indigo-200" />
            <span className="text-[10px] font-black tracking-[0.4em] text-indigo-400 uppercase">
              {t('intentions')}
            </span>
            <div className="h-[1px] w-8 bg-indigo-200" />
          </div>
          
          <h1 className="text-4xl font-serif italic text-slate-800 tracking-tight">
            {t('futureProtocol')}
          </h1>
        </header>

        <PlanSection targetDate={dateStr} />
      </div>
    </main>
  );
}