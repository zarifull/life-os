'use client';

import { useState, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import { addVision } from '@/lib/actions/vision';
import { Plus, X, Upload, Sparkles } from 'lucide-react';
import { useTranslations } from 'next-intl';

export function AddVisionModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();
  const t = useTranslations('Vision');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const title = formData.get('title') as string;
    const file = fileInputRef.current?.files?.[0];

    try {
      const { data: { user } } = await supabase.auth.getUser();
      const { data: { session } } = await supabase.auth.getSession();

      if (!user || !session) {
        console.error("CRITICAL: No active session found!");
        setLoading(false);
        return;
      }

      const { data: buckets, error: bucketError } = await supabase.storage.listBuckets();
      
      
      if (bucketError) console.error("BUCKET LIST ERROR:", bucketError);

      let publicUrl = '';
      if (file) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${crypto.randomUUID()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('visions')
          .upload(fileName, file, {
             upsert: true 
          });

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage.from('visions').getPublicUrl(fileName);
        publicUrl = urlData.publicUrl;
      }

      const result = await addVision({ title, image_url: publicUrl });
      
      if (result.success) {
        console.log("VISION UPLOADED SUCCESSFULLY");
        setIsOpen(false);
        setPreview(null);
      } else {
        console.error("Database Save Failed:", result.error);
      }


    } catch (err) {
      console.error('Surgical Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-10 right-10 h-16 w-16 bg-slate-900/90 backdrop-blur-md text-white rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.2)] flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-50 border border-white/20 group"
      >
        <Plus size={32} strokeWidth={1.5} className="group-hover:rotate-90 transition-transform duration-500" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/20 backdrop-blur-[12px] animate-in fade-in duration-300">
          <div className="relative bg-white/40 backdrop-blur-[30px] w-full max-w-md rounded-[40px] p-10 border border-white/60 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.1)] overflow-hidden">
            
            <div className="absolute -top-24 -left-24 w-64 h-64 bg-emerald-400/20 blur-[80px] rounded-full pointer-events-none" />
            <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-indigo-500/20 blur-[80px] rounded-full pointer-events-none" />

            <button 
              onClick={() => setIsOpen(false)} 
              className="absolute top-8 right-8 text-slate-400 hover:text-slate-900 transition-colors p-2 bg-white/20 rounded-full border border-white/40"
            >
              <X size={18} />
            </button>
            
            <div className="mb-8">
            <h2 className="text-3xl font-serif text-slate-800 tracking-tight flex items-center gap-2">
              {t('modal.title')} <Sparkles size={20} className="text-amber-400" />
            </h2>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 mt-2">
              {t('modal.subtitle')}
            </p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="relative h-56 w-full rounded-[32px] border border-white/60 bg-white/20 flex flex-col items-center justify-center cursor-pointer hover:bg-white/40 transition-all overflow-hidden group shadow-inner"
              >
                {preview ? (
                  <img src={preview} alt="Preview" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                ) : (
                  <div className="flex flex-col items-center text-slate-400 group-hover:text-indigo-500 transition-all duration-500">
                    <div className="p-4 bg-white/40 rounded-full border border-white/60 mb-3 shadow-sm group-hover:shadow-indigo-100 group-hover:bg-white">
                      <Upload size={24} strokeWidth={1.5} />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest">
                      {t('modal.upload')}
                    </span>
                  </div>
                )}
                <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
              </div>

              <div className="space-y-2">
                <input 
                  name="title" 
                  placeholder={t('modal.input_placeholder')}
                  className="w-full bg-white/30 border border-white/60 p-5 rounded-2xl outline-none focus:bg-white/60 focus:border-indigo-300 transition-all text-slate-800 placeholder:text-slate-400 font-serif text-lg italic"
                  required 
                />
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full py-5 bg-slate-900 text-white font-bold rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.2)] hover:bg-black hover:-translate-y-1 transition-all disabled:opacity-50 active:scale-95 flex items-center justify-center gap-2 overflow-hidden relative"
              >
               {loading ? (
                  <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>{t('modal.submit_btn')}</>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}