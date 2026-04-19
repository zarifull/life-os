'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { useTranslations } from 'next-intl';

export function QuickLog({ onSaveSuccess }: { onSaveSuccess: () => void }) {
  const t = useTranslations('History');
  
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState('Insight'); 

  const handleSave = async () => {
    if (!content.trim()) return;
    setLoading(true);

    try {
      const res = await fetch('/api/memories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, type: type }), 
      });

      if (res.ok) {
        setContent( ' ' ); 
        onSaveSuccess();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8 md:mb-16 p-6 md:p-8 rounded-[30px] md:rounded-[40px] bg-white/20 backdrop-blur-2xl border border-white/40 shadow-sm"
    >
      <div className="flex flex-col space-y-4">
        <textarea 
          value={content}
          placeholder={t('placeholder')}
          onChange={(e) => setContent(e.target.value)}
          className="bg-transparent border-none text-slate-800 placeholder:text-slate-400 focus:ring-0 text-base md:text-lg resize-none outline-none"
          rows={2}
        />
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pt-4 border-t border-white/20 gap-4">
          <div className="flex flex-wrap gap-2">
            <span 
              onClick={() => setType('Achievement')}
              className={`px-3 py-1 rounded-full cursor-pointer transition-all border text-xs font-bold tracking-wide ${
                type === 'Achievement' 
                ? 'bg-indigo-500 text-white border-indigo-500' 
                : 'bg-indigo-500/10 text-indigo-600 border-indigo-500/20 hover:bg-indigo-500/20'
              }`}
            >
              #{t('filters.achievement')}
            </span>

            <span 
              onClick={() => setType('Insight')}
              className={`px-3 py-1 rounded-full cursor-pointer transition-all border text-xs font-bold tracking-wide ${
                type === 'Insight' 
                ? 'bg-emerald-500 text-white border-emerald-500' 
                : 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20 hover:bg-emerald-500/20'
              }`}
            >
              #{t('filters.insight')}
            </span>

            <span 
              onClick={() => setType('Goal')}
              className={`px-3 py-1 rounded-full cursor-pointer transition-all border text-xs font-bold tracking-wide ${
                type === 'Goal' 
                ? 'bg-amber-500 text-white border-amber-500' 
                : 'bg-amber-500/10 text-amber-600 border-amber-500/20 hover:bg-amber-500/20'
              }`}
            >
              #{t('filters.goal')}
            </span>
          </div>

          <button 
            onClick={handleSave}
            disabled={loading} 
            title={t('actions.save')} 
            className="w-full sm:w-auto flex justify-center items-center gap-2 px-6 py-2.5 bg-indigo-500 rounded-xl text-white shadow-lg shadow-indigo-500/30 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
          >
            <Plus size={18} />
            <span className="sm:hidden font-bold">{t('actions.save')}</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}