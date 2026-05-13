"use client";

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter, useParams } from 'next/navigation';
import { RevenueModal } from './_components/RevenueModal';
import { addTransaction, deleteTransaction } from '@/lib/actions/finance';
import UpdateModal from './_components/UpdateModal';
import { useTranslations } from 'next-intl';
import { ArrowLeft } from 'lucide-react';

type Currency = 'USD' | 'KGS' | 'RUB';

interface Transaction {
    id: string;
    amount: number;
    category: string;
    description?: string;
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
    const [rates, setRates] = useState<Record<Currency, number>>({ KGS: 1, USD: 0.011, RUB: 1.05 });
    const [isLoadingRates, setIsLoadingRates] = useState(true);
    const t = useTranslations('finance'); 
    const params = useParams(); 
    const locale = params?.locale || 'en';
    const [transactions, setTransactions] = useState(initialTransactions);

    
    useEffect(() => {
        setMounted(true);
        const timer = setInterval(() => setTime(new Date()), 60000);
        const fetchRates = async () => {
            try {
                const res = await fetch('https://open.er-api.com/v6/latest/KGS');
                const data = await res.json();
                if (data && data.rates) {
                    setRates({ KGS: 1, USD: data.rates.USD, RUB: data.rates.RUB });
                }
            } catch (error) {
                console.error("Currency API failed:", error);
            } finally {
                setIsLoadingRates(false);
            }
        };
        fetchRates();
        return () => clearInterval(timer);
    }, []);

    const systemTaxAmount = transactions
    .filter(t => {
        const category = (t.category || "").toLowerCase().trim();
        const description = (t.description || "").toLowerCase().trim();

        return category === 'obligations' || description === 'system tax';
    })
    .reduce((acc, t) => acc + t.amount, 0);

