"use client"

import { useState } from 'react';
import { motion } from 'framer-motion';

export function VaultManager({ onClose }: { onClose: () => void }) {
    const [isAutoSave, setIsAutoSave] = useState(true);

    return (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 md:p-6">
            <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={onClose} className="absolute inset-0 bg-indigo-950/20 backdrop-blur-md" 
            />
            
            <motion.div 
                initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }}
                className="relative w-full max-w-md overflow-hidden rounded-[30px] md:rounded-[40px] border border-white/80 p-6 md:p-10 shadow-2xl"
                style={{ background: "rgba(255, 255, 255, 0.8)", backdropFilter: "blur(40px)" }}
            >
                <header className="mb-6 md:mb-8">
                    <h3 className="font-serif text-2xl md:text-3xl text-indigo-950">Vault Settings</h3>
                    <p className="text-[8px] md:text-[9px] font-black uppercase tracking-widest text-indigo-400">Manage Saved Surplus</p>
                </header>

                <div className="space-y-6 md:space-y-8">
                    {/* Toggle for Auto-Save */}
                    <div className="flex justify-between items-center p-4 md:p-6 bg-white/50 rounded-2xl md:rounded-3xl border border-white">
                        <div>
                            <p className="text-xs font-bold text-indigo-950">Auto-Vault Surplus</p>
                            <p className="text-[7px] md:text-[8px] text-indigo-400 uppercase font-bold">End of month transfer</p>
                        </div>
                        <button 
                            onClick={() => setIsAutoSave(!isAutoSave)}
                            className={`w-10 md:w-12 h-5 md:h-6 rounded-full transition-all relative ${isAutoSave ? 'bg-emerald-500' : 'bg-indigo-200'}`}
                        >
                            <motion.div 
                                animate={{ x: isAutoSave ? 22 : 4 }}
                                className="absolute top-0.5 md:top-1 w-3.5 md:w-4 h-3.5 md:h-4 bg-white rounded-full shadow-sm" 
                            />
                        </button>
                    </div>

                    {/* Adjustment Section */}
                    <div className="space-y-3 md:space-y-4">
                        <label className="text-[8px] md:text-[9px] font-black uppercase tracking-widest text-indigo-300 ml-2">Vault Adjustment (Car/Home/Save)</label>
                        <div className="flex flex-col sm:flex-row gap-2">
                            <input 
                                type="number" 
                                placeholder="e.g. -5000 (Car) or +1000 (Save)" 
                                className="flex-[2] bg-white/50 border border-white rounded-xl md:rounded-2xl px-5 py-3 text-sm focus:outline-none focus:bg-white transition-all" 
                            />
                            <button className="flex-1 bg-indigo-950 text-white rounded-xl md:rounded-2xl py-3 px-4 font-bold text-[9px] md:text-[10px] uppercase tracking-widest">
                                Execute
                            </button>
                        </div>
                        <p className="text-[7px] md:text-[8px] text-indigo-400 italic px-2">Use negative numbers (-) for purchases like a car.</p>
                    </div>

                    <button 
                        onClick={onClose}
                        className="w-full py-4 md:py-5 bg-indigo-950 text-white rounded-xl md:rounded-[24px] font-bold text-[9px] md:text-[10px] uppercase tracking-[0.3em] md:tracking-[0.4em] hover:bg-black transition-all"
                    >
                        Apply Changes
                    </button>
                </div>
            </motion.div>
        </div>
    );
}