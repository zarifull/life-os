'use client';

import { useEffect, useMemo } from 'react';
import PlanSection from '../_sections/PlanSection';
import { usePlanStore } from '../Plan/_lib/planStore';
import { fetchPlansByDate } from '@/lib/actions/plans';
import { useTranslations } from 'next-intl';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

export default function TomorrowPage() {
  const router = useRouter();
  const params = useParams();
  const locale = (params && params.locale && params.locale !== 'undefined') 
  ? params.locale 
  : 'en';
  const { setPlans } = usePlanStore();
  const t = useTranslations('Plan');

  const dateStr = useMemo(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toLocaleDateString('en-CA'); 
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function load() {
      const { data } = await fetchPlansByDate(dateStr);
      if (data && isMounted) setPlans(data);
    }
    
    load();

    return () => {
      isMounted = false;
      setPlans([]);
    };
  }, [setPlans, dateStr]);

  return (
    <>
      <main className="min-h-screen pt-12 sm:pt-16 pb-20 px-4" style={{
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

      <motion.button
         onClick={() => router.push(`/${locale}/dashboard#tomorrow`)}
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