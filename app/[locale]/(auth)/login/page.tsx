"use client";
import { useState,useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import { useRouter, useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { Eye, EyeSlash } from "@phosphor-icons/react"; 


export default function AuthCard() {
  const t = useTranslations("Auth");
  const params = useParams();
  const locale = params.locale as string || "en";
  
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);

  
  useEffect(() => {
    if (searchParams.get("reset") === "true") {
      handleForgot();
    }
  }, [searchParams]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const { error } = isLogin 
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ 
          email, 
          password, 
          options: { 
            data: { display_name: name },
            emailRedirectTo: `${window.location.origin}/${locale}/dashboard`
          } 
        });

        if (error) {
          alert(error.message);
        } else {
          if (!isLogin) {
            alert(t("confirmEmail"));
          } else {
            sessionStorage.removeItem("lifeos-unlocked");
            router.refresh(); 
            window.location.href = `/${locale}/dashboard`;
          }
        }
    setLoading(false);
  };

  const handleForgot = async () => {
    const emailInput = prompt(t("forgotPrompt"));
    if (emailInput) {
      const { error } = await supabase.auth.resetPasswordForEmail(emailInput, {
        redirectTo: `${window.location.origin}/${locale}/reset-password`,
      });
      
      if (error) {
        alert(error.message);
      } else {
        alert(t("recoverySent"));
      }
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-white/5 backdrop-blur-[12px]" />

      <div className="relative z-10 w-full max-w-[360px] p-10 
                      rounded-[60px] bg-white/40 backdrop-blur-[40px] 
                      border border-white/80 
                      shadow-[0_40px_100px_rgba(0,0,0,0.03),inset_0_0_20px_rgba(255,255,255,0.7)]
                      animate-in fade-in zoom-in duration-500">
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-[1000] italic tracking-tighter text-[#34D399] uppercase">
            Life<span className="text-[#FB923C]">OS</span>
          </h1>
          <p className="text-[9px] font-black tracking-[0.4em] text-slate-400 uppercase mt-2">
            {isLogin ? t("synchronize") : t("initialize")}
          </p>
        </div>

        <form onSubmit={handleAuth} className="space-y-4">
          {!isLogin && (
            <input
              type="text" placeholder={t("placeholderName")}
              className="w-full p-4 rounded-3xl bg-white/40 border border-white/50 outline-none text-sm font-bold text-slate-700 placeholder:text-slate-300 transition-all focus:bg-emerald-100/80 focus:border-emerald-300 focus:ring-4 focus:ring-emerald-400/10"
              onChange={(e) => setName(e.target.value)}
              required
            />
          )}

          <input
            type="email" placeholder={t("placeholderEmail")}
            className="w-full p-4 rounded-3xl bg-white/40 border border-white/50 text-sm font-bold text-slate-700 placeholder:text-slate-300 transition-all outline-none focus:bg-emerald-100/80 focus:border-emerald-300 focus:ring-4 focus:ring-emerald-400/10"
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <div className="relative group">
            <input
              type={showPassword ? "text" : "password"} 
              placeholder={t("placeholderKey")}
              className="w-full p-4 pr-12 rounded-3xl bg-white/40 border border-white/50 text-sm font-bold text-slate-700 placeholder:text-slate-300 transition-all outline-none focus:bg-emerald-100/80 focus:border-emerald-300 focus:ring-4 focus:ring-emerald-400/10"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-emerald-500 transition-colors"
            >
              {showPassword ? (
                <EyeSlash size={20} weight="bold" />
              ) : (
                <Eye size={20} weight="bold" />
              )}
            </button>
          </div>
                      
          <button className="w-full py-4 mt-2 bg-emerald-400 text-white rounded-[24px] text-[11px] font-[1000] uppercase tracking-widest transition-all duration-200 shadow-xl shadow-blue-500/20 hover:bg-emerald-500 hover:shadow-emerald-500/40 active:scale-95 active:bg-slate-200 active:text-emerald-400">
            {loading ? "..." : isLogin ? t("btnEnter") : t("btnStart")}
          </button>
        </form>

        <div className="mt-8 flex flex-col items-center gap-3">
          {isLogin && (
            <button onClick={handleForgot} className="text-[9px] font-bold text-slate-400 uppercase tracking-widest hover:text-[#FB923C] transition-colors">
              {t("forgotKey")}
            </button>
          )}

          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="text-[9px] font-black text-[#34D399] uppercase tracking-widest border-b border-slate-200 pb-1 hover:border-[#FB923C] transition-all"
          >
            {isLogin ? t("switchRequest") : t("switchSync")}
          </button>
        </div>
      </div>
    </div>
  );
}