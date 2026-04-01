"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";

export default function ResetPassword() {
  const t = useTranslations("Auth");
  const params = useParams();
  const locale = params.locale as string || "en";
  
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const updatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    
    if (error) {
      alert(error.message);
    } else {
      alert(t("keyUpdatedSuccess"));
      window.location.href = `/${locale}/dashboard`;
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center p-6 bg-[#F8F9FD]">
      <div className="absolute inset-0 bg-white/5 backdrop-blur-[10px]" />

      <div className="relative z-10 w-full max-w-[360px] p-10 
                      rounded-[60px] bg-white/40 backdrop-blur-[40px] 
                      border border-white/80 shadow-2xl">
        
        <h2 className="text-xl font-[1000] italic text-center text-slate-800 uppercase tracking-widest mb-8">
          {t("new")} <span className="text-[#34D399]">{t("key")}</span>
        </h2>

        <form onSubmit={updatePassword} className="space-y-4">
          <input
            type="password"
            placeholder={t("placeholderNewKey")}
            className="w-full p-4 rounded-3xl bg-white/40 border border-white/50 outline-none transition-all
                      focus:bg-emerald-100/80 focus:border-emerald-300 focus:ring-4 focus:ring-emerald-400/10
                      text-sm font-bold text-slate-700 placeholder:text-slate-400"
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <button className="w-full py-4 bg-emerald-400 text-white rounded-[24px] font-black uppercase tracking-widest 
                             hover:bg-emerald-500 shadow-xl shadow-emerald-500/20 active:scale-95 transition-all">
            {loading ? "..." : t("btnUpdateIdentity")}
          </button>
        </form>
      </div>
    </div>
  );
}