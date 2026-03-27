"use client";
import { useState } from 'react';
import { supabase } from '@/lib/supabase/client'; // ЖОЛУН ТЕКШЕРИҢИЗ: lib/supabase/client.ts
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // 1. Кирүү аракети
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password: password,
    });

    if (error) {
      alert("Ката: " + error.message);
      setLoading(false);
    } else {
      // 2. Ийгиликтүү болсо, Next.js'ке кукилерди окууга буйрук беребиз
      router.refresh(); 

      // 3. Тилди аныктап, Dashboard'го өтөбүз
      const locale = window.location.pathname.split('/')[1] || 'en';
      
      // Бир аз күтө туруу (кукилер браузерге жазылып бүтүшү үчүн)
      setTimeout(() => {
        window.location.href = `/${locale}/dashboard`;
      }, 800);
    }
  };
  return (
    <main className="min-h-screen flex items-center justify-center bg-[#0a0a0a] relative overflow-hidden">
      {/* Background Decor (Liquid effect) */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/20 blur-[120px] rounded-full" />

      {/* Glass Card */}
      <div className="relative z-10 w-full max-w-md p-8 rounded-[40px] border border-white/20 bg-white/5 backdrop-blur-2xl shadow-[0_8px_32px_0_rgba(0,0,0,0.8)]">
        <h1 className="text-4xl font-black italic tracking-tighter text-white mb-2 uppercase">
          LifeOS
        </h1>
        <p className="text-white/50 mb-8 font-medium">Системаңызга кириңиз</p>

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Электрондук почта"
            className="w-full p-5 rounded-2xl bg-white/5 border border-white/10 text-white outline-none focus:border-white/40 transition-all font-bold placeholder:text-white/20"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Сөз айкашы"
            className="w-full p-5 rounded-2xl bg-white/5 border border-white/10 text-white outline-none focus:border-white/40 transition-all font-bold placeholder:text-white/20"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          
          <button
            type="submit"
            disabled={loading}
            className="w-full p-5 bg-white text-black font-black rounded-2xl uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
          >
            {loading ? "Жүктөлүүдө..." : "Кирүү"}
          </button>
        </form>
      </div>
    </main>
  );
}