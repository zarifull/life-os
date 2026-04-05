'use client';
import { PlanCard } from '../_components/PlanCard';
import { ScoreBadge } from '../_components/ScoreBadge';
import { useTranslations } from 'next-intl';

export default function PlanPage() {
  const t = useTranslations('Plan');

  // Logic to calculate scores (Mock data for now)
  const plans = [
    { id: '1', title: 'English Lesson Prep', time: '10:00', completed: true },
    { id: '2', title: 'Supabase Integration', time: '14:00', completed: false },
  ];
  
  const completedCount = plans.filter(p => p.completed).length;

  return (
    <main className="flex items-center justify-between min-h-screen px-16 bg-[#f4f7ff]">
      {/* Left: Archive Navigation */}
      <button className="text-slate-400 hover:text-indigo-600 font-serif italic text-xl transition-all">
        ← {t('viewHistory')}
      </button>

      {/* Center: The Notebook Page */}
      <div className="w-full max-w-xl flex flex-col items-center">
        <header className="text-center mb-10">
          <ScoreBadge current={completedCount} total={plans.length} />
          <h1 className="text-4xl font-serif mt-6 text-slate-900">{t('todayTitle')}</h1>
        </header>

        <div className="w-full">
          {plans.map(plan => (
            <PlanCard key={plan.id} {...plan} onToggle={() => console.log('Toggle', plan.id)} />
          ))}
        </div>
      </div>

      {/* Right: Tomorrow Navigation */}
      <button className="text-slate-400 hover:text-indigo-600 font-serif italic text-xl transition-all">
        {t('planTomorrow')} →
      </button>
    </main>
  );
}