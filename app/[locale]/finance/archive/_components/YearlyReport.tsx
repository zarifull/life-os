"use client"

import { motion } from 'framer-motion';

export function YearlyReport({ year, income, expenses, tax, onClose, currencySymbol = 'с' }: any) {
    const surplus = income - expenses - tax;

    return (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 md:p-6 bg-indigo-950/40 backdrop-blur-[20px]">
            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                className="relative max-w-2xl w-full rounded-[40px] md:rounded-[60px] p-8 md:p-12 shadow-[0_50px_100px_rgba(0,0,0,0.3)] border border-white/20 overflow-y-auto max-h-[90vh]"
                style={{ 
                    /* Darkened version of your specific gradient */
                    background:"linear-gradient(145deg, #ece9ff 0%, #f3eeff 22%, #ffe8f8 52%, #e8f0ff 78%, #e4f5ff 100%)",
                    backdropFilter: "blur(60px) saturate(210%)",
                }}
            >
                {/* CLOSE BUTTON */}
                <button 
                    onClick={onClose} 
                    className="absolute top-6 right-8 text-[10px] font-black text-indigo-900/60 hover:text-indigo-950 transition-colors uppercase tracking-[0.3em]"
                >
                    ✕ Close
                </button>

                <div className="text-center">
                    <span className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.5em] text-indigo-800/60 block mb-3 md:mb-4">
                        Cumulative {year} Strategic Data
                    </span>
                    <h3 className="text-3xl md:text-4xl font-serif text-indigo-950 mb-8 md:mb-12">Yearly Progress</h3>
                    
                    {/* Main Surplus Value */}
                    <h2 className="text-5xl md:text-7xl font-serif text-indigo-950 mb-10 md:mb-16 tracking-tighter">
                        {currencySymbol}{surplus.toLocaleString()}
                    </h2>

                    {/* Information Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
                        <div className="p-5 md:p-6 bg-white/30 backdrop-blur-md rounded-2xl md:rounded-3xl border border-white/40 text-center shadow-sm">
                            <p className="text-[7px] md:text-[8px] font-black text-indigo-800/50 uppercase mb-2">Total Inflow</p>
                            <p className="text-lg md:text-xl font-serif text-emerald-700">{currencySymbol}{income.toLocaleString()}</p>
                        </div>
                        
                        <div className="p-5 md:p-6 bg-white/30 backdrop-blur-md rounded-2xl md:rounded-3xl border border-white/40 text-center shadow-sm">
                            <p className="text-[7px] md:text-[8px] font-black text-indigo-800/50 uppercase mb-2">Daily Burn</p>
                            <p className="text-lg md:text-xl font-serif text-rose-700">{currencySymbol}{expenses.toLocaleString()}</p>
                        </div>
                        
                        <div className="p-5 md:p-6 bg-white/30 backdrop-blur-md rounded-2xl md:rounded-3xl border border-white/40 text-center shadow-sm">
                            <p className="text-[7px] md:text-[8px] font-black text-indigo-800/50 uppercase mb-2">System Tax</p>
                            <p className="text-lg md:text-xl font-serif text-indigo-900/60">{currencySymbol}{tax.toLocaleString()}</p>
                        </div>
                    </div>

                    {/* Status Badge */}
                    <div className="mt-12">
                        <span className="inline-block px-4 py-1.5 bg-indigo-950/10 border border-indigo-950/10 rounded-full text-[9px] font-black text-indigo-900 uppercase tracking-widest">
                            Archive Verified
                        </span>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}