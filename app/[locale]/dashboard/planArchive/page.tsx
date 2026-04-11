'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl'; 
import { PlanCard } from '../_components/PlanCard';

export default function PlanArchivePage() {
  const t = useTranslations('Plan');
  const [planHistory, setPlanHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedDates, setExpandedDates] = useState<string[]>([]);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/plans/');
        const data = await res.json();
        if (Array.isArray(data)) setPlanHistory(data);
      } catch (err) {
        console.error("Failed to fetch archive:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // Organizes history into daily chapters
  const groupedPlans = planHistory.reduce((acc: any, plan: any) => {
    const dateKey = new Date(plan.created_at).toLocaleDateString(); 
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(plan);
    return acc;
  }, {});

  const toggleExpand = (date: string) => {
    setExpandedDates(prev => 
      prev.includes(date) ? prev.filter(d => d !== date) : [...prev, date]
    );
  };

  return (
    <main 
      className="min-h-screen py-24 px-6 relative" 
      style={{
        borderRadius: "40px",
        background: "linear-gradient(145deg, #ece9ff 0%, #f3eeff 22%, #ffe8f8 52%, #e8f0ff 78%, #e4f5ff 100%)",
        backdropFilter: "blur(80px) saturate(180%)",
        WebkitBackdropFilter: "blur(80px) saturate(180%)",
      }}
    >  
      <header className="relative max-w-2xl mx-auto mb-20 text-center">
        <h1 className="text-4xl font-serif text-slate-800 tracking-tight italic">
          {t('titleArchive')}
        </h1>
        <div className="flex items-center justify-center gap-2 mt-4">
          <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 shadow-[0_0_8px_rgba(99,102,241,0.6)]" />
          <p className="text-slate-400 text-[10px] tracking-[0.4em] font-bold uppercase">
            {planHistory.length} {t('scoreLabel')}
          </p>
        </div>
      </header>

      <div className="relative max-w-2xl mx-auto space-y-16">
        {loading ? (
          <p className="text-center text-slate-400 italic font-light py-20 tracking-widest">
            {t('loading') || 'GATHERING HISTORY...'}
          </p>
        ) : Object.entries(groupedPlans).map(([date, plans]: [string, any]) => {
          const isExpanded = expandedDates.includes(date);
          const visiblePlans = isExpanded ? plans : plans.slice(0, 3);
          const hasMore = plans.length > 3;

          return (
            <section key={date} className="space-y-6">
              {/* Minimalist Date Pill */}
              <div className="flex justify-center">
                <div 
                  className="px-4 py-1.5 rounded-full bg-white/50 border border-white/80 backdrop-blur-md shadow-sm"
                >
                  <span className="text-[9px] font-black text-indigo-500/80 tracking-[0.2em] uppercase flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-indigo-400" />
                    {date}
                  </span>
                </div>
              </div>

              <div className="grid gap-3">
                {visiblePlans.map((item: any) => (
                  <div 
                    key={item.id}
                    className="opacity-80 hover:opacity-100 transition-opacity duration-300"
                  >
                    <PlanCard {...item} onToggle={() => {}} />
                  </div>
                ))}
              </div>

              {hasMore && (
                <button 
                  onClick={() => toggleExpand(date)}
                  className="w-full py-2 text-[9px] font-black text-slate-400 hover:text-indigo-500 uppercase tracking-[0.3em] transition-colors"
                >
                  {isExpanded ? '— Show Less' : `+ View ${plans.length - 3} more`}
                </button>
              )}
            </section>
          );
        })}
      </div>
    </main>
  );
}