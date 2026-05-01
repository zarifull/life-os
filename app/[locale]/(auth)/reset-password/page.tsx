"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client"; 
import { useParams, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Eye, EyeSlash } from "@phosphor-icons/react"; 

export default function ResetPassword() {
  const t = useTranslations("Auth");
  const params = useParams();
  const router = useRouter();
  const locale = (params.locale as string) || "en";
  const supabase = createClient(); 
  
  const [newPassword, setNewPassword] = useState("");
  const [newPin, setNewPin] = useState(""); 
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleFullReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const { data, error: authError } = await supabase.auth.updateUser({ 
      password: newPassword 
    });
    
    if (authError) {
      alert(authError.message);
      setLoading(false);
      return;
    }

    const { error: dbError } = await supabase
      .from("profiles")
      .update({ 
        pin_code: newPin,
        updated_at: new Date().toISOString() 
      })
      .eq("id", data.user.id);

    if (dbError) {
      alert("Password updated, but PIN failed: " + dbError.message);
    } else {
      alert(t("keyUpdatedSuccess"));
      sessionStorage.removeItem("lifeos-unlocked");
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
          {t("reset_identity")}
        </h2>

        <form onSubmit={handleFullReset} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 ml-4 uppercase">{t("new_password")}</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="w-full p-4 pr-12 rounded-3xl bg-white/40 border border-white/50 outline-none transition-all
                          focus:bg-emerald-100/80 focus:border-emerald-300 focus:ring-4 focus:ring-emerald-400/10
                          text-sm font-bold text-slate-700"
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-500 transition-colors p-1"
              >
                {showPassword ? <EyeSlash size={20} weight="bold" /> : <Eye size={20} weight="bold" />}
              </button>
            </div>
          </div>

          <div className="space-y-1">
             <label className="text-[10px] font-black text-slate-400 ml-4 uppercase">{t("new_pin")}</label>
             <input
                type="text"
                inputMode="numeric"
                maxLength={4}
                placeholder="0000"
                className="w-full p-4 rounded-3xl bg-white/40 border border-white/50 outline-none transition-all
                          focus:bg-cyan-100/80 focus:border-cyan-300 focus:ring-4 focus:ring-cyan-400/10
                          text-sm font-bold text-slate-700 tracking-[1em] text-center"
                onChange={(e) => setNewPin(e.target.value.replace(/\D/g, ""))}
                required
              />
          </div>

          <button 
            disabled={loading}
            className="w-full py-4 bg-emerald-400 text-white rounded-[24px] font-black uppercase tracking-widest 
                             hover:bg-emerald-500 shadow-xl shadow-emerald-500/20 active:scale-95 transition-all disabled:opacity-50 mt-4">
            {loading ? "..." : t("btnCompleteReset")}
          </button>
        </form>
      </div>
      </div>
  );
}