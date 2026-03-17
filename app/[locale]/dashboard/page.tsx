"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";

export default function Dashboard() {
  const t = useTranslations("Dashboard");
  const nav = useTranslations("Navigation");

  const [percent, setPercent] = useState(0);
  const [daysLeft, setDaysLeft] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 1);
    const end = new Date(now.getFullYear() + 1, 0, 1);
    const total = end.getTime() - start.getTime();
    const current = now.getTime() - start.getTime();

    setPercent(Math.floor((current / total) * 100));
    setDaysLeft(Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
  }, []);

  if (!mounted) return null;

  return (
    <div className="relative mx-auto flex max-w-6xl flex-col gap-8 pb-20 pt-6 px-4">
      
      {/* 1. БОРБОРДУК БЛОК: 365 DAYS (Hero Section) */}
      <section className="relative overflow-hidden rounded-[50px] p-[2.5px] bg-gradient-to-b from-white/90 to-white/10 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)]">
        <div className="relative bg-white/10 backdrop-blur-[45px] saturate-[180%] rounded-[47.5px] px-8 py-12 flex flex-col md:flex-row items-center justify-between border border-white/40 overflow-hidden">
          
          {/* Фондогу суюк анимациялык тактар */}
          <div className="absolute -top-24 -left-20 w-80 h-80 bg-purple-400/20 blur-[120px] animate-pulse rounded-full" />
          <div className="absolute -bottom-24 -right-20 w-80 h-80 bg-cyan-400/20 blur-[120px] animate-pulse rounded-full" />

          <div className="relative z-10 text-center md:text-left space-y-4">
            <p className="text-[11px] font-black uppercase tracking-[0.4em] text-indigo-500/80">Life Journey</p>
            <h1 className="text-6xl font-black text-slate-900 tracking-tighter italic">
              365 <span className="text-slate-400 font-light not-italic">Days</span>
            </h1>
            <div className="flex items-center gap-3 justify-center md:justify-start">
              <span className="px-3 py-1 rounded-full bg-emerald-100/50 border border-emerald-200 text-[10px] font-bold text-emerald-700 uppercase tracking-widest">
                {daysLeft} Days Left
              </span>
              <span className="text-xs font-medium text-slate-500 italic">"Ар бир күн — жаңы мүмкүнчүлүк"</span>
            </div>
          </div>

          {/* Жылдык Прогресс Индикатору */}
          <div className="relative mt-10 md:mt-0 group">
            <div className="h-44 w-44 rounded-full border-[12px] border-white/20 shadow-inner flex items-center justify-center bg-white/5 backdrop-blur-md">
                <div className="text-center">
                    <span className="block text-4xl font-black text-slate-800">{percent}%</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Completed</span>
                </div>
                {/* Декоративдик "учкундар" */}
                <div className="absolute -top-2 -right-2 h-6 w-6 bg-amber-300 blur-md animate-ping rounded-full" />
            </div>
          </div>
        </div>
      </section>

      {/* 2. НЕГИЗГИ МАЗМУН: МААНАЙ ЖАНА ПЛАНДАР */}
      <div className="grid gap-8 md:grid-cols-3">
        
        {/* ЭНЕРГИЯ ТАМЧЫЛАРЫ (Liquid Energy Drops) */}
        <section className="md:col-span-2 relative bg-white/10 backdrop-blur-[35px] saturate-[160%] rounded-[45px] p-10 border border-white/30 shadow-2xl">
          <div className="flex justify-between items-center mb-10">
            <div>
                <h3 className="text-xl font-black text-slate-800 tracking-tight">Energy Drops</h3>
                <p className="text-xs text-slate-400 font-medium">Күнүмдүк энергияңыздын деңгээли</p>
            </div>
            <div className="flex gap-2">
                {["Өткөн", "Бүгүн", "Келечек"].map((t) => (
                    <span key={t} className="px-3 py-1 text-[9px] font-black uppercase border border-white/40 rounded-lg bg-white/20 text-slate-500">{t}</span>
                ))}
            </div>
          </div>
          
          <div className="flex justify-around items-end h-56 gap-6">
            {[55, 80, 45, 90, 65, 30, 75].map((val, i) => (
              <div key={i} className="flex flex-col items-center gap-5 w-full group">
                {/* Тамчы формасындагы индикатор */}
                <div className="relative w-full max-w-[50px] h-40 rounded-[25px] border border-white/50 bg-white/10 overflow-hidden shadow-inner group-hover:border-white/80 transition-all">
                   <motion.div 
                    initial={{ height: 0 }}
                    animate={{ height: `${val}%` }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="absolute bottom-0 w-full bg-gradient-to-t from-indigo-500 via-cyan-400 to-white/40"
                   />
                   {/* Суюктуктун ичиндеги кичинекей көбүкчөлөр */}
                   <div className="absolute top-1/2 left-1/2 -translate-x-1/2 w-1 h-1 bg-white/40 rounded-full animate-bounce" />
                </div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Slot {i+1}</span>
              </div>
            ))}
          </div>
        </section>

        {/* TODAY PLAN (Checklist) */}
        <section className="bg-white/10 backdrop-blur-[35px] rounded-[45px] p-10 border border-white/30 shadow-2xl flex flex-col">
          <h3 className="text-xl font-black text-slate-800 mb-8 tracking-tight border-b border-white/20 pb-4">Today Plan</h3>
          <div className="flex-1 space-y-5">
            {[
                { time: "05:00", task: "Get up & Meditation", done: true },
                { time: "07:00", task: "Healthy Breakfast", done: true },
                { time: "09:00", task: "Coding LifeOS", done: false },
                { time: "12:00", task: "Reading Book", done: false },
            ].map((item, i) => (
              <div key={i} className="group flex items-center gap-4 p-4 rounded-2xl bg-white/30 border border-white/40 hover:bg-white/50 transition-all cursor-pointer">
                <div className={`h-6 w-6 rounded-lg border-2 flex items-center justify-center transition-all ${item.done ? "bg-emerald-400 border-emerald-300 shadow-[0_0_10px_rgba(52,211,153,0.5)]" : "border-white/60 bg-white/10"}`}>
                    {item.done && <span className="text-white text-[10px]">✓</span>}
                </div>
                <div>
                    <p className="text-[10px] font-black text-indigo-500/70 uppercase tracking-widest">{item.time}</p>
                    <p className={`text-sm font-bold ${item.done ? "text-slate-400 line-through" : "text-slate-700"}`}>{item.task}</p>
                </div>
              </div>
            ))}
          </div>
          
          <button className="mt-10 group relative w-full py-5 rounded-2xl bg-slate-900 overflow-hidden transition-all active:scale-95 shadow-xl">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity" />
            <span className="relative z-10 text-white font-black text-xs uppercase tracking-[0.3em]">Complete Day</span>
          </button>
        </section>

      </div>

      {/* 3. ТӨМӨНКҮ НАВИГАЦИЯ (Pill Buttons) */}
      <footer className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-5">
         {["My History", "Finance", "Жилания карта", "Settings"].map((label) => (
             <button key={label} className="glass-pill py-5 px-8 bg-white/20 backdrop-blur-md border border-white/40 rounded-[25px] text-[11px] font-black uppercase tracking-[0.2em] text-slate-600 hover:bg-white/40 hover:scale-[1.03] transition-all shadow-lg">
                {label}
             </button>
         ))}
      </footer>
    </div>
  );
}