    const formatValue = (val: number) => {
        if (isLoadingRates && activeCurrency !== 'KGS') return "...";
    
        const rate = activeCurrency === 'KGS' ? 1 : (rates[activeCurrency] || 1);
        const converted = val * rate;
    
        if (activeCurrency === 'KGS') {
            return new Intl.NumberFormat('ru-KG', { 
                maximumFractionDigits: 0,
            }).format(converted) + ' с';
        }
    
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: activeCurrency,
            minimumFractionDigits: 2
        }).format(converted);
    };

    const todaysData = useMemo(() => {
        const now = new Date();
        return transactions.filter(t => { 
            const d = new Date(t.date);
            return d.getDate() === now.getDate() &&
                   d.getMonth() === now.getMonth() &&
                   d.getFullYear() === now.getFullYear();
        });
    }, [transactions]);

    const todaysBurn = useMemo(() => {
        return todaysData
            .filter(t => t.type === 'expense')
            .reduce((acc, curr) => acc + curr.amount, 0);
    }, [todaysData]);

    const handleLog = async () => {
        if (!label || !amount) return;
        try {
            await addTransaction(Number(amount), 'expense', 'General', label);
            const newTx = await addTransaction(Number(amount), 'expense', 'General', label);
            setTransactions(prev => [newTx, ...prev]);
            setLabel('');
            setAmount('');
        } catch (error) { alert("Check connection."); }
    };

    const handleQuickLog = async (category: string) => {
        const quickPresets: Record<string, { price: number }> = {
            food: { price: 250 },
            transport: { price: 120 },
            product: { price: 900 },
            social: { price: 500 },
            fixed: { price: 100 }
        };
    
        const preset = quickPresets[category];
        const suggested = preset?.price || 0;
        
        const userInput = window.prompt(
            `${t(`quick_tags.${category}`)}:`, 
            suggested.toString()
        );
    
        if (!userInput || isNaN(Number(userInput))) return;
    
        try {
            await addTransaction(
                Number(userInput), 
                'expense', 
                category, 
                category 
            );
            const newTx = await addTransaction(
                Number(userInput), 
                'expense', 
                category, 
                category);
            setTransactions(prev => [newTx, ...prev]);
        } catch (e) { 
            console.error("Log failed:", e); 
        }
    };

    return (
        <>
        <main 
        className="min-h-screen pt-4 md:pt-12 pb-10 px-4 md:px-10 overflow-x-hidden relative"
        style={{
            background: "linear-gradient(145deg, #ece9ff 0%, #f3eeff 22%, #ffe8f8 52%, #e8f0ff 78%, #e4f5ff 100%)",
            borderRadius: "40px", 
            backdropFilter: "blur(45px) saturate(160%)",
            border: "3.5px solid rgba(255, 255, 255, 0.7)",
        }}
        >
            <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-[40px]">
                <div className="absolute top-[-5%] left-[-10%] w-[60%] h-[40%] bg-indigo-200/30 blur-[80px] rounded-full" />
                <div className="absolute bottom-[-5%] right-[-10%] w-[60%] h-[40%] bg-rose-100/20 blur-[80px] rounded-full" />
            </div>

            <div className="max-w-5xl mx-auto relative z-10">
                
                <header className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6 md:mb-10 px-2">
                    <div className="flex flex-col items-center md:items-start text-center md:text-left w-full md:w-auto">
                        <div className="flex items-center gap-3 mb-2">
                            <span className="text-[10px] font-black tracking-[0.4em] text-indigo-400 uppercase">{t('title')}</span>
                            <button 
                                onClick={() => setShowRevenueModal(true)}
                                className="text-[8px] bg-white/60 border border-white px-2.5 py-1 rounded-full font-bold text-indigo-600 hover:bg-white transition-all shadow-sm"
                            >
                             {t('edit_sources')}
                            </button>
                        </div>
                        <h1 className="text-5xl md:text-6xl font-serif text-indigo-950 tracking-tight leading-tight">
                            {mounted ? formatValue(initialBalance) : "---"}
                        </h1>
                        <div onClick={() => setShowRevenueModal(true)} className="mt-4 flex items-center gap-3 px-3 py-1.5 bg-white/30 backdrop-blur-md rounded-2xl border border-white/60 shadow-sm">
                            <span className="text-[8px] font-black uppercase tracking-widest text-rose-400">{t('system_tax')}</span>
                            <span className="text-xs font-bold text-rose-600">-{formatValue(systemTaxAmount)}</span>
                        </div>
                    </div>

                    <div className="flex flex-row md:flex-col items-center md:items-end justify-end w-full md:w-auto gap-4 border-t border-indigo-100 pt-6 md:pt-0 md:border-none">
                    <div className="flex p-1 bg-white/40 backdrop-blur-xl border border-white/80 rounded-2xl shadow-sm shrink-0 ml-auto md:ml-0">
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
                        <p className="text-[9px] font-bold text-indigo-300 uppercase tracking-[0.2em]">{t('auto_save')}</p>
                        <p className="text-[9px] font-bold text-emerald-500 uppercase">{t('active')}</p>
                    </div>
                    </div>
                </header>

                <div className="max-w-2xl mx-auto">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="overflow-hidden rounded-[40px] border border-white/80 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.08)] bg-white/40 backdrop-blur-3xl"
                    >
                        <div className="bg-indigo-600 p-6 md:p-8 text-white relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
                            
                            <div className="flex justify-between items-center relative z-10">
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <p className="text-[10px] font-black tracking-[0.3em] uppercase opacity-60 truncate">
                                            {t('todays_burn')}
                                        </p>
                                        <span className="text-[8px] font-black bg-white/10 px-2 py-0.5 rounded-md uppercase tracking-widest shrink-0">
                                            {time.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                        </span>
                                    </div>
                                    <h2 className="text-4xl sm:text-5xl md:text-6xl font-serif tracking-tighter leading-none truncate">
                                        {formatValue(todaysBurn)}
                                    </h2>
                                </div>

                                <div className="text-right pl-4 border-l border-white/10 ml-4 shrink-0">
                                    <p className="text-[9px] font-black tracking-[0.3em] uppercase opacity-40 mb-2 hidden sm:block">
                                        {t('live_clock')}
                                    </p>
                                    <h2 className="text-2xl md:text-3xl font-mono font-light tracking-tighter tabular-nums opacity-80">
                                        {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </h2>
                                </div>
                            </div>
                        </div>

                        <div className="p-4 md:p-6 bg-white/10 border-b border-white/20">
                            <div className="flex flex-col gap-3">
                                
                                <input 
                                    type="text" 
                                    placeholder={t('log_placeholder')}
                                    value={label}
                                    onChange={(e) => setLabel(e.target.value)}
                                    className="w-full bg-white/40 border border-white/60 rounded-xl px-4 py-2.5 text-sm focus:bg-white/80 transition-all outline-none"
                                />

                                <div className="flex gap-2 h-11">
                                    <div className="relative flex-[2] sm:flex-1">
                                        <input 
                                            type="number" 
                                            placeholder="0"
                                            value={amount}
                                            onChange={(e) => setAmount(e.target.value)}
                                            className="w-full h-full bg-white/40 border border-white/60 rounded-xl px-4 py-2.5 text-sm focus:bg-white/80 transition-all outline-none text-left font-bold"
                                        />
                                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-indigo-300">с</span>
                                    </div>
                                    
                                    <button 
                                        onClick={handleLog} 
                                        className="flex-1 max-w-[100px] bg-indigo-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-700 active:scale-95 transition-all shadow-md shadow-indigo-200/40"
                                    >
                                        {t('btn_log')}
                                    </button>
                                </div>

                                <div className="flex gap-1.5 flex-wrap pt-1">
                                    {['food', 'transport', 'product', 'social', 'fixed'].map((tag) => (
                                        <button 
                                            key={tag} 
                                            onClick={() => handleQuickLog(tag)}
                                            className="text-[8px] font-black uppercase tracking-widest bg-white/20 border border-white/30 px-3 py-1.5 rounded-full text-indigo-400/70 hover:text-indigo-600 transition-all"
                                        >
                                            {t(`quick_tags.${tag}`)}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>


                        <div className="p-6 md:p-10 space-y-6 md:space-y-8 min-h-[300px]">
                            {todaysData?.length > 0 ? (
                                todaysData.map((item) => (
                                    <div key={item.id} className="flex justify-between items-center group p-2 -mx-2 rounded-2xl hover:bg-white/40 transition-all duration-300">
                                        <div className="flex items-center gap-4 flex-1">
                                            <span className="text-[9px] font-mono font-bold text-indigo-300 bg-white/80 px-2 py-1 rounded-lg border border-white shadow-sm italic shrink-0">
                                                {new Date(item.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                            <button onClick={() => setSelectedTransaction(item)} className="text-left flex-1 min-w-0">
                                                <p className="text-sm font-bold text-indigo-950 truncate">
                                                  
                                                    {['food', 'transport', 'product', 'social', 'fixed'].includes(item.label) 
                                                        ? `${t(`quick_tags.${item.label}`)} (${t('status.quick_log') || 'Quick Log'})` 
                                                        : item.label}
                                                </p>
                                                <p className="text-[9px] uppercase tracking-[0.2em] font-black text-indigo-300">
                                                    {t(`quick_tags.${item.category}`)}
                                                </p>
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
                                <div className="flex flex-col items-center justify-center py-20 opacity-30 text-[9px] font-black uppercase tracking-[0.6em] animate-pulse">{t('status.waiting')}</div>
                            )}
                        </div>
                    </motion.div>
                    <button 
                onClick={() => router.push(`/${locale}/history/finance`)}
                className="w-full mt-10 py-4 text-[11px] font-bold uppercase tracking-[0.6em] text-indigo-300 hover:text-indigo-600 transition-all hover:tracking-[0.8em]"
            >
               {t('archive_link')} 
            </button>
                </div>
            </div>
        </main>
            <motion.button
                onClick={() => router.push(`/${locale}/dashboard`)}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ 
                    scale: 1.1, 
                    backgroundColor: "rgba(255, 255, 255, 0.9)",
                    boxShadow: "0 15px 30px rgba(79, 70, 229, 0.15)"
                }}
                whileTap={{ scale: 0.9 }}
                className="fixed bottom-10 right-10 z-[200] flex items-center justify-center w-14 h-14 rounded-full bg-white/70 backdrop-blur-2xl border border-white/80 shadow-xl text-indigo-600 transition-all"
            >
                <ArrowLeft size={24} strokeWidth={2.5} />
            </motion.button>

            <AnimatePresence>
                {showRevenueModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }} 
                            animate={{ opacity: 1 }} 
                            exit={{ opacity: 0 }}
                            onClick={() => setShowRevenueModal(false)}
                            className="absolute inset-0 bg-indigo-950/20 backdrop-blur-sm"
                        />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative z-[110] w-full max-w-lg"
                        >
                            <RevenueModal onClose={() => setShowRevenueModal(false)} />
                        </motion.div>
                    </div>
                )}
                {selectedTransaction && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }} 
                            animate={{ opacity: 1 }} 
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedTransaction(null)}
                            className="absolute inset-0 bg-indigo-950/20 backdrop-blur-sm"
                        />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative z-[110] w-full max-w-lg"
                        >
                            <UpdateModal transaction={selectedTransaction} onClose={() => setSelectedTransaction(null)} />
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
}