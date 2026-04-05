'use client';
import { motion } from 'framer-motion';
import { Check, Clock, MoreVertical } from 'lucide-react';

interface PlanCardProps {
  title: string;
  time: string;
  completed: boolean;
  onToggle: () => void;
}

export const PlanCard = ({ title, time, completed, onToggle }: PlanCardProps) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02, backgroundColor: "rgba(255, 255, 255, 0.5)" }}
      className={`group relative flex items-center justify-between p-5 rounded-[24px] border border-white/40 backdrop-blur-md transition-all cursor-pointer
        ${completed ? 'bg-white/40 shadow-inner' : 'bg-white/20 shadow-sm hover:shadow-md'}`}
      onClick={onToggle}
    >
      <div className="flex items-center gap-5">
        <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-500
          ${completed 
            ? 'bg-emerald-500 border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.4)]' 
            : 'border-white/60 bg-white/10 group-hover:border-indigo-400'}`}>
          {completed && <Check size={18} className="text-white" />}
        </div>

        <div className="flex flex-col">
          <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-500/60 flex items-center gap-1 mb-1">
            <Clock size={10} /> {time}
          </span>
          <h3 className={`text-lg font-medium transition-all ${completed ? 'text-slate-400 line-through' : 'text-slate-800'}`}>
            {title}
          </h3>
        </div>
      </div>

      <button className="opacity-0 group-hover:opacity-100 p-2 rounded-full hover:bg-white/50 text-slate-400 transition-all">
        <MoreVertical size={18} />
      </button>
      
      <div className="absolute inset-0 rounded-[24px] bg-gradient-to-tr from-white/10 to-transparent pointer-events-none" />
    </motion.div>
  );
};