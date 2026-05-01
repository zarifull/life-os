"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import { useTranslations } from "next-intl";
import { 
  User, 
  Envelope, 
  Key, 
  ShieldCheck, 
  CameraPlus, 
  CheckCircle 
} from "@phosphor-icons/react";

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
      const { error: uploadError } = await supabase.storage.from('avatars').upload(fileName, file);
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
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Unauthorized");
      const { error: dbError } = await supabase.from('profiles').upsert({ 
          id: user.id, pin_code: newPin, updated_at: new Date().toISOString() 
      });
      if (dbError) throw dbError;
      await supabase.auth.updateUser({ data: { has_pin: true } });
      setMessage({ type: "success", text: t("pinSuccess") });
      setNewPin(""); 
    } catch (err: any) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-6 space-y-12 animate-in fade-in zoom-in duration-700">
      
      <header className="space-y-4 text-center">
        <h1 className="text-4xl md:text-6xl font-[1000] italic tracking-tighter text-slate-800 uppercase">
          {t("titlePart1")} <span className="text-emerald-400">{t("titlePart2")}</span>
        </h1>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.5em] opacity-60">
          {t("subtitle")}
        </p>
      </header>

      {message.text && (
        <div className={`fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] px-8 py-4 rounded-[30px] text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl backdrop-blur-2xl border animate-in slide-in-from-bottom-10 ${
          message.type === "success" ? "bg-emerald-400/90 text-white border-emerald-300" : "bg-rose-500/90 text-white border-rose-400"
        }`}>
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 gap-10">
        
        <section className="group relative overflow-hidden bg-white/30 backdrop-blur-[40px] p-8 md:p-12 rounded-[60px] border border-white/80 shadow-[0_30px_100px_rgba(0,0,0,0.04)] transition-all hover:shadow-emerald-400/5">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="relative">
              <div className="w-36 h-36 md:w-44 md:h-44 rounded-[50px] bg-white/60 p-1 border border-white shadow-xl overflow-hidden group-hover:scale-105 transition-transform duration-500">
                {avatarUrl ? (
                  <img src={avatarUrl} className="w-full h-full object-cover rounded-[48px]" alt="Profile" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-emerald-50 rounded-[48px]">
                    <User size={60} weight="thin" className="text-emerald-200" />
                  </div>
                )}
              </div>
              <label className="absolute -bottom-2 -right-2 bg-emerald-400 text-white w-12 h-12 rounded-[20px] shadow-lg shadow-emerald-400/30 flex items-center justify-center cursor-pointer hover:bg-emerald-500 hover:scale-110 transition-all border-4 border-white/80">
                <input type="file" className="hidden" accept="image/*" onChange={uploadAvatar} />
                <CameraPlus size={20} weight="bold" />
              </label>
            </div>
            
            <div className="flex-1 w-full space-y-6">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">
                  <User size={14} weight="bold" /> {t("labelName")}
                </label>
                <input 
                  type="text" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  className="w-full p-5 rounded-[28px] bg-white/40 border border-white/60 focus:bg-white/80 focus:border-emerald-300 focus:ring-4 focus:ring-emerald-400/5 outline-none text-slate-700 font-bold text-lg transition-all" 
                />
              </div>
              <button 
                onClick={() => handleUpdate("Name", { data: { display_name: name } })}
                className="w-full md:w-auto px-12 py-5 bg-emerald-400 text-white rounded-[24px] text-[10px] font-black uppercase tracking-widest hover:bg-emerald-500 shadow-xl shadow-emerald-500/20 active:scale-95 transition-all"
              >
                {loading ? "..." : t("btnSaveName")}
              </button>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          
          <div className="bg-white/30 backdrop-blur-[40px] p-10 rounded-[60px] border border-white/80 shadow-xl flex flex-col justify-between hover:border-emerald-100 transition-all">
            <div className="space-y-6">
              <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-400">
                  <Envelope size={16} weight="bold" />
                </div>
                {t("labelEmail")}
              </h3>
              <input 
                type="email" 
                value={newEmail} 
                onChange={(e) => setNewEmail(e.target.value)} 
                placeholder="new.identity@lifeos.com"
                className="w-full p-5 rounded-3xl bg-white/50 border border-white/60 outline-none text-sm font-bold text-slate-600 focus:bg-white transition-all" 
              />
            </div>
            <button 
              onClick={() => handleUpdate("Email", { email: newEmail })}
              className="mt-10 w-full py-5 bg-emerald-50 text-emerald-600 rounded-[24px] text-[10px] font-black uppercase tracking-widest hover:bg-emerald-400 hover:text-white transition-all shadow-sm border border-emerald-100"
            >
              {t("btnUpdateEmail")}
            </button>
          </div>

          <div className="bg-white/30 backdrop-blur-[40px] p-10 rounded-[60px] border border-white/80 shadow-xl flex flex-col justify-between hover:border-rose-100 transition-all">
            <div className="space-y-6">
              <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-rose-50 flex items-center justify-center text-rose-400">
                  <Key size={16} weight="bold" />
                </div>
                {t("labelSecurity")}
              </h3>
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                placeholder="••••••••"
                className="w-full p-5 rounded-3xl bg-white/50 border border-white/60 outline-none text-sm font-bold text-slate-600 focus:bg-white transition-all" 
              />
            </div>
            <button 
                onClick={() => handleUpdate("Password", { password: password })}
                className="mt-10 w-full py-5 bg-rose-50 text-rose-500 rounded-[24px] text-[10px] font-black uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all shadow-sm border border-rose-100"
              >
                {t("btnUpdatePassword")}
              </button>
          </div>
        </div>

        <section className="bg-white/30 backdrop-blur-[40px] p-10 md:p-12 rounded-[60px] border border-white/80 shadow-xl space-y-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="space-y-2">
              <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center text-amber-500">
                  <ShieldCheck size={18} weight="bold" />
                </div>
                {t("labelPin")}
              </h3>
              <p className="text-[10px] text-slate-400 font-bold italic ml-11 uppercase opacity-60 tracking-wider">{t("pinInfo")}</p>
            </div>
            <div className="hidden md:block px-4 py-1 rounded-full bg-amber-50 text-amber-600 text-[9px] font-black uppercase tracking-widest border border-amber-100">
              {t("secure")}
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row gap-6 items-center">
            <input 
              type="text" 
              maxLength={4} 
              value={newPin} 
              onChange={(e) => setNewPin(e.target.value.replace(/\D/g, ""))}
              placeholder="XXXX" 
              className="w-full md:w-64 p-6 rounded-[30px] bg-white/60 border border-white/80 text-center tracking-[1em] font-mono text-2xl outline-none text-slate-700 shadow-inner focus:bg-white focus:ring-4 focus:ring-amber-400/5 transition-all" 
            />
         <button 
            onClick={updatePin}
            className="w-full md:flex-1 py-6 bg-amber-400/80 text-white rounded-[30px] text-[10px] font-black uppercase tracking-widest backdrop-blur-md hover:bg-amber-400 shadow-xl shadow-amber-400/10 active:scale-95 transition-all border border-white/20"
          >
            {t("btnUpdatePin")}
          </button>
          </div>
        </section>
      </div>
      
      <footer className="pt-10 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
           <CheckCircle size={14} weight="bold" className="text-emerald-400" />
           <p className="text-[9px] text-slate-400 font-black uppercase tracking-[0.3em]">{t("allSynced")}</p>
        </div>
        <p className="text-[8px] text-slate-300 font-bold uppercase tracking-[0.8em] mt-4">{t("version")}</p>
      </footer>
    </div>
  );
}