'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl'; 
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, CheckCircle2 } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import { PlanCard } from '../../dashboard/_components/PlanCard';

export default function PlanArchivePage() {
  const t = useTranslations('Plan');
  const router = useRouter();
  const params = useParams();
  const locale = params?.locale || 'en';
  
  const [planHistory, setPlanHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/plans/');
        const data = await res.json();
        
        if (Array.isArray(data)) {
          const now = new Date();
          const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          
          const filteredPlans = data.filter(plan => {
            const executionDate = new Date(plan.target_date); 
            return executionDate < startOfToday;
          });
          
          setPlanHistory(filteredPlans);
        }
      } catch (err) {
        console.error("Failed to fetch archive:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const groupedPlans = planHistory.reduce((acc: any, plan: any) => {
    const dateKey = new Date(plan.target_date).toLocaleDateString('en-CA'); 
    
    if (!acc[dateKey]) {
      acc[dateKey] = {
        items: [],
        completedCount: 0,
        totalCount: 0
      };
    }
    
    acc[dateKey].items.push(plan);
    acc[dateKey].totalCount += 1;
    if (plan.completed) {
      acc[dateKey].completedCount += 1;
    }
    
    return acc;
  }, {});

  const sortedDates = Object.entries(groupedPlans).sort((a, b) => 
    new Date(b[0]).getTime() - new Date(a[0]).getTime()
  );

  const handleToggleComplete = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/plans/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: !currentStatus }),
      });
      if (res.ok) {
        setPlanHistory(prev => prev.map(p => p.id === id ? { ...p, completed: !currentStatus } : p));
      }
    } catch (err) {
      console.error("Update failed:", err);
    }
  };
  
  return (
    <>
      <main 
        className="min-h-screen py-12 sm:py-16 px-4 sm:px-12 relative overflow-hidden" 
        style={{
          background: "linear-gradient(145deg, #ece9ff 0%, #f3eeff 22%, #ffe8f8 52%, #e8f0ff 78%, #e4f5ff 100%)",
        }}
      >
        <div className="fixed inset-0 backdrop-blur-[100px] pointer-events-none" />
    
        <div className="relative max-w-2xl mx-auto z-10">
          <header className="mb-16 sm:mb-20 text-center">
            <h1 className="text-3xl sm:text-5xl font-serif text-slate-900 tracking-tight italic">
              {t('titleArchive')}
            </h1>
            <p className="mt-4 text-slate-400 text-[9px] sm:text-[10px] tracking-[0.4em] font-black uppercase flex items-center justify-center gap-3">
              <span className="hidden sm:block w-8 h-[1px] bg-indigo-100" />
              {t('last30Days')} 
              <span className="hidden sm:block w-8 h-[1px] bg-indigo-100" />
            </p>
          </header>
    
          <div className="space-y-12 sm:space-y-20">
            {loading ? (
              <div className="flex flex-col items-center py-20 gap-4">
                <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                <p className="text-slate-400 italic text-xs tracking-widest uppercase">{t('loading')}</p>
              </div>
            ) : sortedDates.length > 0 ? (
              sortedDates.map(([date, data]: [string, any]) => (
                <section key={date} className="relative">
                  <div className="sticky top-4 sm:top-8 z-30 flex items-center justify-between gap-2 mb-6">
                    
                    <div className="flex-shrink-0 px-3 sm:px-5 py-2 rounded-xl sm:rounded-2xl bg-white/50 backdrop-blur-2xl border border-white/60 shadow-lg flex items-center gap-2 sm:gap-3">
                      <Calendar size={12} className="text-indigo-500" />
                      <span className="text-[10px] sm:text-[11px] font-bold text-slate-800 tracking-wider">
                        {new Date(date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                      </span>
                    </div>
    
                    <div className="flex-shrink-0 px-3 sm:px-4 py-2 rounded-xl sm:rounded-2xl bg-indigo-500/10 backdrop-blur-2xl border border-indigo-200/50 shadow-sm flex items-center gap-2">
                      <CheckCircle2 size={12} className="text-indigo-500" />
                      <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-indigo-600 whitespace-nowrap">
                        {data.completedCount} / {data.totalCount} {t('achieved')}
                      </p>
                    </div>
                  </div>
    
                  <div className="grid gap-4">
                    {data.items.map((item: any) => (
                      <motion.div 
                        key={item.id}
                        layout 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="relative" 
                      >
                        <div
                          className="relative transition-all duration-300 hover:z-50" 
                          style={{
                            backgroundColor: "rgba(255, 255, 255, 0.15)",
                            backdropFilter: "blur(20px) saturate(160%)",
                            WebkitBackdropFilter: "blur(20px) saturate(160%)",
                            borderRadius: "24px",
                            border: "1px solid rgba(255, 255, 255, 0.5)",
                          }}
                        > 
                          <PlanCard 
                            key={item.id}
                            {...item} 
                            isHistory={true} 
                            onToggle={() => handleToggleComplete(item.id, item.completed)} 
                          />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </section>
              ))
            ) : (
              <div className="text-center py-20 bg-white/20 rounded-[32px] sm:rounded-[44px] border border-dashed border-white/40">
                <p className="text-slate-400 italic text-sm">{t('empty')}</p>
              </div>
            )}
          </div>
        </div>
      </main>

      <motion.button
          onClick={() => router.push(`/${locale}/dashboard`)}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ 
              scale: 1.1, 
              backgroundColor: "rgba(255, 255, 255, 0.9)",
              boxShadow: "0 15px 30px rgba(79, 70, 229, 0.15)"
          }}
          whileTap={{ scale: 0.9 }}
          className="fixed bottom-10 right-10 z-[200] flex items-center justify-center w-14 h-14 rounded-full bg-white/70 backdrop-blur-2xl border border-white/80 shadow-xl text-indigo-600 transition-all"
      >
          <ArrowLeft size={24} strokeWidth={2.5} />
      </motion.button>
    </>
  );
}