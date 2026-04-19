"use client"

import { motion } from 'framer-motion';

interface RevenueModalProps {
    onClose: () => void;
}

export function RevenueModal({ onClose }: RevenueModalProps) {
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* The Liquid Glass Backdrop */}
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-white/10 backdrop-blur-[25px]"
            />

            <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 30 }}
                className="relative overflow-hidden rounded-[50px] p-1 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] w-full max-w-[480px]"
                style={{
                    background: "linear-gradient(135deg, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.4) 100%)",
                    border: "1.5px solid rgba(255,255,255,0.8)",
                }}
            >
                {/* Internal Gloss Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-indigo-50/20 pointer-events-none" />

                <div className="relative z-10 p-10">
                    <header className="flex justify-between items-start mb-10">
                        <div>
                            <h3 className="font-serif text-4xl text-indigo-950 mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                                Strategy
                            </h3>
                            <p className="text-[9px] font-black uppercase tracking-[0.4em] text-indigo-400">
                                Global Financial Architecture
                            </p>
                        </div>
                        <button 
                            onClick={onClose}
                            className="w-10 h-10 rounded-full flex items-center justify-center bg-white/40 text-indigo-900 border border-white/60 hover:bg-white/80 transition-all active:scale-90"
                        >
                            ✕
                        </button>
                    </header>

                    <div className="space-y-8">
                        {/* INFLOW SECTION */}
                        <div className="space-y-4">
                            <span className="text-[8px] font-black uppercase tracking-widest text-indigo-300 ml-2">Inflow Streams</span>
                            <div className="space-y-3">
                                <div className="group relative">
                                    <input type="number" placeholder="Monthly Salary (+$3,000)" 
                                        className="w-full bg-white/40 border border-white/60 rounded-3xl py-4 px-6 text-sm placeholder:text-indigo-300/60 focus:outline-none focus:bg-white/80 focus:ring-4 ring-indigo-500/5 transition-all" />
                                </div>
                                <div className="group relative">
                                    <input type="number" placeholder="Freelance Projects (+$800)" 
                                        className="w-full bg-white/40 border border-white/60 rounded-3xl py-4 px-6 text-sm placeholder:text-indigo-300/60 focus:outline-none focus:bg-white/80 transition-all" />
                                </div>
                                <div className="group relative">
                                    <input type="number" placeholder="Gifts / Other (+$450)" 
                                        className="w-full bg-white/40 border border-white/60 rounded-3xl py-4 px-6 text-sm placeholder:text-indigo-300/60 focus:outline-none focus:bg-white/80 transition-all" />
                                </div>
                            </div>
                        </div>

                        {/* OUTFLOW SECTION (Liabilities) */}
                        <div className="space-y-4">
                            <span className="text-[8px] font-black uppercase tracking-widest text-rose-300 ml-2">System Obligations</span>
                            <div className="group relative">
                                <input type="number" placeholder="Total System Tax (-$400)" 
                                    className="w-full bg-rose-50/20 border border-rose-100/50 rounded-3xl py-4 px-6 text-sm text-rose-700 placeholder:text-rose-300/60 focus:outline-none focus:bg-white/80 transition-all" />
                                <div className="absolute right-6 top-1/2 -translate-y-1/2 text-[8px] font-bold text-rose-400 uppercase tracking-tighter">Car + Home</div>
                            </div>
                        </div>

                        {/* ACTION */}
                        <button 
                            onClick={onClose}
                            className="w-full py-5 rounded-[28px] text-[10px] font-bold uppercase tracking-[0.4em] transition-all relative overflow-hidden group shadow-xl shadow-indigo-100"
                        >
                            <div className="absolute inset-0 bg-indigo-600 group-hover:bg-indigo-700 transition-colors" />
                            <span className="relative z-10 text-white">Commit Changes</span>
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}