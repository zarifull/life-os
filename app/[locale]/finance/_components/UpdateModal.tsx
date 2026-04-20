"use client";
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { updateTransaction } from '@/lib/actions/finance';

interface UpdateModalProps {
  transaction: any;
  onClose: () => void;
}

export default function UpdateModal({ transaction, onClose }: UpdateModalProps) {
  const [label, setLabel] = useState(transaction.label);
  const [amount, setAmount] = useState(transaction.amount);
  const [isPending, setIsPending] = useState(false);

  const handleUpdate = async () => {
    setIsPending(true);
    try {
      await updateTransaction(transaction.id, { label, amount: Number(amount) });
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-indigo-950/20 backdrop-blur-xl" 
        />

        <motion.div 
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative w-full max-w-sm bg-white/40 border border-white/60 backdrop-blur-2xl rounded-[40px] p-8 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] overflow-hidden"
        >
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/80 to-transparent" />

          <h2 className="text-2xl font-serif text-indigo-950/80 mb-8 italic text-center">Adjust Entry</h2>
          
          <div className="space-y-6">
            <div className="group">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400 ml-4 mb-2 block">Description</label>
              <input 
                className="w-full bg-white/30 border border-white/40 rounded-2xl px-6 py-4 text-indigo-950 placeholder:text-indigo-300 focus:outline-none focus:bg-white/60 transition-all shadow-inner"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
              />
            </div>

            <div className="group">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400 ml-4 mb-2 block">Amount</label>
              <input 
                className="w-full bg-white/30 border border-white/40 rounded-2xl px-6 py-4 text-xl font-serif text-indigo-950 focus:outline-none focus:bg-white/60 transition-all shadow-inner"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
          </div>

          <div className="flex gap-4 mt-10">
            <button 
              onClick={onClose}
              className="flex-1 px-4 py-4 rounded-2xl text-[9px] font-black uppercase tracking-widest text-indigo-400/60 hover:text-indigo-600 transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={handleUpdate}
              disabled={isPending}
              className="flex-[2] bg-indigo-600/90 text-white px-8 py-4 rounded-3xl font-bold text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-indigo-200 hover:shadow-indigo-300 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
            >
              {isPending ? "Syncing..." : "Update Log"}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}