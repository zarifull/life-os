'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Clock, ArrowUp } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import { ScoreBadge } from '../_components/ScoreBadge';
import { PlanCard } from '../_components/PlanCard';
import { usePlanStore } from '../Plan/_lib/planStore';

interface PlanSectionProps {
  targetDate: string;
}

export default function PlanSection({ targetDate }: PlanSectionProps) {
  const t = useTranslations('Plan');
  const { plans, setPlans, togglePlan, addPlan, deletePlan } = usePlanStore();
  
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState("");
  const [time, setTime] = useState("00:00");

  const todayStr = new Date().toISOString().split('T')[0];
  const isTomorrow = targetDate > todayStr;
  const isArchive = targetDate < todayStr;

  useEffect(() => {
    async function fetchPlans() {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('plans')
        .select('*')
        .order('time', { ascending: true });

      if (data) setPlans(data);
      if (error) console.error("Error loading intentions:", error.message);
    }
    fetchPlans();
  }, [setPlans]);

  const displayPlans = plans.filter(p => p.target_date === targetDate);
  const completedCount = displayPlans.filter(p => p.completed).length;
  const totalCount = displayPlans.length;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    
    await addPlan(title, time, targetDate); 
    setTitle("");
    setIsAdding(false);
  };

  return (
    <section 
      className="w-full max-w-2xl mx-auto flex flex-col items-center py-12 px-8 sm:px-12"  
      style={{
        borderRadius: "44px", 
        background: "linear-gradient(145deg, #ece9ff 0%, #f3eeff 22%, #ffe8f8 52%, #e8f0ff 78%, #e4f5ff 100%)",
        backdropFilter: "blur(80px) saturate(180%)",
        WebkitBackdropFilter: "blur(80px) saturate(180%)",
        border: "1px solid rgba(255, 255, 255, 0.6)",
        boxShadow: "0 40px 120px rgba(120, 100, 200, 0.12)"
      }}
    >
      <motion.header 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full flex flex-col items-center mb-12"
      >
        <ScoreBadge current={completedCount} total={totalCount} />
        <h2 className="text-4xl font-serif mt-6 tracking-tight text-slate-900 italic">
          {isTomorrow ? t('titleTomorrow') : isArchive ? t('titleArchive') : t('titleToday')}
        </h2>
      </motion.header>
      
      <div className="w-full space-y-4">
        <AnimatePresence mode="popLayout">
          {displayPlans.length > 0 ? (
            displayPlans.map((plan) => (
              <motion.div 
                key={plan.id} 
                layout
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="group relative"
              >
                <PlanCard {...plan} onToggle={() => togglePlan(plan.id)} />
                <button 
                  onClick={() => deletePlan(plan.id)}
                  className="absolute -right-8 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 p-2 text-slate-300 hover:text-red-400 transition-all"
                >
                  <X size={14} />
                </button>
              </motion.div>
            ))
          ) : (
             <p className="text-center text-slate-400/60 italic py-12 text-sm tracking-widest uppercase">
               {t('empty')}
             </p>
          )}
        </AnimatePresence>

        <div className="pt-6">
          {isAdding ? (
            <motion.form 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              onSubmit={handleSubmit} 
              className="p-6 bg-white/40 backdrop-blur-2xl rounded-[32px] border border-white/60 shadow-sm"
            >
              <div className="flex items-start justify-between gap-2">
                <input 
                  autoFocus
                  className="bg-transparent border-none outline-none flex-1 text-xl font-light italic text-slate-800 placeholder:text-slate-300"
                  placeholder={t('placeholder')}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                
                <AnimatePresence>
                  {title.trim().length > 0 && (
                    <motion.button
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      type="submit"
                      className="p-2.5 bg-indigo-500 text-white rounded-full shadow-lg hover:bg-indigo-600 transition-all flex-shrink-0"
                    >
                      <ArrowUp size={18} />
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>
            
              <div className="flex items-center gap-4 mt-4 text-slate-400">
                <div className="flex items-center gap-2 bg-white/60 px-4 py-1.5 rounded-full border border-white/40">
                  <Clock size={12} className="text-indigo-400" />
                  <input 
                    type="time" 
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="bg-transparent text-xs font-bold outline-none cursor-pointer text-slate-600"
                  />
                </div>
                <button 
                  type="button" 
                  onClick={() => setIsAdding(false)}
                  className="text-[10px] font-bold uppercase tracking-widest hover:text-slate-600 transition-colors"
                >
                  {t('cancel')}
                </button>
              </div>
            </motion.form>
          ) : (
            <motion.button 
              whileHover={{ scale: 1.01, backgroundColor: "rgba(255,255,255,0.4)" }}
              onClick={() => setIsAdding(true)}
              className="w-full py-6 flex items-center justify-center gap-2 text-slate-400 bg-white/20 rounded-[32px] border border-dashed border-white/40 hover:text-indigo-500 transition-all italic font-light text-sm"
            >
              <Plus size={14} /> {t('addNew')}
            </motion.button>
          )}
        </div>
      </div>

      <footer className="w-full flex items-center justify-between border-t border-white/20 mt-16 pt-8">
        <Link 
          href="/dashboard/planArchive" 
          className="text-[10px] uppercase font-bold tracking-[0.3em] text-slate-400 hover:text-indigo-500 transition-all flex items-center gap-2 group"
        >
          <div className="w-1.5 h-1.5 rounded-full bg-indigo-200 group-hover:bg-indigo-500 transition-colors" />
          {t('archiveLink')}
        </Link>

        <Link 
          href={isTomorrow || isArchive ? "/dashboard" : "/dashboard/tomorrow"} 
          className="text-[10px] uppercase font-bold tracking-[0.3em] text-slate-400 hover:text-emerald-500 transition-all flex items-center gap-2 group text-right"
        >
          {isTomorrow || isArchive ? t('todayLink') : t('tomorrowLink')}
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-200 group-hover:bg-emerald-500 transition-colors" />
        </Link>
      </footer>
    </section>
  );
}