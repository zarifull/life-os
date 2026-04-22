"use client"

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

type Currency = 'USD' | 'KGS' | 'RUB';

interface ArchiveClientPageProps {
    realMonthlyData: Array<{
        month: string;
        income: number;
        spent: number;
        surplus: number;
    }>;
}

export default function ArchiveClientPage({ realMonthlyData }: ArchiveClientPageProps) {
    const router = useRouter();
    const t = useTranslations('finance');
    
    const [currency, setCurrency] = useState<Currency>('KGS');
    const [isExpanded, setIsExpanded] = useState(false);
    
    const visibleMonths = isExpanded ? realMonthlyData : realMonthlyData.slice(0, 6);
    const rates = { USD: 0.011, KGS: 1, RUB: 1.05 };

    return (
        <main className="min-h-screen pt-8 md:pt-16 pb-20 px-4 md:px-16 relative overflow-x-hidden" 
        style={{
            borderRadius: "40px", 
            background: "rgba(255, 255, 255, 0.3)", 
            backdropFilter: "blur(60px) saturate(210%)",
            border: "2.5px solid rgba(255, 255, 255, 0.8)",
          }}>
            
            <div className="max-w-6xl mx-auto relative z-10">
                <header className="mb-10 md:mb-14. flex flex-col md:flex-row justify-between items-center md:items-end gap-8">
                    <div className="text-center md:text-left">
                        <button 
                            onClick={() => router.back()} 
                            className="text-[10px] font-black tracking-[0.5em] text-indigo-400 uppercase mb-4 flex items-center gap-2 group mx-auto md:mx-0"
                        >
                            <span className="group-hover:-translate-x-1 transition-transform">‹</span> {t('status.return_today')}
                        </button>
                        <h1 className="text-6xl md:text-8xl font-serif text-indigo-950 tracking-tighter italic">
                            {t('archive.library_title')}
                        </h1>
                    </div>
                    
                    <div className="flex p-1 bg-white/40 backdrop-blur-xl border border-white/80 rounded-[20px]">
                        {(['KGS', 'USD', 'RUB'] as Currency[]).map((curr) => (
                            <button
                                key={curr}
                                onClick={() => setCurrency(curr)}
                                className={`px-5 py-2.5 rounded-[16px] text-[10px] font-black transition-all ${
                                    currency === curr ? 'bg-indigo-950 text-white shadow-xl' : 'text-indigo-300 hover:text-indigo-500'
                                }`}
                            >
                                {curr}
                            </button>
                        ))}
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    <AnimatePresence mode="popLayout">
                        {visibleMonths.map((data) => (
                            <motion.div
                                layout
                                key={data.month}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="p-10 rounded-[50px] bg-white/20 border border-white/40 backdrop-blur-2xl hover:bg-white/40 transition-all group relative overflow-hidden"
                            >
                                <p className="text-[10px] font-black uppercase tracking-[0.5em] text-indigo-400/50 mb-8">
                                    {data.month}
                                </p>

                                <div className="mb-10">
                                    <p className="text-5xl font-serif text-indigo-950 tracking-tighter">
                                        {Math.floor(data.surplus * rates[currency]).toLocaleString('en-US', { useGrouping: false })}
                                        <span className="text-sm ml-1 italic opacity-40">{currency === 'KGS' ? 'с' : currency}</span>
                                    </p>
                                    <p className="text-[9px] font-bold text-emerald-500 uppercase tracking-[0.3em] mt-2">
                                        {t('archive.secured_surplus')}
                                    </p>
                                </div>

                                <div className="pt-8 border-t border-indigo-100/30 flex justify-between">
                                    <div>
                                        <p className="text-[8px] font-black text-indigo-300 uppercase tracking-widest mb-1">{t('status.inflow')}</p>
                                        <p className="text-sm font-bold text-indigo-900/70">
                                            {Math.floor(data.income * rates[currency]).toLocaleString()}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[8px] font-black text-indigo-300 uppercase tracking-widest mb-1">{t('report.daily_burn')}</p>
                                        <p className="text-sm font-bold text-rose-400/80">
                                            {Math.floor(data.spent * rates[currency]).toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {realMonthlyData.length > 6 && (
                    <div className="mt-20 text-center">
                        <button 
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="text-[11px] font-black uppercase tracking-[0.4em] text-indigo-300 hover:text-indigo-600 transition-all py-4 px-8 border border-transparent hover:border-indigo-100 rounded-full"
                        >
                            {isExpanded ? t('status.collapse') : t('status.history')}
                        </button>
                    </div>
                )}
            </div>
        </main>
    );
}