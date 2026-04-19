'use client';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

export function AdventureHeader({ activeFilter, setActiveFilter }: any) {
  const filters = ['All', 'Achievement', 'Insight', 'Goal'];
  const t = useTranslations('History');

  return (
    <div className="flex flex-col items-center text-center space-y-6 md:space-y-8">
      <div>
        <h1 className="text-3xl md:text-5xl font-bold text-slate-800 tracking-tight">
          {t("title")}
        </h1>
        <p className="text-[10px] md:text-sm font-medium text-slate-400 uppercase tracking-[0.4em] mt-2">
          {t("subtitle")}
        </p>
      </div>

      <div className="flex gap-1 md:gap-3 p-1.5 md:p-2 bg-white/30 backdrop-blur-md rounded-full border border-white/50 shadow-inner">
        {filters.map((f) => (
          <motion.button
            key={f}
            onClick={() => setActiveFilter(f)}
            whileTap={{ scale: 0.95 }}
            className={`whitespace-nowrap px-4 md:px-6 py-2 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all ${
              activeFilter === f 
              ? 'bg-white text-indigo-600 shadow-sm' 
              : 'text-slate-400 hover:text-slate-800'
            }`}
          >
        
            {t(`filters.${f.toLowerCase()}`)}
          </motion.button>
        ))}
      </div>
    </div>
  );
}