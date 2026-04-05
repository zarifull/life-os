"use client";
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useRouter, useParams } from 'next/navigation';
import { useTranslations } from "next-intl";
import Link from 'next/link';

export default function UserNav({ email, name }: { email: string, name: string }) {
  const t = useTranslations("Layout");
  const params = useParams();
  const locale = params.locale as string || "en";
  
  const [isOpen, setIsOpen] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.user_metadata?.avatar_url) {
        setAvatarUrl(user.user_metadata.avatar_url);
      }
    };
    fetchUser();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.refresh();
    window.location.href = `/${locale}`; 
  };

  return (
    <div className="relative z-[999]">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center w-12 h-12 rounded-[22px] 
                   bg-white/80 border border-white backdrop-blur-xl 
                   hover:bg-indigo-50 hover:border-indigo-200 
                   active:scale-95 transition-all shadow-sm overflow-hidden group"
      >
        {avatarUrl ? (
          <img src={avatarUrl} alt="Profile" className="w-full h-full object-cover" />
        ) : (
          <div className="text-[#6366F1] font-[1000] text-lg uppercase tracking-tighter group-hover:scale-110 transition-transform">
            {name?.[0]?.toUpperCase() || "U"}
          </div>
        )}
      </button>
  
      {isOpen && (
        <div className="absolute right-0 mt-4 w-72 p-6 
                        rounded-[40px] bg-white/90 backdrop-blur-[40px] 
                        border border-indigo-100/50 shadow-[0_40px_80px_rgba(99,102,241,0.12)] 
                        animate-in fade-in slide-in-from-top-4 duration-300 z-[1000]">
          
          <div 
            className="fixed inset-0 -z-10 h-[200vh] w-[200vw]" 
            style={{ transform: 'translate(-50%, -50%)', left: '50%', top: '50%' }}
            onClick={() => setIsOpen(false)} 
          />
          
          <div className="flex flex-col items-center border-b border-indigo-50 pb-6 mb-4">
            <div className="w-16 h-16 rounded-[24px] bg-indigo-50 border-2 border-indigo-100 p-1 mb-3 shadow-sm">
              <div className="w-full h-full rounded-[20px] overflow-hidden bg-white flex items-center justify-center">
                {avatarUrl ? (
                  <img src={avatarUrl} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-[#6366F1] font-black text-xl">{name?.[0]?.toUpperCase() || "U"}</span>
                )}
              </div>
            </div>
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-tight text-center leading-none">
              {name}
            </h3>
            <p className="text-[10px] font-bold text-slate-400 lowercase tracking-wide mt-2">
              {email}
            </p>
          </div>
  
          <div className="space-y-1">
            <Link 
              href={`/${locale}/dashboard/settings`} 
              onClick={() => setIsOpen(false)}
              className="w-full p-3 rounded-2xl hover:bg-indigo-50/80 text-[10px] font-black uppercase text-slate-600 transition-all flex items-center gap-3 group"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-[#8B5CF6] group-hover:scale-125 transition-transform shadow-[0_0_8px_rgba(139,92,246,0.4)]" />
              {t("navSettings")}
            </Link>
            
            <button 
              onClick={handleSignOut}
              className="w-full p-3 rounded-2xl hover:bg-orange-50 text-[10px] font-black uppercase text-orange-400 transition-all flex items-center gap-3 group"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-orange-400 group-hover:scale-125 transition-transform shadow-[0_0_8px_rgba(251,146,60,0.4)]" />
              {t("navDisconnect")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}