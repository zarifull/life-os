'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Check, Pencil, X, ChevronDown, ChevronUp } from 'lucide-react';
import { useTranslations } from 'next-intl';

export function TimelineItem({ id, date, content, type, onUpdate, onDelete }: any) {
  const t = useTranslations('History');
  
  const [isEditing, setIsEditing] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [editValue, setEditValue] = useState(content);

  const CHARACTER_LIMIT = 150;
  const isLongText = content.length > CHARACTER_LIMIT;

  const handleSave = () => {
    onUpdate(id, editValue);
    setIsEditing(false);
  };

  const getTranslatedTitle = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'achievement': return t('filters.achievement');
      case 'goal': return t('filters.goal');
      default: return t('filters.insight');
    }
  };

  const handleDeleteClick = () => {
    if (window.confirm(t('actions.confirmDelete'))) {
      onDelete(id);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      className="relative pl-12 md:pl-24 mb-12 md:mb-20" 
    >
      <div className="absolute left-[-9px] md:left-[-11px] top-8 md:top-10 w-4 h-4 md:w-5 md:h-5 rounded-full bg-white border-[3px] md:border-[4px] border-indigo-400 z-10 shadow-[0_0_20px_rgba(165,180,252,0.8)]" />
      
      <div 
        className="relative rounded-[32px] md:rounded-[50px] p-[1.5px] md:p-[2px]" 
        style={{
          background: "linear-gradient(145deg,rgba(255,255,255,0.9) 0%,rgba(255,255,255,0.42) 22%,rgba(220,210,255,0.2) 50%,rgba(200,185,255,0.48) 78%,rgba(135,215,255,0.52) 100%)",
          boxShadow: "0 20px 60px rgba(120,100,200,0.12)",
        }}
      >
        <div
          className="relative rounded-[30px] md:rounded-[48px] overflow-hidden px-6 md:px-10 py-8 md:py-10"
          style={{
            background: "linear-gradient(145deg,#ffffff 0%,#f8faff 22%,#fff5fd 52%,#f5f8ff 78%,#f0f9ff 100%)",
            backdropFilter: "blur(40px) saturate(200%)",
            border: "1px solid rgba(255,255,255,0.7)",
          }}
        >
          <div className="absolute top-6 right-6 md:top-8 md:right-10 flex items-center gap-3 z-20">
            {!isEditing ? (
              <>
                <button onClick={() => setIsEditing(true)} title={t('actions.edit')} className="text-slate-300 hover:text-indigo-500 transition-colors">
                  <Pencil size={18}/>
                </button>
                <button onClick={handleDeleteClick} title={t('actions.delete')} className="text-slate-300 hover:text-red-400 transition-colors">
                  <Trash2 size={18} />
                </button>
              </>
            ) : (
              <>
                <button onClick={handleSave} title={t('actions.save')} className="text-emerald-500 hover:scale-110 transition-transform">
                  <Check size={20}/>
                </button>
                <button onClick={() => { setIsEditing(false); setEditValue(content); }} title={t('actions.cancel')} className="text-red-400 hover:scale-110 transition-transform">
                  <X size={20}/>
                </button>
              </>
            )}
          </div>

          <span className="text-[9px] md:text-[10px] font-black text-indigo-500/60 uppercase tracking-[0.3em]">
            {date}
          </span>
          
          <h4 className="text-xl md:text-2xl font-bold text-slate-800 mt-2 tracking-tight">
            {getTranslatedTitle(type)}
          </h4>

          {isEditing ? (
            <textarea
              autoFocus
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              className="w-full mt-4 p-4 rounded-2xl bg-white/50 border border-indigo-100 text-slate-700 leading-relaxed outline-none focus:ring-2 focus:ring-indigo-400/20"
              rows={3}
            />
          ) : (
            <div className="mt-3 md:mt-4">
              <p className="text-slate-500/80 leading-relaxed font-medium text-base md:text-lg transition-all duration-300">
                {isLongText && !isExpanded 
                  ? `${content.substring(0, CHARACTER_LIMIT)}...` 
                  : content}
              </p>
              
              {isLongText && (
                <button 
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="mt-2 text-indigo-500 text-xs md:text-sm font-bold flex items-center gap-1 hover:underline underline-offset-4"
                >
                  {isExpanded ? (
                    <><ChevronUp size={14} /> {t('actions.showLess')}</>
                  ) : (
                    <><ChevronDown size={14} /> {t('actions.showMore')}</>
                  )}
                </button>
              )}
            </div>
          )}
          
          <div className="mt-5 md:mt-6">
            <span className="px-4 md:px-5 py-1.5 md:py-2 rounded-full bg-white/60 text-[9px] md:text-[10px] font-black text-indigo-600 uppercase border border-white shadow-sm">
              #{t(`filters.${type?.toLowerCase() || 'insight'}`)}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}