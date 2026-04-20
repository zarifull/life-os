"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { addTransaction } from '@/lib/actions/finance';
import { useTranslations } from 'next-intl'; 

interface RevenueModalProps {
    onClose: () => void;
}

export function RevenueModal({ onClose }: RevenueModalProps) {
    const t = useTranslations('finance'); 
    const [salary, setSalary] = useState('');
    const [freelance, setFreelance] = useState('');
    const [gifts, setGifts] = useState('');
    const [tax, setTax] = useState('');
    const [loading, setLoading] = useState(false);

    const handleCommit = async () => {
        setLoading(true);
        try {
            if (salary) await addTransaction(Number(salary), 'income', 'Strategy', 'Salary');
            if (freelance) await addTransaction(Number(freelance), 'income', 'Strategy', 'Freelance');
            if (gifts) await addTransaction(Number(gifts), 'income', 'Strategy', 'Gifts');
            if (tax) await addTransaction(Number(tax), 'expense', 'Obligations', 'System Tax');
            onClose();
        } catch (error) {
            console.error("Summation Sync Error:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-white/10 backdrop-blur-[25px]"
            />

            <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 100 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 100 }}
                transition={{ type: "spring", damping: 25, stiffness: 400 }}
                className="relative overflow-hidden rounded-[50px] p-1 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] w-full max-w-[480px]"
                style={{
                    background: "linear-gradient(135deg, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.4) 100%)",
                    border: "1.5px solid rgba(255,255,255,0.8)",
                }}
            >
                <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-indigo-50/20 pointer-events-none" />

                <div className="relative z-10 p-10">
                    <header className="flex justify-between items-start mb-10">
                        <div>
                            <h3 className="font-serif text-4xl text-indigo-950 mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                                {t('status.strategy') || 'Strategy'}
                            </h3>
                            <p className="text-[9px] font-black uppercase tracking-[0.4em] text-indigo-400">
                                {t('status.sync')}
                            </p>
                        </div>
                        <button onClick={onClose} className="w-10 h-10 rounded-full flex items-center justify-center bg-white/40 text-indigo-900 border border-white/60 hover:bg-white/80 transition-all active:scale-90">✕</button>
                    </header>

                    <div className="space-y-8">
                        <div className="space-y-4">
                            <span className="text-[8px] font-black uppercase tracking-widest text-indigo-300 ml-2">
                                {t('status.inflow') || 'Inflow Streams'}
                            </span>
                            <div className="space-y-3">
                                <input 
                                    type="number" placeholder={t('placeholders.salary') || 'Monthly Salary'} 
                                    value={salary} onChange={(e) => setSalary(e.target.value)}
                                    className="w-full bg-white/40 border border-white/60 rounded-3xl py-4 px-6 text-sm focus:outline-none focus:bg-white/80 transition-all" 
                                />
                                <input 
                                    type="number" placeholder={t('placeholders.freelance') || 'Freelance Projects'} 
                                    value={freelance} onChange={(e) => setFreelance(e.target.value)}
                                    className="w-full bg-white/40 border border-white/60 rounded-3xl py-4 px-6 text-sm focus:outline-none focus:bg-white/80 transition-all" 
                                />
                                <input 
                                    type="number" placeholder={t('placeholders.gifts') || 'Gifts / Other'} 
                                    value={gifts} onChange={(e) => setGifts(e.target.value)}
                                    className="w-full bg-white/40 border border-white/60 rounded-3xl py-4 px-6 text-sm focus:outline-none focus:bg-white/80 transition-all" 
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <span className="text-[8px] font-black uppercase tracking-widest text-rose-300 ml-2">
                                {t('status.obligations') || 'System Obligations'}
                            </span>
                            <input 
                                type="number" placeholder={t('system_tax')} 
                                value={tax} onChange={(e) => setTax(e.target.value)}
                                className="w-full bg-rose-50/20 border border-rose-100/50 rounded-3xl py-4 px-6 text-sm text-rose-700 placeholder:text-rose-300/60 focus:outline-none focus:bg-white/80 transition-all" 
                            />
                        </div>

                        <button 
                            onClick={handleCommit}
                            disabled={loading}
                            className="w-full py-5 rounded-[28px] text-[10px] font-bold uppercase tracking-[0.4em] transition-all relative overflow-hidden group shadow-xl shadow-indigo-100 disabled:opacity-50"
                        >
                            <div className="absolute inset-0 bg-indigo-600 group-hover:bg-indigo-700 transition-colors" />
                            <span className="relative z-10 text-white">
                                {loading ? t('status.syncing') : t('status.commit')}
                            </span>
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}