"use client";
import { useState, useEffect } from "react";

export default function DashboardPage() {
  const [percent, setPercent] = useState(0);
  const [daysLeft, setDaysLeft] = useState(0);

  useEffect(() => {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 1);
    const end = new Date(now.getFullYear() + 1, 0, 1);
    const total = end.getTime() - start.getTime();
    const current = now.getTime() - start.getTime();
    
    setPercent(Math.floor((current / total) * 100));
    setDaysLeft(Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
  }, []);

  return (
    <div className="min-h-screen bg-[#f0f4ff] p-8 flex flex-col gap-8 items-center">
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-[10%] left-[20%] w-96 h-96 bg-purple-200 rounded-full blur-[120px] opacity-60" />
        <div className="absolute bottom-[20%] right-[10%] w-[500px] h-[500px] bg-blue-100 rounded-full blur-[150px] opacity-70" />
      </div>

      <div className="w-full max-w-4xl p-10 rounded-[40px] bg-white/30 backdrop-blur-[40px] border border-white/50 shadow-liquid">
        <h2 className="text-gray-600 font-bold mb-6 tracking-tight">ЖАШОО ПРОГРЕССИ</h2>
        <div className="relative w-full h-12 bg-white/20 rounded-full border border-white/40 overflow-hidden shadow-inner">
          <div 
            className="h-full bg-gradient-to-r from-indigo-400 to-purple-500 shadow-[0_0_20px_rgba(129,140,248,0.5)] transition-all duration-1000 ease-out"
            style={{ width: `${percent}%` }}
          />
        </div>
        <div className="mt-6 text-center">
          <span className="text-4xl font-black text-gray-700">{percent}%</span>
          <p className="text-gray-500 mt-2">Бул жылдын бүтүшүнө <span className="font-bold text-indigo-600">{daysLeft}</span> күн калды.</p>
        </div>
      </div>

      <div className="w-full max-w-4xl p-8 rounded-[40px] bg-white/20 backdrop-blur-[30px] border border-white/40 shadow-liquid">
        <h2 className="text-gray-600 font-bold mb-6">БҮГҮНКҮ МААНАЙ</h2>
        <div className="flex justify-around bg-white/30 p-6 rounded-[30px] border border-white/20 shadow-button-inner">
          {['😊', '🤔', '😎', '😴'].map((emoji) => (
            <button key={emoji} className="text-4xl hover:scale-125 transition-transform duration-200 active:scale-90">
              {emoji}
            </button>
          ))}
        </div>
        <textarea 
          placeholder="Ойлоруңузду бул жерге калтырыңыз..."
          className="w-full mt-6 p-6 rounded-[30px] bg-white/20 border border-white/30 focus:outline-none focus:bg-white/40 transition-all placeholder-gray-400"
        />
      </div>
    </div>
  );
}