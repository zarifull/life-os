"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import { useTranslations } from "next-intl";

export default function SettingsPage() {
  const t = useTranslations("Settings");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  
  const [name, setName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [newEmail, setNewEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newPin, setNewPin] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setName(user.user_metadata?.display_name || "");
        setAvatarUrl(user.user_metadata?.avatar_url || null);
      }
    };
    fetchUser();
  }, []);

  const handleUpdate = async (type: string, payload: any) => {
    setLoading(true);
    const { error } = await supabase.auth.updateUser(payload);
    if (error) setMessage({ type: "error", text: error.message });
    else setMessage({ type: "success", text: t("successUpdate", { type }) });
    setLoading(false);
    setTimeout(() => setMessage({ type: "", text: "" }), 3000);
  };

  const uploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setLoading(true);
      if (!event.target.files || event.target.files.length === 0) return;
      
      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
  
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file);
  
      if (uploadError) throw uploadError;
  
      const { data } = supabase.storage.from('avatars').getPublicUrl(fileName);
      const publicUrl = data.publicUrl;
      const { data: { user } } = await supabase.auth.getUser();
      
      await supabase.auth.updateUser({ data: { avatar_url: publicUrl } });
      await supabase.from('profiles').update({ avatar_url: publicUrl }).eq('id', user?.id);
  
      setAvatarUrl(publicUrl);
      setMessage({ type: "success", text: t("avatarSuccess") });
    } catch (e: any) {
      setMessage({ type: "error", text: e.message });
    } finally {
      setLoading(false);
    }
  };

  const updatePin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPin.length !== 4) return;
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    const { error } = await supabase.from('profiles').update({ pin_code: newPin }).eq('id', user?.id);
    if (error) setMessage({ type: "error", text: error.message });
    else setMessage({ type: "success", text: t("pinSuccess") });
    setLoading(false);
    setNewPin("");
  };

  return (
    <div className="max-w-4xl mx-auto py-8 md:py-16 px-4 md:px-8 space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      
      <header className="space-y-2 md:text-center">
        <h1 className="text-3xl md:text-5xl font-medium text-slate-700 tracking-tighter">
          {t("titlePart1")} <span className="text-[#6366F1] italic font-light">{t("titlePart2")}</span>
        </h1>
        <p className="text-[10px] md:text-xs text-slate-400 font-bold uppercase tracking-[0.3em]">
          {t("subtitle")}
        </p>
      </header>

      {message.text && (
        <div className={`fixed bottom-8 right-8 z-[1000] p-5 rounded-[28px] text-[10px] font-black uppercase tracking-widest border shadow-2xl animate-in slide-in-from-bottom-10 backdrop-blur-xl ${
          message.type === "success" ? "bg-white/90 text-indigo-500 border-indigo-100" : "bg-white/90 text-rose-500 border-rose-100"
        }`}>
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 gap-8 md:gap-12">
        <section className="bg-white/40 backdrop-blur-3xl p-6 md:p-12 rounded-[45px] border border-white/80 shadow-[0_20px_50px_rgba(0,0,0,0.02)]">
          <div className="flex flex-col md:flex-row items-center gap-10">
            <div className="relative">
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-[38px] bg-white border border-indigo-50 shadow-inner flex items-center justify-center overflow-hidden">
                {avatarUrl ? (
                  <img src={avatarUrl} className="w-full h-full object-cover" alt="Profile" />
                ) : (
                  <span className="text-5xl text-indigo-100 font-light">{name?.[0] || "?"}</span>
                )}
              </div>
              <label className="absolute -bottom-2 -right-2 bg-white text-indigo-600 w-11 h-11 rounded-2xl shadow-xl border border-indigo-50 flex items-center justify-center cursor-pointer hover:bg-indigo-500 hover:text-white transition-all">
                <input type="file" className="hidden" accept="image/*" onChange={uploadAvatar} />
                <span className="text-lg">📸</span>
              </label>
            </div>
            
            <div className="flex-1 w-full space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">{t("labelName")}</label>
                <input 
                  type="text" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  className="w-full p-5 rounded-3xl bg-white/60 border border-indigo-50/50 focus:border-indigo-200 outline-none text-slate-600 font-light text-lg" 
                />
              </div>
              <button 
                onClick={() => handleUpdate("Name", { data: { display_name: name } })}
                className="w-full md:w-auto px-10 py-4 bg-[#6366F1] text-white rounded-[22px] text-[10px] font-bold uppercase tracking-widest hover:bg-indigo-600 shadow-lg shadow-indigo-100 active:scale-95"
              >
                {loading ? t("syncing") : t("btnSaveName")}
              </button>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white/40 backdrop-blur-3xl p-8 rounded-[45px] border border-white/80 flex flex-col justify-between group hover:border-indigo-100 transition-colors">
            <div className="space-y-5">
              <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 shadow-[0_0_8px_rgba(129,140,248,0.5)]" /> {t("labelEmail")}
              </h3>
              <input 
                type="email" 
                value={newEmail} 
                onChange={(e) => setNewEmail(e.target.value)} 
                placeholder="new.identity@lifeos.com"
                className="w-full p-4 rounded-2xl bg-white/50 border border-indigo-50/30 outline-none text-sm font-light text-slate-600" 
              />
            </div>
            <button 
              onClick={() => handleUpdate("Email", { email: newEmail })}
              className="mt-8 w-full py-4 bg-slate-800 text-white rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-[#6366F1] transition-all"
            >
              {t("btnUpdateEmail")}
            </button>
          </div>

          <div className="bg-white/40 backdrop-blur-3xl p-8 rounded-[45px] border border-white/80 flex flex-col justify-between group hover:border-rose-100 transition-colors">
            <div className="space-y-5">
              <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400 shadow-[0_0_8px_rgba(251,146,60,0.5)]" /> {t("labelSecurity")}
              </h3>
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                placeholder="••••••••"
                className="w-full p-4 rounded-2xl bg-white/50 border border-indigo-50/30 outline-none text-sm font-light text-slate-600" 
              />
            </div>
            <button 
              onClick={() => handleUpdate("Password", { password: password })}
              className="mt-8 w-full py-4 bg-slate-800 text-white rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-rose-500 transition-all"
            >
              {t("btnUpdatePassword")}
            </button>
          </div>
        </div>

        <section className="bg-white/40 backdrop-blur-3xl p-8 md:p-12 rounded-[45px] border border-white/80 space-y-8">
          <div className="space-y-1">
            <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.5)]" /> {t("labelPin")}
            </h3>
            <p className="text-[10px] text-slate-400 font-light italic ml-5">{t("pinInfo")}</p>
          </div>
          
          <div className="flex flex-col md:flex-row gap-5 items-center">
            <input 
              type="text" 
              maxLength={4} 
              value={newPin} 
              onChange={(e) => setNewPin(e.target.value.replace(/\D/g, ""))}
              placeholder="XXXX" 
              className="w-full md:w-64 p-5 rounded-3xl bg-white/60 border border-indigo-50/30 text-center tracking-[0.8em] font-mono text-2xl outline-none text-slate-600" 
            />
            <button 
              onClick={updatePin}
              className="w-full md:flex-1 h-[68px] bg-amber-400 text-white rounded-3xl text-[10px] font-bold uppercase tracking-widest hover:bg-amber-500 shadow-lg shadow-amber-100 transition-all"
            >
              {t("btnUpdatePin")}
            </button>
          </div>
        </section>
      </div>
      
      <footer className="pt-10 text-center">
        <p className="text-[9px] text-slate-300 font-bold uppercase tracking-[0.5em]">{t("version")}</p>
      </footer>
    </div>
  );
}