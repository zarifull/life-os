"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation"; 
import { 
  ArrowLeft, 
  User, 
  Envelope, 
  Key, 
  ShieldCheck, 
  CameraPlus, 
  CheckCircle, 
  Eye, 
  EyeSlash 
} from "@phosphor-icons/react";

const GLASS_CARD_STYLE = "bg-white/30 backdrop-blur-[40px] rounded-[60px] border border-white/80 shadow-xl";

export default function SettingsPage() {
  const t = useTranslations("Settings");
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const [name, setName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [newEmail, setNewEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newPin, setNewPin] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase
        .from('profiles')
        .select('display_name, avatar_url')
        .eq('id', user.id)
        .single();

      setName(profile?.display_name || user.user_metadata?.display_name || "");
      setAvatarUrl(profile?.avatar_url || user.user_metadata?.avatar_url || null);
    };

    fetchUser();
  }, []);

  const showToast = (type: "success" | "error", text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: "", text: "" }), 3000);
  };

  const updateName = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Unauthorized");

      const { error: authError } = await supabase.auth.updateUser({ 
        data: { display_name: name } 
      });
      if (authError) throw authError;

      const { error: dbError } = await supabase
        .from('profiles')
        .upsert({ 
          id: user.id, 
          display_name: name, 
          updated_at: new Date().toISOString() 
        });
      if (dbError) throw dbError;

      showToast("success", t("successUpdate", { type: "Name" }));
    } catch (err) {
      showToast("error", err instanceof Error ? err.message : "Error updating name");
    } finally {
      setLoading(false);
    }
  };

  const updateEmail = async () => {
    if (!newEmail) return;
    try {
      setLoading(true);
      const { error } = await supabase.auth.updateUser({ email: newEmail });
      if (error) throw error;
      showToast("success", t("successUpdate", { type: "Email" }));
      setNewEmail("");
    } catch (err) {
      showToast("error", err instanceof Error ? err.message : "Error updating email");
    } finally {
      setLoading(false);
    }
  };

  const updatePassword = async () => {
    if (!password) return;
    try {
      setLoading(true);
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      showToast("success", t("successUpdate", { type: "Password" }));
      setPassword("");
    } catch (err) {
      showToast("error", err instanceof Error ? err.message : "Error updating password");
    } finally {
      setLoading(false);
    }
  };

  const uploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setLoading(true);
      if (!event.target.files || event.target.files.length === 0) return;
      
      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage.from('avatars').upload(fileName, file);
      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('avatars').getPublicUrl(fileName);
      const publicUrl = data.publicUrl;

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Unauthorized");

      await supabase.auth.updateUser({ data: { avatar_url: publicUrl } });
      await supabase.from('profiles').upsert({ id: user.id, avatar_url: publicUrl, updated_at: new Date().toISOString() });

      setAvatarUrl(publicUrl);
      showToast("success", t("avatarSuccess"));
    } catch (err) {
      showToast("error", err instanceof Error ? err.message : "Error uploading avatar");
    } finally {
      setLoading(false);
    }
  };

  const updatePin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPin.length !== 4) return;

    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Unauthorized");

      const { error: dbError } = await supabase.from('profiles').upsert({ 
        id: user.id, 
        pin_code: newPin, 
        updated_at: new Date().toISOString() 
      });
      if (dbError) throw dbError;

      await supabase.auth.updateUser({ data: { has_pin: true } });
      showToast("success", t("pinSuccess"));
      setNewPin(""); 
    } catch (err) {
      showToast("error", err instanceof Error ? err.message : "Error setting PIN");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-4xl mx-auto py-5 px-6 space-y-12 animate-in fade-in zoom-in duration-700 relative">
      <div className="fixed bottom-8 right-8 z-50">
        <button 
          onClick={() => router.back()}
          aria-label={t("back")}
          className="flex items-center justify-center w-14 h-14 rounded-full bg-white/80 backdrop-blur-md border border-white text-slate-700 hover:text-emerald-500 hover:bg-white transition-all active:scale-95 shadow-2xl group"
          title={t("back")}
        >
          <ArrowLeft size={22} weight="bold" className="group-hover:-translate-x-1 transition-transform" aria-hidden="true" />
        </button>
      </div>

      <header className="space-y-6 text-center">
        <div className="space-y-2">
          <h1 className="text-2xl md:text-4xl font-[1000] italic tracking-tighter text-slate-800 uppercase">
            {t("titlePart1")} <span className="text-emerald-400">{t("titlePart2")}</span>
          </h1>
          <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.4em] opacity-60">
            {t("subtitle")}
          </p>
        </div>
      </header>

      {message.text && (
        <div role="status" aria-live="polite" className={`fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] px-8 py-4 rounded-[30px] text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl backdrop-blur-2xl border animate-in slide-in-from-bottom-10 ${
          message.type === "success" ? "bg-emerald-400/90 text-white border-emerald-300" : "bg-rose-500/90 text-white border-rose-400"
        }`}>
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 gap-10">
        <section className={`p-8 md:p-12 transition-all hover:shadow-emerald-400/5 ${GLASS_CARD_STYLE}`}>
          <div className="flex flex-col md:flex-row items-center gap-10 lg:gap-16">
            <div className="relative shrink-0">
              <div className="w-48 h-48 sm:w-56 sm:h-56 lg:w-72 lg:h-72 rounded-[56px] sm:rounded-[64px] lg:rounded-[80px] bg-white/40 p-0.5 border-[0.5px] border-white/80 shadow-xl overflow-hidden group-hover:scale-105 transition-transform duration-500">
                {avatarUrl ? (
                  <img src={avatarUrl} className="w-full h-full object-cover rounded-[50px] sm:rounded-[58px] lg:rounded-[74px]" alt="User profile avatar" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-emerald-50 rounded-[50px] sm:rounded-[58px] lg:rounded-[74px]">
                    <User size={80} weight="thin" className="text-emerald-200" aria-hidden="true" />
                  </div>
                )}
              </div>
              
              <label 
                aria-label="Upload new avatar"
                className="absolute -bottom-1 -right-1 bg-white/35 backdrop-blur-md text-emerald-500 w-14 h-14 sm:w-16 sm:h-16 rounded-[22px] sm:rounded-[26px] shadow-lg shadow-black/5 flex items-center justify-center cursor-pointer hover:bg-white/60 hover:scale-110 transition-all border-4 border-white/80"
              >
                <input type="file" className="hidden" accept="image/*" onChange={uploadAvatar} aria-label="Upload avatar file input" />
                <CameraPlus size={26} weight="bold" aria-hidden="true" />
              </label>
            </div>
            
            <div className="flex-1 w-full space-y-6 md:pl-6 lg:pl-10">
              <div className="space-y-2">
                <label htmlFor="display-name-input" className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">
                  <User size={14} weight="bold" aria-hidden="true" /> {t("labelName")}
                </label>
                <input 
                  id="display-name-input"
                  type="text" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  className="w-full p-5 rounded-[28px] bg-white/40 border border-white/60 focus:bg-white/80 focus:border-emerald-300 focus:ring-4 focus:ring-emerald-400/5 outline-none text-slate-700 font-bold text-lg transition-all" 
                />
              </div>
              <button 
                onClick={updateName}
                disabled={loading}
                className="w-full md:w-auto px-12 py-5 bg-emerald-400 text-white rounded-[24px] text-[10px] font-black uppercase tracking-widest hover:bg-emerald-500 shadow-xl shadow-emerald-500/20 active:scale-95 transition-all disabled:opacity-50"
              >
                {loading ? "..." : t("btnSaveName")}
              </button>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className={`p-10 flex flex-col justify-between hover:border-emerald-100 transition-all ${GLASS_CARD_STYLE}`}>
            <div className="space-y-6">
              <label htmlFor="email-input" className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-3 cursor-pointer">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-400">
                  <Envelope size={16} weight="bold" aria-hidden="true" />
                </div>
                {t("labelEmail")}
              </label>
              <input 
                id="email-input"
                type="email" 
                value={newEmail} 
                onChange={(e) => setNewEmail(e.target.value)} 
                placeholder="new.identity@lifeos.com"
                className="w-full p-5 rounded-3xl bg-white/50 border border-white/60 outline-none text-sm font-bold text-slate-600 focus:bg-white transition-all" 
              />
            </div>
            <button 
              onClick={updateEmail}
              disabled={loading}
              className="mt-10 w-full py-5 bg-emerald-50 text-emerald-600 rounded-[24px] text-[10px] font-black uppercase tracking-widest hover:bg-emerald-400 hover:text-white transition-all shadow-sm border border-emerald-100 disabled:opacity-50"
            >
              {t("btnUpdateEmail")}
            </button>
          </div>

          <div className={`p-10 flex flex-col justify-between hover:border-rose-100 transition-all ${GLASS_CARD_STYLE}`}>
            <div className="space-y-6">
              <label htmlFor="password-input" className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-3 cursor-pointer">
                <div className="w-8 h-8 rounded-xl bg-rose-50 flex items-center justify-center text-rose-400">
                  <Key size={16} weight="bold" aria-hidden="true" />
                </div>
                {t("labelSecurity")}
              </label>
              
              <div className="relative">
                <input 
                  id="password-input"
                  type={showPassword ? "text" : "password"} 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  placeholder="••••••••"
                  className="w-full p-5 pr-14 rounded-3xl bg-white/50 border border-white/60 outline-none text-sm font-bold text-slate-600 focus:bg-white transition-all" 
                />
                <button
                  type="button"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-rose-500 transition-colors p-1 flex items-center justify-center"
                >
                  {showPassword ? <EyeSlash size={20} weight="bold" aria-hidden="true" /> : <Eye size={20} weight="bold" aria-hidden="true" />}
                </button>
              </div>
            </div>
            
            <button 
              onClick={updatePassword}
              disabled={loading}
              className="mt-10 w-full py-5 bg-rose-50 text-rose-500 rounded-[24px] text-[10px] font-black uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all shadow-sm border border-rose-100 disabled:opacity-50"
            >
              {t("btnUpdatePassword")}
            </button>
          </div>
        </div>

        <section className={`p-10 md:p-12 space-y-10 ${GLASS_CARD_STYLE}`}>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="space-y-2">
              <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center text-amber-500">
                  <ShieldCheck size={18} weight="bold" aria-hidden="true" />
                </div>
                {t("labelPin")}
              </h3>
              <p className="text-[10px] text-slate-400 font-bold italic ml-11 uppercase opacity-60 tracking-wider">{t("pinInfo")}</p>
            </div>
            <div className="hidden md:block px-4 py-1 rounded-full bg-amber-50 text-amber-600 text-[9px] font-black uppercase tracking-widest border border-amber-100">
              {t("secure")}
            </div>
          </div>
          
          <form onSubmit={updatePin} className="flex flex-col md:flex-row gap-6 items-center">
            <input 
              type="text" 
              maxLength={4} 
              value={newPin} 
              onChange={(e) => setNewPin(e.target.value.replace(/\D/g, ""))}
              placeholder="XXXX" 
              aria-label="New 4-digit PIN code"
              className="w-full md:w-64 p-6 rounded-[30px] bg-white/60 border border-white/80 text-center tracking-[1em] font-mono text-2xl outline-none text-slate-700 shadow-inner focus:bg-white focus:ring-4 focus:ring-amber-400/5 transition-all" 
            />
            <button 
              type="submit"
              disabled={loading}
              className="w-full md:flex-1 py-6 bg-amber-400/80 text-white rounded-[30px] text-[10px] font-black uppercase tracking-widest backdrop-blur-md hover:bg-amber-400 shadow-xl shadow-amber-400/10 active:scale-95 transition-all border border-white/20 disabled:opacity-50"
            >
              {t("btnUpdatePin")}
            </button>
          </form>
        </section>
      </div>
      
      <footer className="pt-10 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <CheckCircle size={14} weight="bold" className="text-emerald-400" aria-hidden="true" />
          <p className="text-[9px] text-slate-400 font-black uppercase tracking-[0.3em]">{t("allSynced")}</p>
        </div>
        <p className="text-[8px] text-slate-300 font-bold uppercase tracking-[0.8em] mt-4">{t("version")}</p>
      </footer>
    </main>
  );
}