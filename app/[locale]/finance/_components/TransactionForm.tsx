"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { addTransaction } from "@/lib/actions/finance"
import { FINANCE_CATEGORIES } from "@/types/finance"

interface Props {
  onSuccess: () => void;
  onClose: () => void;
}

export function TransactionForm({ onSuccess, onClose }: Props) {
  const [amount, setAmount] = useState("")
  const [type, setType] = useState<'expense' | 'income'>('expense')
  const [category, setCategory] = useState("Food")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!amount || isNaN(Number(amount))) return

    setLoading(true)
    try {
      await addTransaction(Number(amount), type, category)
      setAmount("")
      onSuccess()
      onClose()
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="p-8 rounded-[32px] border border-white/60 shadow-2xl w-full max-w-md"
      style={{ background: "rgba(255, 255, 255, 0.7)", backdropFilter: "blur(20px)" }}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex p-1 bg-indigo-100/30 rounded-2xl">
          {(['expense', 'income'] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setType(t)}
              className={`flex-1 py-2 rounded-xl text-[9px] font-bold uppercase tracking-widest transition-all ${
                type === t ? 'bg-white text-indigo-600 shadow-sm' : 'text-indigo-400'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="text-center">
          <input 
            type="number"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full bg-transparent text-5xl font-serif text-center text-indigo-950 focus:outline-none placeholder:opacity-20"
            autoFocus
          />
        </div>

        <div className="grid grid-cols-4 gap-2">
          {FINANCE_CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategory(cat)}
              className={`py-3 rounded-xl flex flex-col items-center gap-1 transition-all border ${
                category === cat ? 'bg-white border-indigo-200 shadow-sm' : 'border-transparent opacity-50'
              }`}
            >
              <span className="text-lg">{CATEGORY_ICONS[cat]}</span>
              <span className="text-[7px] font-black uppercase tracking-tighter">{cat}</span>
            </button>
          ))}
        </div>

        <button
          disabled={loading}
          className="w-full py-4 bg-indigo-600 text-white rounded-2xl text-[10px] font-bold uppercase tracking-[0.3em] disabled:opacity-50 transition-all hover:bg-indigo-700"
        >
          {loading ? "LOGGING..." : "CONFIRM TRANSACTION"}
        </button>
      </form>
    </motion.div>
  )
}

const CATEGORY_ICONS: Record<string, string> = {
    Food: "🍱",
    Transport: "🚕",
    University: "📚",
    Tech: "💻",
    Freelance: "💰",
    Shopping: "🛍️",
    Other: "✨",
    Strategy: "🎯",
    Obligations: "📌",
  };