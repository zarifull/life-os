"use client"

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

interface YearlyReportProps {
    year: number;
    income: number;
    expenses: number;
    tax: number;
    onClose: () => void;
    currencySymbol?: string;
}

export function YearlyReport({ year, income, expenses, tax, onClose, currencySymbol = 'с' }: YearlyReportProps) {
    const t = useTranslations('finance');
    const surplus = income - expenses - tax;

    const formatNumber = (num: number) => num.toLocaleString('en-US', { useGrouping: false });

    return (
        <div className="fixed inset-0 z-[200] flex items-start sm:items-center justify-center p-0 sm:p-6 bg-indigo-950/40 backdrop-blur-md">
            <motion.div 
                initial={{ y: "100%", opacity: 0 }} 
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: "100%", opacity: 0 }}
                transition={{ type: "spring", damping: 30, stiffness: 300 }}
                className="relative w-full max-w-2xl bg-white/95 backdrop-blur-2xl rounded-t-[40px] sm:rounded-[60px] p-8 pb-12 sm:p-12 shadow-[0_-20px_80px_rgba(0,0,0,0.1)] sm:shadow-[0_50px_100px_rgba(0,0,0,0.2)] border-t sm:border border-white/60 overflow-y-auto max-h-[92vh]"
            >
                <div className="w-12 h-1 bg-indigo-950/10 rounded-full mx-auto mb-8 sm:hidden" />

                <button 
                    onClick={onClose} 
                    className="absolute top-8 right-8 text-[10px] font-black text-indigo-900/30 hover:text-indigo-950 tracking-[0.3em]"
                >
                    ✕ CLOSE
                </button>

                <div className="text-center">
                    <span className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.5em] text-indigo-800/40 block mb-3">
                        {t('report.cumulative', { year })}
                    </span>
                    
                    <h3 className="text-3xl md:text-4xl font-serif text-indigo-950 mb-10">
                        {t('report.title')}
                    </h3>
                    
                    <div className="mb-12">
                        <h2 className="text-6xl md:text-8xl font-serif text-indigo-950 tracking-tighter leading-none">
                            {formatNumber(surplus)}<span className="text-3xl md:text-5xl opacity-20 ml-2 font-sans">{currencySymbol}</span>
                        </h2>
                        <p className="text-[9px] font-black text-indigo-400/60 uppercase tracking-[0.4em] mt-6">
                           {t('archive.total_secured')}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 px-2">
                        <div className="p-6 md:p-8 bg-emerald-50/40 backdrop-blur-md rounded-[30px] border border-white/60 text-center">
                            <p className="text-[7px] font-black text-emerald-800/50 uppercase tracking-widest mb-3">{t('report.total_inflow')}</p>
                            <p className="text-xl font-serif text-emerald-700">{formatNumber(income)}{currencySymbol}</p>
                        </div>
                        
                        <div className="p-6 md:p-8 bg-rose-50/40 backdrop-blur-md rounded-[30px] border border-white/60 text-center">
                            <p className="text-[7px] font-black text-rose-800/50 uppercase tracking-widest mb-3">{t('report.daily_burn')}</p>
                            <p className="text-xl font-serif text-rose-700">{formatNumber(expenses)}{currencySymbol}</p>
                        </div>
                        
                        <div className="p-6 md:p-8 bg-indigo-50/40 backdrop-blur-md rounded-[30px] border border-white/60 text-center">
                            <p className="text-[7px] font-black text-indigo-800/50 uppercase tracking-widest mb-3">{t('report.system_tax')}</p>
                            <p className="text-xl font-serif text-indigo-900/60">{formatNumber(tax)}{currencySymbol}</p>
                        </div>
                    </div>

                    <div className="mt-12">
                        <span className="inline-flex items-center gap-2 px-5 py-2 bg-indigo-950 text-white rounded-full text-[9px] font-black uppercase tracking-[0.2em]">
                            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                            {t('status.verified')}
                        </span>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}