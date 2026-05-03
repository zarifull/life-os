'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Clock, ArrowUp, Check } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import { ScoreBadge } from '../_components/ScoreBadge';
import { PlanCard } from '../_components/PlanCard';
import { usePlanStore } from '../Plan/_lib/planStore';
import { fetchPlansByDate } from '@/lib/actions/plans'; 

interface PlanSectionProps {
  targetDate: string;
}

export default function PlanSection({ targetDate }: PlanSectionProps) {
  const t = useTranslations('Plan');
  const { plans, setPlans, togglePlan, addPlan, deletePlan,editPlan } = usePlanStore();
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState("");
  const [time, setTime] = useState("00:00");

  const normalizedTarget = targetDate.includes('T') 
    ? targetDate.split('T')[0] 
    : targetDate;

  const todayStr = new Date().toLocaleDateString('en-CA');
const isTomorrow = normalizedTarget > todayStr;
  const isArchive = normalizedTarget < todayStr;
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editTime, setEditTime] = useState("");

  useEffect(() => {
    let isMounted = true;
  
    async function fetchPlans() {
      setIsLoading(true);
      const { data, error } = await fetchPlansByDate(normalizedTarget);
      
      if (isMounted && data) {
        setPlans(data);
      }
      
      if (error) console.error("Error loading plans:", error.message);
      setIsLoading(false);
    }
  
    fetchPlans();
  
    return () => {
      isMounted = false;
    };
  }, [normalizedTarget, setPlans]);

  const displayPlans = plans.filter(p => p.target_date === normalizedTarget);
  const completedCount = displayPlans.filter(p => p.completed).length;
  const totalCount = displayPlans.length;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    
    await addPlan(title, time, normalizedTarget); 
    setTitle("");
    setIsAdding(false);
  };

  const handleStartEdit = (plan: any) => {
    setEditingId(plan.id);
    setEditTitle(plan.title);
    setEditTime(plan.time);
  };

  const handleSaveEdit = async (id: string) => {
    await editPlan(id, editTitle, editTime);
    setEditingId(null);
  };
  
  return (
    <section 
    className="w-full max-w-2xl mx-auto flex flex-col items-center py-8 sm:py-12 px-4 sm:px-12 transition-all duration-300"  
    style={{
      borderRadius: "clamp(24px, 5vw, 44px)",      
      background: "linear-gradient(145deg, rgba(236, 233, 255, 1) 0%, rgba(243, 238, 255, 1) 22%, rgba(255, 232, 248, 1) 52%, rgba(232, 240, 255, 1) 78%, rgba(228, 245, 255, 1) 100%)",
      backdropFilter: "blur(80px) saturate(180%)",
      WebkitBackdropFilter: "blur(80px) saturate(180%)",      
      border: "clamp(3px, 1vw, 6px) solid rgba(255, 255, 255, 0.6)",
      boxShadow: "0 40px 120px rgba(120, 100, 200, 0.12)"
    }}
  >
    <motion.header 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full flex flex-col items-center mb-8 sm:mb-12"
    >
      <ScoreBadge current={completedCount} total={totalCount} />
      <h2 className="text-3xl sm:text-4xl font-serif mt-6 tracking-tight text-slate-900 italic text-center">
        {isTomorrow ? t('titleTomorrow') : isArchive ? t('titleArchive') : t('titleToday')}
      </h2>
    </motion.header>
    
    <div className="w-full space-y-3 sm:space-y-4">
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
              {editingId === plan.id ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="group relative p-5 transition-all duration-500"
                  style={{
                    backgroundColor: "rgba(255, 255, 255, 0.15)", 
                    backdropFilter: "blur(24px) saturate(160%)",
                    WebkitBackdropFilter: "blur(24px) saturate(160%)",
                    borderRadius: "24px",
                    border: "1px solid rgba(255, 255, 255, 0.4)",
                    boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.07)"
                  }}
                  whileHover={{ 
                    backgroundColor: "rgba(255, 255, 255, 0.25)",
                    translateY: -2,
                    boxShadow: "0 12px 40px 0 rgba(31, 38, 135, 0.12)"
                  }}
                >
                  <input 
                    autoFocus
                    className="w-full bg-transparent border-none outline-none text-base sm:text-lg font-medium text-slate-800 italic"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                  />
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-2 bg-white/40 px-3 py-1 rounded-full">
                      <Clock size={12} className="text-indigo-400" />
                      <input 
                        type="time" 
                        className="bg-transparent text-[10px] sm:text-xs font-bold outline-none text-slate-600"
                        value={editTime}
                        onChange={(e) => setEditTime(e.target.value)}
                      />
                    </div>
                    <div className="flex gap-2 sm:gap-3">
                      <button 
                        onClick={() => setEditingId(null)}
                        className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-slate-600"
                      >
                        {t('cancel')}
                      </button>
                      <button 
                        onClick={() => handleSaveEdit(plan.id)}
                        className="p-1.5 sm:p-2 bg-indigo-500 text-white rounded-full hover:bg-indigo-600 transition-all shadow-md"
                      >
                        <Check size={14} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <div className="flex items-center gap-1">
                  <div className="flex-1">
                    <PlanCard 
                      {...plan} 
                      onToggle={() => togglePlan(plan.id)} 
                      onEdit={() => handleStartEdit(plan)}
                    />
                  </div>
                  <button 
                    onClick={() => deletePlan(plan.id)}
                    className="p-2 text-slate-300 hover:text-red-400 transition-all md:opacity-0 md:group-hover:opacity-100"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}
            </motion.div>
          ))
        ) : (
           <p className="text-center text-slate-400/60 italic py-12 text-sm tracking-widest uppercase">
             {t('empty')}
           </p>
        )}
      </AnimatePresence>
  
      <div className="pt-4 sm:pt-6">
        {isAdding ? (
          <motion.form 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={handleSubmit} 
            className="p-4 sm:p-6 bg-white/40 backdrop-blur-2xl rounded-[24px] sm:rounded-[32px] border border-white/60 shadow-sm"
          >
            <div className="flex items-start justify-between gap-2">
              <input 
                autoFocus
                className="bg-transparent border-none outline-none flex-1 text-lg sm:text-xl font-light italic text-slate-800 placeholder:text-slate-300"
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
                    className="p-2 sm:p-2.5 bg-indigo-500 text-white rounded-full shadow-lg hover:bg-indigo-600 transition-all flex-shrink-0"
                  >
                    <ArrowUp size={18} />
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
          
            <div className="flex items-center gap-4 mt-4 text-slate-400">
              <div className="flex items-center gap-2 bg-white/60 px-3 sm:px-4 py-1.5 rounded-full border border-white/40">
                <Clock size={12} className="text-indigo-400" />
                <input 
                  type="time" 
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="bg-transparent text-[10px] sm:text-xs font-bold outline-none cursor-pointer text-slate-600"
                />
              </div>
              <button 
                type="button" 
                onClick={() => setIsAdding(false)}
                className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest hover:text-slate-600 transition-colors"
              >
                {t('cancel')}
              </button>
            </div>
          </motion.form>
        ) : (
          <motion.button 
            whileHover={{ scale: 1.01, backgroundColor: "rgba(255,255,255,0.4)" }}
            onClick={() => setIsAdding(true)}
            className="w-full py-4 sm:py-6 flex items-center justify-center gap-2 text-slate-400 bg-white/20 rounded-[24px] sm:rounded-[32px] border border-dashed border-white/40 hover:text-indigo-500 transition-all italic font-light text-sm"
          >
            <Plus size={14} /> {t('addNew')}
          </motion.button>
        )}
      </div>
    </div>
  
    <footer className="w-full flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/20 mt-3 sm:mt-16 pt-8">
      <Link 
        href="/history/plans" 
        className="text-[9px] sm:text-[10px] uppercase font-bold tracking-[0.2em] sm:tracking-[0.3em] text-slate-400 hover:text-indigo-500 transition-all flex items-center gap-2 group"
      >
        <div className="w-1.5 h-1.5 rounded-full bg-indigo-200 group-hover:bg-indigo-500 transition-colors" />
        {t('archiveLink')}
      </Link>
  
      <Link 
        href={isTomorrow || isArchive ? "/dashboard" : "/dashboard/tomorrow"} 
        className="text-[9px] sm:text-[10px] uppercase font-bold tracking-[0.2em] sm:tracking-[0.3em] text-slate-400 hover:text-emerald-500 transition-all flex items-center gap-2 group text-center sm:text-right"
      >
        {isTomorrow || isArchive ? t('todayLink') : t('tomorrowLink')}
        <div className={`w-1.5 h-1.5 rounded-full transition-colors ${
          isTomorrow || isArchive ? 'bg-indigo-200 group-hover:bg-indigo-500' : 'bg-emerald-200 group-hover:bg-emerald-500'
        }`} />
      </Link>
    </footer>
  </section>
  );
}