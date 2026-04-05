'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl'; 
import { PlanCard } from '../_components/PlanCard';
import { fetchPlansByDate } from '@/lib/supabase/plans';
import { Plan } from '@/lib/supabase/plans';

export default function PlanArchivePage() {
  const t = useTranslations('Plan');
  const [history, setHistory] = useState<Plan[]>([]);

  useEffect(() => {
    const date = new Date();
    date.setDate(date.getDate() - 1);
    const dateStr = date.toISOString().split('T')[0];

    async function load() {
      const { data } = await fetchPlansByDate(dateStr);
      if (data) setHistory(data);
    }
    load();
  }, []);

  return (
    <main className="min-h-screen py-20 px-6 bg-slate-50/20">
      <motion.header 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto mb-16 text-center"
      >
        <h1 className="text-4xl font-serif text-slate-900 tracking-tight">
          {t('titleArchive')}
        </h1>
        <p className="text-slate-400 text-sm mt-3 italic">
          {history.length} {t('scoreLabel').toLowerCase()}
        </p>
      </motion.header>

      <div className="max-w-2xl mx-auto space-y-1">
        {history.length > 0 ? (
          history.map((item) => (
            <motion.div 
              key={item.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-700 cursor-default"
            >
              <PlanCard {...item} onToggle={() => {}} />
            </motion.div>
          ))
        ) : (
          <p className="text-center text-slate-300 italic font-light py-20">
            {t('empty')}
          </p>
        )}
      </div>
    </main>
  );
}