"use client"

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { YearlyReport } from './_components/YearlyReport';
import { VaultManager } from './_components/VaultManager';

type Currency = 'USD' | 'SOM' | 'RUB';

export default function FinanceArchive() {
    const router = useRouter();
    
    // State Management
    const [currency, setCurrency] = useState<Currency>('USD');
    const [selectedYear, setSelectedYear] = useState(2026);
    const [showYearlyReport, setShowYearlyReport] = useState(false);
    const [showVaultManager, setShowVaultManager] = useState(false);

    const [isExpanded, setIsExpanded] = useState(false);

    // Currency Logic
    const rates = { USD: 1, SOM: 89, RUB: 92 };
    const symbols = { USD: '$', SOM: 'с', RUB: '₽' };
    

    const format = (val: number) => {
        return `${symbols[currency]}${(val * rates[currency]).toLocaleString()}`;
    };

    // Mock Data (Strategic Totals)
    const monthlyData = [
        { month: 'March', income: 4250, spent: 1150, tax: 400, surplus: 2700 },
        { month: 'February', income: 3800, spent: 1400, tax: 400, surplus: 2000 },
        { month: 'January', income: 4000, spent: 900, tax: 400, surplus: 2700 },
    ];
    const visibleMonths = isExpanded ? monthlyData : monthlyData.slice(0, 3);

    return  (
        <main className="min-h-screen pt-12 md:pt-24 pb-20 px-4 md:px-16 relative overflow-x-hidden" 
        style={{
            borderRadius: "40px md:80px", 
            background: "rgba(255, 255, 255, 0.3)", 
            backdropFilter: "blur(60px) saturate(210%)",
            WebkitBackdropFilter: "blur(60px) saturate(210%)",
            border: "2.5px solid rgba(255, 255, 255, 0.8)",
            boxShadow: "0 40px 100px rgba(120, 100, 200, 0.1)"
          }}>
            
            {/* Liquid Background Orbs */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[-10%] right-[-5%] w-[60%] md:w-[40%] h-[40%] bg-indigo-200/20 blur-[80px] md:blur-[120px] rounded-full" />
                <div className="absolute bottom-[5%] left-[-5%] w-[50%] md:w-[35%] h-[35%] bg-rose-100/10 blur-[80px] md:blur-[100px] rounded-full" />
            </div>

            <div className="max-w-6xl mx-auto relative z-10">
                {/* Header Section */}
                <header className="mb-12 md:mb-20 flex flex-col md:flex-row justify-between items-center md:items-end gap-8 px-2 md:px-4">
                    <div className="text-center md:text-left">
                        <button 
                            onClick={() => router.back()}
                            className="text-[10px] font-black tracking-[0.5em] text-indigo-400 uppercase mb-4 md:mb-6 flex items-center justify-center md:justify-start gap-2 hover:text-indigo-600 transition-all group"
                        >
                            <span className="group-hover:-translate-x-1 transition-transform">‹</span> Return to Today
                        </button>
                        <h1 className="text-5xl md:text-7xl font-serif text-indigo-950 tracking-tight" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                            Archive Library
                        </h1>
                    </div>
                    
                    {/* Currency & Year Controls */}
                    <div className="flex flex-col items-center md:items-end gap-4 w-full md:w-auto">
                        <div className="flex p-1.5 bg-white/40 backdrop-blur-xl border border-white/80 rounded-[24px] shadow-sm overflow-x-auto max-w-full">
                            {(['USD', 'SOM', 'RUB'] as Currency[]).map((curr) => (
                                <button
                                    key={curr}
                                    onClick={() => setCurrency(curr)}
                                    className={`px-4 md:px-6 py-2 md:py-2.5 rounded-[18px] text-[10px] font-black transition-all whitespace-nowrap ${
                                        currency === curr ? 'bg-indigo-600 text-white shadow-lg' : 'text-indigo-300'
                                    }`}
                                >
                                    {curr}
                                </button>
                            ))}
                        </div>
                        <div className="flex p-1 bg-indigo-50/50 rounded-xl">
                            {[2025, 2026].map(year => (
                                <button 
                                    key={year}
                                    onClick={() => setSelectedYear(year)}
                                    className={`px-4 py-1 text-[9px] font-bold rounded-lg ${selectedYear === year ? 'bg-white text-indigo-600 shadow-sm' : 'text-indigo-300'}`}
                                >
                                    {year}
                                </button>
                            ))}
                        </div>
                    </div>
                </header>

                {/* --- The Master Surplus Vault Card --- */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-12 md:mb-16 p-1 bg-white/40 backdrop-blur-[40px] rounded-[40px] md:rounded-[60px] border border-white/80 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.06)] overflow-hidden group relative"
                >
                    <div className="p-8 md:p-16 text-center relative z-10">
                        <span className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.4em] md:tracking-[0.6em] text-indigo-400/60 block mb-4 md:mb-6">
                            Total Surplus Secured ({selectedYear})
                        </span>
                        
                        <h2 className="text-6xl md:text-9xl font-serif text-indigo-950 mb-8 md:mb-10 tracking-tighter">
                            {format(7400)}
                        </h2>

                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                            <button 
                                onClick={() => setShowYearlyReport(true)}
                                className="px-6 md:px-10 py-4 bg-indigo-600 text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95"
                            >
                                View Victory Report
                            </button>
                            <button 
                                onClick={() => setShowVaultManager(true)}
                                className="px-6 md:px-10 py-4 bg-white/80 border border-white text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm hover:bg-white transition-all active:scale-95"
                            >
                                Set Saved Mode
                            </button>
                        </div>
                    </div>
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 via-indigo-500 to-purple-500 opacity-40" />
                </motion.div>

            <div className="relative">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
                    <AnimatePresence mode="popLayout">
                        {visibleMonths.map((data, index) => (
                            <motion.div
                                layout
                                key={data.month}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                // ... existing styles ...
                            >
                                {/* ... (Your Month Card Code here) ... */}
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {/* Pending Month (Only show if not expanded or at the very end) */}
                    {!isExpanded && (
                        <div className="hidden lg:flex p-12 rounded-[50px] border-2 border-dashed border-indigo-100 items-center justify-center opacity-40">
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-300">
                                Cycle In Progress
                            </span>
                        </div>
                    )}
                </div>

                {/* --- THE "MORE/LESS" TOGGLE --- */}
                <div className="mt-16 flex justify-center">
                    <button 
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="group flex flex-col items-center gap-2"
                    >
                        <span className="text-[10px] font-black uppercase tracking-[0.5em] text-indigo-400 group-hover:text-indigo-950 transition-colors">
                            {isExpanded ? "Collapse Library" : "View Full History"}
                        </span>
                        <motion.div 
                            animate={{ y: isExpanded ? -5 : 5 }}
                            transition={{ repeat: Infinity, duration: 1.5, repeatType: "reverse" }}
                            className="text-indigo-300 group-hover:text-indigo-950"
                        >
                            {isExpanded ? "▲" : "▼"}
                        </motion.div>
                    </button>
                </div>
            </div>
            </div>

            {/* Modals Layer */}
            <AnimatePresence>
                {showYearlyReport && (
                    <YearlyReport 
                        year={selectedYear}
                        income={12050}
                        expenses={4250}
                        tax={1200}
                        onClose={() => setShowYearlyReport(false)} 
                    />
                )}
                {showVaultManager && (
                    <VaultManager onClose={() => setShowVaultManager(false)} />
                )}
            </AnimatePresence>
        </main>
    );
}