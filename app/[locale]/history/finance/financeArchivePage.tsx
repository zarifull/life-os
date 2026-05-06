"use client"

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';

type Currency = 'USD' | 'KGS' | 'RUB';

interface ArchiveClientPageProps {
    realMonthlyData: Array<{
        month: string;
        income: number;
        spent: number;
        surplus: number;
    }>;
}

export default function FinanceArchivePage({ realMonthlyData }: ArchiveClientPageProps) {
    const router = useRouter();
    const t = useTranslations('finance');
    const { locale } = useParams();
    const [currency, setCurrency] = useState<Currency>('KGS');
    const [isExpanded, setIsExpanded] = useState(false);
    
    const visibleMonths = isExpanded ? realMonthlyData : realMonthlyData.slice(0, 6);
    const rates = { USD: 0.011, KGS: 1, RUB: 1.05 };

    return (
        <main className="min-h-screen pt-6 md:pt-16 pb-20 px-4 md:px-16 relative overflow-x-hidden" 
        style={{
            background: "linear-gradient(145deg, #ece9ff 0%, #f3eeff 22%, #ffe8f8 52%, #e8f0ff 78%, #e4f5ff 100%)",
            borderRadius: typeof window !== 'undefined' && window.innerWidth < 768 ? "24px" : "40px", 
            backdropFilter: "blur(45px) saturate(160%)",
            border: "3.5px solid rgba(255, 255, 255, 0.7)",
        }}
          >
            
            <div className="max-w-6xl mx-auto relative z-10">
                <header className="mb-8 md:mb-14 flex flex-col md:flex-row justify-between items-center md:items-end gap-6 md:gap-8">
                    <div className="text-center md:text-left">
                    <button 
                        onClick={() => router.push(`/${locale}/finance`)} 
                        className="text-[9px] md:text-[10px] font-black tracking-[0.5em] text-indigo-400 uppercase mb-3 md:mb-4 flex items-center gap-2 group mx-auto md:mx-0"
                    >
                        <span className="group-hover:-translate-x-1 transition-transform">‹</span> {t('status.return_today')}
                    </button>
                    <h1 className="text-3xl md:text-5xl font-serif text-indigo-950 tracking-tighter italic leading-tight">
                        {t('archive.library_title')}
                        </h1>
                    </div>
                    
                    <div className="flex p-1 bg-white/40 backdrop-blur-xl border border-white/80 rounded-[18px] md:rounded-[20px]">
                        {(['KGS', 'USD', 'RUB'] as Currency[]).map((curr) => (
                            <button
                                key={curr}
                                onClick={() => setCurrency(curr)}
                                className={`px-4 md:px-5 py-2 md:py-2.5 rounded-[14px] md:rounded-[16px] text-[9px] md:text-[10px] font-black transition-all ${
                                    currency === curr ? 'bg-indigo-950 text-white shadow-lg md:shadow-xl' : 'text-indigo-300 hover:text-indigo-500'
                                }`}
                            >
                                {curr}
                            </button>
                        ))}
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-10">
                    <AnimatePresence mode="popLayout">
                        {visibleMonths.map((data) => (
                           <motion.div
                           layout
                           key={data.month}
                           initial={{ opacity: 0, y: 20 }}
                           animate={{ opacity: 1, y: 0 }}
                           className="mx-auto w-full max-w-[340px] md:max-w-none p-6 md:p-10 rounded-[35px] md:rounded-[50px] bg-white/20 border border-white/40 backdrop-blur-2xl hover:bg-white/40 transition-all group relative overflow-hidden"
                       >
                                <p className="text-[8px] md:text-[9px] font-black uppercase tracking-[0.3em] text-indigo-400/50 mb-3 md:mb-8">
                                    {data.month}
                                </p>

                                <div className="mb-5 md:mb-10">
                                    <div className="flex items-baseline gap-1">
                                        <p className="text-3xl md:text-5xl font-serif text-indigo-950 tracking-tighter">
                                            {Math.floor(data.surplus * rates[currency]).toLocaleString('en-US', { useGrouping: false })}
                                        </p>
                                        <span className="text-[10px] md:text-xs italic opacity-40 text-indigo-950">{currency === 'KGS' ? 'с' : currency}</span>
                                    </div>
                                    <p className="text-[7px] md:text-[8px] font-bold text-emerald-500 uppercase tracking-[0.2em] mt-1">
                                        {t('archive.secured_surplus')}
                                    </p>
                                </div>

                                <div className="pt-4 md:pt-8 border-t border-indigo-100/20 flex justify-between items-center">
                                    <div className="flex flex-col">
                                        <span className="text-[6px] md:text-[7px] font-black text-indigo-300 uppercase tracking-widest">{t('status.inflow')}</span>
                                        <span className="text-[11px] md:text-xs font-bold text-indigo-950/70">
                                            {Math.floor(data.income * rates[currency]).toLocaleString()}
                                        </span>
                                    </div>
                                    
                                    <div className="h-3 w-[1px] bg-indigo-100/30 md:hidden" />

                                    <div className="flex flex-col text-right">
                                        <span className="text-[6px] md:text-[7px] font-black text-indigo-300 uppercase tracking-widest">{t('report.daily_burn')}</span>
                                        <span className="text-[11px] md:text-xs font-bold text-rose-400/80">
                                            {Math.floor(data.spent * rates[currency]).toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {realMonthlyData.length > 6 && (
                    <div className="mt-12 md:mt-20 text-center">
                        <button 
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.4em] text-indigo-300 hover:text-indigo-600 transition-all py-3 md:py-4 px-6 md:px-8 border border-transparent hover:border-indigo-100 rounded-full"
                        >
                            {isExpanded ? t('status.collapse') : t('status.history')}
                        </button>
                    </div>
                )}
            </div>
        </main>
    );
}