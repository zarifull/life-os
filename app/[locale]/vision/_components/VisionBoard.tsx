'use client';
import { Sparkles, Trash2 } from 'lucide-react'; 
import { toggleVisionStatus, deleteVision } from '@/lib/actions/vision';
import { useTranslations } from 'next-intl';

interface Vision {
  id: string;
  title: string;
  image_url: string;
  completed: boolean;
  category?: string;
}

export default function VisionBoard({ visions }: { visions: Vision[] }) {
  const t = useTranslations('Vision');
  const handleToggleSuccess = async (id: string) => {
    const result = await toggleVisionStatus(id);
    if (!result.success) console.error(result.error);
  };

  const handleDelete = async (id: string) => {
    if (confirm(t('actions.deleteConfirm'))){
      const result = await deleteVision(id);
      if (!result.success) console.error(result.error);
    }
  };
  
  if (!visions || visions.length === 0) {
    return (
      <div className="relative flex flex-col items-center justify-center min-h-[400px] rounded-[40px] bg-slate-50/50 border border-slate-200 p-8 text-center">
        <h3 className="text-2xl font-serif text-slate-800 italic">
        {t('emptyState.quote')}
        </h3>
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 mt-6">
        {t('emptyState.status')}
        </p>
      </div>
    );
  }
  return (
    <div className="relative w-full px-6 md:px-0 max-w-[1600px] mx-auto flex justify-center pt-4 md:pt-10">
      
      <div className="grid grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-5 justify-items-center w-full max-w-fit md:max-w-none">
        {visions.map((vision) => (
          <div 
            key={vision.id}
            className="group relative aspect-[4/5] w-full rounded-[16px] md:rounded-[32px] overflow-hidden bg-slate-200 border border-white/40 shadow-lg transition-all duration-700 md:hover:-translate-y-2"
          >
            <img 
              src={vision.image_url} 
              className="absolute inset-0 w-full h-full object-cover blur-2xl scale-150 opacity-40" 
              alt=""
            />
            <img 
              src={vision.image_url} 
              alt={vision.title}
              className={`relative z-10 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 ${vision.completed ? 'grayscale-[0.4] opacity-90' : ''}`} 
            />
            <div className="absolute inset-0 z-20 bg-gradient-to-t from-slate-950/90 via-transparent to-black/20" />
  
            <div className="absolute top-3 left-3 md:top-6 md:left-6 z-40">
             <div className="h-fit w-fit py-0.5 px-2 md:py-1 md:px-3 rounded-full bg-white/20 backdrop-blur-md border border-white/30 shadow-sm flex items-center justify-center">
                <span className="text-[5px] md:text-[9px] font-black uppercase tracking-[0.1em] md:tracking-[0.2em] text-white leading-none">
                {vision.completed ? t('labels.done') : t('labels.vision')}
                </span>
              </div>
          </div>
  
            <div className="absolute top-1.5 right-1.5 md:top-5 md:right-5 z-40 flex gap-1 md:gap-2 opacity-0 group-hover:opacity-100 group-active:opacity-100 transition-opacity duration-300">
              <button 
                onClick={() => handleToggleSuccess(vision.id)}
                className="p-1 md:p-2 rounded-full bg-emerald-500/80 text-white backdrop-blur-md"
              >
                <Sparkles size={8} className="md:w-4 md:h-4" />
              </button>
              <button 
                onClick={() => handleDelete(vision.id)}
                className="p-1 md:p-2 rounded-full bg-red-500/80 text-white backdrop-blur-md"
              >
                <Trash2 size={8} className="md:w-4 md:h-4" />
              </button>
            </div>
  
            <div className="absolute inset-0 z-30 p-2 md:p-6 flex flex-col justify-end pointer-events-none items-center text-center">
              <div className="space-y-0.5 md:space-y-2 w-full flex flex-col items-center">
                <div className="h-[0.5px] md:h-[1px] w-3 md:w-5 bg-amber-400 mb-1" />
                <h3 className="text-[9px] md:text-xl font-serif text-white leading-tight italic drop-shadow-lg truncate w-full">
                  {vision.title}
                </h3>
              </div>
            </div>
            
            {vision.completed && (
              <div className="absolute inset-0 z-[25] bg-emerald-950/10 md:bg-emerald-900/20 backdrop-overlay pointer-events-none" />
            )}
          </div>
        ))}
      </div>
    </div>
  );

  }
  