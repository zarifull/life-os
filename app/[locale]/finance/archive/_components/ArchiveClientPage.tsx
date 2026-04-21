"use client"

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { YearlyReport } from './YearlyReport';
import { VaultManager } from './VaultManager';

type Currency = 'USD' | 'KGS' | 'RUB';

interface ArchiveClientPageProps {
    initialBalance: number;
    realMonthlyData: Array<{
        month: string;
        income: number;
        spent: number;
        surplus: number;
    }>;
}

export default function ArchiveClientPage({ initialBalance, realMonthlyData }: ArchiveClientPageProps) {
    const router = useRouter();
    const t = useTranslations('finance');
    
    const [currency, setCurrency] = useState<Currency>('KGS');
    const [selectedYear, setSelectedYear] = useState(2026);
    const [showYearlyReport, setShowYearlyReport] = useState(false);
    const [showVaultManager, setShowVaultManager] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const visibleMonths = isExpanded ? realMonthlyData : realMonthlyData.slice(0, 3);
    const rates = { USD: 0.011, KGS: 1, RUB: 1.05 };
    const symbols = { USD: '$', KGS: 'с', RUB: '₽' };
  
    const format = (val: number) => {
        const converted = Math.floor(val * rates[currency]);
        if (currency === 'KGS') return `${converted} с`; 
    
        return new Intl.NumberFormat('en-US', { 
            style: 'currency', 
            currency,
            useGrouping: false 
        }).format(converted);
    };

    const monthlyData = [
        { month: 'March', income: 4250, spent: 1150, tax: 400, surplus: 2700 },
        { month: 'February', income: 3800, spent: 1400, tax: 400, surplus: 2000 },
        { month: 'January', income: 4000, spent: 900, tax: 400, surplus: 2700 },
    ];


    const yearlyStats = realMonthlyData.reduce((acc, month) => {
        return {
            income: acc.income + month.income,
            expenses: acc.expenses + month.spent,
            tax: 0 
        }
    }, { income: 0, expenses: 0, tax: 0 });
    
    return (
        <main className="min-h-screen pt-12 md:pt-24 pb-20 px-4 md:px-16 relative overflow-x-hidden" 
        style={{
            borderRadius: "40px", 
            background: "rgba(255, 255, 255, 0.3)", 
            backdropFilter: "blur(60px) saturate(210%)",
            border: "2.5px solid rgba(255, 255, 255, 0.8)",
          }}>
            
            <div className="max-w-6xl mx-auto relative z-10">
                <header className="mb-12 md:mb-20 flex flex-col md:flex-row justify-between items-center md:items-end gap-8">
                    <div className="text-center md:text-left">
                        <button onClick={() => router.back()} className="text-[10px] font-black tracking-[0.5em] text-indigo-400 uppercase mb-6 flex items-center gap-2 group">
                            <span className="group-hover:-translate-x-1 transition-transform">‹</span> {t('status.return_today')}
                        </button>
                        <h1 className="text-5xl md:text-7xl font-serif text-indigo-950 tracking-tight">
                            {t('archive.library_title')}
                        </h1>
                    </div>
                    
                    <div className="flex p-1.5 bg-white/40 backdrop-blur-xl border border-white/80 rounded-[24px]">
                        {(['KGS', 'USD', 'RUB'] as Currency[]).map((curr) => (
                            <button
                                key={curr}
                                onClick={() => setCurrency(curr)}
                                className={`px-6 py-2.5 rounded-[18px] text-[10px] font-black transition-all ${
                                    currency === curr ? 'bg-indigo-600 text-white shadow-lg' : 'text-indigo-300'
                                }`}
                            >
                                {curr}
                            </button>
                        ))}
                    </div>
                </header>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-16 p-1 bg-white/40 backdrop-blur-[40px] rounded-[60px] border border-white/80 shadow-xl overflow-hidden group relative">
                    <div className="p-12 md:p-20 text-center relative z-10">
                        <span className="text-[11px] font-black uppercase tracking-[0.6em] text-indigo-400/60 block mb-6">
                            {t('archive.total_secured')} ({selectedYear})
                        </span>
                        
                        <h2 className="text-7xl md:text-9xl font-serif text-indigo-950 mb-10 tracking-tighter">
                            {format(initialBalance)}
                        </h2>

                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                            <button onClick={() => setShowYearlyReport(true)} className="px-10 py-4 bg-indigo-600 text-white rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100">
                                {t('status.view_report')}
                            </button>
                            <button onClick={() => setShowVaultManager(true)} className="px-10 py-4 bg-white/80 border border-white text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-white transition-all active:scale-95">
                                {t('status.vault_settings')}
                            </button>
                        </div>
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
    <AnimatePresence mode="popLayout">
        {visibleMonths.map((data) => (
            <motion.div
                layout
                key={data.month}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-8 rounded-[40px] bg-white/30 border border-white/60 backdrop-blur-xl hover:bg-white/50 transition-all group relative overflow-hidden"
            >
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-400/60 mb-6">
                    {data.month}
                </p>

                <div className="mb-8">
                    <p className="text-4xl font-serif text-indigo-950 tracking-tighter">
                        {data.surplus.toLocaleString('en-US', { useGrouping: false })} с
                    </p>
                    <p className="text-[9px] font-bold text-emerald-500 uppercase tracking-[0.2em] mt-1">
                     {t('archive.secured_surplus')}
                    </p>
                </div>

                <div className="pt-6 border-t border-indigo-100/40 flex justify-between">
                    <div>
                        <p className="text-[8px] font-black text-indigo-300 uppercase tracking-widest mb-1">{t('status.inflow')}</p>
                        <p className="text-sm font-bold text-indigo-900">
                            {data.income.toLocaleString('en-US', { useGrouping: false })}
                        </p>
                    </div>
                    <div className="text-right">
                        <p className="text-[8px] font-black text-indigo-300 uppercase tracking-widest mb-1">{t('report.daily_burn')}</p>
                        <p className="text-sm font-bold text-rose-500">
                            {data.spent.toLocaleString('en-US', { useGrouping: false })}
                        </p>
                    </div>
                </div>

                <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-indigo-50/50 rounded-full blur-2xl group-hover:bg-indigo-100/50 transition-colors" />
            </motion.div>
        ))}
    </AnimatePresence>
</div>
            </div>

            <AnimatePresence>
                {showYearlyReport && (
                    <YearlyReport 
                        year={selectedYear}
                        income={yearlyStats.income}
                        expenses={yearlyStats.expenses}
                        tax={yearlyStats.tax}
                        onClose={() => setShowYearlyReport(false)}
                        currencySymbol={currency === 'KGS' ? 'с' : symbols[currency]}
                    />
                )}
                {showVaultManager && (
                    <VaultManager 
                        onClose={() => setShowVaultManager(false)} 
                        currentBalance={initialBalance}
                    />
                )}
            </AnimatePresence>
        </main>
    );
}