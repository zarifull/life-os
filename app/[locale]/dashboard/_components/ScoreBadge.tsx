interface ScoreBadgeProps {
    current: number;
    total: number;
  }
  
  export const ScoreBadge = ({ current, total }: ScoreBadgeProps) => {
    const isPerfect = current === total && total > 0;
    
    return (
      <div className={`px-6 py-2 rounded-full font-bold transition-all duration-500 shadow-lg
        ${isPerfect ? 'bg-emerald-500 text-white shadow-emerald-200 scale-110' : 'bg-white/60 text-slate-600'}`}>
        {current} / {total} {isPerfect ? '✨ Perfect Day' : 'Achieved'}
      </div>
    );
  };