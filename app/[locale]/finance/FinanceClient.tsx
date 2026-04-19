"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { RevenueModal } from './_components/RevenueModal';
import { addTransaction, deleteTransaction } from '@/lib/actions/finance';
import UpdateModal from './_components/UpdateModal';

type Currency = 'USD' | 'KGS' | 'RUB';

interface Transaction {
    id: string;
    amount: number;
    category: string;
    type: string;
    label: string;
    date: Date;
}

export default function FinancePage({ 
    initialTransactions, 
    initialBalance 
  }: { 
    initialTransactions: Transaction[], 
    initialBalance: number 
  }) {
    const router = useRouter();
    const [showRevenueModal, setShowRevenueModal] = useState(false);
    const [time, setTime] = useState(new Date());
    const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
    const [activeCurrency, setActiveCurrency] = useState<Currency>('KGS');
    const [label, setLabel] = useState('');
    const [amount, setAmount] = useState('');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const timer = setInterval(() => setTime(new Date()), 60000);
        return () => clearInterval(timer);
    }, []);

    const formatValue = (val: number) => {
        const rates = { KGS: 1, USD: 1/89, RUB: 1.05 };
        const converted = val * rates[activeCurrency];
    
        if (activeCurrency === 'KGS') {
            return `${Math.floor(converted).toLocaleString()} с`;
        }
    
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: activeCurrency,
            minimumFractionDigits: 2
        }).format(converted);
    };

    // Correct Derived State
    const strategicRevenue = initialTransactions
        .filter(t => t.type === 'income')
        .reduce((acc, curr) => acc + curr.amount, 0);

    const todaysBurn = initialTransactions
        .filter(t => t.type === 'expense')
        .reduce((acc, curr) => acc + curr.amount, 0);

    const handleLog = async () => {
        if (!label || !amount) return;
        try {
            await addTransaction(Number(amount), 'expense', 'General', label);
            setLabel('');
            setAmount('');
        } catch (error) {
            alert("Check connection.");
        }
    };

    const handleQuickLog = async (category: string) => {
        const defaultPrices: Record<string, number> = {
            'Lunch': 150, 'Taxi': 70, 'Gift': 500, 'Uni': 100, 'Tax': 400
        };
        const suggested = defaultPrices[category] || 0;
        const userInput = window.prompt(`Enter price for ${category}:`, suggested.toString());
        if (!userInput) return;
        
        try {
            await addTransaction(Number(userInput), 'expense', category, `${category} (Quick Log)`);
        } catch (e) { console.error(e); }
    };

    return (
        <main 
        className="min-h-screen pt-4 md:pt-12 pb-10 px-4 md:px-10 overflow-x-hidden"
        style={{
            background: "linear-gradient(145deg, #ece9ff 0%, #f3eeff 22%, #ffe8f8 52%, #e8f0ff 78%, #e4f5ff 100%)",
            borderRadius: "40px", 
            backdropFilter: "blur(45px) saturate(160%)",
            border: "3.5px solid rgba(255, 255, 255, 0.7)",
        }}
        >
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-5%] left-[-10%] w-[60%] h-[40%] bg-indigo-200/30 blur-[80px] rounded-full" />
                <div className="absolute bottom-[-5%] right-[-10%] w-[60%] h-[40%] bg-rose-100/20 blur-[80px] rounded-full" />
            </div>

            <div className="max-w-5xl mx-auto relative z-10">
                
                {/* --- OPTIMIZED HEADER (Mobile Friendly) --- */}
                <header className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6 md:mb-10 px-2">
            <div className="flex flex-col items-center md:items-start text-center md:text-left w-full md:w-auto">
                        <div className="flex items-center gap-3 mb-2">
                            <span className="text-[10px] font-black tracking-[0.4em] text-indigo-400 uppercase">Strategic Revenue</span>
                            <button 
                                onClick={() => setShowRevenueModal(true)}
                                className="text-[8px] bg-white/60 border border-white px-2.5 py-1 rounded-full font-bold text-indigo-600 hover:bg-white transition-all shadow-sm"
                            >
                                Edit Sources
                            </button>
                        </div>
                        
                        <h1 className="text-5xl md:text-6xl font-serif text-indigo-950 tracking-tight leading-tight">
                            {mounted ? formatValue(initialBalance) : "---"}
                        </h1>
                        
                        <div className="mt-4 flex items-center gap-3 px-3 py-1.5 bg-white/30 backdrop-blur-md rounded-2xl border border-white/60 shadow-sm">
                            <span className="text-[8px] font-black uppercase tracking-widest text-rose-400">System Tax</span>
                            <span className="text-xs font-bold text-rose-600">-{formatValue(400)}</span>
                        </div>
                    </div>

                    {/* Currency Toggle & Status Labels */}
                    <div className="flex flex-row md:flex-col items-center md:items-end justify-between w-full md:w-auto gap-4 border-t border-indigo-100 pt-6 md:pt-0 md:border-none">
                        <div className="flex p-1 bg-white/40 backdrop-blur-xl border border-white/80 rounded-2xl shadow-sm shrink-0">
                            {(['KGS', 'USD', 'RUB'] as Currency[]).map((curr) => (
                                <button 
                                    key={curr}
                                    onClick={() => setActiveCurrency(curr)}
                                    className={`px-3 py-1.5 rounded-xl text-[9px] font-bold transition-all ${
                                        activeCurrency === curr ? 'bg-indigo-600 text-white shadow-md' : 'text-indigo-400'
                                    }`}
                                >
                                    {curr === 'KGS' ? 'с' : curr === 'USD' ? '$' : '₽'}
                                </button>
                            ))}
                        </div>
                        <div className="text-right hidden sm:block">
                             <p className="text-[9px] font-bold text-indigo-300 uppercase tracking-[0.2em]">Surplus Auto-Save</p>
                             <p className="text-[9px] font-bold text-emerald-500 uppercase">Active</p>
                        </div>
                    </div>
                </header>

                <div className="max-w-2xl mx-auto">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="overflow-hidden rounded-[40px] border border-white/80 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.08)] bg-white/40 backdrop-blur-3xl"
                    >
                        {/* Status Header */}
                        <div className="bg-indigo-600 p-6 md:p-8 text-white flex justify-between items-center relative overflow-hidden">
                            <div className="relative z-10">
                                <p className="text-[9px] font-bold tracking-[0.3em] uppercase opacity-60 mb-1">Today's Burn</p>
                                <h2 className="text-3xl md:text-5xl font-serif leading-none">{formatValue(todaysBurn)}</h2>
                            </div>
                            <div className="relative z-10 text-right">
                                <p className="text-[9px] font-bold tracking-[0.3em] uppercase opacity-60 mb-1">Live Clock</p>
                                <h2 className="text-xl md:text-3xl font-mono font-light tracking-tighter">
                                    {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </h2>
                            </div>
                        </div>

                        {/* Input Area */}
                        <div className="p-5 md:p-8 bg-white/20">
                            <div className="flex flex-col gap-3 mb-6">
                                <input 
                                    type="text" 
                                    placeholder="Log expense..." 
                                    value={label}
                                    onChange={(e) => setLabel(e.target.value)}
                                    className="w-full bg-white/50 border border-white rounded-[20px] px-5 py-3 text-sm focus:bg-white transition-all shadow-inner"
                                />
                                <div className="flex gap-2">
                                    <input 
                                        type="number" 
                                        placeholder="0" 
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        className="flex-1 bg-white/50 border border-white rounded-[20px] px-5 py-3 text-sm focus:bg-white transition-all shadow-inner"
                                    />
                                    <button onClick={handleLog} className="bg-indigo-600 text-white px-8 rounded-[20px] font-bold text-[10px] uppercase tracking-widest hover:shadow-lg active:scale-95 transition-all">
                                        Log
                                    </button>
                                </div>
                            </div>
                            <div className="flex gap-2 flex-wrap">
                                {['Lunch', 'Taxi', 'Gift', 'Uni', 'Tax'].map(tag => (
                                    <button 
                                        key={tag} 
                                        onClick={() => handleQuickLog(tag)}
                                        className="text-[8px] font-black uppercase tracking-widest bg-white/60 border border-white px-4 py-2 rounded-full text-indigo-400 hover:text-indigo-600 hover:bg-white transition-all shadow-sm active:scale-95"
                                    >
                                        + {tag}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Timeline */}
                        <div className="p-6 md:p-10 space-y-6 md:space-y-8 min-h-[300px]">
                            {initialTransactions?.length > 0 ? (
                                initialTransactions.map((item) => (
                                    <div key={item.id} className="flex justify-between items-center group p-2 -mx-2 rounded-2xl hover:bg-white/40 transition-all duration-300">
                                        <div className="flex items-center gap-4 flex-1">
                                            <span className="text-[9px] font-mono font-bold text-indigo-300 bg-white/80 px-2 py-1 rounded-lg border border-white shadow-sm italic shrink-0">
                                                {new Date(item.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                            <button onClick={() => setSelectedTransaction(item)} className="text-left flex-1">
                                                <p className="text-sm font-bold text-indigo-950 group-hover:text-indigo-600 transition-colors line-clamp-1">{item.label}</p>
                                                <p className="text-[8px] uppercase tracking-[0.2em] font-black text-indigo-400">{item.category}</p>
                                            </button>
                                        </div>

                                        <div className="flex items-center gap-4">
                                            <button 
                                                onClick={() => confirm("Delete?") && deleteTransaction(item.id)}
                                                className="opacity-0 group-hover:opacity-100 transition-opacity p-2 text-indigo-300 hover:text-red-500"
                                            >
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18m-2 0v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /></svg>
                                            </button>
                                            <span className={`font-serif text-lg md:text-xl ${item.type === 'income' ? 'text-emerald-600' : 'text-indigo-950'}`}>
                                                {item.type === 'income' ? '+' : '-'}{formatValue(item.amount)}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="flex flex-col items-center justify-center py-20 opacity-30 text-[9px] font-black uppercase tracking-[0.6em] animate-pulse">Waiting for entry</div>
                            )}
                        </div>
                    </motion.div>

                    <button 
                        onClick={() => router.push('/en/finance/archive')}
                        className="w-full mt-10 py-4 text-[11px] font-bold uppercase tracking-[0.6em] text-indigo-300 hover:text-indigo-600 transition-all hover:tracking-[0.8em]"
                    >
                        Monthly Archive Library ›
                    </button>
                </div>
            </div>

            <AnimatePresence>
                {showRevenueModal && <RevenueModal onClose={() => setShowRevenueModal(false)} />}
                {selectedTransaction && (
                    <UpdateModal transaction={selectedTransaction} onClose={() => setSelectedTransaction(null)} />
                )}
            </AnimatePresence>
        </main>
    );
}